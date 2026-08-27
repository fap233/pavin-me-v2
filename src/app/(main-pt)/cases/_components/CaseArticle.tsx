"use client";

// Conteúdo visível de /cases/[slug]. A página em si é server component
// (metadata, JSON-LD, notFound), mas a cópia segue o toggle de idioma do
// Header, então o artigo vive aqui. Mesma ordem de conteúdo e mesmas classes
// detail-* do globals.css; os tokens --accent-from/--accent-to vêm do projeto.
// O layout do grupo (main-pt) inicia o idioma em "pt": o HTML servido ao
// Google já sai em português, sem gate de mount.

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/projects";
import type { ProjectDetail } from "@/lib/projectDetails";
import { useLanguage } from "@/contexts/LanguageContext";

type CaseLink = { slug: string; title: string };

const copy = {
	pt: {
		breadcrumb: "Trilha de navegação",
		home: "Início",
		cases: "Cases",
		imageAlt: (title: string) => `Tela do projeto ${title}`,
		role: "Papel",
		timeline: "Período",
		summary: "Resumo",
		architecture: "Arquitetura e decisões",
		challenges: "Desafios",
		problem: "Problema",
		solution: "Solução",
		results: "Resultados",
		stack: "Stack",
		technologies: "Tecnologias",
		liveSite: "Ver site ao vivo",
		github: "Ver código no GitHub",
		asideKicker: "próximo passo",
		asideTitle: "Quer algo parecido?",
		asideBody:
			"Veja como trabalho na página de serviços ou descreva o seu projeto no formulário abaixo. Respondo com uma proposta objetiva.",
		seeServices: "Ver serviços",
		describeProject: "Descrever meu projeto",
		otherCases: "Outros cases",
		previousCase: "Case anterior",
		nextCase: "Próximo case",
	},
	en: {
		breadcrumb: "Breadcrumb",
		home: "Home",
		cases: "Cases",
		imageAlt: (title: string) => `Screenshot of the ${title} project`,
		role: "Role",
		timeline: "Timeline",
		summary: "Summary",
		architecture: "Architecture and decisions",
		challenges: "Challenges",
		problem: "Problem",
		solution: "Solution",
		results: "Results",
		stack: "Stack",
		technologies: "Technologies",
		liveSite: "View live site",
		github: "View code on GitHub",
		asideKicker: "next step",
		asideTitle: "Want something similar?",
		asideBody:
			"See how I work on the services page, or describe your project in the form below. I reply with a clear, objective proposal.",
		seeServices: "See services",
		describeProject: "Describe my project",
		otherCases: "Other case studies",
		previousCase: "Previous case",
		nextCase: "Next case",
	},
} as const;

