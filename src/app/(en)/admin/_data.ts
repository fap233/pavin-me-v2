// Camada de dados do back-office (/admin).
//
// Separada da do cliente de propósito. O portal do cliente confere
// `project_members` antes de qualquer coisa porque o VÍNCULO é a autorização
// dele. Aqui é o contrário: o staff não é membro de projeto nenhum (o Fellipe
// tem 0 linhas em project_members) — quem autoriza é o PAPEL. As policies de
// select do portal já aceitam `is_staff()`, então o staff lê tudo sem migração;
// só a resposta de comentário precisou de policy nova (events_staff_reply,
// migração 2026-07-16-staff-admin).
//
// Mesma anon key, mesma RLS do resto do site. A service_role NUNCA encosta aqui.
//
// A regra de progresso NÃO é copiada: `progressOf` vem do portal do cliente. Se
// a % divergisse entre a tela dele e a nossa, a tela que mente é justamente a
// que a gente usa pra decidir — então é uma função só, importada.

import type { RealtimeChannel } from "@supabase/supabase-js";
import {
  supabase,
  type ProjectEvent,
  type SharedProject,
  type Sprint,
  type SprintTask,
} from "@/lib/supabase";
import {
  loadStaffNames,
  progressOf,
  type Progress,
  type StaffNames,
} from "../cliente/_data";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Tetos EXPLÍCITOS das leituras que varrem TODOS os portais de uma vez.
//
// Sem um `.limit()` nosso, quem corta é o PostgREST (max-rows do servidor) — e ele
// corta CALADO, sem erro, sem sinal. Pedindo o teto aqui, o corte é nosso: sabemos
// o número, dá pra conferir se batemos nele (ver truncou()) e dá pra avisar em vez
// de mostrar um número errado com cara de certo.
//
// Dimensionamento (hoje: 1 cliente, 3 sprints, 7 fases, 4 comentários): folga de
// ~3 ordens de grandeza. Se um dia bater, o console grita antes de a tela mentir.
const EVENTS_CAP = 2000; // comentários somados de todos os portais
const TASKS_CAP = 2000; // fases somadas de todos os portais

/** Bateu no teto = a resposta pode estar truncada, e o que veio NÃO dá pra tratar
 *  como o conjunto inteiro. Falso positivo (exatamente CAP linhas) é inofensivo:
 *  o custo é um aviso no console, não uma tela quebrada. */
function truncou(rows: unknown[] | null | undefined, cap: number): boolean {
  return (rows?.length ?? 0) >= cap;
}

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: "not_found" | "error"; message: string };

/** O erro REAL do Supabase no console. Mesmo motivo do reportError do portal
 *  (cliente/_data.ts): em 2026-07-16 um erro engolido custou uma investigação
 *  inteira às cegas. A mensagem de tela é pra pessoa, esta linha é pra nós.
 *  Prefixo próprio (`admin:`) pra dar pra separar do portal no console. */
function reportError(where: string, error: unknown): void {
  const e = (error ?? {}) as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };
  console.error(`[admin:${where}]`, {
    code: e.code,
    message: e.message,
    details: e.details,
    hint: e.hint,
  });
}

function dataMessage(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Não consegui falar com o Supabase. Verifique a conexão.";
  if (m.includes("does not exist") || m.includes("schema cache"))
    return "Alguma tabela do portal ainda não existe neste banco (migração pendente).";
  if (m.includes("jwt") || m.includes("expired"))
    return "A sessão expirou. Recarregue a página.";
  return "Não consegui carregar os dados agora. O erro real está no console.";
}

// ---------------------------------------------------------------------------
// Sessão e portão de staff
// ---------------------------------------------------------------------------

/** O /admin é do DONO. Não é "staff": é owner.
 *
 *  Antes o portão aceitava is_staff() inteiro (owner + collab). Não aceita mais:
 *  o colaborador tem a porta dele (/projetos, o Kanban), e as policies de
 *  2026-07-16b escopam o que ele vê — cair aqui só lhe daria telas meio vazias
 *  (a lista de portais, por exemplo, é do owner). O tipo carrega o "owner"
 *  literal de propósito: quem lê `staff.role` daqui sabe, pelo compilador, que
 *  não existe outro caso pra tratar. */
