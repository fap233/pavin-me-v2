"use client";

// Ordenação das listas de projeto ("Meus"/"Disponíveis" do workspace e o
// /admin/meus) — pedido do Fellipe (2026-07-22): escolher entre POR ENTREGA e
// POR STATUS. É arrumação de tela: nunca filtra, só reordena o que a RLS já
// entregou.

import type { SharedProject } from "@/lib/supabase";
import { deliveryDate } from "../../cliente/_data";

export type SortKey = "entrega" | "status";

// Ordem das colunas do Quadro — a mesma linguagem visual do kanban.
const STATUS_ORDER: Record<SharedProject["status"], number> = {
  backlog: 0,
  doing: 1,
  review: 2,
  done: 3,
};

function dueMs(p: SharedProject): number {
  const d = deliveryDate(p); // string ISO ("2026-07-24") ou null
  const t = d ? new Date(d).getTime() : NaN;
  // Sem entrega (ou data ilegível) vai pro FIM — "a combinar" não é urgente.
  return isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

export function sortProjects(
  list: SharedProject[],
  key: SortKey
): SharedProject[] {
  const out = [...list];
  if (key === "entrega") {
    out.sort(
      (a, b) => dueMs(a) - dueMs(b) || a.title.localeCompare(b.title, "pt-BR")
    );
  } else {
    out.sort(
      (a, b) =>
        (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0) ||
        dueMs(a) - dueMs(b)
    );
  }
  return out;
}

export function SortChips({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (k: SortKey) => void;
}) {
  const chip = (k: SortKey, label: string) => (
    <button
      type="button"
      onClick={() => onChange(k)}
      className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
        value === k
          ? "border-[var(--brand-via)] text-[var(--brand-via)]"
          : "border-border/70 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Ordenar por"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
        ordenar
      </span>
      {chip("entrega", "entrega")}
      {chip("status", "status")}
    </div>
  );
}