export function CaseArticle({
	project,
	detail,
	prev,
	next,
}: {
	project: Project;
	detail?: ProjectDetail;
	prev: CaseLink;
	next: CaseLink;
}) {
	const { language } = useLanguage();
	const c = copy[language];

	return (
		<article
			className="relative overflow-hidden py-20 md:py-28"
			style={
				{
					"--accent-from": project.accent[0],
					"--accent-to": project.accent[1],
				} as React.CSSProperties
			}
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_20%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
				<nav aria-label={c.breadcrumb} className="text-sm text-muted-foreground">
					<ol className="flex flex-wrap items-center gap-2">
						<li>
							<Link href="/" className="transition-colors hover:text-foreground">
								{c.home}
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li>
							<Link href="/cases" className="transition-colors hover:text-foreground">
								{c.cases}
							</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-foreground">
							{project.title}
						</li>
					</ol>
				</nav>

				<header className="mt-8">
					<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
						{project.category[language]}
						<span className="mx-2 text-muted-foreground/40">·</span>
						{project.year}
					</p>
					<h1 className="detail-title mt-2 text-3xl font-bold tracking-tight md:text-5xl">
						{project.title}
					</h1>
					<p className="detail-metric mt-4 text-base font-medium leading-relaxed">
						{project.metric[language]}
					</p>
				</header>

				<div className="mt-10 space-y-10">
					{project.imageUrl && (
						<div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-secondary/30">
							<Image
								src={project.imageUrl}
								alt={c.imageAlt(project.title)}
								fill
								priority
								sizes="(max-width: 768px) 100vw, 900px"
								className="object-cover"
							/>
						</div>
					)}

					{detail && (
						<dl className="grid gap-4 sm:grid-cols-2">
							<Meta label={c.role} value={detail.role[language]} />
							<Meta label={c.timeline} value={detail.timeline[language]} />
						</dl>
					)}

					<Section title={c.summary}>
						<p className="text-base leading-relaxed text-foreground/90">
							{detail ? detail.summary[language] : project.description[language]}
						</p>
					</Section>

					{detail && detail.architecture[language].length > 0 && (
						<Section title={c.architecture}>
							<ul className="space-y-3">
								{detail.architecture[language].map((item) => (
									<li
										key={item}
										className="detail-bullet text-sm leading-relaxed text-muted-foreground"
									>
										{item}
									</li>
								))}
							</ul>
						</Section>
					)}

					{detail && detail.challenges.length > 0 && (
						<Section title={c.challenges}>
							<div className="space-y-5">
								{detail.challenges.map((ch) => (
									<div key={ch.problem.en} className="detail-challenge">
										<h3 className="text-sm font-semibold text-foreground">
											<span className="sr-only">{c.problem}: </span>
											{ch.problem[language]}
										</h3>
										<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
											<span className="sr-only">{c.solution}: </span>
											{ch.solution[language]}
										</p>
									</div>
								))}
							</div>
						</Section>
					)}

					{detail && detail.results[language].length > 0 && (
						<Section title={c.results}>
							<ul className="space-y-2">
								{detail.results[language].map((item) => (
									<li
										key={item}
										className="detail-result flex gap-3 text-sm leading-relaxed text-foreground/90"
									>
										<span aria-hidden="true" className="detail-tick" />
										{item}
									</li>
								))}
							</ul>
						</Section>
					)}

					{detail && detail.stack.length > 0 && (
						<Section title={c.stack}>
							<div className="grid gap-4 sm:grid-cols-2">
								{detail.stack.map((group) => (
									<div key={group.label.en}>
										<h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
											{group.label[language]}
										</h3>
										<div className="mt-2 flex flex-wrap gap-1.5">
											{group.items.map((item) => (
												<Chip key={item}>{item}</Chip>
											))}
										</div>
									</div>
								))}
							</div>
						</Section>
					)}

					<Section title={c.technologies}>
						<div className="flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<Chip key={tag}>{tag}</Chip>
							))}
						</div>
					</Section>

					{(project.liveUrl || project.githubUrl) && (
						<div className="flex flex-col gap-3 border-t pt-8 sm:flex-row sm:flex-wrap">
							{project.liveUrl && (
								<a
									href={project.liveUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hero-btn hero-btn-fill w-full sm:w-auto"
								>
									<span className="relative z-10 inline-flex items-center gap-2 text-sm">
										{c.liveSite}
										<ArrowUpRight className="hero-btn-arrow h-4 w-4" />
									</span>
								</a>
							)}
							{project.githubUrl && (
								<a
									href={project.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hero-btn hero-btn-outline w-full sm:w-auto"
								>
									<span className="relative z-10 inline-flex items-center gap-2 text-sm">
										<Github className="h-4 w-4" />
										{c.github}
									</span>
								</a>
							)}
						</div>
					)}

					<aside className="relative isolate overflow-hidden rounded-2xl border bg-card/60 p-6 backdrop-blur-md sm:p-8">
						<span
							aria-hidden="true"
							className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
						/>
						<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
							{c.asideKicker}
						</p>
						<h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
							{c.asideTitle}
						</h2>
						<p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
							{c.asideBody}
						</p>
						<div className="mt-6 flex flex-col gap-3 sm:flex-row">
							<Link href="/servicos" className="hero-btn hero-btn-fill w-full sm:w-auto">
								<span className="relative z-10 inline-flex items-center gap-2 text-sm">
									{c.seeServices}
									<ArrowRight className="hero-btn-arrow h-4 w-4" />
								</span>
							</Link>
							<a href="#vamos-conversar" className="hero-btn hero-btn-outline w-full sm:w-auto">
								<span className="relative z-10 inline-flex items-center gap-2 text-sm">
									{c.describeProject}
								</span>
							</a>
						</div>
					</aside>

					<nav
						aria-label={c.otherCases}
						className="grid gap-4 border-t pt-8 sm:grid-cols-2"
					>
						<Link
							href={`/cases/${prev.slug}`}
							rel="prev"
							className="group flex items-center gap-3 rounded-2xl border bg-card/60 p-4 backdrop-blur-md transition-colors hover:border-[var(--brand-via)]/45"
						>
							<ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1" />
							<span className="min-w-0">
								<span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									{c.previousCase}
								</span>
								<span className="block truncate text-sm font-semibold">{prev.title}</span>
							</span>
						</Link>
						<Link
							href={`/cases/${next.slug}`}
							rel="next"
							className="group flex items-center justify-end gap-3 rounded-2xl border bg-card/60 p-4 text-right backdrop-blur-md transition-colors hover:border-[var(--brand-via)]/45"
						>
							<span className="min-w-0">
								<span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									{c.nextCase}
								</span>
								<span className="block truncate text-sm font-semibold">{next.title}</span>
							</span>
							<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</nav>
				</div>
			</div>
		</article>
	);
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
			<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-foreground/90">{value}</dd>
		</div>
	);
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section>
			<h2 className="detail-section-title mb-3 font-mono text-[11px] uppercase tracking-[0.22em]">
				{title}
			</h2>
			{children}
		</section>
	);
}

function Chip({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
			{children}
		</span>
	);
}
