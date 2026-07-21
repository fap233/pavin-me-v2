import { createClient } from "@supabase/supabase-js";

// Backlog compartilhado de projetos. URL + anon key vêm de env (Vercel /
// .env.local). A anon key é pública (segura no client); a service_role NUNCA
// deve ser usada aqui.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && anon ? createClient(url, anon) : null;
export const supabaseConfigured = Boolean(url && anon);

export type SharedProject = {
  id: string;
  source: string | null;
  ref_id: string | null;
  title: string;
  description: string | null;
  client: string | null;
  link: string | null;
  status: "backlog" | "doing" | "review" | "done";
  notes: string | null;
  delivery_at: string | null; // data prevista de entrega (YYYY-MM-DD)
  // A migração do portal do cliente adiciona `delivery_date` (spec
  // 2026-07-13-portal-do-cliente). Opcional aqui porque o /projetos ainda lê
  // `delivery_at`; o portal aceita as duas (ver deliveryDate() em
  // src/app/cliente/_data.ts).
  delivery_date?: string | null;
  claimed_by: string | null;
  claimed_email: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
};

// ---------------------------------------------------------------------------
// Portal do cliente (/cliente) — tabelas novas
// ---------------------------------------------------------------------------

export type SprintStatus =
  | "planned"
  | "in_progress"
  | "delivered"
  | "approved"
  | "blocked";

export type Sprint = {
  id: string;
  project_id: string;
  idx: number;
  title: string;
  description: string | null;
  status: SprintStatus;
  planned_end: string | null; // YYYY-MM-DD
  delivered_at: string | null; // ISO
  approved_at: string | null; // ISO
  approved_by: string | null; // auth.users.id
  created_at: string;
  // Fases (checklist) da sprint, anexadas na leitura (ordenadas por idx). O cliente
  // vê read-only; marcá-las (só o Fellipe, pelo Monitor) move a % do projeto.
  tasks?: SprintTask[];
};

// Uma fase (item de checklist) de uma sprint. `done` marcado conta pra % do projeto.
export type SprintTask = {
  id: string;
  sprint_id: string;
  project_id: string;
  idx: number;
  title: string;
  done: boolean;
  done_at: string | null; // ISO
};

export type ProjectEventType =
  | "project_started"
  | "sprint_started"
  | "sprint_delivered"
  | "sprint_approved"
  | "deadline_changed"
  | "comment"
  | "note";

export type ProjectEvent = {
  id: string;
  project_id: string;
  sprint_id: string | null;
  type: ProjectEventType;
  title: string;
  body: string | null;
  actor: "owner" | "client";
  // QUEM escreveu, quando `actor='owner'` (migração 2026-07-16b). Existe porque
  // `actor` só diz de que LADO veio: com o Gustavo respondendo, "owner" virou
  // duas pessoas. Resolvido contra `staff_directory` (ver authorName() em
  // src/app/cliente/_data.ts).
  //
  // NULL = legado: antes desta coluna, quem escrevia como owner era só o
  // Fellipe — então null vira "Fellipe", que é a única verdade possível pras
  // linhas antigas. Também é null nos eventos que nascem de trigger/Monitor
  // (sprint entregue, prazo mudou), onde não há autor humano nenhum.
  author_id: string | null;
  created_at: string; // ISO
};

// Uma linha de `public.staff_directory` — a view só-leitura com o MÍNIMO
// publicável de quem trabalha nos projetos (id + nome, jamais e-mail; só
// owner/collab). É o que deixa o portal assinar uma resposta com o nome certo.
//
// A view não tem `security_invoker`: roda com o dono e por isso ignora a RLS da
// `profiles` de propósito. `grant select to authenticated` — o cliente logado lê
// (nome de quem toca o projeto dele não é segredo); deslogado (anon) não
// enumera a equipe. Ver supabase/migrations/2026-07-16b-escopo-colaborador.sql
// no repo 99freelas-new-v1.
export type StaffMember = {
  id: string;
  display_name: string | null;
};

export type ProjectMember = {
  project_id: string;
  user_id: string;
  role: "client";
  created_at: string;
};

