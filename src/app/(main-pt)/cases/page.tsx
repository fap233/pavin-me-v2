import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { JsonLd, SITE_URL } from "@/components/seo/JsonLd";

// /cases: índice indexável dos projetos (em português). A home só abre os
// projetos num overlay client-side, que o Google não enxerga; aqui cada card
// é um link estático pra /cases/<slug>.

const PAGE_URL = `${SITE_URL}/cases`;
const DESCRIPTION =
	"Cases de projetos em produção: marketplaces, SaaS, automação de CRM, segurança e apps. Arquitetura, desafios e resultados de cada entrega.";

export const metadata: Metadata = {
	title: "Cases · projetos entregues",
	description: DESCRIPTION,
	alternates: {
		canonical: PAGE_URL,
	},
	openGraph: {
		type: "website",
		locale: "pt_BR",
		url: PAGE_URL,
		title: "Cases · projetos entregues · Fellipe Pavin",
		description: DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: "Cases · projetos entregues · Fellipe Pavin",
		description: DESCRIPTION,
	},
};

/** Destaques primeiro; o restante mantém a ordem do catálogo. */
const ordered = [...projects].sort(
	(a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
);

export default function CasesPage() {
	const jsonLd = [
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "Cases", item: PAGE_URL },
			],
		},
		{
			"@type": "ItemList",
			name: "Cases de projetos entregues",
			itemListElement: ordered.map((project, i) => ({
				"@type": "ListItem",
				position: i + 1,
				name: project.title,
				url: `${PAGE_URL}/${project.slug}`,
			})),
		},
	];

	return (
		<>
			<JsonLd data={jsonLd} />

			<section className="relative overflow-hidden py-20 md:py-28">
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_55%,transparent_100%)]"
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
							<li aria-current="page" className="text-foreground">
								Cases
							</li>
						</ol>
					</nav>

					<header className="mt-8 max-w-2xl">
						<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
							projetos reais, em produção
						</p>
						<h1 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
							Cases: projetos entregues em produção
						</h1>
						<p className="mt-4 text-muted-foreground">
							Uma seleção do que entreguei em produção: mais de 20 projetos B2B
							entre marketplaces, SaaS operacionais, automação de CRM, auditorias
							de segurança e aplicações web. Cada case traz o contexto, as
							decisões de arquitetura e os resultados verificáveis.
						</p>
					</header>

					<ul className="mt-12 grid gap-6 sm:grid-cols-2">
						{ordered.map((project) => (
							<li key={project.slug}>
								<Link
									href={`/cases/${project.slug}`}
									className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md transition-colors duration-300 hover:border-[var(--brand-via)]/45"
								>
									<div className="relative aspect-video w-full overflow-hidden border-b bg-secondary/30">
										{project.imageUrl ? (
											<Image
												src={project.imageUrl}
												alt={`Tela do projeto ${project.title}`}
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
											{project.category.pt}
											<span className="mx-2 text-muted-foreground/40">·</span>
											{project.year}
										</p>
										<h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{project.description.pt}
										</p>
										<p
											className="text-sm font-medium leading-relaxed"
											style={{ color: project.accent[1] }}
										>
											{project.metric.pt}
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
											Ver case
											<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
										</span>
									</div>
								</Link>
							</li>
						))}
					</ul>

					<p className="mt-14 text-sm text-muted-foreground">
						Precisa de algo parecido? Veja{" "}
						<Link
							href="/servicos"
							className="font-semibold text-foreground underline-offset-4 hover:underline"
						>
							como trabalho e o que entrego
						</Link>
						.
					</p>
				</div>
			</section>
		</>
	);
}
