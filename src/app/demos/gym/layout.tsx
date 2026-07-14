import type { Metadata } from "next";
import GymNav from "./_components/GymNav";
import GymFooter from "./_components/GymFooter";

export const metadata: Metadata = {
	title: "Iron Forge — Demo de academia",
	description:
		"Demo de site de academia: planos, matrícula multi-etapas, programas, treinadores e unidades.",
};

/**
 * Casca da demo IRON FORGE: navbar fixa + rodapé em TODAS as rotas
 * (/demos/gym, /planos, /matricula, /programas, /programas/[slug],
 * /treinadores, /unidades), pra navegação ser consistente entre elas.
 *
 * A navbar é `fixed h-20`; a home passa por baixo dela de propósito (hero
 * full-bleed) e as páginas internas compensam com o `pt-32` do <PageHero>.
 */
export default function GymLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-yellow-500 selection:text-black">
			<GymNav />
			{children}
			<GymFooter />
		</div>
	);
}