// ---------------------------------------------------------------------------
// Home pública — public_stats (prova social "tem obra rodando agora")
// ---------------------------------------------------------------------------
// A home lê a linha singleton `id = 1` da tabela `public_stats` com a ANON key
// e renderiza `payload`. O Monitor (service_role + github_token) calcula esse
// agregado JÁ ANONIMIZADO e faz upsert nele — nome de cliente, título real e
// nome de repo NUNCA chegam aqui. Contrato definido na migração
// supabase/migrations/2026-07-14c-homepage.sql (repo 99freelas-new-v1).

/** Um projeto em andamento, já anonimizado. `loc_week` é null quando o projeto
 *  não tem repositório mapeado (o Monitor não inventa número). */
export type PublicProjectStat = {
  label: string; // rótulo genérico (pt) — NUNCA o nome do cliente/título real
  label_en: string; // o mesmo em inglês (cai no `label` quando não há tradução)
  sprint_current: number;
  sprint_total: number;
  loc_week: number | null;
};

/** §5.2 — "Concluídos recentemente": rótulo anônimo + quando concluiu. */
export type PublicCompletedStat = {
  label: string;
  label_en: string;
  done_at: string | null; // ISO (updated_at de quando o status virou done)
};

export type PublicStatsPayload = {
  projects: PublicProjectStat[];
  completed: PublicCompletedStat[]; // 10 últimos concluídos (pode vir vazio)
  totals: { active_projects: number; loc_week: number | null };
  generated_at: string | null; // ISO — null antes da 1ª publicação do Monitor
};

/** Normaliza o `payload` cru (jsonb) num shape confiável. Descarta qualquer
 *  campo inesperado — a home só confia no que este parser deixa passar. */
export function parsePublicStats(raw: unknown): PublicStatsPayload {
  const obj = (raw ?? {}) as Record<string, unknown>;
  const rawProjects = Array.isArray(obj.projects) ? obj.projects : [];
  const projects: PublicProjectStat[] = rawProjects
    .map((p): PublicProjectStat | null => {
      const o = (p ?? {}) as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label.trim() : "";
      if (!label) return null;
      const num = (v: unknown) =>
        typeof v === "number" && Number.isFinite(v) ? v : 0;
      const locRaw = o.loc_week;
      const labelEn =
        typeof o.label_en === "string" && o.label_en.trim()
          ? o.label_en.trim()
          : label; // sem tradução? usa o pt — a home nunca fica sem rótulo
      return {
        label,
        label_en: labelEn,
        sprint_current: Math.max(0, Math.round(num(o.sprint_current))),
        sprint_total: Math.max(0, Math.round(num(o.sprint_total))),
        loc_week:
          typeof locRaw === "number" && Number.isFinite(locRaw)
            ? Math.max(0, Math.round(locRaw))
            : null,
      };
    })
    .filter((p): p is PublicProjectStat => p !== null);

  const totalsRaw = (obj.totals ?? {}) as Record<string, unknown>;
  const active =
    typeof totalsRaw.active_projects === "number"
      ? Math.max(0, Math.round(totalsRaw.active_projects))
      : projects.length;
  const totalsLoc =
    typeof totalsRaw.loc_week === "number" && Number.isFinite(totalsRaw.loc_week)
      ? Math.max(0, Math.round(totalsRaw.loc_week))
      : projects.reduce((sum, p) => sum + (p.loc_week ?? 0), 0);

  // §5.2 — concluídos: mesmo rigor dos projetos (label obrigatório; resto
  // tolerante). Snapshot antigo sem `completed` -> lista vazia, seção some.
  const rawCompleted = Array.isArray(obj.completed) ? obj.completed : [];
  const completed: PublicCompletedStat[] = rawCompleted
    .map((c): PublicCompletedStat | null => {
      const o = (c ?? {}) as Record<string, unknown>;
      const label = typeof o.label === "string" ? o.label.trim() : "";
      if (!label) return null;
      return {
        label,
        label_en:
          typeof o.label_en === "string" && o.label_en.trim()
            ? o.label_en.trim()
            : label,
        done_at: typeof o.done_at === "string" ? o.done_at : null,
      };
    })
    .filter((c): c is PublicCompletedStat => c !== null)
    .slice(0, 10);

  return {
    projects,
    completed,
    totals: { active_projects: active, loc_week: totalsLoc },
    generated_at:
      typeof obj.generated_at === "string" ? obj.generated_at : null,
  };
}

