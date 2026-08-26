import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { projectDetails } from "@/lib/projectDetails";
import { JsonLd, PERSON_ID, SITE_URL } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { CaseArticle } from "../_components/CaseArticle";

// /cases/[slug]: versão indexável (pt-BR) do ProjectDetailOverlay. Metadata e
// JSON-LD ficam em pt-BR (é o que o Google indexa); o artigo visível segue o
// toggle de idioma e por isso vive num client component (CaseArticle), que
// mantém a mesma ordem de conteúdo e as mesmas classes detail-* do globals.css.

type Params = { slug: string };

const CASES_URL = `${SITE_URL}/cases`;

/** Mesma ordem do índice: destaques primeiro, depois a ordem do catálogo. */
const ordered = [...projects].sort(
	(a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export function generateStaticParams(): Params[] {
	return projects.map((project) => ({ slug: project.slug }));
}

/** Corta em limite de palavra e fecha com reticências, sem passar de `max`. */
function truncate(text: string, max = 155): string {
	const clean = text.trim();
	if (clean.length <= max) return clean;
	const cut = clean.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(" ");
	const base = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
	return `${base.replace(/[\s,;:.]+$/, "")}…`;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { slug } = await params;
	const project = projects.find((p) => p.slug === slug);
	if (!project) return {};

	const url = `${CASES_URL}/${project.slug}`;
	const description = truncate(project.description.pt);
	const ogTitle = `${project.title} · case · Fellipe Pavin`;

	return {
		title: `${project.title} · case`,
		description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			type: "article",
			locale: "pt_BR",
			url,
			title: ogTitle,
			description,
			...(project.imageUrl
				? { images: [{ url: `${SITE_URL}${project.imageUrl}`, alt: project.title }] }
				: {}),
		},
		twitter: {
			card: project.imageUrl ? "summary_large_image" : "summary",
			title: ogTitle,
			description,
		},
	};
}

export default async function CasePage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { slug } = await params;
	const index = ordered.findIndex((p) => p.slug === slug);
	if (index === -1) notFound();

	const project = ordered[index];
	const detail = projectDetails[project.slug];
	const url = `${CASES_URL}/${project.slug}`;
	const prev = ordered[(index - 1 + ordered.length) % ordered.length];
	const next = ordered[(index + 1) % ordered.length];

	const jsonLd = [
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "Cases", item: CASES_URL },
				{ "@type": "ListItem", position: 3, name: project.title, item: url },
			],
		},
		{
			"@type": "CreativeWork",
			"@id": `${url}#case`,
			name: project.title,
			description: project.description.pt,
			url,
			author: { "@id": PERSON_ID },
			dateCreated: project.year,
			keywords: project.tags.join(", "),
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />

			<CaseArticle
				project={project}
				detail={detail}
				prev={{ slug: prev.slug, title: prev.title }}
				next={{ slug: next.slug, title: next.title }}
			/>

			<LeadFormSection />
		</>
	);
}
