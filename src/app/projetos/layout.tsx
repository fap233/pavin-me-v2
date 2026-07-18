import type { Metadata } from "next";
import { CollabShell } from "./_components/CollabShell";

export const metadata: Metadata = {
  title: "Workspace",
  // Área de trabalho da equipe: fora do índice dos buscadores, igual ao portal
  // do cliente e ao back-office.
  robots: { index: false, follow: false },
};

// A barra do workspace e a navegação do colaborador vivem no CollabShell
// (client component — a sessão do Supabase só existe no browser). Este layout
// fica server só pra poder exportar o `metadata` acima. Mesmo arranjo do
// /admin, pelo mesmo motivo bobo do Next: client component não exporta
// `metadata`.
export default function ProjetosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CollabShell>{children}</CollabShell>;
}
