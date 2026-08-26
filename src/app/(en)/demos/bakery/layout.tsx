import type { Metadata } from "next";

import { CartProvider } from "./_components/CartProvider";
import { SiteNav } from "./_components/SiteNav";
import { SiteFooter } from "./_components/SiteFooter";

export const metadata: Metadata = {
	alternates: { canonical: "https://pavin.me/demos/bakery" },
	title: "Farine · Padaria Artesanal (demo)",
	description:
		"Demo de site de padaria artesanal: cardápio filtrável, carrinho e checkout — construído em Next.js por Fellipe Pavin.",
};

/**
 * Layout da demo Farine.
 *
 * Segura três coisas que precisam existir em TODAS as páginas da padaria:
 * o carrinho (por isso ele sobrevive à navegação), a navegação e o rodapé.
 *
 * O <style> aqui é escopado em `.farine` de propósito: as outras demos do lab
 * dividem o mesmo globals.css, e nenhuma regra daqui pode vazar pra elas.
 * `animate-spin-slow` era uma classe fantasma (usada no selo, nunca definida
 * em lugar nenhum do projeto) — é aqui que ela finalmente ganha keyframes.
 */
export default function BakeryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<CartProvider>
			<style precedence="medium" href="farine-demo">{FARINE_CSS}</style>

			<div className="farine min-h-screen bg-[#FDF8F5] text-stone-800 font-serif selection:bg-orange-200">
				<SiteNav />
				<main>{children}</main>
				<SiteFooter />
			</div>
		</CartProvider>
	);
}

const FARINE_CSS = `
.farine .animate-spin-slow { animation: farine-spin 16s linear infinite; }
@keyframes farine-spin { to { transform: rotate(360deg); } }

.farine .farine-pop { animation: farine-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes farine-pop {
	0% { transform: scale(0.6); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
}

.farine .farine-rise { animation: farine-rise 600ms ease-out both; }
@keyframes farine-rise {
	from { opacity: 0; transform: translateY(14px); }
	to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
	.farine .animate-spin-slow,
	.farine .farine-pop,
	.farine .farine-rise { animation: none !important; }
}
`;
