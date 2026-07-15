// Camada de dados do portal do cliente.
//
// Um único lugar que fala com o Supabase (anon key, RLS ligada — a service_role
// NUNCA encosta no site) ou, em modo demonstração, com o store em memória de
// _mock.ts. As telas não sabem qual dos dois está atendendo.
//
// Nada aqui confia só na RLS: antes de montar a tela conferimos a linha em
// `project_members`. Se o projectId da URL não é do usuário, devolvemos
// "not_found" — nunca um erro cru do Supabase, nunca dado de outro cliente.

import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  supabase,
  supabaseConfigured,
  type ClientReview,
  type ProjectEvent,
  type SharedProject,
  type Sprint,
} from "@/lib/supabase";
import * as mock from "./_mock";

export type PortalUser = { id: string; email: string | null };

export type Portal = {
  project: SharedProject;
  sprints: Sprint[]; // ordenadas por idx
  events: ProjectEvent[]; // mais recente primeiro
};

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: "not_found" | "error"; message: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ---------------------------------------------------------------------------
// Modo demonstração
// ---------------------------------------------------------------------------

const MOCK_KEY = "cliente:mock";

/** Liga se: ?mock=1 na URL (persiste na aba), env NEXT_PUBLIC_CLIENTE_MOCK=1,
 *  ou Supabase sem env var (fallback honesto em vez de tela de erro). */
export function isMockMode(): boolean {
  if (process.env.NEXT_PUBLIC_CLIENTE_MOCK === "1") return true;
  if (typeof window !== "undefined") {
    const q = new URLSearchParams(window.location.search).get("mock");
    if (q === "1") {
      try {
        sessionStorage.setItem(MOCK_KEY, "1");
      } catch {}
      return true;
    }
    if (q === "0") {
      try {
        sessionStorage.removeItem(MOCK_KEY);
      } catch {}
      return false;
    }
    try {
      if (sessionStorage.getItem(MOCK_KEY) === "1") return true;
    } catch {}
  }
  return !supabaseConfigured;
}

/** Mantém o ?mock=1 nos links internos do portal. */
export function href(path: string): string {
  if (typeof window === "undefined") return path;
  const on =
    new URLSearchParams(window.location.search).get("mock") === "1" ||
    (() => {
      try {
        return sessionStorage.getItem(MOCK_KEY) === "1";
      } catch {
        return false;
      }
    })();
  if (!on) return path;
  return path + (path.includes("?") ? "&" : "?") + "mock=1";
}

// ---------------------------------------------------------------------------
// Sessão
// ---------------------------------------------------------------------------

export async function currentUser(): Promise<PortalUser | null> {
  if (isMockMode()) return mock.MOCK_USER;
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const u = data.session?.user;
  return u ? { id: u.id, email: u.email ?? null } : null;
}

export async function signOut(): Promise<void> {
  if (isMockMode() || !supabase) return;
  await supabase.auth.signOut();
}

/** Traduz o erro do Supabase Auth pra algo que um cliente entende. */
export function authMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("captcha"))
    return "A verificação de segurança falhou. Recarregue a página e tente de novo.";
  if (m.includes("invalid login credentials"))
    return "E-mail ou senha incorretos. Confira e tente de novo.";
  if (m.includes("email not confirmed"))
    return "Este e-mail ainda não foi confirmado. Fale com o Fellipe.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Muitas tentativas. Espere um minuto e tente de novo.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Sem conexão com o servidor. Verifique sua internet e tente de novo.";
  if (m.includes("should be at least") || m.includes("password"))
    return "Senha inválida: use pelo menos 6 caracteres.";
  return raw;
}

function dataMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Não consegui falar com o servidor. Verifique sua internet.";
  if (m.includes("does not exist") || m.includes("schema cache"))
    return "O portal ainda está sendo preparado no servidor. Tente mais tarde.";
  return "Não consegui carregar os dados agora.";
}

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

/** Data prevista de entrega. A migração do portal cria `delivery_date`; o
 *  backlog antigo usa `delivery_at`. Aceitamos as duas. */
export function deliveryDate(p: SharedProject): string | null {
  return p.delivery_date ?? p.delivery_at ?? null;
}

/** Projetos em que o usuário é membro. Passa por `project_members` de
 *  propósito: é a fonte da verdade do vínculo, e não depende do papel do
 *  usuário na RLS. */
export async function listMyProjects(
  userId: string
): Promise<LoadResult<SharedProject[]>> {
  if (isMockMode()) return { ok: true, data: mock.mockListProjects() };
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  const { data: members, error: memErr } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("user_id", userId);
  if (memErr)
    return { ok: false, kind: "error", message: dataMessage(memErr.message) };

  const ids = (members ?? []).map((m: { project_id: string }) => m.project_id);
  if (ids.length === 0) return { ok: true, data: [] };

  const { data, error } = await supabase
    .from("shared_projects")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });
  if (error)
    return { ok: false, kind: "error", message: dataMessage(error.message) };

  return { ok: true, data: (data as SharedProject[]) ?? [] };
}

