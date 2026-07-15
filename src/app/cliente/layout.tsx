import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal do cliente",
  description: "Acompanhe o andamento do seu projeto em tempo real.",
  // Área privada: fora do índice dos buscadores.
  robots: { index: false, follow: false },
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
