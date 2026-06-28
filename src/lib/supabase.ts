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
  claimed_by: string | null;
  claimed_email: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
};