/** Projeto + sprints + timeline. Confere o vínculo antes de qualquer coisa. */
export async function loadPortal(
  projectId: string,
  userId: string
): Promise<LoadResult<Portal>> {
  if (isMockMode()) {
    const project = mock.mockProject(projectId);
    if (!project)
      return { ok: false, kind: "not_found", message: "Projeto não encontrado." };
    return {
      ok: true,
      data: {
        project,
        sprints: mock.mockSprints(projectId),
        events: mock.mockEvents(projectId),
      },
    };
  }

  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  // UUID inválido nem chega no banco (o Postgres devolveria erro de sintaxe,
  // e o cliente veria um erro cru).
  if (!UUID_RE.test(projectId))
    return { ok: false, kind: "not_found", message: "Projeto não encontrado." };

  const { data: member, error: memErr } = await supabase
    .from("project_members")
    .select("project_id")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle();
  if (memErr)
    return { ok: false, kind: "error", message: dataMessage(memErr.message) };
  if (!member)
    return { ok: false, kind: "not_found", message: "Projeto não encontrado." };

  const [projectRes, sprintsRes, eventsRes] = await Promise.all([
    supabase.from("shared_projects").select("*").eq("id", projectId).maybeSingle(),
    supabase
      .from("sprints")
      .select("*")
      .eq("project_id", projectId)
      .order("idx", { ascending: true }),
    supabase
      .from("project_events")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);

  const err = projectRes.error ?? sprintsRes.error ?? eventsRes.error;
  if (err)
    return { ok: false, kind: "error", message: dataMessage(err.message) };
  if (!projectRes.data)
    return { ok: false, kind: "not_found", message: "Projeto não encontrado." };

  return {
    ok: true,
    data: {
      project: projectRes.data as SharedProject,
      sprints: (sprintsRes.data as Sprint[]) ?? [],
      events: (eventsRes.data as ProjectEvent[]) ?? [],
    },
  };
}

// ---------------------------------------------------------------------------
// Escrita (as duas únicas ações do cliente)
// ---------------------------------------------------------------------------

/** Aprova a entrega de uma sprint. O `.eq("status","delivered")` espelha a RLS:
 *  só sprint entregue pode ser aprovada, e a corrida com o Monitor (que pode
 *  ter mudado o status) resolve em zero linhas afetadas, não em dado errado.
 *
 *  NÃO inserimos o evento `sprint_approved`: a RLS só deixa o cliente inserir
 *  `type='comment'`. Esse evento tem que nascer de trigger no banco ou do
 *  Monitor. O card da sprint já mostra "aprovada" pela própria tabela `sprints`,
 *  então a tela não fica dependente disso. */
export async function approveSprint(
  sprintId: string,
  userId: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (isMockMode()) {
    mock.mockApproveSprint(sprintId, userId);
    return { ok: true };
  }
  if (!supabase) return { ok: false, message: dataMessage("network") };

  const { error } = await supabase
    .from("sprints")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: userId,
    })
    .eq("id", sprintId)
    .eq("status", "delivered");

  if (error)
    return {
      ok: false,
      message: "Não consegui registrar a aprovação. Tente de novo.",
    };
  return { ok: true };
}

/** Comentário/pedido do cliente. Cai na timeline e na aba Pedidos do Monitor.
 *
 *  `sprintId` (opcional) GRUDA o comentário numa sprint — vira uma thread estilo
 *  review de PR naquele card. Sem ele (ou `null`), é a caixa geral "Precisa de
 *  algo?": comentário de projeto, sem sprint. A RLS aceita o insert com sprint_id
 *  (a policy só exige type='comment', actor='client', is_member); a trigger de
 *  integridade (migração 2026-07-14b) recusa um sprint_id que não seja do próprio
 *  projeto — então aqui só mandamos o id da sprint que o cliente está vendo. */
export async function postComment(
  projectId: string,
  body: string,
  sprintId?: string | null
): Promise<{ ok: true } | { ok: false; message: string }> {
  const text = body.trim();
  if (!text) return { ok: false, message: "Escreva alguma coisa antes de enviar." };

  if (isMockMode()) {
    mock.mockComment(projectId, text, sprintId ?? null);
    return { ok: true };
  }
  if (!supabase) return { ok: false, message: dataMessage("network") };

  const { error } = await supabase.from("project_events").insert({
    project_id: projectId,
    sprint_id: sprintId ?? null,
    type: "comment",
    title: "Comentário do cliente",
    body: text,
    actor: "client",
  });

  if (error)
    return { ok: false, message: "Não consegui enviar sua mensagem. Tente de novo." };
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Avaliação de fim de projeto (o loop de prova social)
// ---------------------------------------------------------------------------

export const REVIEW_MAX = 1000; // teto do texto — espelha o limite da RLS

/** A avaliação que ESTE cliente já deu pra ESTE projeto (ou null). Serve pra não
 *  pedir de novo: a tela mostra "já avaliou" em vez do formulário. A RLS deixa o
 *  cliente ler só a própria linha, então isto nunca traz a de outro cliente. */
export async function myReview(
  projectId: string,
  userId: string
): Promise<LoadResult<ClientReview | null>> {
  if (isMockMode())
    return { ok: true, data: mock.mockMyReview(projectId, userId) };
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };
  if (!UUID_RE.test(projectId)) return { ok: true, data: null };

  const { data, error } = await supabase
    .from("client_reviews")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error)
    return { ok: false, kind: "error", message: dataMessage(error.message) };
  return { ok: true, data: ((data as ClientReview[]) ?? [])[0] ?? null };
}

