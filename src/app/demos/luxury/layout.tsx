import type { Metadata } from "next";
import { LuxuryProvider } from "./_components/luxury-context";
import { LuxuryNav } from "./_components/nav";
import { LuxuryFooter } from "./_components/footer";

export const metadata: Metadata = {
	title: "Aurum · Imóveis de exceção",
	description:
		"Demo de front-end: site de real estate de luxo com coleção filtrável, página de imóvel, agendamento de visita e avaliação de imóvel.",
};

/**
 * Casca da AURUM: o provider de estado (salvos + operação atual), o nav fixo e
 * o rodapé — para todas as rotas da demo compartilharem a mesma navegação.
 */
export default function LuxuryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<LuxuryProvider>
			<div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
				<LuxuryNav />
				{children}
				<LuxuryFooter />
			</div>
		</LuxuryProvider>
	);
}
