"use client";

// Widget do Cloudflare Turnstile (CAPTCHA invisível/interativo).
//
// Onde é usado:
//   - Formulário "Vamos conversar" da home (o token é validado no Route Handler
//     /api/contato com a SECRET, antes de inserir o lead).
//   - Login do portal do cliente (o token vai em signInWithPassword({..., options:
//     { captchaToken }}); o próprio Supabase valida).
//
// A SITE KEY é pública (vai pro browser) — vem de NEXT_PUBLIC_TURNSTILE_SITE_KEY.
// A SECRET nunca encosta aqui (fica no server). Se a env da site key faltar, o
// widget NÃO quebra a página: cai na test key pública da Cloudflare (só passa em
// dev) e mostra um aviso claro de que está em modo de teste.

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Test site key oficial da Cloudflare — SEMPRE passa. Usada só como degradação
// de DEV quando NEXT_PUBLIC_TURNSTILE_SITE_KEY está vazia, pra o widget nunca
// travar a página localmente. Em produção o Fellipe preenche a env real.
const CLOUDFLARE_TEST_SITE_KEY = "1x00000000000000000000AA";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileRenderOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "flexible" | "compact";
  action?: string;
};

type TurnstileApi = {
  render: (el: HTMLElement, opts: TurnstileRenderOptions) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// Carrega o script uma vez só (várias instâncias do widget compartilham).
let loadPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src^="https://challenges.cloudflare.com/turnstile"]',
    );
    if (existing) {
      if (window.turnstile) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("turnstile script failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("turnstile script failed to load"));
    document.head.appendChild(script);
  });
  return loadPromise;
}

export type TurnstileHandle = {
  /** Reseta o widget e pede um token novo (token é de uso único). */
  reset: () => void;
};

type TurnstileProps = {
  /** Recebe o token quando o desafio é resolvido; recebe "" ao expirar/erro. */
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

/**
 * Renderiza o widget e entrega o token via onVerify. Expõe reset() por ref pra
 * o chamador renovar o token depois de um submit (sucesso ou falha).
 */
export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(
  function Turnstile({ onVerify, onExpire, onError, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "failed">(
      "loading",
    );

    // O tema do WIDGET tem que seguir o tema do SITE (a classe `dark` que o
    // ThemeContext poe no <html>), não o "auto" do Cloudflare (que segue o SO e
    // deixava o widget claro num site escuro). Lido direto do DOM pra funcionar
    // em qualquer página (home e /cliente/login), sem depender de provider; o
    // observer faz o widget acompanhar o toggle claro/escuro ao vivo.
    const [isDark, setIsDark] = useState(true);
    useEffect(() => {
      if (typeof document === "undefined") return;
      const read = () =>
        setIsDark(document.documentElement.classList.contains("dark"));
      read();
      const obs = new MutationObserver(read);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => obs.disconnect();
    }, []);

    // Guarda os callbacks numa ref pra o efeito de montagem não depender deles
    // (senão o widget re-renderiza a cada render do pai e perde o token).
    const cbRef = useRef({ onVerify, onExpire, onError });
    cbRef.current = { onVerify, onExpire, onError };

    const envSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    const siteKey = envSiteKey || CLOUDFLARE_TEST_SITE_KEY;
    const usingTestKey = !envSiteKey;

    useImperativeHandle(
      ref,
      () => ({
        reset: () => {
          if (widgetIdRef.current && window.turnstile) {
            try {
              window.turnstile.reset(widgetIdRef.current);
            } catch {
              /* widget já removido */
            }
          }
        },
      }),
      [],
    );

    useEffect(() => {
      let cancelled = false;

      loadTurnstileScript()
        .then(() => {
          if (cancelled || !containerRef.current || !window.turnstile) return;
          // Evita render duplo em StrictMode (dois mounts): só renderiza se ainda
          // não há widget neste container.
          if (widgetIdRef.current) return;
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme: isDark ? "dark" : "light",
            action: "contato",
            callback: (token) => cbRef.current.onVerify(token),
            "error-callback": () => {
              cbRef.current.onVerify("");
              cbRef.current.onError?.();
            },
            "expired-callback": () => {
              cbRef.current.onVerify("");
              cbRef.current.onExpire?.();
            },
            "timeout-callback": () => cbRef.current.onVerify(""),
          });
          setStatus("ready");
        })
        .catch(() => {
          if (!cancelled) setStatus("failed");
        });

      return () => {
        cancelled = true;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ok */
          }
          widgetIdRef.current = null;
        }
      };
      // isDark nas deps: ao trocar o tema, o cleanup remove o widget e ele é
      // re-renderizado com o tema novo (o token é de uso único, sem prejuízo).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [siteKey, isDark]);

    return (
      <div className={className}>
        <div ref={containerRef} />

        {status === "loading" && (
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Carregando verificação…
          </p>
        )}

        {status === "failed" && (
          <p
            role="alert"
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400"
          >
            Não consegui carregar a verificação de segurança. Recarregue a página
            — se persistir, me chame direto pelo e-mail.
          </p>
        )}

        {status === "ready" && usingTestKey && (
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-600/80 dark:text-amber-400/80">
            modo de teste — defina NEXT_PUBLIC_TURNSTILE_SITE_KEY
          </p>
        )}
      </div>
    );
  },
);
