import type { Metadata } from "next";

/**
 * Versão em português da home (e do CV em /pt/cv). Mesmos componentes da raiz,
 * mas o primeiro render (SSR) já sai em pt-BR: é o HTML que o Google lê. A
 * raiz continua em inglês; as duas apontam uma pra outra por hreflang. O
 * provider "pt" e o <html lang> vêm do layout do route group (main-pt).
 */
export const metadata: Metadata = {
	title: {
		absolute: "Fellipe Pavin · Desenvolvedor Full Stack em Fortaleza (sites, sistemas, automação)",
		// Sem isto, um título absoluto aqui apaga o template dos filhos (/pt/cv
		// saía só "Currículo").
		template: "%s · Fellipe Pavin",
	},
	description:
		"Desenvolvedor de software full stack com 9+ anos de experiência. Criação de sites e lojas virtuais, automação com n8n e WhatsApp, sistemas e SaaS sob medida e aplicativos. Atendimento remoto para todo o Brasil.",
	alternates: {
		canonical: "https://pavin.me/pt",
		languages: {
			en: "https://pavin.me",
			"pt-BR": "https://pavin.me/pt",
			"x-default": "https://pavin.me",
		},
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		alternateLocale: "en_US",
		url: "https://pavin.me/pt",
		title: "Fellipe Pavin · Desenvolvedor Full Stack",
		description:
			"9+ anos construindo software em produção. Sites, lojas virtuais, automação, sistemas sob medida e apps para empresas de todo o Brasil.",
		siteName: "pavin.me",
	},
	twitter: {
		card: "summary_large_image",
		title: "Fellipe Pavin · Desenvolvedor Full Stack",
		description:
			"Sites, lojas virtuais, automação, sistemas sob medida e apps. Atendimento remoto para todo o Brasil.",
	},
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
