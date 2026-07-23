"use client";

// "Meus": os projetos que EU peguei no Kanban (shared_projects.claimed_by).
//
// Não é a mesma lista da aba Clientes: pegar é do fluxo do backlog, portal é
// vínculo de cliente. Um projeto pode estar num, no outro, nos dois ou em
// nenhum — e é justamente por isso que são duas telas.
//
// Cards de leitura. Quem move status, larga ou edita continua sendo o /projetos:
// duplicar a edição aqui seria duas fontes pra mesma escrita.

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
import { listClaimed } from "../_data";
import { useStaff } from "../_components/AdminShell";
import { ProjectOverlay } from "../../projetos/_components/ProjectOverlay";
import { SortChips, sortProjects, type SortKey } from "../../projetos/_components/sort";

// Mesmas cores de coluna do Kanban — a mesma informação não pode ter duas
// linguagens visuais no mesmo produto.
const STATUS: Record<SharedProject["status"], { label: string; accent: string }> = {
  backlog: { label: "backlog", accent: "#64748b" },
  doing: { label: "fazendo", accent: "#a855f7" },
  review: { label: "revisão", accent: "#f59e0b" },
  done: { label: "entregue", accent: "#22c55e" },
};

export default function MeusPage() {
  const staff = useStaff();
  const [projects, setProjects] = useState<SharedProject[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  // Projeto aberto no modal de detalhe (o "resumão"). Clicar num card abre isto
  // — antes navegava pro Kanban, que não tem âncora por card (pedido 2026-07-22).
  const [selected, setSelected] = useState<SharedProject | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("entrega");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await listClaimed(staff.id);
    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    setProjects(res.data);
    setLoading(false);
  }, [staff.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading label="Carregando seus projetos" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
            {"// o que eu peguei"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Meus projetos
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <SortChips value={sortKey} onChange={setSortKey} />
          <Link
            href="/admin/kanban"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Abrir o Kanban
          </Link>
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <EmptyState title="Você não pegou nenhum projeto">
          Quando você pegar um card no{" "}
          <Link
            href="/admin/kanban"
            className="text-[var(--brand-via)] underline-offset-4 hover:underline"
          >
            Kanban
          </Link>
          , ele aparece aqui.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {sortProjects(projects, sortKey).map((p) => {
            const st = STATUS[p.status] ?? STATUS.backlog;
            const due = longDate(deliveryDate(p));
            return (
              <li key={p.id}>
                {/* Clicar abre o modal de detalhe (marcos, conversa, briefing) —
                    o Kanban continua a um clique no topo pra quem quer o quadro. */}
                <button
                  type="button"
                  onClick={() => setSelected(p)}
                  className="block w-full text-left"
                >
                  <Panel className="group p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--brand-via)_45%,transparent)]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold group-hover:text-[var(--brand-via)]">
                          {p.title}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {p.client ? `${p.client} · ` : ""}
                          {due ? `entrega ${due}` : "entrega a combinar"}
                        </p>
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
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selected && (
        <ProjectOverlay
          project={selected}
          staff={staff}
          onClose={() => {
            setSelected(null);
            load(); // marcos/comentários podem ter mudado — a lista reflete
          }}
        />
      )}
    </div>
  );
}
