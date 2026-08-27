import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { JsonLd, SITE_URL, BUSINESS_ID } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ServiceBody, type RelatedCase } from "../_components/ServiceBody";

// Server component: generateMetadata, generateStaticParams, notFound e JSON-LD
// ficam aqui, em pt. O corpo visível é o ServiceBody (client), que segue o
// toggle de idioma do header.

type Params = { slug: string };

export function generateStaticParams(): Params[] {
	return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<Params>;
}): Promise<Metadata> {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) return {};

	const url = `${SITE_URL}/servicos/${service.slug}`;
	return {
		title: { absolute: service.metaTitle },
		description: service.metaDescription,
		alternates: { canonical: url },
		openGraph: {
			type: "website",
			locale: "pt_BR",
			url,
			title: service.metaTitle,
			description: service.metaDescription,
			siteName: "pavin.me",
		},
		twitter: {
			card: "summary_large_image",
			title: service.metaTitle,
			description: service.metaDescription,
		},
	};
}

export default async function ServicoPage({
	params,
}: {
	params: Promise<Params>;
}) {
	const { slug } = await params;
	const service = getService(slug);
	if (!service) notFound();

	const url = `${SITE_URL}/servicos/${service.slug}`;

	// Só o recorte plano que o card precisa vai pro cliente.
	const cases: RelatedCase[] = service.relatedCaseSlugs
		.map((s) => projects.find((p) => p.slug === s))
		.filter((p): p is (typeof projects)[number] => Boolean(p))
		.map((p) => ({
			slug: p.slug,
			title: p.title,
			year: p.year,
			category: p.category,
			description: p.description,
			metric: p.metric,
			accent: p.accent,
		}));

	const jsonLd = [
		{
			"@type": "Service",
			"@id": `${url}#service`,
			name: service.name.pt,
			description: service.metaDescription,
			url,
			serviceType: service.name.pt,
			areaServed: "BR",
			provider: { "@id": BUSINESS_ID },
			offers: {
				"@type": "Offer",
				priceCurrency: "BRL",
				price: service.price.from,
				priceSpecification: {
					"@type": "PriceSpecification",
					priceCurrency: "BRL",
					minPrice: service.price.from,
				},
			},
		},
		{
			"@type": "FAQPage",
			mainEntity: service.faq.map((f) => ({
				"@type": "Question",
				name: f.q.pt,
				acceptedAnswer: { "@type": "Answer", text: f.a.pt },
			})),
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
				{
					"@type": "ListItem",
					position: 2,
					name: "Serviços",
					item: `${SITE_URL}/servicos`,
				},
				{ "@type": "ListItem", position: 3, name: service.name.pt, item: url },
			],
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />
			<ServiceBody service={service} cases={cases} />
			<LeadFormSection />
		</>
	);
}
