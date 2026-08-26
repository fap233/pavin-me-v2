import { REVIEWS, REVIEW_SUMMARY } from "@/data/reviews";
import { BUSINESS_ID, JsonLd, PERSON_ID, SITE_URL } from "./JsonLd";

/**
 * Dados estruturados do site inteiro (schema.org), montados no root layout:
 *  - Person: quem é o Fellipe + sameAs (LinkedIn, GitHub, 99freelas) — entidade.
 *  - ProfessionalService/LocalBusiness: o negócio em Fortaleza, atendendo o
 *    Brasil, com AggregateRating e Reviews REAIS (src/data/reviews.ts, coletadas
 *    do perfil no 99freelas). Nada aqui é inventado: notas, contagem e textos
 *    vêm do mesmo arquivo que a seção de depoimentos da home.
 *  - WebSite: nome/idiomas.
 */
export function SiteJsonLd() {
	const person = {
		"@type": "Person",
		"@id": PERSON_ID,
		name: "Fellipe Pavin",
		alternateName: "Fellipe Augusto Pavin",
		jobTitle: "Software Engineer · Full Stack",
		description:
			"Engenheiro de software full stack com 9+ anos de experiência. Fundou e escalou um SaaS multi-tenant a 10 mil usuários pagantes. Entrega sites, lojas virtuais, automações, sistemas sob medida e aplicativos para empresas de todo o Brasil.",
		url: SITE_URL,
		image: `${SITE_URL}/opengraph-image`,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Fortaleza",
			addressRegion: "CE",
			addressCountry: "BR",
		},
		knowsAbout: [
			"TypeScript",
			"React",
			"Next.js",
			"Node.js",
			"PostgreSQL",
			"Go",
			".NET",
			"PHP",
			"Laravel",
			"Python",
			"Flutter",
			"WordPress",
			"n8n",
			"Power BI",
			"SaaS multi-tenant",
			"Automação de processos",
		],
		sameAs: [
			"https://www.linkedin.com/in/fellipe-pavin",
			"https://github.com/fap233",
			"https://www.99freelas.com.br/user/fellipe-augusto-pavin",
		],
		worksFor: { "@id": BUSINESS_ID },
	};

	const reviews = REVIEWS.slice(0, 6).map((r) => ({
		"@type": "Review",
		name: r.project,
		reviewBody: r.text,
		datePublished: r.date,
		inLanguage: "pt-BR",
		reviewRating: {
			"@type": "Rating",
			ratingValue: r.rating,
			bestRating: 5,
			worstRating: 0,
		},
		author: { "@type": "Person", name: "Cliente (99freelas)" },
		itemReviewed: { "@id": BUSINESS_ID },
	}));

	const business = {
		"@type": ["ProfessionalService", "LocalBusiness"],
		"@id": BUSINESS_ID,
		name: "Fellipe Pavin · Desenvolvimento de software",
		alternateName: "pavin.me",
		url: SITE_URL,
		image: `${SITE_URL}/opengraph-image`,
		description:
			"Criação de sites e lojas virtuais, automação com n8n e chatbots de WhatsApp, sistemas e SaaS sob medida, aplicativos mobile e integrações (Bling, marketplaces). Atendimento remoto para todo o Brasil, a partir de Fortaleza.",
		founder: { "@id": PERSON_ID },
		employee: { "@id": PERSON_ID },
		address: {
			"@type": "PostalAddress",
			addressLocality: "Fortaleza",
			addressRegion: "CE",
			addressCountry: "BR",
		},
		areaServed: [{ "@type": "Country", name: "Brasil" }],
		priceRange: "R$ 750 - R$ 25.000",
		knowsLanguage: ["pt-BR", "en"],
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: REVIEW_SUMMARY.average,
			reviewCount: REVIEW_SUMMARY.total,
			bestRating: 5,
			worstRating: 0,
		},
		review: reviews,
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Serviços",
			itemListElement: [
				["Criação de site profissional", "/servicos/criacao-de-site"],
				["Loja virtual (Nuvemshop, Shopify, WooCommerce)", "/servicos/loja-virtual"],
				["Automação com n8n e chatbot de WhatsApp", "/servicos/automacao-n8n-chatbot-whatsapp"],
				["Sistema sob medida e SaaS", "/servicos/sistema-sob-medida-saas"],
				["Aplicativo mobile", "/servicos/aplicativo-mobile"],
				["Integração Bling e marketplaces", "/servicos/integracao-bling-marketplaces"],
			].map(([name, path]) => ({
				"@type": "Offer",
				itemOffered: { "@type": "Service", name, url: `${SITE_URL}${path}` },
			})),
		},
	};

	const website = {
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		url: SITE_URL,
		name: "Fellipe Pavin",
		inLanguage: ["en", "pt-BR"],
		publisher: { "@id": PERSON_ID },
	};

	return <JsonLd data={[person, business, website]} />;
}
