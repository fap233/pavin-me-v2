"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured, type SharedProject } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LogOut, RefreshCw } from "lucide-react";

const STATUSES: {
  key: SharedProject["status"];
  label: string;
  accent: string;
}[] = [
  { key: "backlog", label: "Backlog", accent: "#6366f1" },
  { key: "doing", label: "Em andamento", accent: "#f59e0b" },
  { key: "review", label: "Revisão", accent: "#a855f7" },
  { key: "done", label: "Concluído", accent: "#22c55e" },
];

// ---- Roteiro estruturado (coluna `notes`) ----------------------------------
// O Monitor grava em `notes` um JSON {phases:[{name,items:[{text,done}]}],
// questions:[]} — fases + checklist do escopo. Renderizado interativo aqui;
// marcar/desmarcar persiste de volta no Supabase (RLS permite UPDATE a
// qualquer autenticado — par confiável).

type NotesItem = { text: string; done: boolean };
type NotesPhase = { name: string; items: NotesItem[] };
type Notes = { phases: NotesPhase[]; questions: string[] };

function parseNotes(raw: string | null): Notes | null {
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    const phases: NotesPhase[] = Array.isArray(obj?.phases)
      ? obj.phases.map((ph: { name?: string; items?: unknown[] }) => ({
          name: String(ph?.name ?? ""),
          items: Array.isArray(ph?.items)
            ? ph.items.map((it) =>
                typeof it === "string"
                  ? { text: it, done: false }
                  : {
                      text: String((it as NotesItem)?.text ?? ""),
                      done: Boolean((it as NotesItem)?.done),
                    }
              )
            : [],
        }))
      : [];
    const questions: string[] = Array.isArray(obj?.questions)
      ? obj.questions.map((q: unknown) => String(q))
      : [];
    if (!phases.length && !questions.length) return null;
    return { phases, questions };
  } catch {
    return null;
  }
}

function notesProgress(n: Notes): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const ph of n.phases)
    for (const it of ph.items) {
      total++;
      if (it.done) done++;
    }
  return { done, total };
}