// ---------------------------------------------------------------------------
// Avaliações do cliente — client_reviews (fase 4, o loop de prova social)
// ---------------------------------------------------------------------------
// O cliente logado avalia o SEU projeto em /cliente/[projectId]/avaliar. A linha
// nasce `status='pending'` e NÃO aparece em lugar nenhum público até o Fellipe
// aprovar no Monitor. RLS (migração 2026-07-14d-avaliacoes.sql, repo
// 99freelas-new-v1): o cliente só INSERE do projeto que é membro, só LÊ a
// própria, nunca faz update/delete; anon não toca nesta tabela. A home lê a
// versão publicada (public_reviews), nunca esta.

export type ClientReviewStatus = "pending" | "approved" | "rejected";

export type ClientReview = {
  id: string;
  project_id: string;
  user_id: string;
  rating: number; // 1..5
  body: string;
  status: ClientReviewStatus;
  created_at: string;
  approved_at: string | null;
};

// ---------------------------------------------------------------------------
// Home pública — public_reviews (as avaliações APROVADAS, lidas por anon)
// ---------------------------------------------------------------------------
// Mesmo padrão do public_stats: o Monitor (service_role), ao aprovar uma
// avaliação, publica a versão JÁ ANONIMIZADA aqui, e só aqui. A home lê com a
// ANON key (grant select to anon) e mescla com as 10 estáticas do 99freelas.
// `author` já vem pronto do Monitor: nome real SÓ se o cliente consentiu; por
// padrão "Cliente verificado" ou primeiro nome + inicial. O texto (`body`) vem
// do cliente — a home escapa no render (React já escapa; nada de innerHTML).
//
// O parser abaixo é tolerante de propósito (aceita alguns aliases de nome de
// coluna) pra a home não quebrar se o Monitor nomear um campo de forma um pouco
// diferente. Contrato canônico das colunas: id, rating, body, author, context,
// published_at.

export type PublicReview = {
  id: string;
  rating: number; // 1..5
  body: string; // texto do cliente — escapar no render
  author: string; // nome já anonimizado ("Maria S." | "Cliente verificado")
  context: string | null; // rótulo do projeto anonimizado (opcional)
  published_at: string | null; // ISO — quando foi aprovada/publicada
};

/** Normaliza uma linha crua de `public_reviews` num shape confiável, ou null se
 *  a linha não tem o mínimo (id + body + rating válido). Aceita aliases de nome
 *  de coluna pra sobreviver a pequenas divergências com o que o Monitor grava. */
export function parsePublicReview(raw: unknown): PublicReview | null {
  const o = (raw ?? {}) as Record<string, unknown>;

  const id =
    typeof o.id === "string" && o.id
      ? o.id
      : typeof o.review_id === "string"
        ? o.review_id
        : "";
  if (!id) return null;

  const ratingRaw = typeof o.rating === "number" ? o.rating : NaN;
  if (!Number.isFinite(ratingRaw)) return null;
  const rating = Math.min(5, Math.max(1, Math.round(ratingRaw)));

  const bodyRaw =
    typeof o.body === "string"
      ? o.body
      : typeof o.text === "string"
        ? o.text
        : "";
  const body = bodyRaw.trim().slice(0, 2000);
  if (!body) return null;

  const authorRaw =
    (typeof o.author === "string" && o.author) ||
    (typeof o.display_name === "string" && o.display_name) ||
    (typeof o.name === "string" && o.name) ||
    "";
  const author = authorRaw.trim().slice(0, 80) || "Cliente verificado";

  const contextRaw =
    (typeof o.context === "string" && o.context) ||
    (typeof o.project_label === "string" && o.project_label) ||
    (typeof o.label === "string" && o.label) ||
    "";
  const context = contextRaw.trim().slice(0, 160) || null;

  const published =
    (typeof o.published_at === "string" && o.published_at) ||
    (typeof o.approved_at === "string" && o.approved_at) ||
    (typeof o.created_at === "string" && o.created_at) ||
    null;

  return { id, rating, body, author, context, published_at: published };
}

// ---------------------------------------------------------------------------
// Home pública — contact_requests (leads do formulário "Vamos conversar")
// ---------------------------------------------------------------------------
// O form NÃO fala com o Supabase direto: o submit vai pro Route Handler
// /api/contato (server), que valida o Turnstile com a SECRET e só então insere.
// anon só INSERE (nome, email, tipo, mensagem); nunca LÊ (RLS). Ver migração.

export type ContactRequestInput = {
  nome: string;
  email: string;
  tipo: string | null;
  mensagem: string;
};
