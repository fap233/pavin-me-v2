"use client";

import {
	Mail,
	Github,
	Linkedin,
	MapPin,
	Phone,
	Globe,
	Download,
	Printer,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type SkillRowData = { label: string; value: string };
type JobData = {
	company: string;
	companyMeta?: string;
	title: string;
	period: string;
	location: string;
	bullets: string[];
};
type ProjectData = { title: string; url?: string; description: string };

type CVContent = {
	role: string;
	back: string;
	download: string;
	print: string;
	pdfHref: string;
	openToRemote: string;
	sections: {
		summary: string;
		skills: string;
		experience: string;
		projects: string;
		education: string;
		certifications: string;
	};
	summary: string;
	skills: SkillRowData[];
	jobs: JobData[];
	projects: ProjectData[];
	projectsFootnote: string;
	educationSchool: string;
	educationPeriod: string;
	educationDegree: string;
	certifications: string;
};

const cv: Record<"en" | "pt", CVContent> = {
	en: {
		role: "Software Engineer · Full Stack (TypeScript, React/Next.js, Node.js, .NET, Go)",
		back: "Back to portfolio",
		download: "Download PDF",
		print: "Print",
		pdfHref: "/cv/Fellipe-Pavin-CV-EN.pdf",
		openToRemote: "Open to Remote",
		sections: {
			summary: "Summary",
			skills: "Technical Skills",
			experience: "Experience",
			projects: "Selected Projects",
			education: "Education",
			certifications: "Certifications",
		},
		summary:
			"Full Stack Software Engineer with 9+ years of production experience owning the entire lifecycle — architecture, code, tests, CI/CD, deployment, monitoring, incident response and support. Founded and scaled a multi-tenant SaaS from zero to 10,000+ paying recurring users at 99.9% uptime as a single-person tech team. Since 2024, working as an independent engineer for B2B clients with 20+ engagements delivered across healthcare, real estate, tourism, e-commerce, entertainment and legal — marketplaces, SaaS platforms, dashboards, CRM automation, AI agents, security audits and production infrastructure. Core stack: TypeScript, React/Next.js and Node.js, with shipped production work in C#/.NET, PHP/Laravel and Python. Fluent English, remote-async by default.",
		skills: [
			{
				label: "Languages",
				value:
					"TypeScript / JavaScript, C# (.NET), PHP, Python, Go, SQL, Bash / PowerShell",
			},
			{
				label: "Frontend",
				value:
					"React 18/19, Next.js 14–16 (App Router, Server Actions), Blazor WebAssembly, Vue 3, Tailwind CSS, shadcn/ui, Vite, PWA / offline-first",
			},
			{
				label: "Backend",
				value:
					"Node.js (Express), Laravel, ASP.NET Core (EF Core), Flask / FastAPI, REST APIs, Supabase (Auth, RLS, Realtime), background jobs (BullMQ, cron, APScheduler)",
			},
			{
				label: "Databases",
				value:
					"PostgreSQL (PostGIS, RLS), MySQL / MariaDB, SQL Server, MongoDB, Redis, SQLite · Prisma, Drizzle, EF Core, Mongoose",
			},
			{
				label: "DevOps & Infra",
				value:
					"Docker, GitHub Actions (CI/CD), Linux (Ubuntu / Debian / Arch), Nginx, Cloudflare (WAF, CDN, APO), Vercel, AWS Lambda, DigitalOcean, Backblaze B2, 3-2-1 encrypted backups",
			},
			{
				label: "Integrations",
				value:
					"Stripe, Mercado Pago, Twilio, Zoho CRM, Mercado Livre API, WhatsApp (Evolution API), Telegram, Bunny.net (video/CDN), Google (GA4, Ads, Search Console), SMTP / Resend",
			},
			{
				label: "AI & Automation",
				value:
					"Claude API, OpenAI GPT, Gemini, AI agents, n8n, Chrome Extensions (MV3), web scraping (Playwright, BeautifulSoup)",
			},
			{
				label: "Security",
				value:
					"White/black-box audits, Supabase RLS review, LGPD compliance, Linux hardening, incident response & forensics",
			},
			{
				label: "Data & BI",
				value: "Power BI (dashboards, on-premises Gateway)",
			},
			{
				label: "Practices",
				value:
					"Clean Architecture, SOLID, TDD (Vitest, Playwright, RSpec), Code Review, Agile / Scrum",
			},
			{
				label: "Languages (spoken)",
				value: "Portuguese (Native), English (Fluent)",
			},
		],
		jobs: [
			{
				company: "Self-Employed",
				title: "Independent Software Engineer (Contract)",
				period: "January 2024 — Present",
				location: "Fortaleza, Brazil · Remote",
				bullets: [
					"Delivered 20+ B2B engagements end-to-end — scoping, architecture, implementation, tests, deploy and support — across healthcare, real estate, tourism, e-commerce, entertainment and legal verticals, as sole engineer from first call to production.",
					"Built and operate MEDSPACE (medspacebrasil.com.br), a marketplace connecting doctors to clinics: Next.js 16, React 19, Prisma/PostgreSQL and Auth.js — MVP live in ~4 weeks, evolved in paid cycles with multi-advertiser accounts (CPF/CNPJ validation), a medical-education module, end-to-end LGPD compliance, 105 automated tests (unit/integration/E2E) and Google Ads/Meta conversion instrumentation.",
					"Ran a self-initiated security audit on that same production platform and fixed all 13 findings (1 critical, 3 high — moderation bypass, fail-open rate limiting, login timing oracle), shipping CSP/HSTS headers and fail-closed rate limiting (Upstash Redis).",
					"Modernized a legacy PHP/MySQL tourism portal: responsive redesign of 8 pages refactored into 23 reusable components, real-time search and SEO — accepted and paid in 8 days against a 12-day contract, including a read-only staging environment running over the production database and fail-safe automated FTP deploy tooling.",
					"Developed a Mercado Livre seller dashboard in .NET 8 (ASP.NET Core) + Blazor WebAssembly + EF Core/MySQL: OAuth 2.0 with automatic background token refresh, listing sync with competitor (Buy Box) analysis, a 3-mode price-suggestion algorithm writing back through the official API, and 17 REST endpoints.",
					"Automated a real-estate auction CRM on Zoho: consolidated 11 modules into 3, migrated 2,051 properties and 49 deduplicated clients with zero failures, and operate a daily Python capture robot (AWS Lambda + n8n) generating flyers and WhatsApp notifications in production.",
					"Security & infrastructure: white/black-box audit of a multi-tenant ERP SaaS (Supabase RLS across 14 tables) uncovering tenant-breakout and privilege-escalation vulnerabilities, delivered with a prioritized SQL fix plan; designed a 3-2-1 client-side-encrypted backup pipeline (rclone crypt + Backblaze B2) covering 7 MongoDB databases and 6.15M files with bit-for-bit validated restores at ~US$0.30/month; led ransomware incident forensics and server hardening (fail2ban, service isolation).",
					"Built and run Lorflux (lorflux.com), a vertical streaming and cinematic-comics PWA in production: React 19, Node.js/Express, MongoDB, Stripe subscriptions, BullMQ/Redis job queues, Bunny.net adaptive HLS streaming, multi-language content and multiple audio tracks.",
					"AI & automation portfolio: multi-provider AI agents (Claude, GPT-4o, Gemini), Chrome MV3 extensions, Python desktop monitors, a Flask/Telethon Telegram campaign panel and Power BI dashboards with an on-premises Gateway to AWS RDS PostgreSQL.",
					"Currently delivering: a real-time sports-odds API with arbitrage detection (Python, PostgreSQL, Redis), a React Native key-custody app for a real-estate holding, an AI WhatsApp SDR funnel (GPT-4o + n8n + Evolution API) and technical SEO consulting (WordPress, Search Console).",
				],
			},
			{
				company: "Crescigram",
				companyMeta: "SaaS Platform",
				title: "Founder · Tech Lead · Full Stack Engineer",
				period: "January 2018 — December 2023 (6 years)",
				location: "Fortaleza, Brazil",
				bullets: [
					"Founded, launched and scaled a multi-tenant SaaS platform from zero to 10,000+ paying recurring users — full-cycle ownership across engineering, product, billing, customer support and infrastructure as a single-person tech team.",
					"Sustained 99.9% production uptime on a PHP/Laravel + MySQL monolith over 6 years; ran an on-call rotation of one, from incident detection to root-cause fix.",
					"Reduced legacy SQL query response times by ~40% via targeted refactoring and indexing, eliminating bottlenecks during peak-traffic windows.",
					"Operated production infrastructure end-to-end: Cloudflare edge (WAF, DDoS mitigation, CDN, DNS, SSL), Nginx reverse proxy, Docker-containerized Linux servers (Ubuntu/Debian) and automated CI/CD deployment pipelines.",
					"Authored Shell automation that eliminated hundreds of hours of manual operational toil per year and sustained the unit-economics of running engineering + ops solo.",
					"Drove the full product lifecycle — discovery, scope, build, ship, support, retention — translating user feedback into roadmap and shipped features without a PM in the loop.",
				],
			},
		],
		projects: [
			{
				title: "MEDSPACE",
				url: "medspacebrasil.com.br",
				description:
					"Marketplace connecting doctors to clinics (rooms, equipment, medical education). Next.js 16, Prisma/PostgreSQL — in production with LGPD compliance and 105 automated tests.",
			},
			{
				title: "Fresh Cleaning 4U",
				description:
					"Operations SaaS for an Australian cleaning company — recurring-jobs engine, offline employee PWA, geofenced clock-in/out, GST-compliant PDF invoicing, Twilio SMS, payroll (Next.js 15, Prisma, PostgreSQL).",
			},
			{
				title: "Lorflux",
				url: "lorflux.com",
				description:
					"Vertical streaming & cinematic comics PWA — Stripe subscriptions, Bunny.net HLS, BullMQ/Redis, multi-audio dubbing (React 19, Node.js, MongoDB).",
			},
			{
				title: "CidadeTur",
				url: "cidadetur.com.br",
				description:
					"Legacy tourism portal modernization — 8 pages redesigned into 23 reusable PHP components, SEO, real-time search; delivered in 8 of 12 contracted days.",
			},
			{
				title: "Mercado Livre Seller Dashboard",
				description:
					".NET 8 + Blazor WebAssembly + EF Core — OAuth 2.0 auto-refresh, competitor analysis, 3-mode price-suggestion algorithm, 17 REST endpoints.",
			},
			{
				title: "Auction Real-Estate CRM Automation",
				description:
					"Zoho CRM restructure (11 → 3 modules) + Python/AWS Lambda capture robot + n8n WhatsApp flyers — 2,051 properties migrated with zero failures.",
			},
			{
				title: "Multi-tenant ERP Security Audit",
				description:
					"White/black-box pentest of a SaaS ERP (Supabase RLS, 14 tables) — found tenant-breakout and privilege-escalation flaws; prioritized SQL remediation plan.",
			},
			{
				title: "VPS Backup & Hardening",
				description:
					"3-2-1 client-side-encrypted backup pipeline (rclone crypt + Backblaze B2, 7 MongoDB DBs, 6.15M files) with validated restores; ransomware forensics and hardening.",
			},
			{
				title: "Macroluz",
				url: "macroluz.com.br",
				description:
					"Corporate site for a natural-lighting engineering firm — industrial product catalog and lead capture (Next.js).",
			},
			{
				title: "LastMile Brasil",
				url: "projeto-lastmile-brasil.vercel.app",
				description:
					"Last-mile coverage platform for ISPs — PostGIS geographic viability search and integrated checkout.",
			},
			{
				title: "Veritas Task Manager",
				url: "github.com/fap233/desafio-fullstack-veritas",
				description:
					"Full-stack Kanban — Go backend, React frontend, Docker, CI/CD.",
			},
		],
		projectsFootnote: "Full portfolio: ",
		educationSchool: "Descomplica Faculdade Digital",
		educationPeriod: "Apr 2024 — Oct 2026 (Expected)",
		educationDegree:
			"Associate's Degree in Systems Analysis and Development (CST — Análise e Desenvolvimento de Sistemas).",
		certifications:
			"Back-End Developer · Front-End Developer · Basic Front-End · Programmer",
	},
	pt: {
		role: "Engenheiro de Software · Full Stack (TypeScript, React/Next.js, Node.js, .NET, Go)",
		back: "Voltar ao portfólio",
		download: "Baixar PDF",
		print: "Imprimir",
		pdfHref: "/cv/Fellipe-Pavin-CV-PT.pdf",
		openToRemote: "Aberto a Remoto",
		sections: {
			summary: "Resumo",
			skills: "Habilidades Técnicas",
			experience: "Experiência Profissional",
			projects: "Projetos Selecionados",
			education: "Formação",
			certifications: "Certificações",
		},
		summary:
			"Engenheiro de Software Full Stack com 9+ anos de experiência em produção conduzindo o ciclo completo — arquitetura, código, testes, CI/CD, deploy, monitoramento, resposta a incidentes e suporte. Fundei e escalei uma plataforma SaaS multi-tenant de zero a 10.000+ usuários recorrentes pagantes com 99,9% de uptime como time tech de uma pessoa só. Desde 2024 atuo como engenheiro independente para clientes B2B, com 20+ projetos entregues nas verticais de saúde, imobiliário, turismo, e-commerce, entretenimento e jurídico — marketplaces, plataformas SaaS, dashboards, automação de CRM, agentes de IA, auditorias de segurança e infraestrutura de produção. Stack principal: TypeScript, React/Next.js e Node.js, com entregas em produção também em C#/.NET, PHP/Laravel e Python. Inglês fluente, remoto-async por padrão.",
		skills: [
			{
				label: "Linguagens",
				value:
					"TypeScript / JavaScript, C# (.NET), PHP, Python, Go, SQL, Bash / PowerShell",
			},
			{
				label: "Frontend",
				value:
					"React 18/19, Next.js 14–16 (App Router, Server Actions), Blazor WebAssembly, Vue 3, Tailwind CSS, shadcn/ui, Vite, PWA / offline-first",
			},
			{
				label: "Backend",
				value:
					"Node.js (Express), Laravel, ASP.NET Core (EF Core), Flask / FastAPI, APIs REST, Supabase (Auth, RLS, Realtime), jobs em background (BullMQ, cron, APScheduler)",
			},
			{
				label: "Banco de Dados",
				value:
					"PostgreSQL (PostGIS, RLS), MySQL / MariaDB, SQL Server, MongoDB, Redis, SQLite · Prisma, Drizzle, EF Core, Mongoose",
			},
			{
				label: "DevOps & Infra",
				value:
					"Docker, GitHub Actions (CI/CD), Linux (Ubuntu / Debian / Arch), Nginx, Cloudflare (WAF, CDN, APO), Vercel, AWS Lambda, DigitalOcean, Backblaze B2, backups 3-2-1 criptografados",
			},
			{
				label: "Integrações",
				value:
					"Stripe, Mercado Pago, Twilio, Zoho CRM, API Mercado Livre, WhatsApp (Evolution API), Telegram, Bunny.net (vídeo/CDN), Google (GA4, Ads, Search Console), SMTP / Resend",
			},
			{
				label: "IA & Automação",
				value:
					"Claude API, OpenAI GPT, Gemini, agentes de IA, n8n, Extensões Chrome (MV3), web scraping (Playwright, BeautifulSoup)",
			},
			{
				label: "Segurança",
				value:
					"Auditorias white/black-box, revisão de RLS (Supabase), conformidade LGPD, hardening Linux, resposta a incidentes e forense",
			},
			{
				label: "Dados & BI",
				value: "Power BI (dashboards, Gateway on-premises)",
			},
			{
				label: "Práticas",
				value:
					"Clean Architecture, SOLID, TDD (Vitest, Playwright, RSpec), Code Review, Agile / Scrum",
			},
			{
				label: "Idiomas",
				value: "Português (Nativo), Inglês (Fluente)",
			},
		],
		jobs: [
			{
				company: "Autônomo",
				title: "Engenheiro de Software Independente (Contratos)",
				period: "Janeiro 2024 — Atual",
				location: "Fortaleza, Brasil · Remoto",
				bullets: [
					"Entreguei 20+ projetos B2B ponta a ponta — escopo, arquitetura, implementação, testes, deploy e suporte — nas verticais de saúde, imobiliário, turismo, e-commerce, entretenimento e jurídico, como único engenheiro da primeira call até a produção.",
					"Construí e mantenho o MEDSPACE (medspacebrasil.com.br), marketplace que conecta médicos a clínicas: Next.js 16, React 19, Prisma/PostgreSQL e Auth.js — MVP no ar em ~4 semanas, evoluído em ciclos pagos com contas multi-anunciante (validação CPF/CNPJ), módulo de educação médica, conformidade LGPD ponta a ponta, 105 testes automatizados (unit/integração/E2E) e instrumentação de conversão Google Ads/Meta.",
					"Conduzi auditoria de segurança por iniciativa própria nessa mesma plataforma em produção e corrigi os 13 achados (1 crítico, 3 altos — bypass de moderação, rate limiting fail-open, timing oracle no login), entregando headers CSP/HSTS e rate limiting fail-closed (Upstash Redis).",
					"Modernizei um portal de turismo legado em PHP/MySQL: redesign responsivo de 8 páginas refatoradas em 23 componentes reutilizáveis, busca em tempo real e SEO — entrega aceita e paga em 8 dias num contrato de 12, incluindo ambiente de homologação read-only sobre o banco de produção e deploy FTP automatizado com trava de segurança.",
					"Desenvolvi dashboard de gestão para vendedores do Mercado Livre em .NET 8 (ASP.NET Core) + Blazor WebAssembly + EF Core/MySQL: OAuth 2.0 com refresh automático em background, sincronização de anúncios com análise de concorrência (Buy Box), algoritmo de sugestão de preço com 3 modos gravando via API oficial e 17 endpoints REST.",
					"Automatizei o CRM de uma imobiliária de leilões no Zoho: consolidei 11 módulos em 3, migrei 2.051 imóveis e 49 clientes deduplicados com zero falhas, e opero robô diário de captura em Python (AWS Lambda + n8n) gerando flyers e notificações WhatsApp em produção.",
					"Segurança & infraestrutura: auditoria white/black-box de ERP SaaS multi-tenant (Supabase RLS em 14 tabelas) revelando falhas de tenant-breakout e escalação de privilégio, entregue com plano de correção SQL priorizado; pipeline de backup 3-2-1 com criptografia client-side (rclone crypt + Backblaze B2) cobrindo 7 bancos MongoDB e 6,15 milhões de arquivos, restauração validada bit a bit a ~US$0,30/mês; conduzi forense de incidente de ransomware e hardening de servidor (fail2ban, isolamento de serviços).",
					"Construí e opero o Lorflux (lorflux.com), PWA de streaming vertical e cinematic comics em produção: React 19, Node.js/Express, MongoDB, assinaturas Stripe, filas BullMQ/Redis, streaming HLS adaptativo via Bunny.net, conteúdo multi-idioma e múltiplas trilhas de áudio.",
					"Portfólio de IA & automação: agentes de IA multi-provider (Claude, GPT-4o, Gemini), extensões Chrome MV3, monitores desktop em Python, painel de campanhas Telegram (Flask/Telethon) e dashboards Power BI com Gateway on-premises para AWS RDS PostgreSQL.",
					"Em entrega atualmente: API de odds esportivas em tempo real com detecção de arbitragem (Python, PostgreSQL, Redis), app React Native de custódia de chaves para holding imobiliária, funil SDR de IA no WhatsApp (GPT-4o + n8n + Evolution API) e consultoria de SEO técnico (WordPress, Search Console).",
				],
			},
			{
				company: "Crescigram",
				companyMeta: "Plataforma SaaS",
				title: "Fundador · Tech Lead · Engenheiro Full Stack",
				period: "Janeiro 2018 — Dezembro 2023 (6 anos)",
				location: "Fortaleza, Brasil",
				bullets: [
					"Fundei, lancei e escalei uma plataforma SaaS multi-tenant de zero a 10.000+ usuários recorrentes pagantes — ownership full-cycle em engenharia, produto, billing, suporte e infraestrutura como time tech de uma pessoa só.",
					"Sustentei 99,9% de uptime em produção num monolito PHP/Laravel + MySQL ao longo de 6 anos; rodei plantão on-call de uma pessoa só, da detecção do incidente até a correção da raiz.",
					"Reduzi tempo de resposta de queries SQL legadas em ~40% via refatoração e indexação direcionadas, eliminando gargalos em picos de tráfego.",
					"Operei infraestrutura de produção ponta a ponta: borda Cloudflare (WAF, mitigação de DDoS, CDN, DNS, SSL), Nginx reverse proxy, servidores Linux (Ubuntu/Debian) containerizados com Docker e pipelines CI/CD automatizadas.",
					"Desenvolvi automação em Shell que eliminou centenas de horas de trabalho manual por ano e sustentou a unit-economics de rodar engenharia + ops sozinho.",
					"Conduzi o ciclo completo de produto — discovery, escopo, build, ship, suporte, retenção — traduzindo feedback de usuário em roadmap e features entregues sem um PM no loop.",
				],
			},
		],
		projects: [
			{
				title: "MEDSPACE",
				url: "medspacebrasil.com.br",
				description:
					"Marketplace que conecta médicos a clínicas (salas, aparelhos, educação médica). Next.js 16, Prisma/PostgreSQL — em produção com conformidade LGPD e 105 testes automatizados.",
			},
			{
				title: "Fresh Cleaning 4U",
				description:
					"SaaS operacional para empresa de limpeza australiana — engine de jobs recorrentes, PWA offline do funcionário, ponto com geofence, faturas PDF com GST, SMS Twilio, folha de pagamento (Next.js 15, Prisma, PostgreSQL).",
			},
			{
				title: "Lorflux",
				url: "lorflux.com",
				description:
					"PWA de streaming vertical e cinematic comics — assinaturas Stripe, HLS Bunny.net, BullMQ/Redis, dublagens multi-áudio (React 19, Node.js, MongoDB).",
			},
			{
				title: "CidadeTur",
				url: "cidadetur.com.br",
				description:
					"Modernização de portal de turismo legado — 8 páginas redesenhadas em 23 componentes PHP reutilizáveis, SEO, busca em tempo real; entregue em 8 dos 12 dias contratados.",
			},
			{
				title: "Dashboard de Vendas Mercado Livre",
				description:
					".NET 8 + Blazor WebAssembly + EF Core — OAuth 2.0 com refresh automático, análise de concorrência, algoritmo de sugestão de preço com 3 modos, 17 endpoints REST.",
			},
			{
				title: "Automação CRM Imobiliária de Leilões",
				description:
					"Reestruturação do Zoho CRM (11 → 3 módulos) + robô de captura Python/AWS Lambda + flyers WhatsApp via n8n — 2.051 imóveis migrados com zero falhas.",
			},
			{
				title: "Auditoria de Segurança em ERP Multi-tenant",
				description:
					"Pentest white/black-box de ERP SaaS (Supabase RLS, 14 tabelas) — falhas de tenant-breakout e escalação de privilégio encontradas; plano de correção SQL priorizado.",
			},
			{
				title: "Backup & Hardening de VPS",
				description:
					"Pipeline de backup 3-2-1 com criptografia client-side (rclone crypt + Backblaze B2, 7 bancos MongoDB, 6,15M de arquivos) com restauração validada; forense de ransomware e hardening.",
			},
			{
				title: "Macroluz",
				url: "macroluz.com.br",
				description:
					"Site corporativo de engenharia de iluminação natural — catálogo industrial e captura de leads (Next.js).",
			},
			{
				title: "LastMile Brasil",
				url: "projeto-lastmile-brasil.vercel.app",
				description:
					"Plataforma de cobertura de última milha para provedores — busca geográfica de viabilidade com PostGIS e checkout integrado.",
			},
			{
				title: "Veritas Task Manager",
				url: "github.com/fap233/desafio-fullstack-veritas",
				description:
					"Kanban full-stack — backend Go, frontend React, Docker, CI/CD.",
			},
		],
		projectsFootnote: "Portfólio completo: ",
		educationSchool: "Descomplica Faculdade Digital",
		educationPeriod: "Abr 2024 — Out 2026 (Previsto)",
		educationDegree:
			"Curso Superior de Tecnologia (CST) em Análise e Desenvolvimento de Sistemas.",
		certifications:
			"Back-End Developer · Front-End Developer · Basic Front-End · Programmer",
	},
};

export default function CVPage() {
	const { language } = useLanguage();
	const c = cv[language];

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
							{c.back}
						</Link>
					</Button>
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="sm" onClick={handlePrint} className="gap-2">
							<Printer className="h-4 w-4" />
							{c.print}
						</Button>
						<Button size="sm" asChild className="gap-2">
							<a href={c.pdfHref} download>
								<Download className="h-4 w-4" />
								{c.download}
							</a>
						</Button>
					</div>
				</div>

				<article className="cv-document rounded-lg border bg-card p-10 shadow-sm print:rounded-none print:border-none print:bg-white print:p-0 print:shadow-none">
					{/* Header */}
					<header className="cv-header mb-7 border-b pb-5 print:border-b-2 print:border-black">
						<h1 className="text-4xl font-bold tracking-tight print:text-3xl print:text-black">
							Fellipe Pavin
						</h1>
						<p className="mt-1 text-lg text-muted-foreground print:text-base print:text-gray-700">
							{c.role}
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
								Fortaleza, Ceará, Brazil · {c.openToRemote}
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
					<Section title={c.sections.summary}>
						<p className="text-sm leading-relaxed text-foreground/90 print:text-[11pt] print:text-black">
							{c.summary}
						</p>
					</Section>

					{/* Skills */}
					<Section title={c.sections.skills}>
						<dl className="grid grid-cols-1 gap-y-1.5 text-sm sm:grid-cols-[max-content_1fr] sm:gap-x-6 print:text-[10.5pt] print:text-black">
							{c.skills.map((s) => (
								<SkillRow key={s.label} label={s.label} value={s.value} />
							))}
						</dl>
					</Section>

					{/* Experience */}
					<Section title={c.sections.experience}>
						<div className="space-y-5">
							{c.jobs.map((job) => (
								<Job key={job.company} {...job} />
							))}
						</div>
					</Section>

					{/* Selected Projects */}
					<Section title={c.sections.projects}>
						<ul className="space-y-2 text-sm print:text-[10.5pt] print:text-black">
							{c.projects.map((p) => (
								<ProjectLine key={p.title} {...p} />
							))}
						</ul>
						<p className="mt-3 text-xs text-muted-foreground print:text-[9.5pt] print:text-gray-700">
							{c.projectsFootnote}
							<a
								href="https://pavin.me"
								className="underline hover:text-primary print:text-black"
							>
								pavin.me
							</a>
						</p>
					</Section>

					{/* Education */}
					<Section title={c.sections.education}>
						<div>
							<div className="flex flex-wrap items-baseline justify-between gap-x-4">
								<h3 className="font-semibold print:text-black">
									{c.educationSchool}
								</h3>
								<span className="text-xs text-muted-foreground print:text-[10pt] print:text-gray-700">
									{c.educationPeriod}
								</span>
							</div>
							<p className="text-sm text-foreground/85 print:text-[10.5pt] print:text-black">
								{c.educationDegree}
							</p>
						</div>
					</Section>

					{/* Certifications */}
					<Section title={c.sections.certifications}>
						<p className="text-sm text-foreground/85 print:text-[10.5pt] print:text-black">
							{c.certifications}
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
}: JobData) {
	return (
		<div className="cv-job">
			<div className="flex flex-wrap items-baseline justify-between gap-x-4">
				<h3 className="font-semibold print:text-black">
					{title}{" "}
					<span className="font-normal text-foreground/70 print:text-black">
						· {company}
					</span>
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

function ProjectLine({ title, url, description }: ProjectData) {
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
			<span className="text-foreground/85 print:text-black">
				{" "}
				— {description}
			</span>
		</li>
	);
}
