import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { JsonLd, SITE_URL } from "@/components/seo/JsonLd";
import { CasesGrid } from "./_components/CasesGrid";

// /cases: índice indexável dos projetos (em português). A home só abre os
// projetos num overlay client-side, que o Google não enxerga; aqui cada card
// é um link estático pra /cases/<slug>. Metadata e JSON-LD ficam em pt-BR
// (é o que o Google indexa); o conteúdo visível segue o toggle de idioma e
// por isso vive num client component (CasesGrid).

const PAGE_URL = `${SITE_URL}/cases`;
const DESCRIPTION =
	"Cases de projetos em produção: marketplaces, SaaS, automação de CRM, segurança e apps. Arquitetura, desafios e resultados de cada entrega.";

export const metadata: Metadata = {
	title: "Cases · projetos entregues",
	description: DESCRIPTION,
	alternates: {
		canonical: PAGE_URL,
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: PAGE_URL,
		title: "Cases · projetos entregues · Fellipe Pavin",
		description: DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: "Cases · projetos entregues · Fellipe Pavin",
		description: DESCRIPTION,
	},
};

/** Destaques primeiro; o restante mantém a ordem do catálogo. */
const ordered = [...projects].sort(
	(a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export default function CasesPage() {
	const jsonLd = [
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "Cases", item: PAGE_URL },
			],
		},
		{
			"@type": "ItemList",
			name: "Cases de projetos entregues",
			itemListElement: ordered.map((project, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: project.title,
				url: `${PAGE_URL}/${project.slug}`,
			})),
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />
			<CasesGrid projects={ordered} />
		</>
	);
}
