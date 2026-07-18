"use client";

// "Marcos": o índice read-through dos projetos, agrupado por projeto.
//
// Componente COMPARTILHADO entre /admin/marcos (o dono vê todos) e
// /projetos/marcos (o colaborador vê os dele). A MESMA view nas duas cascas —
// quem recorta é a RLS, não o componente: loadMilestones/toggleMilestone só
// devolvem e só deixam marcar o que o usuário logado pode trabalhar
// (can_work_project). Por isso o Gustavo não precisa passar pelo /admin.
//
// A escrita cai onde a fonte da verdade REALMENTE mora — sprint_tasks (portal)
// ou notes.phases (kanban). Não há tabela nova; ver _marcos-data.ts.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, CircleDot, Users } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  Loading,
  Panel,
} from "../../cliente/_components/States";
import {
  loadMilestones,
  toggleMilestone,
  type Milestone,
} from "../_marcos-data";

/** Chave estável de um marco. Portal tem id (tid); kanban é ancorado no índice
 *  (não tem id), então a chave é composta. */
function keyOf(m: Milestone): string {
  return m.source === "portal"
    ? `t:${m.tid}`
    : `k:${m.project_id}:${m.sprint_idx}:${m.item_index}`;
}

type SprintGroup = {
  sprint_idx: number;
  sprint_title: string;
  sprint_status: string | null;
  items: Milestone[];
};

type ProjectGroup = {
  project_id: string;
  project_title: string;
  has_client: boolean;
  source: Milestone["source"];
  sprints: SprintGroup[];
  done: number;
  total: number;
};

/** Achata → agrupa por projeto e, dentro, por sprint. Preserva a ordem do
 *  array (o _marcos-data já entrega na ordem de render do contrato). */
function groupByProject(list: Milestone[]): ProjectGroup[] {
  const projects: ProjectGroup[] = [];
  const projIndex = new Map<string, ProjectGroup>();
  const sprintIndex = new Map<string, SprintGroup>();

  for (const m of list) {
    let pg = projIndex.get(m.project_id);
    if (!pg) {
      pg = {
        project_id: m.project_id,
        project_title: m.project_title,
        has_client: m.has_client,
        source: m.source,
        sprints: [],
        done: 0,
        total: 0,
      };
      projIndex.set(m.project_id, pg);
      projects.push(pg);
    }
    const sKey = `${m.project_id}:${m.sprint_idx}`;
    let sg = sprintIndex.get(sKey);
    if (!sg) {
      sg = {
        sprint_idx: m.sprint_idx,
        sprint_title: m.sprint_title,
        sprint_status: m.sprint_status,
        items: [],
      };
      sprintIndex.set(sKey, sg);
      pg.sprints.push(sg);
    }
    sg.items.push(m);
    pg.total += 1;
    if (m.done) pg.done += 1;
  }

  return projects;
}