export type StaffRole = "owner";
export type StaffUser = {
  id: string;
  email: string | null;
  role: StaffRole;
  /** Nome de exibição (staff_directory.display_name). É ENFEITE em quase tudo,
   *  menos numa coisa: é ele que assina a resposta ao cliente. Null = o banco
   *  não sabe o nome; quem usa decide o fallback. */
  name: string | null;
};

export type StaffSession =
  | { kind: "staff"; user: StaffUser }
  | { kind: "anon" } // deslogado — a tela manda pro login do portal
  | { kind: "denied" } // logado, mas não é o dono (colaborador ou cliente)
  | { kind: "error"; message: string };

/** Quem está logado e se é o dono.
 *
 *  O papel aceito aqui é EXATAMENTE o de `is_owner()` no banco — role = 'owner'.
 *  O /projetos ainda tolera os nomes legados ('admin','member') por causa da
 *  janela de deploy da migração 2026-07-14; aqui não dá pra tolerar: quem é
 *  'admin' no banco reprova em is_owner(), então a tela abriria e TODA query
 *  voltaria vazia — um portão que mente é pior que um portão fechado. (A própria
 *  migração já converteu os dois papéis legados.) */
export async function currentStaff(): Promise<StaffSession> {
  if (!supabase)
    return {
      kind: "error",
      message:
        "Supabase sem configuração (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).",
    };

  const { data: sess, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) {
    reportError("session", sessErr);
    return { kind: "error", message: dataMessage(sessErr.message) };
  }
  const u = sess.session?.user;
  if (!u) return { kind: "anon" };

  const { data: prof, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", u.id)
    .maybeSingle();
  if (error) {
    reportError("profile", error);
    return { kind: "error", message: dataMessage(error.message) };
  }

  if (prof?.role !== "owner") return { kind: "denied" };

  // O nome sai da view staff_directory (id, display_name) — a mesma que o resto
  // do produto usa pra dizer QUEM é quem. Não-fatal de propósito: sem nome, a
  // resposta ao cliente assina pelo fallback e o resto do /admin nem percebe.
  // Derrubar o back-office inteiro por causa de um rótulo seria desproporcional.
  const { data: dir, error: dirErr } = await supabase
    .from("staff_directory")
    .select("display_name")
    .eq("id", u.id)
    .maybeSingle();
  if (dirErr) reportError("staff_directory", dirErr);

  return {
    kind: "staff",
    user: {
      id: u.id,
      email: u.email ?? null,
      role: "owner",
      name: (dir?.display_name as string | null | undefined) ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// Comentários pendentes — o número que faz esta área existir
// ---------------------------------------------------------------------------

/** Quantos comentários do cliente ainda não têm resposta do owner DEPOIS deles.
 *
 *  Conta por THREAD: cada sprint é uma conversa, e a caixa geral (sprint_id null)
 *  é outra. Dentro de uma thread, varremos de trás pra frente e paramos na
 *  primeira fala do owner — o que veio antes dela já foi respondido. Sobra a
 *  rabeira de comentários do cliente sem resposta, que é o que a tela mostra.
 *
 *  Só conta `type='comment'`: entrega de sprint não é resposta a pedido. */
export function pendingReplies(events: ProjectEvent[]): number {
  const threads = new Map<string, ProjectEvent[]>();
  for (const e of events) {
    if (e.type !== "comment") continue;
    const key = e.sprint_id ?? "geral";
    const arr = threads.get(key);
    if (arr) arr.push(e);
    else threads.set(key, [e]);
  }

  let pending = 0;
  for (const arr of threads.values()) {
    arr.sort((a, b) => a.created_at.localeCompare(b.created_at));
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].actor === "owner") break; // respondida daqui pra trás
      pending++;
    }
  }
  return pending;
}

// ---------------------------------------------------------------------------
// "Meus" — o que EU peguei no Kanban
// ---------------------------------------------------------------------------

/** Projetos que este usuário pegou (claimed_by). Não é a mesma coisa que
 *  "projetos com portal": pegar é do fluxo do Kanban, portal é vínculo de
 *  cliente. Um projeto pode ser um, o outro, os dois ou nenhum. */
export async function listClaimed(
  userId: string
): Promise<LoadResult<SharedProject[]>> {
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  const { data, error } = await supabase
    .from("shared_projects")
    .select("*")
    .eq("claimed_by", userId)
    .order("created_at", { ascending: false });

  if (error) {
    reportError("listClaimed", error);
    return { ok: false, kind: "error", message: dataMessage(error.message) };
  }
  return { ok: true, data: (data as SharedProject[]) ?? [] };
}

// ---------------------------------------------------------------------------
// "Clientes" — a lista dos portais
// ---------------------------------------------------------------------------

export type PortalClient = { userId: string; email: string | null };

export type PortalSummary = {
  project: SharedProject;
  clients: PortalClient[]; // normalmente 1; a tabela não proíbe mais
  progress: Progress;
  currentSprint: Sprint | null;
  pending: number;
};

/** Agrupa as linhas de sprint_tasks nas sprints, como o portal faz. Query
 *  separada e não-fatal pelo mesmo motivo de lá: sem a tabela, o rastreio
 *  funciona — só cai pra % por status de sprint. */
function attachTasks(sprints: Sprint[], tasks: SprintTask[]): Sprint[] {
  const bySprint = new Map<string, SprintTask[]>();
  for (const t of tasks) {
    const arr = bySprint.get(t.sprint_id);
    if (arr) arr.push(t);
    else bySprint.set(t.sprint_id, [t]);
  }
  return sprints.map((s) => ({ ...s, tasks: bySprint.get(s.id) ?? [] }));
}

/** A sprint "da vez" — a mesma que o ProgressHeader do cliente anuncia. */
function currentSprintOf(sprints: Sprint[], p: Progress): Sprint | null {
  if (p.currentIdx === null) return null;
  return sprints.find((s) => s.idx === p.currentIdx) ?? null;
}

/** Todo projeto que tem cliente vinculado (project_members role='client'), com o
 *  que a lista precisa mostrar. Uma leitura só, em lote: 5 queries pro conjunto
 *  todo em vez de 5 por projeto. */
export async function listPortals(): Promise<LoadResult<PortalSummary[]>> {
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  // O vínculo é a fonte da verdade de "tem portal" — não o status do projeto.
  const { data: members, error: memErr } = await supabase
    .from("project_members")
    .select("project_id, user_id, role")
    .eq("role", "client");
  if (memErr) {
    reportError("listPortals:members", memErr);
    return { ok: false, kind: "error", message: dataMessage(memErr.message) };
  }

  const rows = (members ?? []) as {
    project_id: string;
    user_id: string;
    role: string;
  }[];
  if (rows.length === 0) return { ok: true, data: [] };

  const projectIds = [...new Set(rows.map((m) => m.project_id))];
  const userIds = [...new Set(rows.map((m) => m.user_id))];

  const [projectsRes, sprintsRes, tasksRes, eventsRes, profilesRes] =
    await Promise.all([
      supabase.from("shared_projects").select("*").in("id", projectIds),
      supabase
        .from("sprints")
        .select("*")
        .in("project_id", projectIds)
        .order("idx", { ascending: true }),
      // Fases: aqui o corte silencioso é PIOR que perder linha — ele MENTE o
      // número. Truncado, um projeto ainda vem com tasks_total > 0, o progressOf
      // não cai no fallback e calcula a % sobre um pedaço; o cliente, que busca só
      // o projeto dele (sem corte), vê OUTRA porcentagem. Dono e cliente olhando
      // números diferentes do mesmo projeto é o pior tipo de bug deste produto.
      // Por isso pedimos com teto explícito e conferimos o teto abaixo.
      supabase
        .from("sprint_tasks")
        .select("*")
        .in("project_id", projectIds)
        .order("idx", { ascending: true })
        .limit(TASKS_CAP),
      // DESC + limit, e NÃO asc: o PostgREST corta a resposta no max-rows do
      // servidor (1000 no Supabase) SEM erro nenhum. Com `ascending: true` os
      // cortados seriam os comentários MAIS NOVOS — ou seja, justo os que estão
      // esperando resposta sumiriam da contagem, e esta tela passaria a mostrar
      // menos pendência do que existe, calada. Pegando os mais novos primeiro, o
      // corte cai no histórico velho (já respondido). `pendingReplies` ordena por
      // conta própria, então a ordem daqui não o afeta.
      // (Mesmo bug que mordeu o watcher do Monitor em 2026-07-16.)
      supabase
        .from("project_events")
        .select("*")
        .in("project_id", projectIds)
        .eq("type", "comment")
        .order("created_at", { ascending: false })
        .limit(EVENTS_CAP),
      // E-mail do cliente é ENFEITE: identifica o portal na lista, mas não muda
      // nada do que a tela faz. Se `profiles.email` não existir neste banco, a
      // lista continua de pé mostrando "e-mail indisponível" — não vale derrubar
      // a tela inteira por causa de um rótulo.
      supabase.from("profiles").select("id, email").in("id", userIds),
    ]);

  const fatal = projectsRes.error ?? sprintsRes.error ?? eventsRes.error;
  if (fatal) {
    reportError("listPortals", fatal);
    return { ok: false, kind: "error", message: dataMessage(fatal.message) };
  }
  if (tasksRes.error) reportError("listPortals:sprint_tasks", tasksRes.error);
  if (profilesRes.error) reportError("listPortals:profiles", profilesRes.error);

  // Bateu no teto? O que veio não é o conjunto inteiro, e daqui pra frente as
  // contas (% do projeto, pendências) sairiam sobre um pedaço — com cara de
  // número exato. Grita no console: é o único lugar onde isso vira visível antes
  // de virar "por que a minha % é diferente da que a cliente vê?".
  if (truncou(tasksRes.data, TASKS_CAP))
    reportError("listPortals:sprint_tasks", {
      message: `Teto de ${TASKS_CAP} fases batido: a % dos projetos pode estar calculada sobre dados PARCIAIS. Pagine esta query.`,
      code: "cap_atingido",
    });
  if (truncou(eventsRes.data, EVENTS_CAP))
    reportError("listPortals:project_events", {
      message: `Teto de ${EVENTS_CAP} comentários batido: a contagem de pendências pode estar INCOMPLETA. Pagine esta query.`,
      code: "cap_atingido",
    });

  const emailById = new Map<string, string | null>();
  if (!profilesRes.error)
    for (const p of (profilesRes.data ?? []) as {
      id: string;
      email: string | null;
    }[])
      emailById.set(p.id, p.email ?? null);

  const allSprints = (sprintsRes.data as Sprint[]) ?? [];
  const allTasks = tasksRes.error ? [] : ((tasksRes.data as SprintTask[]) ?? []);
  const allEvents = (eventsRes.data as ProjectEvent[]) ?? [];
  const projects = (projectsRes.data as SharedProject[]) ?? [];

  const summaries = projects.map((project) => {
    const sprints = attachTasks(
      allSprints.filter((s) => s.project_id === project.id),
      allTasks.filter((t) => t.project_id === project.id)
    );
    const progress = progressOf(sprints);
    return {
      project,
      clients: rows
        .filter((m) => m.project_id === project.id)
        .map((m) => ({ userId: m.user_id, email: emailById.get(m.user_id) ?? null })),
      progress,
      currentSprint: currentSprintOf(sprints, progress),
      pending: pendingReplies(allEvents.filter((e) => e.project_id === project.id)),
    };
  });

  // Quem está esperando resposta primeiro. É pra isso que a gente abre esta tela.
  summaries.sort(
    (a, b) =>
      b.pending - a.pending ||
      a.project.title.localeCompare(b.project.title, "pt-BR")
  );
  return { ok: true, data: summaries };
}

// ---------------------------------------------------------------------------
// O portal de um cliente, visto pelo staff
// ---------------------------------------------------------------------------

export type StaffPortal = {
  project: SharedProject;
  sprints: Sprint[];
  events: ProjectEvent[];
  clients: PortalClient[];
  /** Quem assinou cada resposta (author_id -> nome). Sem isto, a resposta do
   *  Gustavo aparece aqui como "Fellipe" — justamente o que a migração
   *  2026-07-16b veio consertar: você ficaria sem saber que seu colaborador
   *  falou com seu cliente. Mesma resolução do portal dela (função importada). */
  authors: StaffNames;
};

/** O mesmo conteúdo que `loadPortal` monta pro cliente, sem o teste de vínculo
 *  (o staff não é membro — quem libera é is_staff() nas policies de select).
 *
 *  "not_found" cobre id inexistente E id que a RLS não deixa ver: a tela é a
 *  mesma e nada vaza na diferença. */
export async function loadPortalAsStaff(
  projectId: string
): Promise<LoadResult<StaffPortal>> {
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  // UUID inválido nem chega no banco (o Postgres devolveria erro de sintaxe).
  if (!UUID_RE.test(projectId))
    return { ok: false, kind: "not_found", message: "Projeto não encontrado." };

  const [projectRes, sprintsRes, tasksRes, eventsRes, membersRes, authors] =
    await Promise.all([
      supabase.from("shared_projects").select("*").eq("id", projectId).maybeSingle(),
      supabase
        .from("sprints")
        .select("*")
        .eq("project_id", projectId)
        .order("idx", { ascending: true }),
      supabase
        .from("sprint_tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("idx", { ascending: true }),
      supabase
        .from("project_events")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false }),
      supabase
        .from("project_members")
        .select("user_id")
        .eq("project_id", projectId)
        .eq("role", "client"),
      // Quem assina cada resposta. NÃO-FATAL por contrato (devolve {} em qualquer
      // problema) — por isso entra no Promise.all como valor, e não como
      // {data,error}: não tem como derrubar a tela.
      loadStaffNames(),
    ]);

  const fatal = projectRes.error ?? sprintsRes.error ?? eventsRes.error;
  if (fatal) {
    reportError("loadPortalAsStaff", fatal);
    return { ok: false, kind: "error", message: dataMessage(fatal.message) };
  }
  if (!projectRes.data)
    return { ok: false, kind: "not_found", message: "Projeto não encontrado." };
  if (tasksRes.error) reportError("loadPortalAsStaff:sprint_tasks", tasksRes.error);
  if (membersRes.error) reportError("loadPortalAsStaff:members", membersRes.error);

  const memberIds = membersRes.error
    ? []
    : ((membersRes.data ?? []) as { user_id: string }[]).map((m) => m.user_id);

  // Enfeite, igual na lista: sem e-mail a tela ainda diz de quem é o portal.
  let clients: PortalClient[] = memberIds.map((id) => ({
    userId: id,
    email: null,
  }));
  if (memberIds.length > 0) {
    const { data: profs, error: profErr } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", memberIds);
    if (profErr) reportError("loadPortalAsStaff:profiles", profErr);
    else {
      const byId = new Map(
        ((profs ?? []) as { id: string; email: string | null }[]).map((p) => [
          p.id,
          p.email ?? null,
        ])
      );
      clients = memberIds.map((id) => ({ userId: id, email: byId.get(id) ?? null }));
    }
  }

  return {
    ok: true,
    data: {
      project: projectRes.data as SharedProject,
      sprints: attachTasks(
        (sprintsRes.data as Sprint[]) ?? [],
        tasksRes.error ? [] : ((tasksRes.data as SprintTask[]) ?? [])
      ),
      events: (eventsRes.data as ProjectEvent[]) ?? [],
      clients,
      authors,
    },
  };
}

