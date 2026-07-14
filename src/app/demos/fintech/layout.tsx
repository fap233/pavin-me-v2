import type { Metadata } from "next";
import LuminaNav from "./_components/LuminaNav";
import LuminaFooter from "./_components/LuminaFooter";
import "./lumina.css";

export const metadata: Metadata = {
	title: "Lumina · Banco digital (demo)",
	description:
		"Demo de front-end: banco digital navegável — planos, abertura de conta, extrato com Pix e gestão de cartões.",
};

/**
 * Shell da demo Lumina: navbar (fixa, h-20) e footer em TODAS as rotas.
 * As páginas cuidam do próprio pt-32 pra passar por baixo da navbar fixa.
 */
export default function FintechLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
			<LuminaNav />
			<main>{children}</main>
			<LuminaFooter />
		</div>
	);
}
