import type { Metadata } from "next";
import { AdminShell } from "./_components/AdminShell";

export const metadata: Metadata = {
  title: "Back-office",
  // Área interna: fora do índice dos buscadores, igual ao portal do cliente.
  robots: { index: false, follow: false },
};

// O portão de staff e a navbar vivem no AdminShell (client component — a sessão
// do Supabase só existe no browser). Este layout fica server só pra poder
// exportar o `metadata` acima.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
