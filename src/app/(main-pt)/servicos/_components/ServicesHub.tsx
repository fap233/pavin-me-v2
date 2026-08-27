"use client";

// Corpo do hub /servicos. O page.tsx (server) cuida de metadata e JSON-LD em
// pt; aqui tudo que é visível segue o idioma do toggle do header. Com
// initialLanguage="pt" no layout, o HTML servido já sai em português e o <h1>
// existe no primeiro byte, sem gate de mount.

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Service } from "@/lib/services";
import { Reveal } from "./Reveal";

const UI = {
	pt: {
		breadcrumb: "Navegação estrutural",
		home: "Início",
		services: "Serviços",
		kicker: "// serviços",
		title: "Serviços de desenvolvimento web, automação e sistemas",
		lead: "Sou Fellipe Pavin, engenheiro de software full stack em Fortaleza, atendendo empresas de todo o Brasil de forma remota. Do site institucional ao SaaS multi-tenant, cada projeto sai com proposta em até um dia, pagamento por etapas com marcos definidos e acompanhamento pelo portal do cliente.",
		viewDetails: "Ver detalhes",
		reviewsHeadline: (avg: string, total: number) =>
			`${avg}/5 em ${total} avaliações no 99freelas`,
		reviewsSub:
			"Top 100 da plataforma, selo TOP FREELANCER PLUS. Avaliações reais, nada editado.",
		proofReviews: (total: number) => `em ${total} avaliações`,
		proofProjects: "projetos B2B entregues",
		proofYears: "anos de experiência",
		proofUsers: "usuários pagantes num SaaS próprio",
	},
	en: {
		breadcrumb: "Breadcrumb",
		home: "Home",
		services: "Services",
		kicker: "// services",
		title: "Web development, automation and custom systems",
		lead: "I am Fellipe Pavin, a full stack software engineer based in Fortaleza, working remotely with companies all over Brazil. From a corporate website to a multi-tenant SaaS, every project comes with a proposal within a day, staged payment with defined milestones and progress tracking through the client portal.",
		viewDetails: "View details",
		reviewsHeadline: (avg: string, total: number) =>
			`${avg}/5 across ${total} reviews on 99freelas`,
		reviewsSub:
			"Top 100 on the platform, TOP FREELANCER PLUS badge. Real reviews, nothing edited.",
		proofReviews: (total: number) => `across ${total} reviews`,
		proofProjects: "B2B projects delivered",
		proofYears: "years of experience",
		proofUsers: "paying users on my own SaaS",
	},
} as const;

type Props = {
	services: Service[];
	/** Média e total de src/data/reviews.ts (formatação por idioma aqui). */
	reviews: { average: number; total: number };
};

export function ServicesHub({ services, reviews }: Props) {
	const { language } = useLanguage();
	const ui = UI[language];

	const average = reviews.average.toFixed(2);
	const averageLabel = language === "pt" ? average.replace(".", ",") : average;

	const proof = [
		{ value: `${averageLabel}/5`, label: ui.proofReviews(reviews.total) },
		{ value: "20+", label: ui.proofProjects },
		{ value: "9+", label: ui.proofYears },
		{ value: "10k+", label: ui.proofUsers },
	];

	return (
		<>
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
						aria-label={ui.breadcrumb}
						className="in-view-anim in-view-anim-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
					>
						<ol className="flex flex-wrap items-center gap-2">
							<li>
								<Link href="/" className="transition-colors hover:text-foreground">
									{ui.home}
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li aria-current="page" className="text-foreground">
								{ui.services}
							</li>
						</ol>
					</nav>

					<div className="in-view-anim in-view-anim-2 mt-8 max-w-3xl">
						<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
							{ui.kicker}
						</p>
						<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
							{ui.title}
						</h1>
						<p className="mt-5 text-lg leading-relaxed text-muted-foreground">
							{ui.lead}
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
										{String(i + 1).padStart(2, "0")} · {s.timeline[language]}
									</p>
									<h2 className="mt-3 text-xl font-bold tracking-tight transition-colors group-hover:text-[var(--brand-via)]">
										{s.name[language]}
									</h2>
									<p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
										{s.summary[language]}
									</p>
									<div className="mt-5 flex items-center justify-between gap-3">
										<span className="text-sm font-semibold">
											{s.price.label[language]}
										</span>
										<span className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
											{ui.viewDetails}
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
									{ui.reviewsHeadline(averageLabel, reviews.total)}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{ui.reviewsSub}
								</p>
							</div>
							<dl className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
								{proof.map((p) => (
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
		</>
	);
}
