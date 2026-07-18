"use client";

// Sprints do projeto. Leitura + DUAS ações do cliente por card:
//   1. aprovar a entrega (só quando a sprint está 'delivered');
//   2. conversar NA sprint — cada card abre uma thread estilo review de PR:
//      os comentários daquela sprint (cliente e Fellipe) em ordem, e uma caixa
//      pra comentar ali mesmo. O cliente não edita, não reordena, não vê backlog.
//
// A caixa GERAL "Precisa de algo?" (Composer) continua, pro que não é de sprint.
//
// `viewer` existe porque o back-office (/admin/clientes/[id]) mostra ESTE mesmo
// componente pro staff, e lá duas coisas mudam: não há botão de aprovar (staff
// não aprova no lugar do cliente — a RLS recusaria de qualquer forma) e o "Você"
// da bolha vira "Cliente" (quem está lendo é o outro lado da conversa). O padrão
// é "client": pro portal, nada mudou.

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";
import type {
  ProjectEvent,
  Sprint,
  SprintStatus,
  SprintTask,
} from "@/lib/supabase";
import { authorName, type StaffNames } from "../_data";
import { dateTime, shortYmd } from "../_format";
import { Panel, SectionTitle } from "./States";

type SendResult = { ok: true } | { ok: false; message: string };

/** De que lado da conversa está quem olha a tela. */
export type Viewer = "client" | "staff";

const STATUS: Record<
  SprintStatus,
  { label: string; color: string; dim?: boolean }
> = {
  planned: { label: "planejada", color: "var(--color-muted-foreground)", dim: true },
  in_progress: { label: "em andamento", color: "var(--brand-via)" },
  delivered: { label: "entregue", color: "#22c55e" },
  approved: { label: "aprovada", color: "#22c55e" },
  blocked: { label: "parada", color: "#f59e0b" },
};

// A cor que identifica quem falou na thread. Cliente puxa pro índigo (a mesma
// cor de "comentário" na timeline); Fellipe puxa pro gradiente da marca.
const CLIENT_ACCENT = "#6366f1";
const OWNER_ACCENT = "var(--brand-via)";

