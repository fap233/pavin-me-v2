"use client";

import { AppShell } from "./_components/app-shell";
import { PainelProvider } from "./_components/painel-context";

/**
 * Shell do painel: sidebar + topbar + área rolável vivem aqui, então persistem
 * entre /dashboard, /pedidos, /clientes e /configuracoes (a sidebar marca a
 * rota atual via usePathname, e a busca/sino não perdem estado na navegação).
 */
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<PainelProvider>
			<AppShell>{children}</AppShell>
		</PainelProvider>
	);
}
