"use client";

// O rastreio. Um `select * from project_events order by created_at desc` — o
// evento mais novo no topo, pulsando, como o "objeto saiu para entrega" dos
// Correios. Sem reconstrução de estado: o que aconteceu está escrito.

import { useMemo } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Flag,
  MessageSquare,
  PackageCheck,
  PlayCircle,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import type { ProjectEvent, ProjectEventType, Sprint } from "@/lib/supabase";
import { dateTime, relative, shortDate } from "../_format";
import { Panel, SectionTitle } from "./States";

const ICONS: Record<ProjectEventType, LucideIcon> = {
  project_started: Flag,
  sprint_started: PlayCircle,
  sprint_delivered: PackageCheck,
  sprint_approved: CheckCircle2,
  deadline_changed: CalendarClock,
  comment: MessageSquare,
  note: StickyNote,
};

// Cor por tipo. Entrega/aprovação puxam pro verde (é o que o cliente quer ver),
// prazo puxa pro âmbar (mudança de data merece atenção).
const COLORS: Record<ProjectEventType, string> = {
  project_started: "var(--brand-via)",
  sprint_started: "var(--brand-via)",
  sprint_delivered: "#22c55e",
  sprint_approved: "#22c55e",
  deadline_changed: "#f59e0b",
  comment: "#6366f1",
  note: "#a855f7",
};

export function Timeline({
  events,
  sprints,
}: {
  events: ProjectEvent[];
  sprints: Sprint[];
}) {
  // Pra rotular o comentário com a sprint em que ele grudou ("sobre a Sprint 2 —
  // Painel admin") em vez do genérico. Mapa por id, refeito quando muda.
  const sprintById = useMemo(() => {
    const m = new Map<string, Sprint>();
    for (const s of sprints) m.set(s.id, s);
    return m;
  }, [sprints]);

  return (
    <Panel className="p-6 sm:p-8">
      <SectionTitle>Acompanhamento</SectionTitle>

      {events.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Assim que o projeto começar, cada passo aparece aqui — em ordem, com
          data.
        </p>
      ) : (
        <ol className="relative mt-5">
          {events.map((e, i) => (
            <Row
              key={e.id}
              event={e}
              sprint={e.sprint_id ? sprintById.get(e.sprint_id) ?? null : null}
              first={i === 0}
              last={i === events.length - 1}
            />
          ))}
        </ol>
      )}
    </Panel>
  );
}

function Row({
  event,
  sprint,
  first,
  last,
}: {
  event: ProjectEvent;
  sprint: Sprint | null;
  first: boolean;
  last: boolean;
}) {
  const Icon = ICONS[event.type] ?? StickyNote;
  const color = COLORS[event.type] ?? "var(--brand-via)";
  const isClient = event.actor === "client";

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {/* trilho */}
      {!last && (
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-border to-border/30"
        />
      )}

      {/* marcador — o mais recente pulsa */}
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center">
        {first && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none"
            style={{ background: `color-mix(in oklab, ${color} 35%, transparent)` }}
          />
        )}
        <span
          className="relative flex h-8 w-8 items-center justify-center rounded-full border bg-card"
          style={{
            borderColor: `color-mix(in oklab, ${color} ${first ? 70 : 35}%, transparent)`,
            background: first
              ? `color-mix(in oklab, ${color} 14%, var(--card))`
              : "var(--card)",
          }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </span>
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className="font-mono text-[11px] tabular-nums text-muted-foreground"
            title={dateTime(event.created_at)}
          >
            {shortDate(event.created_at)}
          </span>
          <span
            className={`text-sm font-semibold leading-snug ${
              first ? "text-foreground" : "text-foreground/80"
            }`}
          >
            {event.title}
          </span>
          {isClient && (
            <span className="rounded-full border border-border/70 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
              você
            </span>
          )}
          {event.type === "comment" && sprint && (
            <span
              className="inline-flex max-w-full items-center gap-1 rounded-full border px-2 py-px text-[10px]"
              style={{
                borderColor: "color-mix(in oklab, var(--brand-via) 30%, transparent)",
              }}
              title={`Comentário sobre a Sprint ${sprint.idx} — ${sprint.title}`}
            >
              <span
                className="font-mono uppercase tracking-[0.14em]"
                style={{ color: "var(--brand-via)" }}
              >
                Sprint {sprint.idx}
              </span>
              <span className="text-muted-foreground/50">·</span>
              <span className="truncate text-foreground/70">{sprint.title}</span>
            </span>
          )}
          {first && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
              {relative(event.created_at)}
            </span>
          )}
        </div>
        {event.body && (
          <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
            {event.body}
          </p>
        )}
      </div>
    </li>
  );
}
