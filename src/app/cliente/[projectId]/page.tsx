"use client";

// A tela principal: o rastreio do projeto.
//
// Realtime é o coração daqui. O Fellipe marca a sprint como entregue no Monitor
// e ESTA tela muda sozinha — sem F5. O canal escuta project_events e sprints
// filtrados por project_id; qualquer mudança dispara um reload silencioso
// (mais barato de raciocinar que aplicar patch de payload, e a tela nunca
// diverge do banco). O canal é fechado no unmount.

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";
import type { Sprint } from "@/lib/supabase";
import { Shell } from "../_components/Shell";
import { Composer } from "../_components/Composer";
import { ProgressHeader } from "../_components/ProgressHeader";
import { SprintList } from "../_components/SprintList";
import { Timeline } from "../_components/Timeline";
import { EmptyState, ErrorState, Loading } from "../_components/States";
import {
  approveSprint,
  currentUser,
  href,
  loadPortal,
  postComment,
  subscribePortal,
  type Portal,
  type PortalUser,
} from "../_data";

type Status = "loading" | "ready" | "not_found" | "error";

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";

  const [user, setUser] = useState<PortalUser | null>(null);
  const [portal, setPortal] = useState<Portal | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [pulse, setPulse] = useState(false); // brilho do "ao vivo" quando chega update

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setStatus("loading");
      const u = await currentUser();
      if (!u) {
        router.replace(href("/cliente/login"));
        return;
      }
      setUser(u);

      const res = await loadPortal(projectId, u.id);
      if (!res.ok) {
        // "not_found" cobre tanto projeto inexistente quanto projeto de OUTRO
        // cliente: a tela é a mesma, e nenhuma informação vaza na diferença.
        setStatus(res.kind === "not_found" ? "not_found" : "error");
        setMessage(res.message);
        return;
      }
      setPortal(res.data);
      setStatus("ready");
    },
    [projectId, router]
  );

  useEffect(() => {
    load();
  }, [load]);

  // ---- Realtime ----------------------------------------------------------
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  const ready = status === "ready";
  useEffect(() => {
    if (!ready || !projectId) return;

    let timer: number | undefined;
    const off = subscribePortal(projectId, () => {
      // Coalesce: o Monitor grava sprint + evento quase juntos; um reload só
      // resolve os dois.
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setPulse(true);
        window.setTimeout(() => setPulse(false), 1200);
        loadRef.current(true);
      }, 150);
    });

    return () => {
      window.clearTimeout(timer);
      off(); // fecha o canal — sem isso, cada remontagem deixa um aberto
    };
  }, [ready, projectId]);

  // ---- Ações do cliente ---------------------------------------------------

  async function onApprove(sprint: Sprint) {
    if (!user) return;
    setApprovingId(sprint.id);
    setActionError("");
    const res = await approveSprint(sprint.id, user.id);
    setApprovingId(null);
    if (!res.ok) {
      setActionError(res.message);
      return;
    }
    await load(true); // o realtime também traria, mas não dá pra depender dele
  }

  // Único caminho de comentário: a caixa geral chama sem sprintId (vira comentário
  // de projeto); a thread de um card chama com o id da sprint (gruda naquela
  // sprint). O reload traz o novo comentário pra thread e pra timeline.
  async function onSend(text: string, sprintId?: string | null) {
    const res = await postComment(projectId, text, sprintId ?? null);
    if (res.ok) await load(true);
    return res;
  }

  // ---- Render -------------------------------------------------------------

  if (status === "loading" && !portal) {
    return (
      <Shell email={user?.email}>
        <Loading label="Carregando seu projeto" />
      </Shell>
    );
  }

  if (status === "not_found") {
    return (
      <Shell email={user?.email}>
        <EmptyState title="Projeto não encontrado">
          Este projeto não existe ou não está vinculado à sua conta.{" "}
          <Link
            href={href("/cliente")}
            className="text-[var(--brand-via)] underline-offset-4 hover:underline"
          >
            Ver meus projetos
          </Link>
          .
        </EmptyState>
      </Shell>
    );
  }

  if (status === "error" && !portal) {
    return (
      <Shell email={user?.email}>
        <ErrorState message={message} onRetry={() => load()} />
      </Shell>
    );
  }

  if (!portal) return null;

  return (
    <Shell email={user?.email}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href={href("/cliente")}
          className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Meus projetos
        </Link>
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
            pulse ? "text-emerald-500" : "text-muted-foreground/60"
          }`}
          title="Esta tela se atualiza sozinha"
        >
          <Radio
            className={`h-3.5 w-3.5 ${pulse ? "animate-pulse" : ""}`}
          />
          ao vivo
        </span>
      </div>

      <div className="space-y-5">
        <ProgressHeader project={portal.project} sprints={portal.sprints} />

        {actionError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {actionError}
          </p>
        )}

        <Timeline events={portal.events} sprints={portal.sprints} />

        <SprintList
          sprints={portal.sprints}
          events={portal.events}
          onApprove={onApprove}
          approvingId={approvingId}
          onComment={onSend}
        />

        <Composer onSend={onSend} />
      </div>
    </Shell>
  );
}
