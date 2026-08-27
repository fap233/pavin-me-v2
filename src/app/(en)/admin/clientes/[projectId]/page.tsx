"use client";

// O portal do cliente, visto pelo staff. O ponto alto do /admin.
//
// A tela é a DELE: ProgressHeader, Timeline e SprintList são os mesmos
// componentes de /cliente/[projectId], com os mesmos dados. Clonar seria pior
// que inútil — seria uma cópia que envelhece e passa a mentir sobre o que o
// cliente está vendo, justo na tela que existe pra saber o que ele está vendo.
//
// O que muda (e só isto):
//   • sem botão de aprovar sprint — quem aprova é o cliente (viewer="staff");
//   • sem o Composer "Precisa de algo?", que é a caixa DELE;
//   • uma caixa de resposta nossa (project_events actor='owner');
//   • uma faixa no topo dizendo de quem é este portal.
//
// A RLS sustenta tudo isso sozinha: a única escrita que o staff consegue fazer é
// events_staff_reply (comment + owner + is_staff). Se um botão de aprovar
// escapasse pra cá, o banco recusaria — as regras acima são pra tela não mentir,
// não são o cinto de segurança.

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, Loader2, Radio, Send } from "lucide-react";
import { ProgressHeader } from "../../../cliente/_components/ProgressHeader";
import { SprintList } from "../../../cliente/_components/SprintList";
import { Timeline } from "../../../cliente/_components/Timeline";
import {
  EmptyState,
  ErrorState,
  Loading,
  Panel,
  SectionTitle,
} from "../../../cliente/_components/States";
import {
  loadPortalAsStaff,
  postStaffReply,
  subscribePortal,
  type StaffPortal,
} from "../../_data";
import { useStaff } from "../../_components/AdminShell";

type Status = "loading" | "ready" | "not_found" | "error";

export default function AdminPortalPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";
  // Quem está logado — a resposta é assinada com o nome dele e carimbada com o
  // author_id que a policy events_staff_reply exige. O portão já resolveu isto,
  // então aqui é só ler (nunca null: esta página só existe depois dele).
  const staff = useStaff();

  const [portal, setPortal] = useState<StaffPortal | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [pulse, setPulse] = useState(false);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setStatus("loading");
      const res = await loadPortalAsStaff(projectId);
      if (!res.ok) {
        setStatus(res.kind === "not_found" ? "not_found" : "error");
        setMessage(res.message);
        return;
      }
      setPortal(res.data);
      setStatus("ready");
    },
    [projectId]
  );

  useEffect(() => {
    load();
  }, [load]);

  // Realtime, igual ao portal: o cliente comenta e a resposta pode ser escrita
  // sem F5. Mesmo coalesce de 150ms (o Monitor grava sprint + evento quase
  // juntos; um reload resolve os dois).
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const ready = status === "ready";
  useEffect(() => {
    if (!ready || !projectId) return;
    let timer: number | undefined;
    const off = subscribePortal(projectId, () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setPulse(true);
        window.setTimeout(() => setPulse(false), 1200);
        loadRef.current(true);
      }, 150);
    });
    return () => {
      window.clearTimeout(timer);
      off(); // sem isto, cada remontagem deixa um canal aberto
    };
  }, [ready, projectId]);

  // A caixa da sprint (dentro do card) e a caixa geral chamam o MESMO caminho —
  // muda só o sprint_id, que é o que gruda a resposta na thread.
  const reply = useCallback(
    async (text: string, sprintId?: string | null) => {
      const res = await postStaffReply(projectId, text, sprintId ?? null, staff);
      if (res.ok) await load(true);
      return res;
    },
    [projectId, load, staff]
  );

  if (status === "loading" && !portal) return <Loading label="Abrindo o portal" />;

  if (status === "not_found") {
    return (
      <EmptyState title="Projeto não encontrado">
        Este projeto não existe.{" "}
        <Link
          href="/admin/clientes"
          className="text-[var(--brand-via)] underline-offset-4 hover:underline"
        >
          Ver os portais
        </Link>
        .
      </EmptyState>
    );
  }

  if (status === "error" && !portal)
    return <ErrorState message={message} onRetry={() => load()} />;

  if (!portal) return null;

  const who =
    portal.clients.map((c) => c.email).filter(Boolean).join(", ") ||
    portal.project.client ||
    "cliente sem e-mail no perfil";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Portais
        </Link>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
            pulse ? "text-emerald-500" : "text-muted-foreground/60"
          }`}
          title="Esta tela se atualiza sozinha"
        >
          <Radio className={`h-3.5 w-3.5 ${pulse ? "animate-pulse" : ""}`} />
          ao vivo
        </span>
      </div>

      {/* A faixa. Tudo abaixo dela é a tela do cliente, então ela precisa ser
          impossível de não ver: sem isso, dá pra achar que "Você" na thread é
          você e responder no lugar dele. */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3">
        <Eye className="h-4 w-4 shrink-0 text-amber-500" />
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Você está vendo o portal de <strong className="font-semibold">{who}</strong> —
          exatamente como ele vê.
        </p>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-amber-500/80">
          somente leitura + resposta
        </span>
      </div>

      <ProgressHeader project={portal.project} sprints={portal.sprints} />

      {/* `authors` NÃO é enfeite aqui: sem ele, a resposta do Gustavo aparece
          assinada "Fellipe" — pra VOCÊ, justamente na tela onde você decide o que
          fazer. É o buraco que a migração 2026-07-16b veio fechar. */}
      <Timeline
        events={portal.events}
        sprints={portal.sprints}
        viewer="staff"
        authors={portal.authors}
      />

      {/* viewer="staff" tira o botão de aprovar e conserta os rótulos ("Você" na
          bolha do cliente seria mentira aqui). A caixa da thread continua: é por
          ela que se responde dentro da sprint. */}
      <SprintList
        sprints={portal.sprints}
        events={portal.events}
        onComment={reply}
        viewer="staff"
        authors={portal.authors}
      />

      <ReplyBox onSend={reply} />
    </div>
  );
}

/** A caixa geral de resposta — o par da "Precisa de algo?" do cliente. Sem
 *  sprint_id: cai na timeline dele como comentário de projeto. Pra responder
 *  DENTRO de uma sprint, a caixa é a da thread, no card. */
function ReplyBox({
  onSend,
}: {
  onSend: (
    text: string,
    sprintId?: string | null
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setErr("");
    const res = await onSend(body, null);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setText("");
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <Panel className="p-6 sm:p-8">
      <SectionTitle>Responder ao cliente</SectionTitle>
      <p className="mt-2 text-sm text-muted-foreground">
        Vai pra timeline dele agora, assinado como Fellipe. Não dá pra editar nem
        apagar depois — a timeline é append-only pros dois lados.
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          rows={3}
          placeholder="Ex.: fechado, troco o botão pra verde ainda hoje."
          className="w-full resize-none rounded-xl border border-border/70 bg-background/60 px-3.5 py-3 text-sm outline-none backdrop-blur transition placeholder:text-muted-foreground/60 focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity ${
              sent ? "text-emerald-500 opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            enviado ✓
          </span>
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {busy ? "Enviando…" : "Responder"}
          </button>
        </div>

        {err && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {err}
          </p>
        )}
      </form>
    </Panel>
  );
}
