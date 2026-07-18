// Camada de dados da PORTA DO COLABORADOR (/projetos).
//
// A regra desta área inteira: quem recorta o que o colaborador enxerga é a
// RLS, não este arquivo. A policy `sp_select` (migração 2026-07-16b) já
// entrega, pra quem é collab, exatamente o que ele PEGOU + o backlog livre SEM
// cliente; pro owner, tudo. Por isso `listWorkable()` não tem um `.eq()` de
// autorização: repetir a regra aqui criaria uma SEGUNDA verdade, e duas
// verdades divergem — a do banco continuaria valendo e a da tela viraria
// mentira. Se a policy mudar, esta tela acompanha sozinha.
//
// O que a TELA faz com o resultado é AGRUPAR: "os meus" (claimed_by = eu) e
// "disponíveis" (claimed_by = null). Isso não é autorização, é arrumação — o
// banco já decidiu o CONJUNTO; a gente só escolhe a prateleira.

import { supabase, type SharedProject } from "@/lib/supabase";

export type LoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

/** O erro REAL do Supabase no console — mesmo motivo do /admin e do portal: a
 *  mensagem de tela é pra pessoa, esta linha é pra nós. */
function reportError(where: string, error: unknown): void {
  const e = (error ?? {}) as {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
  };
  console.error(`[projetos:${where}]`, {
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
  if (m.includes("jwt") || m.includes("expired"))
    return "A sessão expirou. Recarregue a página.";
  return "Não consegui carregar os projetos agora. O erro real está no console.";
}

// ---------------------------------------------------------------------------
// Sessão
// ---------------------------------------------------------------------------

/** Papéis. A migração do portal (2026-07-14) renomeou o vocabulário:
 *  admin -> owner, member -> collab, e nasceu "client". Os nomes antigos
 *  continuam tolerados aqui pelo mesmo motivo que o page.tsx tolera: a
 *  migração roda no banco, não no deploy — e, se um 'admin' legado aparecesse,
 *  ele só perderia o atalho pro back-office, nunca o acesso ao quadro. */
export type WorkRole = "owner" | "collab" | "client" | "admin" | "member";

export type WorkSession = { id: string; email: string | null; role: WorkRole };

export function isOwnerRole(role: WorkRole): boolean {
  return role === "owner" || role === "admin";
}

/** Quem está logado, com o papel. `null` = ninguém (ou Supabase sem config).
 *
 *  NÃO é um portão: o /projetos é a porta do colaborador e tem o próprio
 *  formulário de login na tela do quadro. Isto aqui existe só pra navbar saber
 *  se desenha os links e se oferece o atalho do back-office. */
export async function currentWorker(): Promise<WorkSession | null> {
  if (!supabase) return null;

  const { data: sess, error } = await supabase.auth.getSession();
  if (error) {
    reportError("session", error);
    return null;
  }
  const u = sess.session?.user;
  if (!u) return null;

  const { data: prof, error: profErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", u.id)
    .maybeSingle();
  if (profErr) reportError("profile", profErr);

  // Sem papel legível, "collab" é o default seguro: é o papel que MENOS oferece
  // (o atalho do /admin fica escondido). Mesmo default do page.tsx.
  return { id: u.id, email: u.email ?? null, role: (prof?.role as WorkRole) ?? "collab" };
}

// ---------------------------------------------------------------------------
// Os projetos que EU posso tocar
// ---------------------------------------------------------------------------

/** Tudo que a RLS deixa este usuário ver em `shared_projects`.
 *
 *  Sem filtro de autorização de propósito (ver o cabeçalho): pro collab o banco
 *  já devolve só os dele + o backlog livre. A ordem é a mesma do quadro
 *  (mais novo primeiro), pra duas telas da mesma área não contarem a mesma
 *  história em ordens diferentes. */
export async function listWorkable(): Promise<LoadResult<SharedProject[]>> {
  if (!supabase)
    return {
      ok: false,
      message:
        "Supabase sem configuração (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY).",
    };

  const { data, error } = await supabase
    .from("shared_projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    reportError("listWorkable", error);
    return { ok: false, message: dataMessage(error.message) };
  }
  return { ok: true, data: (data as SharedProject[]) ?? [] };
}

/** "Os meus": o que este usuário pegou. Agrupamento de TELA, não recorte de
 *  segurança — a lista que entra aqui já veio recortada pela RLS. */
export function mine(projects: SharedProject[], userId: string): SharedProject[] {
  return projects.filter((p) => p.claimed_by === userId);
}

/** "Disponíveis": o backlog livre — ninguém pegou ainda. Idem: agrupamento.
 *  (Quem é collab nem recebe do banco os livres COM cliente; quem é owner
 *  recebe. É a policy que manda, e é assim mesmo.) */
export function unclaimed(projects: SharedProject[]): SharedProject[] {
  return projects.filter((p) => p.claimed_by === null);
}
