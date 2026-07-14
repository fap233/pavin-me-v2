import type { Metadata } from "next";
import Nav from "./_components/Nav";
import Footer from "./_components/Footer";

/**
 * Layout da demo Nexus AI (/demos/ai-saas/*).
 *
 * A demo virou um site de verdade (home, features, pricing, docs, playground,
 * signup), então nav e footer vivem aqui — uma única fonte pra navegação em
 * todas as rotas, com o link ativo destacado via usePathname() dentro do Nav.
 */

export const metadata: Metadata = {
	title: "Nexus AI — Autonomous agents for your workflows",
	description:
		"Demo de UI: SaaS de IA com playground, documentação, planos e cadastro. Frontend lab de Fellipe Pavin.",
};

export default function AiSaasLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
			<Nav />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
