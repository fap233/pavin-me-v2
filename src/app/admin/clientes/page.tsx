"use client";

// "Clientes": a lista dos PORTAIS — todo projeto com cliente vinculado
// (project_members role='client').
//
// A ordem não é alfabética: quem tem cliente esperando resposta vem primeiro
// (listPortals ordena). É pra isso que se abre esta tela.
//
// A % é a MESMA que o cliente vê (progressOf, do portal): fases quando existem,
// senão status das sprints. Se aqui dissesse 60% e no portal dele 45%, a tela
// errada seria justamente a que a gente usa pra decidir.

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquareWarning } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  Loading,
  Panel,
} from "../../cliente/_components/States";
import { listPortals, type PortalSummary } from "../_data";

export default function ClientesPage() {
  const [portals, setPortals] = useState<PortalSummary[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await listPortals();
    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setPortals(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Carregando os portais" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// quem está acompanhando"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Portais de cliente
        </h1>
      </div>

      {!portals || portals.length === 0 ? (
        <EmptyState title="Nenhum portal ainda">
          Um projeto aparece aqui quando um cliente é vinculado a ele
          (project_members). Quem cria o vínculo é o Monitor.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {portals.map((p) => (
            <li key={p.project.id}>
              <Link href={`/admin/clientes/${p.project.id}`} className="block">
                <Panel
                  accent={p.pending > 0}
                  className="group p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--brand-via)_45%,transparent)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold group-hover:text-[var(--brand-via)]">
                        {p.project.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                        {p.clients.length === 0
                          ? "sem cliente vinculado"
                          : p.clients
                              .map((c) => c.email ?? "e-mail indisponível")
                              .join(", ")}
                      </p>
                    </div>

                    {p.pending > 0 ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-500">
                        <MessageSquareWarning className="h-3 w-3" />
                        {p.pending}{" "}
                        {p.pending === 1 ? "sem resposta" : "sem resposta"}
                      </span>
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand-via)]" />
                    )}
                  </div>

                  {/* Progresso — mesma barra e mesma regra do portal do cliente */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {p.currentSprint
                          ? `Sprint ${p.currentSprint.idx} · ${p.currentSprint.title}`
                          : p.progress.phaseLabel}
                      </span>
                      <span className="font-mono text-[10px] font-semibold tabular-nums text-muted-foreground">
                        {p.progress.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary/70">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] transition-[width] duration-500"
                        style={{ width: `${p.progress.pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground/70">
                      {p.progress.usesTasks
                        ? `${p.progress.tasksDone} de ${p.progress.tasksTotal} fases`
                        : `${p.progress.done} de ${p.progress.total} sprints`}
                    </p>
                  </div>
                </Panel>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