export default function ProjetosPage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "member">("member");
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("shared_projects")
      .select("*")
      .order("created_at", { ascending: false });
    setProjects((data as SharedProject[]) ?? []);
  }, []);

  const onAuthed = useCallback(
    async (u: User) => {
      if (!supabase) return;
      setUser(u);
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .maybeSingle();
      setRole((prof?.role as "admin" | "member") ?? "member");
      await loadProjects();
    },
    [loadProjects]
  );

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
      <Shell>
        <p className="text-muted-foreground">
          Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (Vercel / .env.local).
        </p>
      </Shell>
    );
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">
            Carregando…
          </span>
        </div>
      </Shell>
    );
  }

  if (!user) return <Login onAuthed={onAuthed} />;

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
            {"// backlog"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Backlog de projetos
          </h1>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {user.email}
            <span className="mx-2 text-muted-foreground/40">·</span>
            <span
              className={
                role === "admin" ? "text-purple-400" : "text-muted-foreground"
              }
            >
              {role}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-card/60 backdrop-blur"
            onClick={loadProjects}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Atualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={async () => {
              await supabase!.auth.signOut();
              setUser(null);
            }}
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((st) => {
          const items = projects.filter((p) => p.status === st.key);
          return (
            <div key={st.key}>
              <div
                className="mb-3 rounded-full border bg-card/60 px-3 py-1.5 backdrop-blur"
                style={{
                  borderColor: `color-mix(in oklab, ${st.accent} 35%, transparent)`,
                }}
              >
                <h2 className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: st.accent }}
                    />
                    {st.label}
                  </span>
                  <span style={{ color: st.accent }}>{items.length}</span>
                </h2>
              </div>
              <div className="space-y-3">
                {items.map((p) => (
                  <ProjectCard
                    key={p.id}
                    p={p}
                    me={user}
                    role={role}
                    accent={st.accent}
                    onChange={loadProjects}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Notebook grid over the site-wide universe background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_75%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      {/* Minimal workspace bar — this route lives outside the main site chrome */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6">
        <Link
          href="/"
          className="group text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          Pavin
          <span className="ml-0.5 inline-block font-[family-name:var(--font-caveat)] text-xl text-primary transition-transform group-hover:rotate-[-3deg]">
            .dev
          </span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          Workspace — Backlog
        </span>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">{children}</div>
    </div>
  );
}

function Login({ onAuthed }: { onAuthed: (u: User) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setErr("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });
    setBusy(false);
    if (error) {
      setErr(error.message);
      return;
    }
    if (data.session) await onAuthed(data.session.user);
  }

  return (
    <Shell>
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
            pavin.dev — workspace de colaboradores
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
    </Shell>
  );
}

// Calcula urgência a partir da data de entrega. Urgente = faltam <5 dias
// (ou atrasado) e o projeto ainda não está concluído.
function deliveryInfo(p: SharedProject) {
  if (!p.delivery_at) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(p.delivery_at + "T00:00:00");
  if (isNaN(due.getTime())) return null;
  const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
  const fmt = due.toLocaleDateString("pt-BR");
  const urgent = p.status !== "done" && days < 5;
  let label: string;
  if (days < 0) label = `Atrasado ${Math.abs(days)}d`;
  else if (days === 0) label = "Entrega hoje";
  else if (days === 1) label = "Falta 1 dia";
  else label = `Faltam ${days} dias`;
  return { days, fmt, urgent, label };
}

function ProjectCard({
  p,
  me,
  role,
  accent,
  onChange,
}: {
  p: SharedProject;
  me: User;
  role: "admin" | "member";
  accent: string;
  onChange: () => Promise<void>;
}) {
  // Roteiro local (otimista): marcar/desmarcar aplica na hora e persiste.
  const [notes, setNotes] = useState<Notes | null>(() => parseNotes(p.notes));
  useEffect(() => setNotes(parseNotes(p.notes)), [p.notes]);

  async function update(patch: Partial<SharedProject>) {
    if (!supabase) return;
    const { error } = await supabase.from("shared_projects").update(patch).eq("id", p.id);
    if (error) alert("Erro: " + error.message);
    await onChange();
  }

  async function toggleItem(phaseIdx: number, itemIdx: number) {
    if (!notes || !supabase) return;
    const next: Notes = {
      ...notes,
      phases: notes.phases.map((ph, i) =>
        i !== phaseIdx
          ? ph
          : {
              ...ph,
              items: ph.items.map((it, j) =>
                j !== itemIdx ? it : { ...it, done: !it.done }
              ),
            }
      ),
    };
    setNotes(next);
    const { error } = await supabase
      .from("shared_projects")
      .update({ notes: JSON.stringify(next) })
      .eq("id", p.id);
    if (error) {
      setNotes(notes); // desfaz otimismo
      alert("Erro ao salvar progresso: " + error.message);
    }
  }

  async function claim(take: boolean) {
    await update(
      take
        ? {
            claimed_by: me.id,
            claimed_email: me.email ?? null,
            claimed_at: new Date().toISOString(),
            status: p.status === "backlog" ? "doing" : p.status,
          }
        : { claimed_by: null, claimed_email: null, claimed_at: null }
    );
  }

  async function remove() {
    if (!supabase) return;
    if (!confirm("Remover este projeto do backlog?")) return;
    const { error } = await supabase.from("shared_projects").delete().eq("id", p.id);
    if (error) alert("Erro: " + error.message);
    await onChange();
  }

  const mine = p.claimed_by === me.id;
  const dl = deliveryInfo(p);

  return (
    <Card
      className={`group relative overflow-hidden bg-card/75 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_color-mix(in_oklab,var(--acc)_45%,transparent),0_0_24px_-8px_color-mix(in_oklab,var(--acc)_30%,transparent)] ${
        dl?.urgent ? "urgent-blink border-2" : ""
      }`}
      style={{
        ["--acc" as string]: accent,
        ...(dl?.urgent
          ? {}
          : {
              borderColor: `color-mix(in oklab, ${accent} 22%, var(--border))`,
            }),
      }}
    >
      {/* Borda-gradiente no hover — efeito dos featured projects, mas na COR
          da coluna do card (accent) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${accent}, color-mix(in oklab, ${accent} 45%, white))`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1.5px",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          background: `linear-gradient(to bottom, ${accent}, transparent)`,
        }}
      />
      <CardContent className="space-y-2 pt-4">
        <div className="text-sm font-semibold leading-snug transition-colors duration-300 group-hover:text-[var(--acc)]">
          {p.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {dl && (
            <span
              className={
                dl.urgent
                  ? "font-semibold text-destructive"
                  : "text-muted-foreground"
              }
            >
              ⏳ {dl.label} · {dl.fmt}
            </span>
          )}
          {p.client && <span>{p.client}</span>}
          {/* origem (99freelas) escondida do colaborador — não revelar de onde veio */}
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              repositório
            </a>
          )}
        </div>
        {p.claimed_email && (
          <div className="text-xs text-green-600 dark:text-green-500">
            🙋 {p.claimed_email}
          </div>
        )}

        {/* Progresso do roteiro (fases + checklist do `notes`) */}
        {notes && notesProgress(notes).total > 0 && (
          <div className="pt-0.5">
            <div className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <span>Progresso</span>
              <span style={{ color: accent }}>
                {notesProgress(notes).done}/{notesProgress(notes).total}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-secondary/70">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (notesProgress(notes).done /
                      Math.max(1, notesProgress(notes).total)) *
                    100
                  }%`,
                  background: accent,
                }}
              />
            </div>
          </div>
        )}

        {/* Roteiro interativo — checkboxes persistem no Supabase */}
        {notes && notes.phases.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer select-none text-primary">
              Roteiro (fases)
            </summary>
            <div className="mt-2 space-y-3">
              {notes.phases.map((ph, i) => (
                <div key={i}>
                  {ph.name && (
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {ph.name}
                    </div>
                  )}
                  <ul className="space-y-1">
                    {ph.items.map((it, j) => (
                      <li key={j}>
                        <label className="flex cursor-pointer items-start gap-2">
                          <input
                            type="checkbox"
                            checked={it.done}
                            onChange={() => toggleItem(i, j)}
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer"
                            style={{ accentColor: accent }}
                          />
                          <span
                            className={
                              it.done
                                ? "text-muted-foreground line-through"
                                : "text-foreground/90"
                            }
                          >
                            {it.text}
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {notes.questions.length > 0 && (
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    Perguntas em aberto
                  </div>
                  <ul className="list-disc space-y-1 pl-4 text-foreground/90">
                    {notes.questions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        )}

        {p.description && (
          <details className="text-xs">
            <summary className="cursor-pointer select-none text-primary">
              Ver briefing / valor
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-foreground/90">
              {p.description}
            </pre>
          </details>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {!p.claimed_by && (
            <Button size="sm" className="rounded-full" onClick={() => claim(true)}>
              Pegar
            </Button>
          )}
          {mine && (
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => claim(false)}
            >
              Largar
            </Button>
          )}
          <select
            value={p.status}
            onChange={(e) => update({ status: e.target.value as SharedProject["status"] })}
            className="rounded-full border bg-background/60 px-2.5 py-1 font-mono text-[11px] backdrop-blur"
          >
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          {role === "admin" && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={remove}
            >
              Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