export function SprintList({
  sprints,
  events,
  onApprove,
  approvingId,
  onComment,
  viewer = "client",
  authors,
}: {
  sprints: Sprint[];
  events: ProjectEvent[];
  onApprove?: (sprint: Sprint) => void;
  approvingId?: string | null;
  onComment: (text: string, sprintId: string) => Promise<SendResult>;
  viewer?: Viewer;
  // Quem assina a bolha do nosso lado (id -> nome), de `staff_directory`.
  // Opcional: sem ele a bolha volta a dizer "Fellipe", como antes do author_id.
  authors?: StaffNames;
}) {
  // Comentários agrupados por sprint (só type='comment' com sprint_id), em ordem
  // cronológica — como a conversa aconteceu. Um mapa, recalculado quando os
  // eventos mudam (o realtime recarrega tudo).
  const bySprint = useMemo(() => {
    const m = new Map<string, ProjectEvent[]>();
    for (const e of events) {
      if (e.type !== "comment" || !e.sprint_id) continue;
      const arr = m.get(e.sprint_id);
      if (arr) arr.push(e);
      else m.set(e.sprint_id, [e]);
    }
    for (const arr of m.values())
      arr.sort((a, b) => a.created_at.localeCompare(b.created_at));
    return m;
  }, [events]);

  return (
    <Panel className="p-6 sm:p-8">
      <SectionTitle>Sprints</SectionTitle>

      {sprints.length === 0 ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold">
            Estamos montando o plano do seu projeto
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Em breve as etapas aparecem aqui, com o que cada uma entrega e a data
            prevista.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {sprints.map((s) => (
            <SprintRow
              key={s.id}
              sprint={s}
              comments={bySprint.get(s.id) ?? []}
              onApprove={onApprove}
              approving={approvingId === s.id}
              onComment={onComment}
              viewer={viewer}
              authors={authors}
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}

function SprintRow({
  sprint,
  comments,
  onApprove,
  approving,
  onComment,
  viewer,
  authors,
}: {
  sprint: Sprint;
  comments: ProjectEvent[];
  onApprove?: (s: Sprint) => void;
  approving: boolean;
  onComment: (text: string, sprintId: string) => Promise<SendResult>;
  viewer: Viewer;
  authors?: StaffNames;
}) {
  const [descOpen, setDescOpen] = useState(false);
  // Abre já aberta se tem conversa — o cliente vê que ali houve troca sem clicar.
  const [threadOpen, setThreadOpen] = useState(() => comments.length > 0);
  const st = STATUS[sprint.status] ?? STATUS.planned;
  // Aprovar é do CLIENTE, e só. O staff vê a sprint entregue mas não tem o botão.
  const canApprove = viewer === "client" && sprint.status === "delivered" && !!onApprove;
  const current = sprint.status === "in_progress";
  const count = comments.length;

  return (
    <li
      className="rounded-xl border bg-background/40 p-4 transition-colors"
      style={{
        borderColor: current
          ? "color-mix(in oklab, var(--brand-via) 40%, transparent)"
          : "var(--border)",
        background: current
          ? "color-mix(in oklab, var(--brand-via) 6%, transparent)"
          : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] font-semibold tabular-nums"
          style={{
            borderColor: `color-mix(in oklab, ${st.color} 40%, transparent)`,
            color: st.dim ? "var(--color-muted-foreground)" : st.color,
          }}
        >
          {sprint.idx}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="text-sm font-semibold leading-snug">
              {sprint.title}
            </span>
            <span
              className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em]"
              style={{ color: st.dim ? undefined : st.color }}
            >
              {sprint.status === "approved" && <Check className="h-3 w-3" />}
              <span className={st.dim ? "text-muted-foreground" : undefined}>
                {st.label}
              </span>
              {sprint.status === "planned" && sprint.planned_end && (
                <span className="text-muted-foreground/60">
                  · {shortYmd(sprint.planned_end)}
                </span>
              )}
            </span>
          </div>

          {sprint.description && (
            <p
              className={`mt-1 text-sm leading-relaxed text-muted-foreground ${
                descOpen ? "" : "line-clamp-2"
              }`}
              onClick={() => setDescOpen((v) => !v)}
            >
              {sprint.description}
            </p>
          )}

          {sprint.tasks && sprint.tasks.length > 0 && (
            <SprintChecklist tasks={sprint.tasks} />
          )}

          {sprint.status === "approved" && sprint.approved_at && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-500">
              {viewer === "staff" ? "aprovada pelo cliente em" : "aprovada por você em"}{" "}
              {dateTime(sprint.approved_at)}
            </p>
          )}

          {canApprove && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onApprove?.(sprint)}
                disabled={approving}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:pointer-events-none disabled:opacity-60"
              >
                {approving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {approving ? "Registrando…" : "Aprovar entrega"}
              </button>
              <span className="text-xs text-muted-foreground">
                Confere e aprova — fica registrado com a data.
              </span>
            </div>
          )}

          {/* --- thread da sprint (review de PR) --- */}
          <button
            type="button"
            onClick={() => setThreadOpen((v) => !v)}
            aria-expanded={threadOpen}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition hover:border-border hover:text-foreground"
          >
            <MessageSquare className="h-3 w-3" />
            {count > 0
              ? `${count} ${count === 1 ? "comentário" : "comentários"}`
              : viewer === "staff"
                ? "Responder nesta sprint"
                : "Comentar nesta sprint"}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${threadOpen ? "rotate-180" : ""}`}
            />
          </button>

          {threadOpen && (
            <SprintThread
              sprint={sprint}
              comments={comments}
              onComment={onComment}
              viewer={viewer}
              authors={authors}
            />
          )}
        </div>
      </div>
    </li>
  );
}

// Checklist (read-only) das fases da sprint. O cliente vê o que já está feito e o
// que falta; quem marca é o Fellipe (pelo Monitor). Marcar move a barra lá em cima.
function SprintChecklist({ tasks }: { tasks: SprintTask[] }) {
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {done}/{tasks.length} fases
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
          {pct}%
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-secondary/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start gap-2 text-sm">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                t.done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-border text-transparent"
              }`}
            >
              <Check className="h-3 w-3" />
            </span>
            <span
              className={
                t.done
                  ? "text-muted-foreground line-through decoration-muted-foreground/40"
                  : "text-foreground/90"
              }
            >
              {t.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SprintThread({
  sprint,
  comments,
  onComment,
  viewer,
  authors,
}: {
  sprint: Sprint;
  comments: ProjectEvent[];
  onComment: (text: string, sprintId: string) => Promise<SendResult>;
  viewer: Viewer;
  authors?: StaffNames;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setErr("");
    const res = await onComment(body, sprint.id);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setText(""); // o reload traz o comentário novo pra lista acima
  }

  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-card/40 p-3">
      {comments.length === 0 ? (
        <p className="px-1 py-1 text-xs text-muted-foreground">
          {viewer === "staff"
            ? "Nenhum comentário nesta sprint ainda. O que você escrever aqui aparece no portal do cliente."
            : "Nenhum comentário nesta sprint ainda. Escreva abaixo — cai direto comigo."}
        </p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <CommentBubble
              key={c.id}
              comment={c}
              viewer={viewer}
              authors={authors}
            />
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="mt-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          rows={2}
          placeholder={
            viewer === "staff"
              ? `Responder na Sprint ${sprint.idx}…`
              : `Comentar na Sprint ${sprint.idx}…`
          }
          className="w-full resize-none rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
        />
        <div className="mt-2 flex items-center gap-2">
          {err && (
            <span className="mr-auto text-xs text-destructive" role="alert">
              {err}
            </span>
          )}
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-via)]/40 bg-[var(--brand-via)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand-via)] transition hover:bg-[var(--brand-via)]/20 disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {busy ? "Enviando…" : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function CommentBubble({
  comment,
  viewer,
  authors,
}: {
  comment: ProjectEvent;
  viewer: Viewer;
  authors?: StaffNames;
}) {
  const isClient = comment.actor === "client";
  const accent = isClient ? CLIENT_ACCENT : OWNER_ACCENT;
  // "Você" é sempre quem está lendo. No portal, o cliente; no back-office, quem
  // lê é o outro lado — então a fala do cliente vira "Cliente", não "Você".
  //
  // Do nosso lado, o nome sai do author_id (2026-07-16b): `actor='owner'` já não
  // é uma pessoa só. Sem author_id, ou sem o diretório, cai em "Fellipe" — a
  // única verdade possível pras linhas escritas antes da coluna existir.
  const who = isClient
    ? viewer === "staff"
      ? "Cliente"
      : "Você"
    : authorName(comment, authors);

  return (
    <li
      className="rounded-lg border px-3 py-2"
      style={{
        borderColor: `color-mix(in oklab, ${accent} 22%, var(--border))`,
        background: `color-mix(in oklab, ${accent} 5%, transparent)`,
      }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: accent }}
        >
          {who}
        </span>
        <time
          className="font-mono text-[10px] tabular-nums text-muted-foreground/70"
          title={dateTime(comment.created_at)}
        >
          {dateTime(comment.created_at)}
        </time>
      </div>
      {comment.body && (
        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {comment.body}
        </p>
      )}
    </li>
  );
}
