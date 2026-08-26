import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { services } from "@/lib/services";
import { REVIEW_SUMMARY } from "@/data/reviews";
import { JsonLd, SITE_URL, BUSINESS_ID } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { Reveal } from "./_components/Reveal";

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

const average = REVIEW_SUMMARY.average.toFixed(2).replace(".", ",");

const PROOF = [
	{ value: `${average}/5`, label: `em ${REVIEW_SUMMARY.total} avaliações` },
	{ value: "20+", label: "projetos B2B entregues" },
	{ value: "9+", label: "anos de experiência" },
	{ value: "10k+", label: "usuários pagantes num SaaS próprio" },
];

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
					name: s.name,
					description: s.summary,
					url: `${PAGE_URL}/${s.slug}`,
					serviceType: s.name,
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

			{/* Hero */}
			<Reveal
				as="section"
				className="relative overflow-hidden pt-28 pb-12 md:pt-36 md:pb-16"
			>
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_50%,transparent_100%)]"
				/>
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<nav
						aria-label="Navegação estrutural"
						className="in-view-anim in-view-anim-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
					>
						<ol className="flex flex-wrap items-center gap-2">
							<li>
								<Link href="/" className="transition-colors hover:text-foreground">
									Início
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li aria-current="page" className="text-foreground">
								Serviços
							</li>
						</ol>
					</nav>

					<div className="in-view-anim in-view-anim-2 mt-8 max-w-3xl">
						<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
							{"// serviços"}
						</p>
						<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
							Serviços de desenvolvimento web, automação e sistemas
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-muted-foreground">
							Sou Fellipe Pavin, engenheiro de software full stack em Fortaleza,
							atendendo empresas de todo o Brasil de forma remota. Do site
							institucional ao SaaS multi-tenant, cada projeto sai com proposta
							em até um dia, pagamento por etapas com marcos definidos e
							acompanhamento pelo portal do cliente.
						</p>
					</div>
				</div>
			</Reveal>

			{/* Grid de serviços */}
			<Reveal as="section" className="relative py-12 md:py-16">
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{services.map((s, i) => (
							<li
								key={s.slug}
								className={`in-view-anim in-view-anim-${Math.min(i + 1, 4)} h-full`}
							>
								<Link
									href={`/servicos/${s.slug}`}
									className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-via)]/45 hover:shadow-[0_22px_48px_-24px_rgb(0_0_0/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-via)]/40"
								>
									<span
										aria-hidden="true"
										className="absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity group-hover:opacity-100"
										style={{
											background: `linear-gradient(90deg, ${s.accent[0]}, ${s.accent[1]})`,
										}}
									/>
									<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
										{String(i + 1).padStart(2, "0")} · {s.timeline}
									</p>
									<h2 className="mt-3 text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--brand-via)]">
										{s.name}
									</h2>
									<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
										{s.summary}
									</p>
									<div className="mt-5 flex items-center justify-between gap-3">
										<span className="text-sm font-semibold">{s.price.label}</span>
										<span className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
											Ver detalhes
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
										</span>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</Reveal>

			{/* Prova social */}
			<Reveal as="section" className="relative py-12 md:py-16">
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="in-view-anim in-view-anim-1 relative isolate overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md sm:p-8">
						<span
							aria-hidden="true"
							className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
						/>
						<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
							<div className="max-w-md">
								<div className="flex items-center gap-1 text-amber-500">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											aria-hidden="true"
											className="h-4 w-4 fill-current"
										/>
									))}
								</div>
								<p className="mt-2 text-lg font-semibold">
									{average}/5 em {REVIEW_SUMMARY.total} avaliações no 99freelas
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Top 100 da plataforma, selo TOP FREELANCER PLUS. Avaliações
									reais, nada editado.
								</p>
							</div>
							<dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
								{PROOF.map((p) => (
									<div key={p.label} className="min-w-0">
										<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
											{p.label}
										</dt>
										<dd className="mt-1 bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] bg-clip-text text-2xl font-black tracking-tight text-transparent md:text-3xl">
											{p.value}
										</dd>
									</div>
								))}
							</dl>
						</div>
					</div>
				</div>
			</Reveal>

			<LeadFormSection />
		</>
	);
}
