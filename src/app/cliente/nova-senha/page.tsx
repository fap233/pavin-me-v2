"use client";

// Destino do link de "esqueci a senha". O Supabase abre esta página já com uma
// sessão de recuperação (evento PASSWORD_RECOVERY / token na hash), e aqui o
// cliente escolhe a senha nova.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Shell } from "../_components/Shell";
import { authMessage, href } from "../_data";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  // O link do e-mail traz o token na hash; o supabase-js troca por sessão
  // sozinho. Esperamos a sessão existir antes de deixar trocar a senha.
  useEffect(() => {
    if (!supabase) {
      setErr("O portal está sem configuração de acesso. Fale com o Fellipe.");
      return;
    }
    const client = supabase;
    let alive = true;

    client.auth.getSession().then(({ data }) => {
      if (alive && data.session) setReady(true);
    });

    const { data: sub } = client.auth.onAuthStateChange((_evt, session) => {
      if (alive && session) setReady(true);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    if (pass.length < 6) {
      setErr("Use pelo menos 6 caracteres.");
      return;
    }
    if (pass !== pass2) {
      setErr("As duas senhas não são iguais.");
      return;
    }
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.updateUser({ password: pass });
    setBusy(false);
    if (error) {
      setErr(authMessage(error.message));
      return;
    }
    setDone(true);
    window.setTimeout(() => router.replace(href("/cliente")), 1500);
  }

  return (
    <Shell label="Nova senha">
      <div className="mx-auto mt-[6vh] max-w-sm">
        <div className="relative isolate overflow-hidden rounded-2xl border bg-card/70 p-8 shadow-[0_30px_80px_-32px_rgb(0_0_0/0.6)] backdrop-blur-xl">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
          />
          <h1 className="text-2xl font-bold tracking-tight">Escolha uma senha</h1>

          {done ? (
            <p className="mt-5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-600 dark:text-emerald-400">
              Senha trocada. Levando você para o seu projeto…
            </p>
          ) : !ready && !err ? (
            <p className="mt-5 text-sm text-muted-foreground">
              Validando o link do e-mail…
            </p>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Nova senha
                </span>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Repita a senha
                </span>
                <input
                  type="password"
                  value={pass2}
                  onChange={(e) => setPass2(e.target.value)}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
                />
              </label>

              <button
                type="submit"
                disabled={busy || !ready}
                className="hero-btn hero-btn-fill w-full disabled:pointer-events-none disabled:opacity-60"
              >
                <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
                  {busy ? "Salvando…" : "Salvar senha"}
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
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}
