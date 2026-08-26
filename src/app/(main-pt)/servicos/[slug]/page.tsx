import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Plus } from "lucide-react";
import { getService, services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { JsonLd, SITE_URL, BUSINESS_ID } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { Reveal } from "../_components/Reveal";

// Âncora do formulário em LeadFormSection (id="vamos-conversar").
const LEAD_ANCHOR = "#vamos-conversar";

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
	const cases = service.relatedCaseSlugs
		.map((s) => projects.find((p) => p.slug === s))
		.filter((p): p is (typeof projects)[number] => Boolean(p));

	const jsonLd = [
		{
			"@type": "Service",
			"@id": `${url}#service`,
			name: service.name,
			description: service.metaDescription,
			url,
			serviceType: service.name,
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
				name: f.q,
				acceptedAnswer: { "@type": "Answer", text: f.a },
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
				{ "@type": "ListItem", position: 3, name: service.name, item: url },
			],
		},
	];

	const kickerCls =
		"font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80";
	const h2Cls = "mt-2 text-3xl font-bold tracking-tight md:text-5xl";
	const chipCls =
		"inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur";

	return (
		<>
			<JsonLd data={jsonLd} />

			{/* Hero */}
			<Reveal
				as="section"
				className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
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
							<li>
								<Link
									href="/servicos"
									className="transition-colors hover:text-foreground"
								>
									Serviços
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li aria-current="page" className="text-foreground">
								{service.name}
							</li>
						</ol>
					</nav>

					<div className="in-view-anim in-view-anim-2 mt-8 max-w-3xl">
						<p className={kickerCls}>{service.kicker}</p>
						<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
							{service.title}
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-muted-foreground">
							{service.lead}
						</p>
					</div>

					<div className="in-view-anim in-view-anim-3 mt-6 flex flex-wrap gap-2">
						<span className={chipCls}>
							<span
								aria-hidden="true"
								className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
							/>
							{service.price.label}
						</span>
						<span className={chipCls}>prazo típico: {service.timeline}</span>
						<span className={chipCls}>pagamento por etapas</span>
					</div>

					<div className="in-view-anim in-view-anim-4 mt-8 flex flex-wrap items-center gap-3">
						<a href={LEAD_ANCHOR} className="hero-btn hero-btn-fill">
							<span className="relative z-10 inline-flex items-center gap-2">
								Pedir proposta
								<ArrowRight className="hero-btn-arrow h-4 w-4" />
							</span>
						</a>
						<a href="#como-funciona" className="hero-btn-ghost">
							<span className="hero-btn-ghost-label">Como funciona</span>
						</a>
					</div>
				</div>
			</Reveal>

			{/* O que está incluso */}
			<Reveal as="section" className="relative py-20 md:py-28">
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="in-view-anim in-view-anim-1 max-w-2xl">
						<p className={kickerCls}>{"// o que está incluso"}</p>
						<h2 className={h2Cls}>Tudo o que entra no projeto</h2>
						<p className="mt-4 text-muted-foreground">
							Escopo fechado por escrito na proposta. O que está aqui é o padrão;
							o que o seu caso pedir a mais, a gente combina antes.
						</p>
					</div>
					<ul className="in-view-anim in-view-anim-2 mt-10 grid gap-4 sm:grid-cols-2">
						{service.included.map((item) => (
							<li
								key={item}
								className="flex gap-3 rounded-2xl border bg-card/60 p-5 backdrop-blur-md"
							>
								<span
									aria-hidden="true"
									className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-from)] to-[var(--brand-to)] text-white"
								>
									<Check className="h-3.5 w-3.5" strokeWidth={3} />
								</span>
								<span className="text-sm leading-relaxed">{item}</span>
							</li>
						))}
					</ul>
				</div>
			</Reveal>

			{/* Como funciona */}
			<Reveal
				as="section"
				id="como-funciona"
				className="relative overflow-hidden py-20 md:py-28 scroll-mt-24"
			>
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_55%,transparent_100%)]"
				/>
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="in-view-anim in-view-anim-1 max-w-2xl">
						<p className={kickerCls}>{"// como funciona"}</p>
						<h2 className={h2Cls}>Do primeiro contato à entrega</h2>
						<p className="mt-4 text-muted-foreground">
							Sem reunião infinita nem sumiço no meio do caminho. Quatro etapas,
							todas visíveis pra você.
						</p>
					</div>
					<ol className="in-view-anim in-view-anim-2 mt-10 grid gap-4 md:grid-cols-2">
						{service.steps.map((step, i) => (
							<li
								key={step.title}
								className="relative overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md"
							>
								<span
									aria-hidden="true"
									className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
								/>
								<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									etapa {String(i + 1).padStart(2, "0")}
								</p>
								<h3 className="mt-2 text-lg font-bold tracking-tight">
									{step.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
									{step.text}
								</p>
							</li>
						))}
					</ol>
				</div>
			</Reveal>

			{/* Tecnologias */}
			<Reveal as="section" className="relative py-20 md:py-28">
				<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
					<div className="in-view-anim in-view-anim-1 max-w-2xl">
						<p className={kickerCls}>{"// tecnologias"}</p>
						<h2 className={h2Cls}>Com o que eu construo</h2>
						<p className="mt-4 text-muted-foreground">
							Ferramenta escolhida pelo problema, não pelo hábito. Estas são as
							que costumam entrar neste tipo de projeto.
						</p>
					</div>
					<ul className="in-view-anim in-view-anim-2 mt-8 flex flex-wrap gap-2">
						{service.technologies.map((tech) => (
							<li
								key={tech}
								className="rounded-full border border-border/70 bg-card/60 px-3.5 py-1.5 font-mono text-xs text-foreground/90 backdrop-blur transition-colors hover:border-[var(--brand-via)]/45"
							>
								{tech}
							</li>
						))}
					</ul>
				</div>
			</Reveal>

			{/* Cases relacionados */}
			{cases.length > 0 && (
				<Reveal
					as="section"
					className="relative overflow-hidden py-20 md:py-28"
				>
					<div
						aria-hidden="true"
						className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_55%,transparent_100%)]"
					/>
					<div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="in-view-anim in-view-anim-1 max-w-2xl">
							<p className={kickerCls}>{"// cases relacionados"}</p>
							<h2 className={h2Cls}>Projetos parecidos que já entreguei</h2>
							<p className="mt-4 text-muted-foreground">
								Trabalho real em produção, com números verificáveis.
							</p>
						</div>
						<ul className="in-view-anim in-view-anim-2 mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
							{cases.map((p) => (
								<li key={p.slug} className="h-full">
									<Link
										href={`/cases/${p.slug}`}
										className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-via)]/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-via)]/40"
									>
										<span
											aria-hidden="true"
											className="absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity group-hover:opacity-100"
											style={{
												background: `linear-gradient(90deg, ${p.accent[0]}, ${p.accent[1]})`,
											}}
										/>
										<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
											{p.category.pt} · {p.year}
										</p>
										<h3 className="mt-3 text-lg font-bold tracking-tight transition-colors group-hover:text-[var(--brand-via)]">
											{p.title}
										</h3>
										<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
											{p.description.pt}
										</p>
										<p className="mt-4 text-xs font-medium text-foreground/80">
											{p.metric.pt}
										</p>
										<span className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
											Ver case
											<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</Reveal>
			)}

			{/* FAQ: <details> nativo, acessível e indexável sem JS */}
			<Reveal as="section" className="relative py-20 md:py-28">
				<div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
					<div className="in-view-anim in-view-anim-1 max-w-2xl">
						<p className={kickerCls}>{"// dúvidas"}</p>
						<h2 className={h2Cls}>Perguntas frequentes</h2>
						<p className="mt-4 text-muted-foreground">
							As objeções que aparecem antes de fechar. Se a sua não estiver
							aqui, manda no formulário.
						</p>
					</div>
					<div className="in-view-anim in-view-anim-2 mt-10 space-y-3">
						{service.faq.map((item, i) => (
							<details
								key={item.q}
								open={i === 0}
								className="group overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md transition-colors duration-300 open:border-[var(--brand-via)]/45"
							>
								<summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none transition-colors hover:text-[var(--brand-via)] focus-visible:ring-2 focus-visible:ring-[var(--brand-via)]/40 [&::-webkit-details-marker]:hidden">
									<span>{item.q}</span>
									<Plus
										aria-hidden="true"
										className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:text-[var(--brand-via)]"
									/>
								</summary>
								<p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
									{item.a}
								</p>
							</details>
						))}
					</div>
				</div>
			</Reveal>

			<LeadFormSection />
		</>
	);
}
