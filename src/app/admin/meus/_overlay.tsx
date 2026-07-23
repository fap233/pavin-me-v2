"use client";

// O "resumão" de UM projeto — modal estilo overlay do portfólio (MEDSPACE),
// pedido do Fellipe (2026-07-22): clicar num projeto do "Meus" abre ISTO em vez
// de navegar pro Kanban. Mostra e OPERA num lugar só:
//   • marcos (fases do roteiro OU do portal) com marcar/desmarcar;
//   • conversa (atividade do kanban + comentários do cliente) com resposta;
//   • briefing/valor (description) e links (repo).
// Na prática substitui a "visão do cliente" da aba Clientes — mesma informação,
// mais completa (decisão do Fellipe). A aba continua existindo por ora.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Github, Send, X } from "lucide-react";
import { supabase, type SharedProject } from "@/lib/supabase";
import { deliveryDate } from "../../cliente/_data";
import { longDate } from "../../cliente/_format";
import { postStaffReply, type StaffUser } from "../_data";
import {
  loadMilestones,
  toggleMilestone,
  type Milestone,
} from "../_marcos-data";

const STATUS: Record<SharedProject["status"], { label: string; accent: string }> = {
  backlog: { label: "backlog", accent: "#64748b" },
  doing: { label: "fazendo", accent: "#a855f7" },
  review: { label: "revisão", accent: "#f59e0b" },
  done: { label: "entregue", accent: "#22c55e" },
};

/** Uma entrada da conversa, venha do kanban (notes.activity) ou do portal
 *  (project_events tipo comment). Normalizada só pro render. */
type Talk = {
  key: string;
  origin: "kanban" | "cliente" | "equipe";
  author: string;
  kind: string; // comment | request | roteiro
  text: string;
  at: string; // ISO ("" quando desconhecido)
};

function mkey(m: Milestone): string {
  return m.source === "portal"
    ? `p:${m.tid}`
    : `k:${m.sprint_idx}.${m.item_index}`;
}