// ---------------------------------------------------------------------------
// A ÚNICA escrita do /admin
// ---------------------------------------------------------------------------

/** Quem assina a resposta na thread do cliente.
 *
 *  Era o texto fixo "Resposta do Fellipe": `actor` só tem 'owner' | 'client', e o
 *  banco não distinguia Fellipe de Gustavo. A coluna `project_events.author_id`
 *  (migração 2026-07-16b) passou a distinguir — então o título deixa de ser
 *  chute e vira o nome de quem está logado.
 *
 *  O fallback NUNCA usa o e-mail, e isso é deliberado. `user.name` vem do
 *  staff_directory numa leitura que é não-fatal de propósito (currentStaff():
 *  `if (dirErr) reportError(...)` e segue com name: null) — ou seja, um soluço de
 *  rede, um grant revogado ou um JWT expirando no meio fazem `name` virar null sem
 *  ninguém perceber. Com o e-mail no fallback, a linha nasceria "Resposta de
 *  fellipe306", ia PRO BANCO assim e a cliente leria isso pra sempre: o título é
 *  gravado no insert e não há segunda chance (o eventTitle do portal só reescreve
 *  o que o Monitor escreve, e nem casaria este texto). Genérico é chato; e-mail
 *  do dono na timeline do cliente é vazamento. */