export function MarcosView() {
  const [list, setList] = useState<Milestone[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Marcos com um toggle em voo (por chave) — desabilita o checkbox e evita
  // clique duplo enquanto o banco não confirma.
  const [busy, setBusy] = useState<Set<string>>(new Set());
  // Erro transitório de um toggle específico (rollback já aplicado).
  const [toggleError, setToggleError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await loadMilestones();
    if (!res.ok) {
      setError(res.message);
      setList(null);
      setLoading(false);
      return;
    }
    setList(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const groups = useMemo(() => (list ? groupByProject(list) : []), [list]);

  const onToggle = useCallback(
    async (m: Milestone, next: boolean) => {
      const k = keyOf(m);
      setToggleError("");
      setBusy((b) => new Set(b).add(k));
      // Otimista: marca na hora, reverte se o banco recusar.
      setList((prev) =>
        prev
          ? prev.map((x) =>
              keyOf(x) === k ? { ...x, done: next, done_at: next ? x.done_at : null } : x
            )
          : prev
      );
      const res = await toggleMilestone(m, next);
      setBusy((b) => {
        const n = new Set(b);
        n.delete(k);
        return n;
      });
      if (!res.ok) {
        // Rollback ao estado anterior do próprio marco.
        setList((prev) =>
          prev ? prev.map((x) => (keyOf(x) === k ? { ...x, done: m.done } : x)) : prev
        );
        setToggleError(res.message);
        return;
      }
      // Sucesso: recarrega em segundo plano pra pegar o done_at real (portal) e
      // qualquer mudança concorrente. A tela já mostra o estado certo.
      load();
    },
    [load]
  );

  if (loading) return <Loading label="Carregando os marcos" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// o que já foi entregue"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Marcos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Os marcos dos projetos, agrupados. Marcar aqui atualiza o portal do
          cliente (sprints) ou o roteiro do Kanban (fases) — onde o marco
          realmente mora.
        </p>
      </div>

      {toggleError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {toggleError}
        </p>
      )}

      {groups.length === 0 ? (
        <EmptyState title="Nenhum marco ainda">
          Um projeto aparece aqui quando tem sprints com fases (portal) ou um
          roteiro de fases no Kanban (notes).
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {groups.map((g) => (
            <li key={g.project_id}>
              <ProjectBlock group={g} busy={busy} onToggle={onToggle} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectBlock({
  group,
  busy,
  onToggle,
}: {
  group: ProjectGroup;
  busy: Set<string>;
  onToggle: (m: Milestone, next: boolean) => void;
}) {
  const pct = group.total === 0 ? 0 : Math.round((group.done / group.total) * 100);

  return (
    <Panel className="p-5" accent={group.has_client}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold">{group.project_title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/40 px-2 py-0.5">
              {group.source === "portal" ? "portal" : "kanban"}
            </span>
            {group.has_client && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_oklab,var(--brand-via)_40%,transparent)] bg-[color-mix(in_oklab,var(--brand-via)_10%,transparent)] px-2 py-0.5 text-[var(--brand-via)]">
                <Users className="h-3 w-3" />
                cliente
              </span>
            )}
          </div>
        </div>
        <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground">
          {group.done}/{group.total}
        </span>
      </div>

      {/* Barra: fração dos marcos LISTADOS marcados. É um tally da lista, não o
          cálculo canônico de % do projeto (esse vive no progressOf do portal). */}
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-4 space-y-4">
        {group.sprints.map((s) => (
          <div key={`${group.project_id}:${s.sprint_idx}`}>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {group.source === "portal"
                  ? `Sprint ${s.sprint_idx} · ${s.sprint_title}`
                  : s.sprint_title || `Fase ${s.sprint_idx + 1}`}
              </span>
              {s.sprint_status && (
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
                  {s.sprint_status}
                </span>
              )}
            </div>
            <ul className="space-y-1">
              {s.items.map((m) => {
                const k = keyOf(m);
                return (
                  <li key={k}>
                    <MilestoneRow m={m} busy={busy.has(k)} onToggle={onToggle} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MilestoneRow({
  m,
  busy,
  onToggle,
}: {
  m: Milestone;
  busy: boolean;
  onToggle: (m: Milestone, next: boolean) => void;
}) {
  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => onToggle(m, !m.done)}
      className="flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-card/60 disabled:cursor-wait disabled:opacity-60"
      aria-pressed={m.done}
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          m.done
            ? "border-[var(--brand-via)] bg-[var(--brand-via)] text-white"
            : "border-border bg-card/40 text-transparent"
        }`}
      >
        {m.done ? (
          <Check className="h-3 w-3" />
        ) : (
          <CircleDot className="h-3 w-3 text-transparent" />
        )}
      </span>
      <span
        className={`text-sm leading-snug ${
          m.done ? "text-muted-foreground line-through" : "text-foreground/90"
        }`}
      >
        {m.text || <span className="italic text-muted-foreground/60">sem título</span>}
      </span>
    </button>
  );
}
