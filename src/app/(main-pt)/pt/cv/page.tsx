import type { Metadata } from "next";
import CvPage from "../../../(en)/(main)/cv/page";

export const metadata: Metadata = {
	title: "Currículo",
	description:
		"Fellipe Pavin, engenheiro de software full stack. 9+ anos de experiência, 20+ projetos B2B entregues, fundador de um SaaS multi-tenant com 10 mil usuários pagantes. TypeScript, React/Next.js, Node.js, .NET, PostgreSQL.",
	alternates: {
		canonical: "https://pavin.me/pt/cv",
		languages: {
			en: "https://pavin.me/cv",
			"pt-BR": "https://pavin.me/pt/cv",
			"x-default": "https://pavin.me/cv",
		},
	},
	openGraph: {
		title: "Currículo · Fellipe Pavin",
		description:
			"Engenheiro de software · 9+ anos · Go, TypeScript, Node.js, React. Remoto, para todo o Brasil e o mundo.",
		url: "https://pavin.me/pt/cv",
		type: "profile",
		locale: "pt_BR",
	},
};

/** CV em português: mesmo componente de /cv, idioma inicial vem do layout /pt. */
export default function CvPt() {
	return <CvPage />;
}
