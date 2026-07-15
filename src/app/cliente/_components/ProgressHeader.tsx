"use client";

// O topo do rastreio: onde o projeto está, quanto já andou, quando chega.
// É a primeira coisa que o cliente lê — e, na maioria das visitas, a única.

import { CalendarClock } from "lucide-react";
import type { SharedProject, Sprint } from "@/lib/supabase";
import { daysUntil, deadlineLabel, longDate } from "../_format";
import { deliveryDate, progressOf } from "../_data";
import { Panel } from "./States";

export function ProgressHeader({
  project,
  sprints,
}: {
  project: SharedProject;
  sprints: Sprint[];
}) {
  const p = progressOf(sprints);
  const due = deliveryDate(project);
  const dueLong = longDate(due);
  const dueDays = daysUntil(due);
  const late = dueDays !== null && dueDays < 0 && p.phase !== "done";
  const near = dueDays !== null && dueDays >= 0 && dueDays <= 5 && p.phase !== "done";

  return (
    <Panel accent className="p-6 sm:p-8">
      <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        {project.title}
      </h1>

      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className={p.phase === "done" ? "text-emerald-500" : "text-[var(--brand-via)]"}>
          {p.phaseLabel}
        </span>
        {p.total > 0 && p.currentIdx !== null && p.phase !== "done" && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>
              Sprint {p.currentIdx} de {p.total}
            </span>
          </>
        )}
        {p.phase === "done" && p.total > 0 && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span>
              {p.total} {p.total === 1 ? "sprint entregue" : "sprints entregues"}
            </span>
          </>
        )}
      </p>

      {/* Barra: sprints entregues ou aprovadas ÷ total */}
      <div className="mt-6">
        <div className="mb-2 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Progresso
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {p.pct}%
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-secondary/70"
          role="progressbar"
          aria-valuenow={p.pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do projeto"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] transition-[width] duration-700 ease-out"
            style={{ width: `${p.pct}%` }}
          />
        </div>
        {p.total > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            {p.done} de {p.total} {p.total === 1 ? "sprint" : "sprints"} entregues
          </p>
        )}
      </div>

      {/* Prazo */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5 text-sm">
        <CalendarClock
          className={`h-4 w-4 ${late ? "text-destructive" : "text-muted-foreground"}`}
        />
        {dueLong ? (
          <>
            <span className="text-muted-foreground">Entrega prevista:</span>
            <span className="font-semibold">{dueLong}</span>
            {(late || near) && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  late
                    ? "bg-destructive/10 text-destructive"
                    : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {deadlineLabel(due)}
              </span>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">
            Data de entrega ainda não definida — combinamos junto com o plano.
          </span>
        )}
      </div>
    </Panel>
  );
}