function shortWhen(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
    " " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

export function ProjectAdminOverlay({
  project,
  staff,
  onClose,
}: {
  project: SharedProject;
  staff: StaffUser;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const st = STATUS[project.status] ?? STATUS.backlog;
  const due = longDate(deliveryDate(project));

  // ---- dados vivos do modal --------------------------------------------------
  const [marcos, setMarcos] = useState<Milestone[]>([]);
  const [talk, setTalk] = useState<Talk[]>([]);
  const [hasClient, setHasClient] = useState(false);
  const [loadErr, setLoadErr] = useState("");
  const [busy, setBusy] = useState<Set<string>>(new Set());

  const reload = useCallback(async () => {
    if (!supabase) return;
    setLoadErr("");
    // Marcos: mesmos primitivos da página Marcos (kanban E portal) — o modal só
    // filtra pro projeto aberto. Reuso > cópia: a regra de âncora mora lá.
    const ms = await loadMilestones();
    if (ms.ok) setMarcos(ms.data.filter((m) => m.project_id === project.id));
    else setLoadErr(ms.message);

    const entries: Talk[] = [];
    // Conversa do kanban: notes.activity (comentários/pedidos do Gustavo etc.).
    const { data: row } = await supabase
      .from("shared_projects")
      .select("notes")
      .eq("id", project.id)
      .maybeSingle();
    try {
      const obj = row?.notes ? JSON.parse(row.notes) : null;
      const acts: unknown[] = Array.isArray(obj?.activity) ? obj.activity : [];
      for (let i = 0; i < acts.length; i++) {
        const a = (acts[i] ?? {}) as Record<string, unknown>;
        const text = String(a.text ?? "").trim();
        if (!text) continue;
        entries.push({
          key: `a${i}`,
          origin: "kanban",
          author: String(a.author ?? "?").split("@")[0],
          kind: String(a.kind ?? "comment"),
          text,
          at: String(a.at ?? ""),
        });
      }
    } catch {
      /* notes ilegível: segue só com o portal */
    }
    // Conversa do portal: comentários da timeline do cliente (e respostas).
    const { data: evs } = await supabase
      .from("project_events")
      .select("id,type,body,actor,created_at")
      .eq("project_id", project.id)
      .eq("type", "comment")
      .order("created_at", { ascending: true })
      .limit(80);
    for (const e of evs ?? []) {
      const text = String(e.body ?? "").trim();
      if (!text) continue;
      entries.push({
        key: `e${e.id}`,
        origin: e.actor === "client" ? "cliente" : "equipe",
        author: e.actor === "client" ? project.client || "cliente" : "você",
        kind: "comment",
        text,
        at: String(e.created_at ?? ""),
      });
    }
    entries.sort((x, y) => (x.at || "9999").localeCompare(y.at || "9999"));
    setTalk(entries);

    // Tem cliente acompanhando? decide o destino padrão da resposta.
    const { count } = await supabase
      .from("project_members")
      .select("*", { count: "exact", head: true })
      .eq("project_id", project.id);
    setHasClient((count ?? 0) > 0);
  }, [project.id, project.client]);

  useEffect(() => {
    reload();
  }, [reload]);

  // ---- marcar/desmarcar (otimista, mesmo contrato da página Marcos) ----------
  const onToggle = useCallback(
    async (m: Milestone, next: boolean) => {
      const k = mkey(m);
      setBusy((b) => new Set(b).add(k));
      setMarcos((prev) =>
        prev.map((x) => (mkey(x) === k ? { ...x, done: next } : x))
      );
      const res = await toggleMilestone(m, next);
      setBusy((b) => {
        const n = new Set(b);
        n.delete(k);
        return n;
      });
      if (!res.ok) {
        setMarcos((prev) =>
          prev.map((x) => (mkey(x) === k ? { ...x, done: m.done } : x))
        );
        setLoadErr(res.message);
      }
    },
    []
  );

  // ---- resposta --------------------------------------------------------------
  const [msg, setMsg] = useState("");
  const [dest, setDest] = useState<"equipe" | "cliente">("equipe");
  const [sending, setSending] = useState(false);
  useEffect(() => {
    setDest(hasClient ? "cliente" : "equipe");
  }, [hasClient]);

  async function send() {
    const text = msg.trim();
    if (!text || !supabase) return;
    setSending(true);
    setLoadErr("");
    if (dest === "cliente") {
      const r = await postStaffReply(project.id, text, null, staff);
      if (!r.ok) setLoadErr(r.message);
    } else {
      // Atividade do kanban: read-modify-write do notes preservando TUDO que não
      // conhecemos (parse cru + push em activity + stringify — nenhuma chave se
      // perde). É o mesmo canal que o quadro usa pros comentários.
      const { data: row } = await supabase
        .from("shared_projects")
        .select("notes")
        .eq("id", project.id)
        .maybeSingle();
      let obj: Record<string, unknown> = {};
      try {
        obj = row?.notes ? JSON.parse(row.notes) : {};
      } catch {
        obj = {};
      }
      const acts = Array.isArray(obj.activity) ? (obj.activity as unknown[]) : [];
      acts.push({
        author: staff.email ?? "owner",
        kind: "comment",
        text,
        at: new Date().toISOString(),
      });
      obj.activity = acts;
      const { error } = await supabase
        .from("shared_projects")
        .update({ notes: JSON.stringify(obj) })
        .eq("id", project.id);
      if (error) setLoadErr(error.message);
    }
    setSending(false);
    setMsg("");
    reload();
  }

  // ---- agrupamento dos marcos por fase/sprint --------------------------------
  const groups = useMemo(() => {
    const by = new Map<number, Milestone[]>();
    for (const m of marcos) {
      const arr = by.get(m.sprint_idx) ?? [];
      arr.push(m);
      by.set(m.sprint_idx, arr);
    }
    return [...by.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([idx, items]) => ({
        idx,
        title: items[0]?.sprint_title || `Etapa ${idx + 1}`,
        items,
      }));
  }, [marcos]);
  const doneN = marcos.filter((m) => m.done).length;
  const pct = marcos.length
    ? Math.round((doneN / marcos.length) * 100)
    : 0;

  // ---- casca do modal (mesma mecânica do ProjectDetailOverlay) ---------------
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);
  if (!mounted) return null;

  return createPortal(
    <div
      className="detail-overlay fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div aria-hidden="true" className="detail-scrim fixed inset-0 backdrop-blur-sm" />

      <div
        ref={panelRef}
        className="detail-panel relative my-auto w-full max-w-3xl overflow-hidden rounded-2xl border backdrop-blur-2xl"
        style={
          {
            "--accent-from": "var(--brand-from)",
            "--accent-to": st.accent,
          } as React.CSSProperties
        }
      >
        <span aria-hidden="true" className="detail-rule" />

        {/* Barra de título */}
        <header className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b bg-transparent px-6 py-4 md:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {project.client || "sem cliente"}
              <span className="mx-2 text-muted-foreground/40">·</span>
              <span style={{ color: st.accent }}>{st.label}</span>
              {due && (
                <>
                  <span className="mx-2 text-muted-foreground/40">·</span>
                  entrega {due}
                </>
              )}
            </p>
            <h2 className="detail-title mt-1 truncate text-xl font-bold tracking-tight md:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 rounded-full border border-border/70 p-2 text-muted-foreground transition hover:border-border hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-8 px-6 pb-8 pt-6 md:px-8">
          {loadErr && (
            <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              {loadErr}
            </p>
          )}

          {/* PROGRESSO */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Progresso
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/70">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, var(--brand-from), ${st.accent})`,
                  }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {doneN}/{marcos.length} · {pct}%
              </span>
            </div>
          </section>

          {/* MARCOS */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Marcos
            </p>
            {groups.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Sem roteiro ainda — gere/edite pelo Kanban.
              </p>
            ) : (
              <div className="mt-3 space-y-4">
                {groups.map((g) => (
                  <div key={g.idx}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                      {g.title}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {g.items.map((m) => {
                        const k = mkey(m);
                        const isBusy = busy.has(k);
                        return (
                          <li key={k}>
                            <button
                              onClick={() => onToggle(m, !m.done)}
                              disabled={isBusy}
                              className="group flex w-full items-start gap-2.5 rounded-lg px-2 py-1 text-left transition hover:bg-secondary/50 disabled:opacity-50"
                            >
                              <span
                                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                                  m.done
                                    ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-500"
                                    : "border-border/80 text-transparent group-hover:border-border"
                                }`}
                              >
                                <Check className="h-3 w-3" />
                              </span>
                              <span
                                className={`text-sm leading-snug ${
                                  m.done
                                    ? "text-muted-foreground line-through decoration-border"
                                    : ""
                                }`}
                              >
                                {m.text}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* CONVERSA */}
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Conversa
            </p>
            {talk.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum comentário ainda.
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {talk.map((t) => (
                  <li
                    key={t.key}
                    className="rounded-lg border border-border/60 bg-card/50 px-3 py-2"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      {t.origin === "cliente" ? (
                        <span className="text-sky-400">cliente</span>
                      ) : (
                        t.author
                      )}
                      {t.kind === "request" && (
                        <span className="ml-2 text-amber-400">pedido</span>
                      )}
                      {t.at && (
                        <span className="ml-2 text-muted-foreground/50">
                          {shortWhen(t.at)}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{t.text}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Responder */}
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setDest("equipe")}
                  className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                    dest === "equipe"
                      ? "border-[var(--brand-via)] text-[var(--brand-via)]"
                      : "border-border/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  equipe (kanban)
                </button>
                {hasClient && (
                  <button
                    onClick={() => setDest("cliente")}
                    className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                      dest === "cliente"
                        ? "border-sky-400 text-sky-400"
                        : "border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    cliente (timeline)
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={2}
                  placeholder={
                    dest === "cliente"
                      ? "Vai pra timeline do cliente, assinado como você. Não dá pra apagar."
                      : "Comentário interno no card do kanban."
                  }
                  className="w-full rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm outline-none backdrop-blur transition focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/25"
                />
                <button
                  onClick={send}
                  disabled={sending || !msg.trim()}
                  aria-label="Enviar"
                  className="shrink-0 self-end rounded-lg border border-border/70 p-2.5 text-muted-foreground transition hover:border-border hover:text-foreground disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>

          {/* BRIEFING / VALOR + links */}
          {(project.description || project.link) && (
            <section>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Briefing / valor
              </p>
              {project.description && (
                <details className="mt-2 rounded-lg border border-border/60 bg-card/50 px-3 py-2 text-sm">
                  <summary className="cursor-pointer select-none text-muted-foreground">
                    Ver briefing completo
                  </summary>
                  <p className="mt-2 whitespace-pre-wrap">{project.description}</p>
                </details>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition hover:text-foreground"
                >
                  <Github className="h-3.5 w-3.5" /> repositório
                </a>
              )}
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
