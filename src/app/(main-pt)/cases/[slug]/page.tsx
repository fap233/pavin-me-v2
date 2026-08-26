import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/lib/projects";
import { projectDetails } from "@/lib/projectDetails";
import { JsonLd, PERSON_ID, SITE_URL } from "@/components/seo/JsonLd";
import { LeadFormSection } from "@/components/sections/LeadFormSection";

// /cases/[slug]: versão indexável (pt-BR) do ProjectDetailOverlay. Mesma
// ordem de conteúdo e mesmas classes detail-* do globals.css; os tokens
// --accent-from/--accent-to vêm do projeto e alimentam essas classes.

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
					<nav aria-label="Trilha de navegação" className="text-sm text-muted-foreground">
						<ol className="flex flex-wrap items-center gap-2">
							<li>
								<Link href="/" className="transition-colors hover:text-foreground">
									Início
								</Link>
							</li>
							<li aria-hidden="true">/</li>
							<li>
								<Link href="/cases" className="transition-colors hover:text-foreground">
									Cases
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
							{project.category.pt}
							<span className="mx-2 text-muted-foreground/40">·</span>
							{project.year}
						</p>
						<h1 className="detail-title mt-2 text-3xl font-bold tracking-tight md:text-5xl">
							{project.title}
						</h1>
						<p className="detail-metric mt-4 text-base font-medium leading-relaxed">
							{project.metric.pt}
						</p>
					</header>

					<div className="mt-10 space-y-10">
						{project.imageUrl && (
							<div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-secondary/30">
								<Image
									src={project.imageUrl}
									alt={`Tela do projeto ${project.title}`}
									fill
									priority
									sizes="(max-width: 768px) 100vw, 900px"
									className="object-cover"
								/>
							</div>
						)}

						{detail && (
							<dl className="grid gap-4 sm:grid-cols-2">
								<Meta label="Papel" value={detail.role.pt} />
								<Meta label="Período" value={detail.timeline.pt} />
							</dl>
						)}

						<Section title="Resumo">
							<p className="text-base leading-relaxed text-foreground/90">
								{detail ? detail.summary.pt : project.description.pt}
							</p>
						</Section>

						{detail && detail.architecture.pt.length > 0 && (
							<Section title="Arquitetura e decisões">
								<ul className="space-y-3">
									{detail.architecture.pt.map((item) => (
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
							<Section title="Desafios">
								<div className="space-y-5">
									{detail.challenges.map((c) => (
										<div key={c.problem.pt} className="detail-challenge">
											<h3 className="text-sm font-semibold text-foreground">
												{c.problem.pt}
											</h3>
											<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
												{c.solution.pt}
											</p>
										</div>
									))}
								</div>
							</Section>
						)}

						{detail && detail.results.pt.length > 0 && (
							<Section title="Resultados">
								<ul className="space-y-2">
									{detail.results.pt.map((item) => (
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
							<Section title="Stack">
								<div className="grid gap-4 sm:grid-cols-2">
									{detail.stack.map((group) => (
										<div key={group.label.pt}>
											<h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
												{group.label.pt}
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

						<Section title="Tecnologias">
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
											Ver site ao vivo
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
											Ver código no GitHub
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
								próximo passo
							</p>
							<h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
								Quer algo parecido?
							</h2>
							<p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
								Veja como trabalho na página de serviços ou descreva o seu projeto
								no formulário abaixo. Respondo com uma proposta objetiva.
							</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<Link href="/servicos" className="hero-btn hero-btn-fill w-full sm:w-auto">
									<span className="relative z-10 inline-flex items-center gap-2 text-sm">
										Ver serviços
										<ArrowRight className="hero-btn-arrow h-4 w-4" />
									</span>
								</Link>
								<a href="#vamos-conversar" className="hero-btn hero-btn-outline w-full sm:w-auto">
									<span className="relative z-10 inline-flex items-center gap-2 text-sm">
										Descrever meu projeto
									</span>
								</a>
							</div>
						</aside>

						<nav
							aria-label="Outros cases"
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
										Case anterior
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
										Próximo case
									</span>
									<span className="block truncate text-sm font-semibold">{next.title}</span>
								</span>
								<ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</nav>
					</div>
				</div>
			</article>

			<LeadFormSection />
		</>
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
