"use client";

// A lista de projetos das telas "Meus projetos" e "Disponíveis".
//
// Cards de LEITURA, de propósito. Pegar, largar, mover de coluna e mexer no
// roteiro continua sendo o Quadro — duplicar a escrita aqui seria duas fontes
// pra mesma gravação, e é a mesma decisão que o /admin/meus já tinha tomado.
// Por isso todo card leva pro Quadro, que é onde as coisas acontecem.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { SharedProject } from "@/lib/supabase";
import {
  EmptyState,
  ErrorState,
  Loading,
  Panel,
} from "../../cliente/_components/States";
import { deliveryDate } from "../../cliente/_data";
import { longDate } from "../../cliente/_format";
import { listWorkable, mine, unclaimed } from "../_data";
import { useWorker } from "./CollabShell";

// As cores das colunas do Quadro. Repetidas aqui porque o STATUSES do
// page.tsx é local dele — no dia em que o kanban virar componente
// (_components/KanbanBoard.tsx) e exportar essa tabela, importe de lá e apague
// esta. A mesma informação não pode ter duas linguagens visuais na mesma área.
const STATUS: Record<SharedProject["status"], { label: string; accent: string }> = {
  backlog: { label: "backlog", accent: "#6366f1" },
  doing: { label: "em andamento", accent: "#f59e0b" },
  review: { label: "revisão", accent: "#a855f7" },
  done: { label: "concluído", accent: "#22c55e" },
};

/** Uma das duas prateleiras do workspace.
 *
 *  "mine"  = claimed_by sou eu.   "free" = claimed_by é null.
 *
 *  E é só isso: NÃO existe filtro de autorização aqui. A lista que chega de
 *  `listWorkable()` já vem recortada pela RLS (o collab só recebe o que pegou +
 *  o backlog livre sem cliente). Isto é arrumação de tela em cima de um
 *  conjunto que o banco já decidiu — se virar regra de acesso, vira mentira. */
export function ScopedList({
  scope,
  kicker,
  title,
  emptyTitle,
  emptyBody,
}: {
  scope: "mine" | "free";
  kicker: string;
  title: string;
  emptyTitle: string;
  emptyBody: React.ReactNode;
}) {
  const worker = useWorker();
  const [projects, setProjects] = useState<SharedProject[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await listWorkable();
    if (!res.ok) {
      setError(res.message);
      setProjects(null);
      setLoading(false);
      return;
    }
    setProjects(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Deslogado esta tela não tem o que dizer — e o login mora no Quadro, que é a
  // porta desta área. Manda pra lá em vez de repetir o formulário aqui.
  if (!worker)
    return (
      <EmptyState title="Entre pra ver seus projetos">
        O login desta área é a tela do{" "}
        <Link
          href="/projetos"
          className="text-[var(--brand-via)] underline-offset-4 hover:underline"
        >
          Quadro
        </Link>
        .
      </EmptyState>
    );

  const list =
    projects === null
      ? []
      : scope === "mine"
        ? mine(projects, worker.id)
        : unclaimed(projects);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {kicker}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      </div>

      {loading ? (
        <Loading label="Carregando os projetos" />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : list.length === 0 ? (
        <EmptyState title={emptyTitle}>{emptyBody}</EmptyState>
      ) : (
        <WorkList projects={list} />
      )}
    </div>
  );
}

function WorkList({ projects }: { projects: SharedProject[] }) {
  return (
    <ul className="space-y-3">
      {projects.map((p) => {
        const st = STATUS[p.status] ?? STATUS.backlog;
        const due = longDate(deliveryDate(p));
        return (
          <li key={p.id}>
            {/* O Quadro não tem âncora por card, então o link leva pra tela
                dele — é o mais perto que dá sem inventar rota. */}
            <Link
              href="/projetos"
              className="block"
              style={{ ["--acc" as string]: st.accent }}
            >
              <Panel className="group p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--acc)_45%,transparent)]">
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{
                    background: `linear-gradient(to bottom, ${st.accent}, transparent)`,
                  }}
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold group-hover:text-[var(--acc)]">
                      {p.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {p.client ? `${p.client} · ` : ""}
                      {due ? `entrega ${due}` : "entrega a combinar"}
                    </p>
                    {p.claimed_email && (
                      <p className="mt-1 truncate text-xs text-green-600 dark:text-green-500">
                        🙋 {p.claimed_email}
                      </p>
                    )}
                  </div>
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                    style={{
                      borderColor: `color-mix(in oklab, ${st.accent} 40%, transparent)`,
                      color: st.accent,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
              </Panel>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
