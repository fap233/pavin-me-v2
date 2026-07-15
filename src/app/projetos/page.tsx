"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured, type SharedProject } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LogOut, Moon, RefreshCw, Sun } from "lucide-react";

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
// tudo persiste de volta no Supabase (RLS permite UPDATE a qualquer
// autenticado — par confiável). O roteiro é EDITÁVEL (adicionar/editar/
// excluir itens e fases) e toda alteração vira uma entrada em `activity`
// com autor+data. `activity` também guarda comentários e PEDIDOS — o
// Monitor 99freelas do Fellipe polla isso e apita quando chega pedido.

type NotesItem = { text: string; done: boolean };
type NotesPhase = { name: string; items: NotesItem[] };
type NotesActivity = {
  author: string;
  kind: "comment" | "request" | "roteiro";
  text: string;
  at: string; // ISO
};
type Notes = {
  phases: NotesPhase[];
  questions: string[];
  activity: NotesActivity[];
};

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
    const activity: NotesActivity[] = Array.isArray(obj?.activity)
      ? obj.activity.map((a: Partial<NotesActivity>) => ({
          author: String(a?.author ?? ""),
          kind: (["comment", "request", "roteiro"].includes(String(a?.kind))
            ? a?.kind
            : "comment") as NotesActivity["kind"],
          text: String(a?.text ?? ""),
          at: String(a?.at ?? ""),
        }))
      : [];
    if (!phases.length && !questions.length && !activity.length) return null;
    return { phases, questions, activity };
  } catch {
    return null;
  }
}

const EMPTY_NOTES: Notes = { phases: [], questions: [], activity: [] };

