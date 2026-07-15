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
  created_at: string; // ISO
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
  label: string; // rótulo genérico — NUNCA o nome do cliente/título real
  sprint_current: number;
  sprint_total: number;
  loc_week: number | null;
};

export type PublicStatsPayload = {
  projects: PublicProjectStat[];
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
      return {
        label,
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

  return {
    projects,
    totals: { active_projects: active, loc_week: totalsLoc },
    generated_at:
      typeof obj.generated_at === "string" ? obj.generated_at : null,
  };
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
