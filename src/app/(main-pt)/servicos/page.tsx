import type { Metadata } from "next";
import { services } from "@/lib/services";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { JsonLd, SITE_URL, BUSINESS_ID } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ServicesHub } from "./_components/ServicesHub";

// Server component: metadata e JSON-LD ficam em pt e só no servidor. O corpo
// visível é o ServicesHub (client), que segue o toggle de idioma do header.

const PAGE_URL = `${SITE_URL}/servicos`;

export const metadata: Metadata = {
	title: {
		absolute: "Serviços · desenvolvimento web, automação e sistemas sob medida",
	},
	description:
		"Criação de site, loja virtual, automação com n8n e WhatsApp, sistema sob medida, aplicativo mobile e integrações Bling/marketplaces. Proposta em até 1 dia.",
	alternates: { canonical: PAGE_URL },
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: PAGE_URL,
		title: "Serviços · desenvolvimento web, automação e sistemas sob medida",
		description:
			"Site, loja virtual, automação n8n e chatbot WhatsApp, SaaS, app mobile e integrações Bling/marketplaces. 4,92/5 em 28 avaliações. Proposta em até 1 dia.",
		siteName: "pavin.me",
	},
	twitter: {
		card: "summary_large_image",
		title: "Serviços · Fellipe Pavin",
		description:
			"Desenvolvimento web, automação e sistemas sob medida. Proposta em até 1 dia.",
	},
};

export default function ServicosPage() {
	const jsonLd = [
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "Serviços", item: PAGE_URL },
			],
		},
		{
			"@type": "ItemList",
			name: "Serviços de desenvolvimento web, automação e sistemas",
			itemListOrder: "https://schema.org/ItemListOrderAscending",
			numberOfItems: services.length,
			itemListElement: services.map((s, i) => ({
				"@type": "ListItem",
				position: i + 1,
				item: {
					"@type": "Service",
					"@id": `${PAGE_URL}/${s.slug}#service`,
					name: s.name.pt,
					description: s.summary.pt,
					url: `${PAGE_URL}/${s.slug}`,
					serviceType: s.name.pt,
					areaServed: "BR",
					provider: { "@id": BUSINESS_ID },
					offers: {
						"@type": "Offer",
						priceCurrency: "BRL",
						price: s.price.from,
						priceSpecification: {
							"@type": "PriceSpecification",
							priceCurrency: "BRL",
							minPrice: s.price.from,
						},
					},
				},
			})),
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />
			<ServicesHub
				services={services}
				reviews={{ average: REVIEW_SUMMARY.average, total: REVIEW_SUMMARY.total }}
			/>
			<LeadFormSection />
		</>
	);
}
