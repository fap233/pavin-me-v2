"use client";

import {
	Mail,
	Github,
	Linkedin,
	MapPin,
	Phone,
	Globe,
	Download,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CVPage() {
	const { language } = useLanguage();
	const isEN = language === "en";

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	return (
		<div className="min-h-screen bg-secondary/10 py-12 print:bg-white print:py-0">
			<div className="mx-auto max-w-3xl px-4 print:px-0">
				{/* Action bar — hidden on print */}
				<div className="no-print mb-6 flex items-center justify-between">
					<Button variant="ghost" size="sm" asChild>
						<Link href="/" className="gap-2">
							<ArrowLeft className="h-4 w-4" />
							{isEN ? "Back to portfolio" : "Voltar ao portfólio"}
						</Link>
					</Button>
					<Button onClick={handlePrint} size="sm" className="gap-2">
						<Download className="h-4 w-4" />
						{isEN ? "Download PDF" : "Baixar PDF"}
					</Button>
				</div>

				<article className="cv-document rounded-lg border bg-card p-10 shadow-sm print:rounded-none print:border-none print:bg-white print:p-0 print:shadow-none">
					{/* Header */}
					<header className="mb-7 border-b pb-5 print:border-b-2 print:border-black">
						<h1 className="text-4xl font-bold tracking-tight print:text-3xl print:text-black">
							Fellipe Pavin
						</h1>
						<p className="mt-1 text-lg text-muted-foreground print:text-base print:text-gray-700">
							{isEN
								? "Software Engineer · Full Stack (Go, React, Node.js)"
								: "Engenheiro de Software · Full Stack (Go, React, Node.js)"}
						</p>
						<div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground print:text-[10pt] print:text-black">
							<a
								href="mailto:fellipe306@gmail.com"
								className="inline-flex items-center gap-1.5 hover:text-primary print:text-black"
							>
								<Mail className="h-3.5 w-3.5" aria-hidden="true" />
								fellipe306@gmail.com
							</a>
							<a
								href="tel:+5585992688102"
								className="inline-flex items-center gap-1.5 hover:text-primary print:text-black"
							>
								<Phone className="h-3.5 w-3.5" aria-hidden="true" />
								+55 85 99268-8102
							</a>
							<span className="inline-flex items-center gap-1.5 print:text-black">
								<MapPin className="h-3.5 w-3.5" aria-hidden="true" />
								Fortaleza, Ceará, Brazil ·{" "}
								{isEN ? "Open to Remote" : "Aberto a Remoto"}
							</span>
							<a
								href="https://pavin.me"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 hover:text-primary print:text-black"
							>
								<Globe className="h-3.5 w-3.5" aria-hidden="true" />
								pavin.me
							</a>
							<a
								href="https://github.com/fap233"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 hover:text-primary print:text-black"
							>
								<Github className="h-3.5 w-3.5" aria-hidden="true" />
								github.com/fap233
							</a>
							<a
								href="https://linkedin.com/in/fellipe-pavin"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 hover:text-primary print:text-black"
							>
								<Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
								linkedin.com/in/fellipe-pavin
							</a>
						</div>
					</header>

					{/* Summary */}
					<Section title={isEN ? "Summary" : "Resumo"}>
						<p className="text-sm leading-relaxed text-foreground/90 print:text-[11pt] print:text-black">
							{isEN
								? "Full Stack Software Engineer with 6+ years of hands-on experience designing, building and scaling production web applications. Architected and maintained a high-traffic SaaS platform serving 10,000+ active users with 99.9% uptime — owning system reliability, database optimization (~40% query latency reduction), DevOps (Docker, Nginx, Linux) and security (Cloudflare WAF, DDoS mitigation, CDN). Currently delivering custom software to international and local clients as an independent engineer, with focus on Go (Golang), Node.js, TypeScript and React/Next.js. Comfortable owning the full stack and the full deployment lifecycle, with a pragmatic product mindset and remote-async work experience."
								: "Engenheiro de Software Full Stack com mais de 6 anos de experiência projetando, construindo e escalando aplicações web em produção. Arquitetei e mantive uma plataforma SaaS de alto tráfego servindo mais de 10.000 usuários ativos com 99,9% de uptime — atuando em confiabilidade de sistema, otimização de banco de dados (~40% de redução de latência em queries), DevOps (Docker, Nginx, Linux) e segurança (Cloudflare WAF, mitigação de DDoS, CDN). Atualmente entrego software customizado para clientes internacionais e locais como engenheiro independente, com foco em Go (Golang), Node.js, TypeScript e React/Next.js. Confortável dominando a stack completa e o ciclo de deploy, com mentalidade de produto e experiência em trabalho remoto-async."}
						</p>
					</Section>

					{/* Skills */}
					<Section title={isEN ? "Technical Skills" : "Habilidades Técnicas"}>
						<dl className="grid grid-cols-1 gap-y-1.5 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-6 print:text-[10.5pt] print:text-black">
							<SkillRow
								label={isEN ? "Languages" : "Linguagens"}
								value="Go (Golang), TypeScript, JavaScript, C# (.NET), PHP, SQL"
							/>
							<SkillRow
								label={isEN ? "Frontend" : "Frontend"}
								value="React.js, Next.js, Tailwind CSS, HTML5, CSS3"
							/>
							<SkillRow
								label={isEN ? "Backend" : "Backend"}
								value="Node.js, Laravel, Express, REST APIs, Microservices, Entity Framework, Prisma ORM"
							/>
							<SkillRow
								label={isEN ? "Databases" : "Banco de Dados"}
								value="PostgreSQL, MySQL, SQL Server, Redis, PostGIS"
							/>
							<SkillRow
								label="DevOps & Infra"
								value="Docker, CI/CD Pipelines, Linux (Arch / Ubuntu / Debian), Nginx, Cloudflare (WAF, CDN, DNS), Git/GitHub, Vercel"
							/>
							<SkillRow
								label={isEN ? "Practices" : "Práticas"}
								value={
									isEN
										? "Clean Architecture, SOLID, TDD, Agile / Scrum, Code Review"
										: "Clean Architecture, SOLID, TDD, Agile / Scrum, Code Review"
								}
							/>
							<SkillRow
								label={isEN ? "Languages (spoken)" : "Idiomas"}
								value={
									isEN
										? "Portuguese (Native), English (Professional)"
										: "Português (Nativo), Inglês (Profissional)"
								}
							/>
						</dl>
					</Section>

					{/* Experience */}
					<Section title={isEN ? "Experience" : "Experiência Profissional"}>
						<div className="space-y-5">
							<Job
								company={isEN ? "Self-Employed" : "Autônomo"}
								title={
									isEN
										? "Software Engineer (Contractor)"
										: "Engenheiro de Software (Contratado)"
								}
								period={
									isEN
										? "January 2024 — Present"
										: "Janeiro 2024 — Atual"
								}
								location={
									isEN
										? "Fortaleza, Brazil · Remote"
										: "Fortaleza, Brasil · Remoto"
								}
								bullets={
									isEN
										? [
												"Delivered 8+ production applications to international and local B2B clients across healthcare, logistics, real-estate, services and entertainment verticals.",
												"Designed and implemented RESTful APIs and microservices in Go (Golang) and Node.js with focus on concurrency patterns, clean architecture and type safety.",
												"Built responsive interactive frontends with TypeScript, React, Next.js and Tailwind CSS — mobile-first and accessibility-conscious.",
												"Owned full deployment lifecycle: Docker containerization, CI/CD pipelines for automated testing and delivery, Linux environments and cloud infrastructure (Vercel, VPS).",
												"Translated vague business requirements into concrete technical specifications and delivered code with 100% client satisfaction across all engagements.",
											]
										: [
												"Entreguei mais de 8 aplicações em produção para clientes B2B internacionais e locais nas verticais de saúde, logística, imobiliário, serviços e entretenimento.",
												"Projetei e implementei APIs RESTful e microsserviços em Go (Golang) e Node.js com foco em padrões de concorrência, arquitetura limpa e type safety.",
												"Construí frontends responsivos e interativos com TypeScript, React, Next.js e Tailwind CSS — mobile-first e com atenção a acessibilidade.",
												"Conduzi o ciclo completo de deploy: containerização Docker, pipelines CI/CD para testes e entrega automatizada, ambientes Linux e infraestrutura em nuvem (Vercel, VPS).",
												"Traduzi requisitos de negócio difusos em especificações técnicas concretas, com 100% de satisfação dos clientes em todas as entregas.",
											]
								}
							/>
							<Job
								company="Crescigram"
								companyMeta={
									isEN
										? "SaaS & E-commerce Platform"
										: "Plataforma SaaS & E-commerce"
								}
								title={
									isEN
										? "Founder · Full Stack Developer · Tech Lead"
										: "Fundador · Desenvolvedor Full Stack · Tech Lead"
								}
								period={
									isEN
										? "January 2018 — December 2023 (6 years)"
										: "Janeiro 2018 — Dezembro 2023 (6 anos)"
								}
								location={
									isEN
										? "Fortaleza, Brazil"
										: "Fortaleza, Brasil"
								}
								bullets={
									isEN
										? [
												"Built and scaled a high-traffic SaaS / e-commerce platform from zero to 10,000+ active users, owning end-to-end engineering, product strategy and operations.",
												"Maintained 99.9% production uptime on a PHP/Laravel + MySQL monolith through proactive monitoring, observability and bug-fix cadence.",
												"Refactored legacy SQL queries (MySQL), reducing query response times by approximately 40% and resolving bottlenecks during peak traffic windows.",
												"Managed Linux production servers (Ubuntu/Debian), Nginx web servers, Docker-containerized environments and automated deployment pipelines.",
												"Configured Cloudflare WAF rules to mitigate DDoS attacks; managed DNS, SSL and CDN for global content delivery.",
												"Authored Shell automation scripts that eliminated hundreds of hours of manual operational toil per year.",
											]
										: [
												"Construí e escalei uma plataforma SaaS / e-commerce de alto tráfego de zero a mais de 10.000 usuários ativos, atuando em engenharia ponta-a-ponta, estratégia de produto e operações.",
												"Mantive 99,9% de uptime em produção em um monolito PHP/Laravel + MySQL através de monitoramento proativo, observabilidade e cadência de correções.",
												"Refatorei queries SQL legadas (MySQL), reduzindo tempos de resposta em aproximadamente 40% e resolvendo gargalos em picos de tráfego.",
												"Gerenciei servidores Linux em produção (Ubuntu/Debian), Nginx, ambientes containerizados com Docker e pipelines de deploy automatizados.",
												"Configurei regras WAF no Cloudflare para mitigação de DDoS; gerenciei DNS, SSL e CDN para entrega global de conteúdo.",
												"Desenvolvi scripts de automação em Shell que eliminaram centenas de horas de trabalho operacional manual por ano.",
											]
								}
							/>
						</div>
					</Section>

					{/* Selected Projects */}
					<Section
						title={isEN ? "Selected Projects" : "Projetos Selecionados"}
					>
						<ul className="space-y-2 text-sm print:text-[10.5pt] print:text-black">
							<ProjectLine
								title="MedSpace Brasil"
								url="medspacebrasil.com.br"
								description={
									isEN
										? "B2B marketplace connecting clinics and medical equipment suppliers (Next.js, TypeScript)."
										: "Marketplace B2B conectando clínicas e fornecedores de equipamentos médicos (Next.js, TypeScript)."
								}
							/>
							<ProjectLine
								title="Fresh Cleaning 4U"
								description={
									isEN
										? "Operations SaaS for an Australian cleaning company — clients, calendar, invoices, SMS reminders, ABN-compliant invoicing (Next.js, TypeScript)."
										: "SaaS operacional para empresa de limpeza australiana — clientes, calendário, faturas, lembretes SMS, emissão compatível com ABN (Next.js, TypeScript)."
								}
							/>
							<ProjectLine
								title="Macroluz"
								url="macroluz.com.br"
								description={
									isEN
										? "Corporate site for a natural lighting engineering firm with industrial product catalog and lead capture."
										: "Site corporativo de engenharia de iluminação natural com catálogo industrial e captura de leads."
								}
							/>
							<ProjectLine
								title="LastMile Brasil"
								url="projeto-lastmile-brasil.vercel.app"
								description={
									isEN
										? "Last-mile coverage platform for ISPs with PostGIS geographic search and integrated checkout."
										: "Plataforma de cobertura de última milha para provedores de internet com busca geográfica via PostGIS."
								}
							/>
							<ProjectLine
								title="Veritas Task Manager"
								url="github.com/fap233/desafio-fullstack-veritas"
								description={
									isEN
										? "Full-stack Kanban with Go backend, React frontend, Docker and CI/CD."
										: "Kanban full-stack com backend Go, frontend React, Docker e CI/CD."
								}
							/>
						</ul>
						<p className="mt-3 text-xs text-muted-foreground print:text-[9.5pt] print:text-gray-700">
							{isEN ? "Full portfolio: " : "Portfólio completo: "}
							<a
								href="https://pavin.me"
								className="underline hover:text-primary print:text-black"
							>
								pavin.me
							</a>
						</p>
					</Section>

					{/* Education */}
					<Section title={isEN ? "Education" : "Formação"}>
						<div>
							<div className="flex flex-wrap items-baseline justify-between gap-x-4">
								<h3 className="font-semibold print:text-black">
									Descomplica Faculdade Digital
								</h3>
								<span className="text-xs text-muted-foreground print:text-[10pt] print:text-gray-700">
									{isEN ? "Apr 2024 — Oct 2026 (Expected)" : "Abr 2024 — Out 2026 (Previsto)"}
								</span>
							</div>
							<p className="text-sm text-foreground/85 print:text-[10.5pt] print:text-black">
								{isEN
									? "Associate's Degree in Systems Analysis and Development (CST — Análise e Desenvolvimento de Sistemas)."
									: "Curso Superior de Tecnologia (CST) em Análise e Desenvolvimento de Sistemas."}
							</p>
						</div>
					</Section>

					{/* Certifications */}
					<Section title={isEN ? "Certifications" : "Certificações"}>
						<p className="text-sm text-foreground/85 print:text-[10.5pt] print:text-black">
							Back-End Developer · Front-End Developer · Basic Front-End ·
							Programmer
						</p>
					</Section>
				</article>
			</div>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="cv-section mb-7 print:mb-5">
			<h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground print:mb-2 print:text-[10pt] print:text-black">
				{title}
			</h2>
			{children}
		</section>
	);
}

function SkillRow({ label, value }: { label: string; value: string }) {
	return (
		<>
			<dt className="font-semibold print:text-black">{label}</dt>
			<dd className="text-foreground/85 print:text-black">{value}</dd>
		</>
	);
}

function Job({
	company,
	companyMeta,
	title,
	period,
	location,
	bullets,
}: {
	company: string;
	companyMeta?: string;
	title: string;
	period: string;
	location: string;
	bullets: string[];
}) {
	return (
		<div className="cv-job">
			<div className="flex flex-wrap items-baseline justify-between gap-x-4">
				<h3 className="font-semibold print:text-black">
					{title} <span className="font-normal text-foreground/70 print:text-black">· {company}</span>
					{companyMeta && (
						<span className="font-normal text-muted-foreground print:text-gray-700">
							{" "}
							({companyMeta})
						</span>
					)}
				</h3>
				<span className="text-xs text-muted-foreground print:text-[10pt] print:text-gray-700">
					{period} · {location}
				</span>
			</div>
			<ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/85 print:text-[10.5pt] print:text-black">
				{bullets.map((b, i) => (
					<li key={i}>{b}</li>
				))}
			</ul>
		</div>
	);
}

function ProjectLine({
	title,
	url,
	description,
}: {
	title: string;
	url?: string;
	description: string;
}) {
	return (
		<li>
			<span className="font-semibold print:text-black">{title}</span>
			{url && (
				<>
					{" — "}
					<a
						href={`https://${url}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary underline-offset-2 hover:underline print:text-black"
					>
						{url}
					</a>
				</>
			)}
			<span className="text-foreground/85 print:text-black"> — {description}</span>
		</li>
	);
}
