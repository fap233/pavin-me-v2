// Camada de dados da aba MARCOS (/admin/marcos) — o espelho, no site, da aba
// Marcos do Monitor.
//
// Abordagem B do brainstorm 2026-07-18: os marcos NÃO são uma tabela nova. São
// um ÍNDICE read-through sobre o que já existe:
//   - projeto COM portal (tem sprints)  -> marco = sprint_tasks (o que o cliente vê)
//   - projeto kanban-only (sem sprint)  -> marco = shared_projects.notes.phases
//
// A precedência é IDÊNTICA à do Monitor (_homepage_build_snapshot: `if sprints
// else notes.phases`) e à do progressOf do cliente: um projeto que tem QUALQUER
// sprint é sempre `portal`; `notes.phases` só vira marco quando não há sprint
// nenhuma. Nunca as duas origens pro mesmo projeto.
//
// Mesma anon key, mesma RLS do resto do site. A service_role NUNCA encosta aqui.
// O toggle do portal depende da policy de UPDATE de sprint_tasks (migração
// 2026-07-18) — sem ela, o banco recusa e a tela avisa em vez de mentir sucesso.

import {
  supabase,
  type SharedProject,
  type Sprint,
  type SprintTask,
} from "@/lib/supabase";

// ---------------------------------------------------------------------------
// O "carimbo de origem" — o objeto que decide o WRITER ao marcar
// ---------------------------------------------------------------------------
// É o mesmo shape do contrato (§0): cada marco carrega de onde veio. `source`
// escolhe o caminho de escrita; o resto são as âncoras.
//   portal -> âncora estável = `tid` (sprint_tasks.id)
//   kanban -> âncora = (project_id, sprint_idx, item_index); notes.phases NÃO
//             tem id estável nem done_at, então o índice É a âncora.

export type MilestoneSource = "portal" | "kanban";

export type Milestone = {
  project_id: string;
  project_title: string;
  has_client: boolean;
  source: MilestoneSource;

  sprint_id: string | null; // portal: sprints.id      | kanban: null
  sprint_title: string; // portal: sprints.title   | kanban: phase.name
  sprint_idx: number; // portal: sprints.idx     | kanban: índice da fase
  sprint_status: string | null; // portal: sprints.status  | kanban: null

  tid: string | null; // portal: sprint_tasks.id | kanban: null
  item_index: number | null; // portal: null            | kanban: índice do item

  text: string; // portal: sprint_tasks.title | kanban: item.text
  done: boolean;
  done_at: string | null; // portal: sprint_tasks.done_at | kanban: sempre null
};

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: "error"; message: string };

// Teto EXPLÍCITO das leituras que varrem TODOS os projetos de uma vez. Mesmo
// motivo do /admin/_data.ts: sem um `.limit()` nosso, quem corta é o PostgREST
// (max-rows do servidor) — e corta CALADO. Pedindo o teto aqui, o corte é nosso
// e dá pra gritar antes de a tela mostrar uma lista incompleta com cara de
// completa.
const SPRINTS_CAP = 2000;
const TASKS_CAP = 4000; // marcos somados de todos os portais (done + não-done)

function truncou(rows: unknown[] | null | undefined, cap: number): boolean {
  return (rows?.length ?? 0) >= cap;
}

/** O erro REAL do Supabase no console. Mesmo princípio do resto do /admin: a
 *  mensagem de tela é pra pessoa, esta linha é pra nós — nunca engolir a causa
 *  (2026-07-16 custou uma investigação às cegas por um erro engolido). */
