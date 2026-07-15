"use client";

// Login do cliente: e-mail + senha (o cliente RECEBEU uma senha — magic link
// seria contraintuitivo aqui). Erro traduzido, e "esqueci a senha" que dispara
// o e-mail de redefinição pra /cliente/nova-senha.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Turnstile, type TurnstileHandle } from "@/components/Turnstile";
import { Shell } from "../_components/Shell";
import { authMessage, currentUser, href, isMockMode } from "../_data";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [resetSent, setResetSent] = useState(false);
  const [checking, setChecking] = useState(true);
  // Token do Turnstile. O Supabase valida (o Fellipe liga o captcha no painel).
  // Se a env da site key faltar, o widget degrada sozinho (test key + aviso) e
  // não trava o login.
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Token é de uso único: depois de uma tentativa que falhou, renova.
  function refreshCaptcha() {
    setCaptchaToken("");
    turnstileRef.current?.reset();
  }

  // Já logado? Não faz sentido ver o login. (Exceto em demonstração, onde o
  // "usuário" é fake e a tela de login precisa ser visível pra revisar design.)
  useEffect(() => {
    let alive = true;
    if (isMockMode()) {
      setChecking(false);
      return;
    }
    currentUser().then((u) => {
      if (!alive) return;
      if (u) router.replace(href("/cliente"));
      else setChecking(false);
    });
    return () => {
      alive = false;
    };
  }, [router]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    if (isMockMode()) {
      router.replace(href("/cliente"));
      return;
    }
    if (!supabase) {
      setErr("O portal está sem configuração de acesso. Fale com o Fellipe.");
      return;
    }
    setBusy(true);
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
      options: { captchaToken },
    });
    setBusy(false);
    if (error) {
      setErr(authMessage(error.message));
      refreshCaptcha();
      return;
    }
    if (data.session) router.replace(href("/cliente"));
  }

  async function sendReset(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const to = email.trim();
    if (!to) {
      setErr("Escreva o seu e-mail primeiro.");
      return;
    }
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(to, {
      redirectTo: `${window.location.origin}/cliente/nova-senha`,
      captchaToken,
    });
    setBusy(false);
    if (error) {
      setErr(authMessage(error.message));
      refreshCaptcha();
      return;
    }
    setResetSent(true);
  }

  if (checking) {
    return (
      <Shell label="Acesso">
        <div className="flex items-center gap-3 py-24 text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand-via)]" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">
            Carregando…
          </span>
        </div>
      </Shell>
    );
  }

  return (
    <Shell label="Acesso">
      <div className="relative mx-auto mt-[4vh] max-w-sm">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-border/60 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]"
        />

        <div className="relative isolate overflow-hidden rounded-2xl border bg-card/70 p-8 shadow-[0_30px_80px_-32px_rgb(0_0_0/0.6)] backdrop-blur-xl">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
          />

          <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
            {"// seu projeto, ao vivo"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            {mode === "login" ? "Portal do cliente" : "Redefinir senha"}
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            pavin.me — acompanhamento
          </p>

          {resetSent ? (
            <div className="mt-7 space-y-4">
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                Enviei um link para <strong>{email.trim()}</strong>. Abra o e-mail
                e escolha uma senha nova. (Se não aparecer, confira o spam.)
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setMode("login");
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
              </button>
            </div>
          ) : (
            <form
              onSubmit={mode === "login" ? signIn : sendReset}
              className="mt-7 space-y-4"
            >
              <label className="block space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  E-mail
                </span>
                <input
                  type="email"
                  required
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
                />
              </label>

              {mode === "login" && (
                <label className="block space-y-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Senha
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
                  />
                </label>
              )}

              {mode === "reset" && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Mando um link no seu e-mail pra você escolher uma senha nova.
                </p>
              )}

              <Turnstile ref={turnstileRef} onVerify={setCaptchaToken} />

              <button
                type="submit"
                disabled={busy}
                className="hero-btn hero-btn-fill w-full disabled:pointer-events-none disabled:opacity-60"
              >
                <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
                  {busy
                    ? "Aguarde…"
                    : mode === "login"
                      ? "Entrar"
                      : "Enviar link"}
                  {!busy && <ArrowRight className="hero-btn-arrow h-4 w-4" />}
                </span>
              </button>

              {err && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {err}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setErr("");
                  setMode(mode === "login" ? "reset" : "login");
                }}
                className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {mode === "login"
                  ? "Esqueci a senha"
                  : "Lembrei — voltar para o login"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground/70">
          Recebeu o acesso por e-mail ou WhatsApp. Perdeu? Fale comigo.
        </p>
      </div>
    </Shell>
  );
}
