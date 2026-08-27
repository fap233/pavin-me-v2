"use client";

// Conteúdo visível de /cases. A página em si é server component (metadata,
// JSON-LD), mas a cópia segue o toggle de idioma do Header, então o miolo
// vive aqui. O layout do grupo (main-pt) inicia o idioma em "pt": o HTML
// servido ao Google já sai em português, sem gate de mount.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { useLanguage } from "@/contexts/LanguageContext";

const copy = {
	pt: {
		breadcrumb: "Trilha de navegação",
		home: "Início",
		cases: "Cases",
		kicker: "projetos reais, em produção",
		title: "Cases: projetos entregues em produção",
		intro:
			"Uma seleção do que entreguei em produção: mais de 20 projetos B2B entre marketplaces, SaaS operacionais, automação de CRM, auditorias de segurança e aplicações web. Cada case traz o contexto, as decisões de arquitetura e os resultados verificáveis.",
		imageAlt: (title: string) => `Tela do projeto ${title}`,
		viewCase: "Ver case",
		closingLead: "Precisa de algo parecido? Veja ",
		closingLink: "como trabalho e o que entrego",
	},
	en: {
		breadcrumb: "Breadcrumb",
		home: "Home",
		cases: "Cases",
		kicker: "real projects, in production",
		title: "Case studies: projects shipped to production",
		intro:
			"A selection of what I have shipped to production: more than 20 B2B projects spanning marketplaces, operations SaaS, CRM automation, security audits and web applications. Each case study covers the context, the architecture decisions and the verifiable results.",
		imageAlt: (title: string) => `Screenshot of the ${title} project`,
		viewCase: "View case",
		closingLead: "Need something similar? See ",
		closingLink: "how I work and what I deliver",
	},
} as const;

export function CasesGrid({ projects }: { projects: Project[] }) {
	const { language } = useLanguage();
	const c = copy[language];

	return (
		<section className="relative overflow-hidden py-20 md:py-28">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_55%,transparent_100%)]"
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
						<li aria-current="page" className="text-foreground">
							{c.cases}
						</li>
					</ol>
				</nav>

				<header className="mt-8 max-w-2xl">
					<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
						{c.kicker}
					</p>
					<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
						{c.title}
					</h1>
					<p className="mt-4 text-muted-foreground">{c.intro}</p>
				</header>

				<ul className="mt-12 grid gap-6 sm:grid-cols-2">
					{projects.map((project) => (
						<li key={project.slug}>
							<Link
								href={`/cases/${project.slug}`}
								className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md transition-colors duration-300 hover:border-[var(--brand-via)]/45"
							>
								<div className="relative aspect-video w-full overflow-hidden border-b bg-secondary/30">
									{project.imageUrl ? (
										<Image
											src={project.imageUrl}
											alt={c.imageAlt(project.title)}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 440px"
											className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
										/>
									) : (
										<div
											aria-hidden="true"
											className="absolute inset-0 opacity-40"
											style={{
												backgroundImage: `linear-gradient(120deg, ${project.accent[0]}, ${project.accent[1]})`,
											}}
										/>
									)}
								</div>

								<div className="flex flex-1 flex-col gap-3 p-5">
									<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
										{project.category[language]}
										<span className="mx-2 text-muted-foreground/40">·</span>
										{project.year}
									</p>
									<h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{project.description[language]}
									</p>
									<p
										className="text-sm font-medium leading-relaxed"
										style={{ color: project.accent[1] }}
									>
										{project.metric[language]}
									</p>
									<div className="mt-auto flex flex-wrap gap-1.5 pt-2">
										{project.tags.map((tag) => (
											<span
												key={tag}
												className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
											>
												{tag}
											</span>
										))}
									</div>
									<span className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-foreground">
										{c.viewCase}
										<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
									</span>
								</div>
							</Link>
						</li>
					))}
				</ul>

				<p className="mt-14 text-sm text-muted-foreground">
					{c.closingLead}
					<Link
						href="/servicos"
						className="font-semibold text-foreground underline-offset-4 hover:underline"
					>
						{c.closingLink}
					</Link>
					.
				</p>
			</div>
		</section>
	);
}
