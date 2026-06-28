"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, supabaseConfigured, type SharedProject } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUSES: { key: SharedProject["status"]; label: string }[] = [
  { key: "backlog", label: "Backlog" },
  { key: "doing", label: "Em andamento" },
  { key: "review", label: "Revisão" },
  { key: "done", label: "Concluído" },
];

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
        <p className="text-muted-foreground">Carregando…</p>
      </Shell>
    );
  }

  if (!user) return <Login onAuthed={onAuthed} />;

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Backlog de projetos</h1>
          <p className="text-sm text-muted-foreground">
            {user.email} ({role})
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadProjects}>
            Atualizar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await supabase!.auth.signOut();
              setUser(null);
            }}
          >
            Sair
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUSES.map((st) => {
          const items = projects.filter((p) => p.status === st.key);
          return (
            <div key={st.key}>
              <h2 className="mb-2 px-1 text-sm font-semibold text-muted-foreground">
                {st.label} ({items.length})
              </h2>
              <div className="space-y-3">
                {items.map((p) => (
                  <ProjectCard
                    key={p.id}
                    p={p}
                    me={user}
                    role={role}
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
  return <div className="mx-auto max-w-7xl px-4 py-10">{children}</div>;
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
      <Card className="mx-auto mt-[10vh] max-w-sm">
        <CardHeader>
          <CardTitle>Backlog — entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="senha"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Entrando…" : "Entrar"}
            </Button>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </form>
        </CardContent>
      </Card>
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
  onChange,
}: {
  p: SharedProject;
  me: User;
  role: "admin" | "member";
  onChange: () => Promise<void>;
}) {
  async function update(patch: Partial<SharedProject>) {
    if (!supabase) return;
    const { error } = await supabase.from("shared_projects").update(patch).eq("id", p.id);
    if (error) alert("Erro: " + error.message);
    await onChange();
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
    <Card className={dl?.urgent ? "urgent-blink border-2" : undefined}>
      <CardContent className="space-y-2 pt-4">
        <div className="text-sm font-semibold leading-snug">{p.title}</div>
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
          {p.source && <Badge variant="secondary">{p.source}</Badge>}
          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              abrir
            </a>
          )}
        </div>
        {p.claimed_email && (
          <div className="text-xs text-green-600 dark:text-green-500">
            🙋 {p.claimed_email}
          </div>
        )}
        {p.description && (
          <details className="text-xs">
            <summary className="cursor-pointer select-none text-primary">
              Ver roteiro / valor
            </summary>
            <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-foreground/90">
              {p.description}
            </pre>
          </details>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {!p.claimed_by && (
            <Button size="sm" onClick={() => claim(true)}>
              Pegar
            </Button>
          )}
          {mine && (
            <Button size="sm" variant="outline" onClick={() => claim(false)}>
              Largar
            </Button>
          )}
          <select
            value={p.status}
            onChange={(e) => update({ status: e.target.value as SharedProject["status"] })}
            className="rounded-md border bg-background px-2 py-1 text-xs"
          >
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          {role === "admin" && (
            <Button size="sm" variant="ghost" onClick={remove}>
              Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