export function replyTitle(user: StaffUser): string {
  const who = user.name?.trim();
  return who ? `Resposta de ${who}` : "Resposta da equipe";
}

/** Responde o comentário do cliente. `sprintId` gruda a resposta na thread
 *  daquela sprint; sem ele, é resposta na caixa geral.
 *
 *  É a única coisa que o /admin escreve. A policy events_staff_reply só aceita
 *  type='comment' + actor='owner' + is_staff() + can_see_project() + author_id =
 *  auth.uid() — aprovar sprint, marcar fase ou mexer em prazo continua sendo só
 *  pelo Monitor, e o banco recusaria daqui de qualquer jeito.
 *
 *  `author` é EXIGIDO (e não lido aqui dentro) porque a policy exige author_id:
 *  a válvula legada `author_id is null` só vale pro owner, e depender dela seria
 *  gravar uma fala sem dono — justamente o que a migração veio consertar. Quem
 *  chama já tem o usuário do portão (useStaff()), então não custa uma ida ao
 *  servidor e o compilador cobra. */
export async function postStaffReply(
  projectId: string,
  body: string,
  sprintId: string | null,
  author: StaffUser
): Promise<{ ok: true } | { ok: false; message: string }> {
  const text = body.trim();
  if (!text) return { ok: false, message: "Escreva alguma coisa antes de enviar." };
  if (!supabase) return { ok: false, message: dataMessage("network") };

  const { error } = await supabase.from("project_events").insert({
    project_id: projectId,
    sprint_id: sprintId ?? null,
    type: "comment",
    title: replyTitle(author),
    body: text,
    actor: "owner",
    author_id: author.id,
  });

  if (error) {
    reportError("postStaffReply", error);
    const m = error.message.toLowerCase();
    if (m.includes("row-level security") || m.includes("policy"))
      return {
        ok: false,
        message:
          "O banco recusou a resposta. A migração 2026-07-16b já foi aplicada neste ambiente?",
      };
    if (m.includes("failed to fetch") || m.includes("network"))
      return {
        ok: false,
        message:
          "Não consegui falar com o servidor — seu texto continua aí. Tente de novo.",
      };
    if (m.includes("jwt") || m.includes("expired"))
      return { ok: false, message: "Sua sessão expirou. Recarregue a página." };
    return {
      ok: false,
      message: "Não consegui enviar a resposta. O erro real está no console.",
    };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Realtime
// ---------------------------------------------------------------------------

/** Mesma ideia do portal do cliente: qualquer mudança do projeto chama
 *  `onChange` e a tela recarrega. Canal próprio (`admin:`) — o do portal é
 *  `cliente:` e passa por isMockMode(), que aqui não faz sentido.
 *
 *  Devolve a limpeza: CHAME no unmount, senão sobra canal por remontagem. */
export function subscribePortal(
  projectId: string,
  onChange: () => void
): () => void {
  if (!supabase) return () => {};
  const client = supabase;

  const channel: RealtimeChannel = client
    .channel(`admin:${projectId}`)
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
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "sprint_tasks",
        filter: `project_id=eq.${projectId}`,
      },
      onChange
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}