/** Envia a avaliação (estrelas + texto). Nasce `status='pending'` — nada aparece
 *  público até o Fellipe aprovar no Monitor. A RLS confere o resto (que o cliente
 *  é membro, que o rating é 1..5, que o texto cabe); aqui só validamos pra dar
 *  mensagem boa antes de bater no banco. */
export async function submitReview(
  projectId: string,
  userId: string,
  rating: number,
  body: string
): Promise<{ ok: true; data: ClientReview } | { ok: false; message: string }> {
  const r = Math.round(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5)
    return { ok: false, message: "Escolha de 1 a 5 estrelas." };
  const text = body.trim();
  if (!text)
    return { ok: false, message: "Escreva algumas palavras sobre o projeto." };
  if (text.length > REVIEW_MAX)
    return {
      ok: false,
      message: `O texto passou do limite (${REVIEW_MAX} caracteres).`,
    };

  if (isMockMode()) {
    const data = mock.mockSubmitReview(projectId, userId, r, text);
    return { ok: true, data };
  }
  if (!supabase) return { ok: false, message: dataMessage("network") };

  const { data, error } = await supabase
    .from("client_reviews")
    .insert({
      project_id: projectId,
      user_id: userId,
      rating: r,
      body: text,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("duplicate") || m.includes("unique"))
      return {
        ok: false,
        message: "Você já enviou uma avaliação deste projeto. Obrigado!",
      };
    return {
      ok: false,
      message: "Não consegui registrar sua avaliação agora. Tente de novo.",
    };
  }
  return { ok: true, data: data as ClientReview };
}

/** Projeto concluído? Fecha quando o Fellipe marca `status='done'` no Monitor OU
 *  quando todas as sprints foram aprovadas. É o gatilho de mostrar o convite pra
 *  avaliar no rastreio. */
export function isConcluded(
  project: SharedProject,
  sprints: Sprint[]
): boolean {
  if (project.status === "done") return true;
  return sprints.length > 0 && sprints.every((s) => s.status === "approved");
}

// ---------------------------------------------------------------------------
// Realtime — o coração da feature
// ---------------------------------------------------------------------------

/** Assina as mudanças do projeto (timeline + sprints) e chama `onChange` a cada
 *  uma. O chamador refaz o load: é menos código que aplicar patch de payload e
 *  não tem risco de a tela divergir do banco.
 *
 *  Devolve a função de limpeza — CHAME no unmount, senão o canal fica aberto e
 *  o Supabase acumula subscription por remontagem. */
export function subscribePortal(
  projectId: string,
  onChange: () => void
): () => void {
  if (isMockMode()) return mock.mockSubscribe(onChange);
  if (!supabase) return () => {};

  const client = supabase;
  const channel: RealtimeChannel = client
    .channel(`cliente:${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "project_events",
        filter: `project_id=eq.${projectId}`,
      },
      onChange
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "sprints",
        filter: `project_id=eq.${projectId}`,
      },
      onChange
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

// ---------------------------------------------------------------------------
// Derivações da tela (progresso, fase, prazo)
// ---------------------------------------------------------------------------

export type Progress = {
  done: number;
  total: number;
  pct: number;
  currentIdx: number | null; // sprint "da vez"
  phase: "planning" | "building" | "done";
  phaseLabel: string;
};

export function progressOf(sprints: Sprint[]): Progress {
  const total = sprints.length;
  const done = sprints.filter(
    (s) => s.status === "delivered" || s.status === "approved"
  ).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const current =
    sprints.find((s) => s.status === "in_progress") ??
    sprints.find((s) => s.status === "delivered") ??
    sprints.find((s) => s.status === "blocked") ??
    sprints.find((s) => s.status === "planned") ??
    sprints[sprints.length - 1];

  const phase: Progress["phase"] =
    total === 0 ? "planning" : done === total ? "done" : "building";

  return {
    done,
    total,
    pct,
    currentIdx: current?.idx ?? null,
    phase,
    phaseLabel:
      phase === "planning"
        ? "Em planejamento"
        : phase === "done"
          ? "Concluído"
          : "Em desenvolvimento",
  };
}