function reportError(where: string, error: unknown): void {
  const e = (error ?? {}) as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };
  console.error(`[admin:marcos:${where}]`, {
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
    return "Alguma tabela ainda não existe neste banco (migração pendente).";
  if (m.includes("jwt") || m.includes("expired"))
    return "A sessão expirou. Recarregue a página.";
  if (m.includes("row-level security") || m.includes("policy"))
    return "O banco recusou a operação (RLS). A migração 2026-07-18 já foi aplicada aqui?";
  return "Não consegui carregar os dados agora. O erro real está no console.";
}

// ---------------------------------------------------------------------------
// notes.phases — o roteiro kanban (mesma forma que o Monitor grava e o
// KanbanBoard lê): { phases:[{ name, items:[{ text, done }] }], ...resto }
// ---------------------------------------------------------------------------

type NotesItem = { text: string; done: boolean };
type NotesPhase = { name: string; items: NotesItem[] };

/** Lê SÓ as fases do blob `notes` (TEXT → JSON), defensivo igual ao home-feed do
 *  Monitor e ao parseNotes do KanbanBoard. Devolve [] pra qualquer coisa que não
 *  seja um roteiro válido — nunca estoura. */
function readPhases(raw: string | null): NotesPhase[] {
  if (!raw) return [];
  try {
    const obj = JSON.parse(raw);
    if (!obj || !Array.isArray(obj.phases)) return [];
    return obj.phases.map((ph: { name?: string; items?: unknown[] }) => ({
      name: String(ph?.name ?? ""),
      items: Array.isArray(ph?.items)
        ? ph.items.map((it): NotesItem =>
            typeof it === "string"
              ? { text: it, done: false }
              : {
                  text: String((it as NotesItem)?.text ?? ""),
                  done: Boolean((it as NotesItem)?.done),
                }
          )
        : [],
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Leitura: o índice de marcos de TODOS os projetos, numa rodada
// ---------------------------------------------------------------------------

/** Todos os marcos, achatados e na ordem de render do contrato (§1):
 *    1. has_client desc  (projetos com cliente primeiro — produção antes de backlog)
 *    2. created_at asc do projeto  (estável, mesma chave do home-feed)
 *    3. sprint_idx asc
 *    4. item asc (sprint_tasks.idx no portal, item_index no kanban)
 *
 *  Diferença crítica vs o home-feed do Monitor: aqui NÃO se descarta o projeto/
 *  sprint 100% entregue — o ponto é AUDITAR o que já foi feito. Traz done e
 *  não-done. */
export async function loadMilestones(): Promise<LoadResult<Milestone[]>> {
  if (!supabase)
    return { ok: false, kind: "error", message: dataMessage("network") };

  const [projectsRes, membersRes, sprintsRes, tasksRes] = await Promise.all([
    supabase
      .from("shared_projects")
      .select("id, title, notes, created_at")
      .order("created_at", { ascending: true }),
    supabase.from("project_members").select("project_id, role"),
    supabase
      .from("sprints")
      .select("id, project_id, idx, title, status")
      .order("idx", { ascending: true })
      .limit(SPRINTS_CAP),
    supabase
      .from("sprint_tasks")
      .select("id, sprint_id, project_id, idx, title, done, done_at")
      .order("idx", { ascending: true })
      .limit(TASKS_CAP),
  ]);

  // Projetos e membros são fatais (sem eles não há lista). Sprints/tasks NÃO
  // são: um banco sem essas tabelas ainda tem marcos kanban (notes.phases).
  const fatal = projectsRes.error ?? membersRes.error;
  if (fatal) {
    reportError("loadMilestones", fatal);
    return { ok: false, kind: "error", message: dataMessage(fatal.message) };
  }
  if (sprintsRes.error) reportError("loadMilestones:sprints", sprintsRes.error);
  if (tasksRes.error) reportError("loadMilestones:sprint_tasks", tasksRes.error);

  if (truncou(sprintsRes.data, SPRINTS_CAP))
    reportError("loadMilestones:sprints", {
      message: `Teto de ${SPRINTS_CAP} sprints batido: a lista pode estar INCOMPLETA. Pagine esta query.`,
      code: "cap_atingido",
    });
  if (truncou(tasksRes.data, TASKS_CAP))
    reportError("loadMilestones:sprint_tasks", {
      message: `Teto de ${TASKS_CAP} marcos batido: a lista pode estar INCOMPLETA. Pagine esta query.`,
      code: "cap_atingido",
    });

  const projects = (projectsRes.data as Pick<
    SharedProject,
    "id" | "title" | "notes" | "created_at"
  >[]) ?? [];
  const members = (membersRes.data as { project_id: string; role: string }[]) ?? [];
  const allSprints = sprintsRes.error
    ? []
    : ((sprintsRes.data as Sprint[]) ?? []);
  const allTasks = tasksRes.error
    ? []
    : ((tasksRes.data as SprintTask[]) ?? []);

  // has_client = existe member role='client' (o mesmo client_pids do home-feed).
  const clientPids = new Set(
    members.filter((m) => m.role === "client").map((m) => m.project_id)
  );

  const sprintsByProject = new Map<string, Sprint[]>();
  for (const s of allSprints) {
    const arr = sprintsByProject.get(s.project_id);
    if (arr) arr.push(s);
    else sprintsByProject.set(s.project_id, [s]);
  }
  const tasksBySprint = new Map<string, SprintTask[]>();
  for (const t of allTasks) {
    const arr = tasksBySprint.get(t.sprint_id);
    if (arr) arr.push(t);
    else tasksBySprint.set(t.sprint_id, [t]);
  }

  const out: Milestone[] = [];

  // Projetos já vêm em created_at asc; iteramos nessa ordem e só re-ordenamos
  // por has_client no fim (sort estável preserva o resto).
  for (const project of projects) {
    const hasClient = clientPids.has(project.id);
    const sprints = (sprintsByProject.get(project.id) ?? [])
      .slice()
      .sort((a, b) => a.idx - b.idx);

    if (sprints.length > 0) {
      // PORTAL: marco = sprint_tasks. Sprint sem task não emite marco (o header
      // de sprint vazia sai de outra query se alguém quiser mostrá-lo).
      for (const s of sprints) {
        const tasks = (tasksBySprint.get(s.id) ?? [])
          .slice()
          .sort((a, b) => a.idx - b.idx);
        for (const t of tasks) {
          out.push({
            project_id: project.id,
            project_title: project.title,
            has_client: hasClient,
            source: "portal",
            sprint_id: s.id,
            sprint_title: s.title,
            sprint_idx: s.idx,
            sprint_status: s.status,
            tid: t.id,
            item_index: null,
            text: t.title,
            done: t.done,
            done_at: t.done_at,
          });
        }
      }
    } else {
      // KANBAN: sem sprint nenhuma -> marco = notes.phases. Índice É a âncora.
      const phases = readPhases(project.notes ?? null);
      phases.forEach((ph, sprintIdx) => {
        ph.items.forEach((it, itemIdx) => {
          out.push({
            project_id: project.id,
            project_title: project.title,
            has_client: hasClient,
            source: "kanban",
            sprint_id: null,
            sprint_title: ph.name,
            sprint_idx: sprintIdx,
            sprint_status: null,
            tid: null,
            item_index: itemIdx,
            text: it.text,
            done: it.done,
            done_at: null, // kanban não tem done_at
          });
        });
      });
    }
  }

  // has_client desc por cima da ordem já estável (created_at → sprint → item).
  out.sort((a, b) => Number(b.has_client) - Number(a.has_client));

  return { ok: true, data: out };
}

// ---------------------------------------------------------------------------
// Escrita: marcar/desmarcar um marco (idempotente — é set, não flip)
// ---------------------------------------------------------------------------

/** Marca (ou desmarca) um marco. O `source` do carimbo decide o writer:
 *
 *   portal -> UPDATE sprint_tasks.done/done_at pelo `tid`. done_at segue a mesma
 *             semântica do Monitor (_portal_now_iso): ISO-8601 UTC "agora" quando
 *             done=true, null quando false. Depende da policy de UPDATE de
 *             sprint_tasks (migração 2026-07-18); sem ela o banco recusa e a tela
 *             avisa.
 *
 *   kanban -> rewrite do blob `notes`. Como notes.phases não tem id estável, a
 *             âncora é (sprint_idx, item_index). RELEMOS o notes fresco antes de
 *             reescrever (nunca gravamos de cima de um estado velho) e PRESERVAMOS
 *             toda chave que não modelamos (public_label etc.) — o mesmo cuidado
 *             do saveNotes do KanbanBoard: o site não destrói o que não conhece.
 *
 *  Invariante do contrato (§0): um toggle NUNCA altera project_id/sprint_id/idx/
 *  title — só done/done_at. */
export async function toggleMilestone(
  m: Milestone,
  done: boolean
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!supabase) return { ok: false, message: dataMessage("network") };

  if (m.source === "portal") {
    if (!m.tid)
      return { ok: false, message: "Marco de portal sem tid — não dá pra marcar." };
    const { error } = await supabase
      .from("sprint_tasks")
      .update({ done, done_at: done ? new Date().toISOString() : null })
      .eq("id", m.tid);
    if (error) {
      reportError("toggleMilestone:portal", error);
      return { ok: false, message: dataMessage(error.message) };
    }
    return { ok: true };
  }

  // ---- kanban: reescreve notes.phases[sprint_idx].items[item_index].done ----
  if (m.item_index === null)
    return { ok: false, message: "Marco kanban sem item_index — não dá pra marcar." };

  const { data: row, error: readErr } = await supabase
    .from("shared_projects")
    .select("notes")
    .eq("id", m.project_id)
    .maybeSingle();
  if (readErr) {
    reportError("toggleMilestone:kanban:read", readErr);
    return { ok: false, message: dataMessage(readErr.message) };
  }
  if (!row) return { ok: false, message: "Projeto não encontrado." };

  const raw = (row as { notes: string | null }).notes;
  let obj: Record<string, unknown>;
  try {
    obj = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    reportError("toggleMilestone:kanban:parse", { message: "notes inválido" });
    return {
      ok: false,
      message: "O roteiro deste projeto está num formato que não consegui ler.",
    };
  }

  const phases = obj.phases;
  if (!Array.isArray(phases) || !phases[m.sprint_idx]) {
    return {
      ok: false,
      message: "O roteiro mudou desde que a lista carregou. Recarregue a página.",
    };
  }
  const phase = phases[m.sprint_idx] as { items?: unknown[] };
  const items = phase.items;
  if (!Array.isArray(items) || !items[m.item_index]) {
    return {
      ok: false,
      message: "O roteiro mudou desde que a lista carregou. Recarregue a página.",
    };
  }

  // notes.phases não tem id estável: a única defesa contra marcar o item errado
  // (se o roteiro foi editado embaixo da lista) é conferir que o texto na âncora
  // ainda é o que a lista mostrava. Divergiu -> recusa em vez de marcar o vizinho.
  const current = items[m.item_index] as { text?: string; done?: boolean };
  if (String(current?.text ?? "") !== m.text) {
    return {
      ok: false,
      message: "O roteiro mudou desde que a lista carregou. Recarregue a página.",
    };
  }

  // Muta SÓ o done do item alvo; todo o resto do blob (outras fases, questions,
  // activity, public_label...) passa intacto.
  items[m.item_index] = { ...current, done };

  const { error: writeErr } = await supabase
    .from("shared_projects")
    .update({ notes: JSON.stringify(obj) })
    .eq("id", m.project_id);
  if (writeErr) {
    reportError("toggleMilestone:kanban:write", writeErr);
    return { ok: false, message: dataMessage(writeErr.message) };
  }
  return { ok: true };
}
