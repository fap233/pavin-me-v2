"use client";

// A porta do COLABORADOR: login + o Kanban do backlog.
//
// O quadro em si não mora mais aqui — mora em _components/KanbanBoard.tsx,
// porque o /admin/kanban renderiza o MESMO quadro dentro do back-office. A
// casca também não: a barra do workspace e a navegação do colaborador estão no
// layout desta pasta (_components/CollabShell.tsx), pra que "Meus projetos" e
// "Disponíveis" tenham a mesma moldura desta tela. O que sobrou aqui é o que é
// só desta página: o formulário de login.

import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";
import { Turnstile, type TurnstileHandle } from "@/components/Turnstile";
import { KanbanBoard, type Role } from "./_components/KanbanBoard";

export default function ProjetosPage() {
  const [user, setUser] = useState<User | null>(null);
  // O portal do cliente (migracao 2026-07-14) troca o vocabulario de papeis:
  // admin -> owner, member -> collab, e nasce "client" pro cliente final.
  // Aceitamos os dois enquanto a migracao nao roda em todos os ambientes.
  const [role, setRole] = useState<Role>("collab");
  const [loading, setLoading] = useState(true);

  const onAuthed = useCallback(async (u: User) => {
    if (!supabase) return;
    setUser(u);
    const { data: prof } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", u.id)
      .maybeSingle();
    setRole((prof?.role as Role) ?? "collab");
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) await onAuthed(data.session.user);
      setLoading(false);
    });
  }, [onAuthed]);

  if (!supabaseConfigured) {
    return (
      <p className="text-muted-foreground">
        Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (Vercel / .env.local).
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-muted-foreground">
        <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
        <span className="font-mono text-xs uppercase tracking-[0.2em]">
          Carregando…
        </span>
      </div>
    );
  }

  if (!user) return <Login onAuthed={onAuthed} />;

  return (
    <KanbanBoard
      me={{ id: user.id, email: user.email ?? null }}
      role={role}
      onSignOut={async () => {
        await supabase!.auth.signOut();
        setUser(null);
      }}
    />
  );
}

function Login({ onAuthed }: { onAuthed: (u: User) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  // Token do Turnstile — o Supabase Auth está com CAPTCHA ligado, então TODO
  // signInWithPassword precisa mandar captchaToken (o /cliente/login já manda;
  // este form ficou de fora e o Gustavo tomava "no captcha_token found").
  const [captchaToken, setCaptchaToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Token é de uso único: depois de uma tentativa que falhou, renova.
  function refreshCaptcha() {
    setCaptchaToken("");
    turnstileRef.current?.reset();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
      options: { captchaToken },
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      refreshCaptcha();
      return;
    }
    if (data.session) await onAuthed(data.session.user);
  }

  return (
    <div className="relative mx-auto mt-[8vh] max-w-sm">
      {/* Drafting marks behind the card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-border/60 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]"
      />

      <div className="relative isolate overflow-hidden rounded-2xl border bg-card/70 p-8 shadow-[0_30px_80px_-32px_rgb(0_0_0/0.6)] backdrop-blur-xl">
        {/* Gradient top rule */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
        />

        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// acesso restrito"}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight">
          Backlog de projetos
        </h1>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          pavin.dev, workspace de colaboradores
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              E-mail
            </span>
            <input
              type="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/25"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Senha
            </span>
            <input
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/25"
            />
          </label>

          <Turnstile ref={turnstileRef} onVerify={setCaptchaToken} />

          <button
            type="submit"
            disabled={busy}
            className="hero-btn hero-btn-fill w-full disabled:pointer-events-none disabled:opacity-60"
          >
            <span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
              {busy ? "Entrando…" : "Entrar"}
              {!busy && <ArrowRight className="hero-btn-arrow h-4 w-4" />}
            </span>
          </button>

          {err && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              {err}
            </p>
          )}
        </form>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
        Fortaleza, BR — UTC-3
      </p>
    </div>
  );
}