function shortWhen(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
    " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function shortAuthor(email: string): string {
  return (email || "?").split("@")[0];
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

/**
 * Papeis. A migracao do portal do cliente (2026-07-14) renomeia o vocabulario:
 *   admin  -> owner   (o Fellipe)
 *   member -> collab  (o Gustavo)
 *   client            (novo: o cliente final, so ve o projeto dele)
 * Os nomes antigos continuam aceitos porque a migracao roda no banco, nao aqui:
 * durante a janela entre o deploy do site e o ALTER TABLE, os dois convivem.
 * Sem isso, o Fellipe vira "owner" no banco e PERDE os controles de admin aqui.
 */
type Role = "owner" | "collab" | "client" | "admin" | "member";

function isOwner(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export default function ProjetosPage() {
  const [user, setUser] = useState<User | null>(null);
  // O portal do cliente (migracao 2026-07-14) troca o vocabulario de papeis:
// admin -> owner, member -> collab, e nasce "client" pro cliente final.
// Aceitamos os dois enquanto a migracao nao roda em todos os ambientes.
const [role, setRole] = useState<Role>("collab");
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
      setRole((prof?.role as Role) ?? "collab");
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
                isOwner(role) ? "text-purple-400" : "text-muted-foreground"
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
  // Esta rota vive fora do chrome do site (sem Header), então traz o próprio
  // botão de tema — mesmo comportamento do Header da home (revelação em
  // "blot" de tinta via View Transitions API).
  const { isDarkMode, toggleDarkMode } = useTheme();

  const switchTheme = (event: React.MouseEvent) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced) {
      toggleDarkMode();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const radius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) * 1.2;
    const POINTS = 26;
    const jitter = Array.from({ length: POINTS }, () => 0.8 + Math.random() * 0.45);
    const blot = (scale: number) =>
      `polygon(${Array.from({ length: POINTS }, (_, i) => {
        const angle = (i / POINTS) * Math.PI * 2;
        const r = radius * scale * jitter[i];
        return `${(x + Math.cos(angle) * r).toFixed(1)}px ${(y + Math.sin(angle) * r).toFixed(1)}px`;
      }).join(",")})`;
    const transition = doc.startViewTransition(() => {
      flushSync(() => toggleDarkMode());
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [blot(0.004), blot(1)] },
        {
          duration: 780,
          easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

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
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:inline">
            Workspace — Backlog
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => switchTheme(e)}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
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
  role: Role;
  accent: string;
  onChange: () => Promise<void>;
}) {
  // Roteiro/atividade local (otimista): edições aplicam na hora e persistem.
  const [notes, setNotes] = useState<Notes>(() => parseNotes(p.notes) ?? EMPTY_NOTES);
  useEffect(() => setNotes(parseNotes(p.notes) ?? EMPTY_NOTES), [p.notes]);
  const [editing, setEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentKind, setCommentKind] =
    useState<"comment" | "request">("comment");

  const meLabel = shortAuthor(me.email ?? "");

  async function update(patch: Partial<SharedProject>) {
    if (!supabase) return;
    const { error } = await supabase.from("shared_projects").update(patch).eq("id", p.id);
    if (error) alert("Erro: " + error.message);
    await onChange();
  }

  // Grava `notes` (otimista → rollback em erro). NÃO chama onChange (refetch)
  // pra não fechar o formulário de edição enquanto o Gustavo digita.
  async function saveNotes(next: Notes) {
    if (!supabase) return;
    const prev = notes;
    setNotes(next);
    const { error } = await supabase
      .from("shared_projects")
      .update({ notes: JSON.stringify(next) })
      .eq("id", p.id);
    if (error) {
      setNotes(prev);
      alert("Erro ao salvar: " + error.message);
    }
  }

  function logActivity(next: Notes, kind: NotesActivity["kind"], text: string): Notes {
    return {
      ...next,
      activity: [
        ...next.activity,
        { author: meLabel, kind, text, at: new Date().toISOString() },
      ],
    };
  }

  async function toggleItem(phaseIdx: number, itemIdx: number) {
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
    await saveNotes(next);
  }

  // ---- edição do roteiro (add/edita/exclui item e fase) --------------------

  async function editItem(phaseIdx: number, itemIdx: number, text: string) {
    const old = notes.phases[phaseIdx]?.items[itemIdx]?.text ?? "";
    if (text.trim() === old.trim()) return;
    let next: Notes = {
      ...notes,
      phases: notes.phases.map((ph, i) =>
        i !== phaseIdx
          ? ph
          : {
              ...ph,
              items: ph.items.map((it, j) =>
                j !== itemIdx ? it : { ...it, text }
              ),
            }
      ),
    };
    next = logActivity(next, "roteiro", `editou "${old}" → "${text}"`);
    await saveNotes(next);
  }

  async function deleteItem(phaseIdx: number, itemIdx: number) {
    const old = notes.phases[phaseIdx]?.items[itemIdx]?.text ?? "";
    let next: Notes = {
      ...notes,
      phases: notes.phases.map((ph, i) =>
        i !== phaseIdx
          ? ph
          : { ...ph, items: ph.items.filter((_, j) => j !== itemIdx) }
      ),
    };
    next = logActivity(next, "roteiro", `removeu "${old}"`);
    await saveNotes(next);
  }

  async function addItem(phaseIdx: number, text: string) {
    if (!text.trim()) return;
    let next: Notes = {
      ...notes,
      phases: notes.phases.map((ph, i) =>
        i !== phaseIdx
          ? ph
          : { ...ph, items: [...ph.items, { text: text.trim(), done: false }] }
      ),
    };
    next = logActivity(next, "roteiro", `adicionou "${text.trim()}"`);
    await saveNotes(next);
  }

  async function addPhase(name: string) {
    if (!name.trim()) return;
    let next: Notes = {
      ...notes,
      phases: [...notes.phases, { name: name.trim(), items: [] }],
    };
    next = logActivity(next, "roteiro", `criou a fase "${name.trim()}"`);
    await saveNotes(next);
  }

  async function deletePhase(phaseIdx: number) {
    const name = notes.phases[phaseIdx]?.name ?? "";
    if (!confirm(`Remover a fase "${name}" e seus itens?`)) return;
    let next: Notes = {
      ...notes,
      phases: notes.phases.filter((_, i) => i !== phaseIdx),
    };
    next = logActivity(next, "roteiro", `removeu a fase "${name}"`);
    await saveNotes(next);
  }

  // ---- comentários / pedidos -----------------------------------------------

  async function postActivity() {
    const text = commentText.trim();
    if (!text) return;
    const next = logActivity(notes, commentKind, text);
    setCommentText("");
    await saveNotes(next);
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
        {notesProgress(notes).total > 0 && (
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

        {/* Roteiro interativo + EDITÁVEL — tudo persiste no Supabase */}
        {(notes.phases.length > 0 || notes.questions.length > 0) && (
          <details className="text-xs">
            <summary className="flex cursor-pointer select-none items-center justify-between text-primary">
              <span>Roteiro (fases)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setEditing((v) => !v);
                }}
                className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
              >
                {editing ? "concluir" : "editar"}
              </button>
            </summary>
            <div className="mt-2 space-y-3">
              {notes.phases.map((ph, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {ph.name || "Fase"}
                    </span>
                    {editing && (
                      <button
                        type="button"
                        onClick={() => deletePhase(i)}
                        className="font-mono text-[9px] uppercase tracking-[0.15em] text-destructive/80 hover:text-destructive"
                      >
                        excluir fase
                      </button>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {ph.items.map((it, j) => (
                      <li key={j} className="group/it flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={it.done}
                          onChange={() => toggleItem(i, j)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer"
                          style={{ accentColor: accent }}
                        />
                        {editing ? (
                          <input
                            defaultValue={it.text}
                            onBlur={(e) => editItem(i, j, e.target.value)}
                            className="min-w-0 flex-1 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-foreground/90 outline-none focus:border-primary/60"
                          />
                        ) : (
                          <span
                            className={
                              it.done
                                ? "text-muted-foreground line-through"
                                : "text-foreground/90"
                            }
                          >
                            {it.text}
                          </span>
                        )}
                        {editing && (
                          <button
                            type="button"
                            onClick={() => deleteItem(i, j)}
                            className="shrink-0 font-mono text-[11px] text-destructive/70 hover:text-destructive"
                            title="Remover item"
                          >
                            ✕
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {editing && <AddRow onAdd={(t) => addItem(i, t)} placeholder="+ novo item" />}
                </div>
              ))}
              {editing && <AddRow onAdd={addPhase} placeholder="+ nova fase" />}
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

        {/* Comentários / pedidos — pedido apita no Monitor do Fellipe */}
        <details className="text-xs">
          <summary className="flex cursor-pointer select-none items-center gap-2 text-primary">
            <span>Comentários / pedidos</span>
            {notes.activity.filter((a) => a.kind !== "roteiro").length > 0 && (
              <span
                className="rounded-full px-1.5 text-[10px] font-semibold text-white"
                style={{ background: accent }}
              >
                {notes.activity.filter((a) => a.kind !== "roteiro").length}
              </span>
            )}
          </summary>
          <div className="mt-2 space-y-2">
            {notes.activity.length === 0 && (
              <p className="text-muted-foreground">Nada ainda.</p>
            )}
            {notes.activity.map((a, i) => (
              <div
                key={i}
                className="rounded-lg border px-2.5 py-1.5"
                style={{
                  borderColor:
                    a.kind === "request"
                      ? "color-mix(in oklab, #f59e0b 45%, transparent)"
                      : "var(--border)",
                  background:
                    a.kind === "request"
                      ? "color-mix(in oklab, #f59e0b 8%, transparent)"
                      : "color-mix(in oklab, var(--card) 60%, transparent)",
                }}
              >
                <div className="mb-0.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  {a.kind === "request" && (
                    <span className="font-bold text-amber-500">● pedido</span>
                  )}
                  {a.kind === "roteiro" && <span>✎ roteiro</span>}
                  {a.kind === "comment" && <span>comentário</span>}
                  <span>{a.author}</span>
                  <span className="text-muted-foreground/50">{shortWhen(a.at)}</span>
                </div>
                <div
                  className={
                    a.kind === "roteiro"
                      ? "text-muted-foreground"
                      : "text-foreground/90"
                  }
                >
                  {a.text}
                </div>
              </div>
            ))}

            {/* composer */}
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1">
                {(["comment", "request"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setCommentKind(k)}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] transition ${
                      commentKind === k
                        ? "text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={
                      commentKind === k
                        ? {
                            background: k === "request" ? "#f59e0b" : accent,
                          }
                        : { border: "1px solid var(--border)" }
                    }
                  >
                    {k === "request" ? "pedido" : "comentário"}
                  </button>
                ))}
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  commentKind === "request"
                    ? "Ex.: preciso das credenciais do WordPress do cliente"
                    : "Deixe um comentário…"
                }
                rows={2}
                className="w-full resize-none rounded-lg border border-border/70 bg-background/60 px-2.5 py-1.5 text-foreground/90 outline-none focus:border-primary/60"
              />
              <button
                type="button"
                onClick={postActivity}
                disabled={!commentText.trim()}
                className="rounded-full px-3 py-1 text-[11px] font-semibold text-white transition disabled:opacity-40"
                style={{ background: commentKind === "request" ? "#f59e0b" : accent }}
              >
                {commentKind === "request" ? "Enviar pedido" : "Comentar"}
              </button>
            </div>
          </div>
        </details>

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
          {isOwner(role) && (
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

// Input inline pra adicionar item/fase ao roteiro. Enter (ou blur com texto)
// confirma; limpa depois.
function AddRow({
  onAdd,
  placeholder,
}: {
  onAdd: (text: string) => void | Promise<void>;
  placeholder: string;
}) {
  const [text, setText] = useState("");
  async function commit() {
    const t = text.trim();
    if (!t) return;
    setText("");
    await onAdd(t);
  }
  return (
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
      }}
      onBlur={commit}
      placeholder={placeholder}
      className="mt-1 w-full rounded border border-dashed border-border/70 bg-transparent px-1.5 py-0.5 text-xs text-foreground/80 outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
    />
  );
}
