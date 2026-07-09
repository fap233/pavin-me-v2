export type Project = {
	slug: string;
	title: string;
	/** Monospace overline shown above the title, e.g. "MARKETPLACE / 2026". */
	category: { en: string; pt: string };
	year: string;
	description: { en: string; pt: string };
	/** One hard number or outcome. Rendered as the card's highlight. */
	metric: { en: string; pt: string };
	tags: string[];
	/** Painted-hover accent. Two stops so the fill reads as a gradient. */
	accent: [string, string];
	liveUrl?: string;
	githubUrl?: string;
	imageUrl?: string;
	featured?: boolean;
};

export const projects: Project[] = [
	{
		slug: "medspace",
		title: "MEDSPACE",
		category: { en: "Marketplace · Healthcare", pt: "Marketplace · Saúde" },
		year: "2026",
		description: {
			en: "Marketplace connecting doctors to clinics renting out rooms, equipment and medical education. Advertiser dashboard, moderation queue, WhatsApp lead flow and paid-campaign instrumentation.",
			pt: "Marketplace que conecta médicos a clínicas que anunciam salas, aparelhos e educação médica. Painel do anunciante, fila de moderação, captação via WhatsApp e instrumentação de campanhas pagas.",
		},
		metric: {
			en: "MVP live in ~4 weeks · 105 automated tests · 13 security findings fixed",
			pt: "MVP no ar em ~4 semanas · 105 testes automatizados · 13 falhas de segurança corrigidas",
		},
		tags: ["Next.js 16", "React 19", "Prisma", "PostgreSQL", "Auth.js", "LGPD"],
		accent: ["#6366f1", "#ec4899"],
		liveUrl: "https://medspacebrasil.com.br",
		imageUrl: "/projects/medspace.png",
		featured: true,
	},
	{
		slug: "cleanapp",
		title: "Fresh Cleaning 4U",
		category: { en: "Operations SaaS", pt: "SaaS Operacional" },
		year: "2026",
		description: {
			en: "Operations platform for an Australian cleaning company: recurring-jobs engine, offline employee PWA, geofenced clock-in/out, GST-compliant PDF invoicing, SMS reminders and payroll.",
			pt: "Plataforma operacional para empresa de limpeza australiana: engine de jobs recorrentes, PWA offline do funcionário, ponto com geofence, faturas PDF com GST, lembretes SMS e folha de pagamento.",
		},
		metric: {
			en: "Geofenced time tracking · automated GST invoicing",
			pt: "Ponto com geofence · faturamento GST automatizado",
		},
		tags: ["Next.js 15", "TypeScript", "Prisma", "Twilio", "Playwright"],
		accent: ["#06b6d4", "#6366f1"],
		imageUrl: "/projects/cleanapp.png",
		featured: true,
	},
	{
		slug: "lorflux",
		title: "Lorflux",
		category: { en: "Streaming · PWA", pt: "Streaming · PWA" },
		year: "2026",
		description: {
			en: "Vertical streaming and cinematic-comics platform in production: Stripe subscriptions, adaptive HLS via Bunny.net, background transcoding queues, multi-language content and audio tracks.",
			pt: "Plataforma de streaming vertical e cinematic comics em produção: assinaturas Stripe, HLS adaptativo via Bunny.net, filas de transcodificação, conteúdo multi-idioma e múltiplas trilhas de áudio.",
		},
		metric: {
			en: "Adaptive HLS streaming · Stripe subscriptions · BullMQ queues",
			pt: "Streaming HLS adaptativo · assinaturas Stripe · filas BullMQ",
		},
		tags: ["React 19", "Node.js", "MongoDB", "Stripe", "Redis", "Bunny CDN"],
		accent: ["#f97316", "#ec4899"],
		liveUrl: "https://lorflux.com",
		imageUrl: "/projects/lorflux.png",
		featured: true,
	},
	{
		slug: "cidadetur",
		title: "CidadeTur",
		category: { en: "Legacy Modernization", pt: "Modernização de Legado" },
		year: "2026",
		description: {
			en: "Modernization of a legacy PHP/MySQL tourism portal: responsive redesign, real-time search, SEO, a read-only staging environment over the production database and fail-safe FTP deploy tooling.",
			pt: "Modernização de portal de turismo legado em PHP/MySQL: redesign responsivo, busca em tempo real, SEO, ambiente de homologação read-only sobre o banco de produção e deploy FTP com trava de segurança.",
		},
		metric: {
			en: "8 pages refactored into 23 reusable components · delivered in 8 of 12 contracted days",
			pt: "8 páginas refatoradas em 23 componentes reutilizáveis · entregue em 8 dos 12 dias contratados",
		},
		tags: ["PHP", "MySQL", "Docker", "SEO", "PowerShell"],
		accent: ["#22c55e", "#06b6d4"],
		liveUrl: "https://cidadetur.com.br",
	},
	{
		slug: "mercadolivre",
		title: "Mercado Livre Seller Dashboard",
		category: { en: "E-commerce · .NET", pt: "E-commerce · .NET" },
		year: "2025",
		description: {
			en: "Management dashboard for Mercado Livre sellers: OAuth 2.0 with background token refresh, listing sync, Buy Box competitor analysis and a 3-mode price-suggestion algorithm writing back through the official API.",
			pt: "Dashboard de gestão para vendedores do Mercado Livre: OAuth 2.0 com refresh automático em background, sincronização de anúncios, análise de concorrência (Buy Box) e algoritmo de sugestão de preço com 3 modos gravando via API oficial.",
		},
		metric: {
			en: "17 REST endpoints · Clean Architecture · delivered and accepted",
			pt: "17 endpoints REST · Clean Architecture · entregue e aceito",
		},
		tags: ["C#", ".NET 8", "Blazor WASM", "EF Core", "MySQL"],
		accent: ["#eab308", "#f97316"],
	},
	{
		slug: "crm-leiloes",
		title: "Auction CRM Automation",
		category: { en: "CRM · Automation", pt: "CRM · Automação" },
		year: "2026",
		description: {
			en: "Restructured a real-estate auction CRM on Zoho (11 modules into 3), built a daily Python capture robot on AWS Lambda and an n8n pipeline generating flyers and WhatsApp notifications.",
			pt: "Reestruturei o CRM de uma imobiliária de leilões no Zoho (11 módulos em 3), construí um robô diário de captura em Python na AWS Lambda e um pipeline n8n que gera flyers e notificações no WhatsApp.",
		},
		metric: {
			en: "2,051 properties migrated with zero failures · robot running daily in production",
			pt: "2.051 imóveis migrados com zero falhas · robô rodando diariamente em produção",
		},
		tags: ["Python", "AWS Lambda", "Zoho CRM", "n8n", "WhatsApp API"],
		accent: ["#8b5cf6", "#6366f1"],
	},
	{
		slug: "security",
		title: "Security Audit & Infrastructure",
		category: { en: "Security · Infra", pt: "Segurança · Infra" },
		year: "2026",
		description: {
			en: "White/black-box audit of a multi-tenant ERP (Supabase RLS across 14 tables) that surfaced tenant-breakout and privilege-escalation flaws. Separately: a 3-2-1 encrypted backup pipeline and ransomware incident forensics.",
			pt: "Auditoria white/black-box de um ERP multi-tenant (Supabase RLS em 14 tabelas) que revelou falhas de tenant-breakout e escalação de privilégio. Em outro projeto: pipeline de backup 3-2-1 criptografado e forense de incidente de ransomware.",
		},
		metric: {
			en: "7 MongoDB databases and 6.15M files backed up with validated restores at ~US$0.30/month",
			pt: "7 bancos MongoDB e 6,15M de arquivos com restauração validada a ~US$0,30/mês",
		},
		tags: ["Pentest", "Supabase RLS", "rclone", "Backblaze B2", "fail2ban"],
		accent: ["#ef4444", "#f97316"],
	},
	{
		slug: "macroluz",
		title: "Macroluz",
		category: { en: "Corporate · B2B", pt: "Corporativo · B2B" },
		year: "2025",
		description: {
			en: "Corporate site for a natural-lighting engineering company specializing in industrial roofing solutions. Product catalog and lead capture.",
			pt: "Site corporativo para engenharia de iluminação natural especializada em soluções para coberturas industriais. Catálogo de produtos e captura de leads.",
		},
		metric: {
			en: "Industrial catalog · lead capture funnel",
			pt: "Catálogo industrial · funil de captação de leads",
		},
		tags: ["Next.js", "TypeScript", "SEO"],
		accent: ["#f59e0b", "#eab308"],
		liveUrl: "https://macroluz.com.br",
		imageUrl: "/projects/macroluz.png",
	},
	{
		slug: "lastmile",
		title: "LastMile Brasil",
		category: { en: "Geolocation · B2B", pt: "Geolocalização · B2B" },
		year: "2025",
		description: {
			en: "Last-mile coverage platform for ISPs. Geographic precision with PostGIS, viability search and integrated checkout for lead-to-customer conversion.",
			pt: "Plataforma de cobertura de última milha para provedores de internet. Precisão geográfica com PostGIS, busca de viabilidade e checkout integrado para conversão de leads.",
		},
		metric: {
			en: "PostGIS viability search · integrated checkout",
			pt: "Busca de viabilidade com PostGIS · checkout integrado",
		},
		tags: ["Next.js", "PostGIS", "PostgreSQL"],
		accent: ["#14b8a6", "#22c55e"],
		liveUrl: "https://projeto-lastmile-brasil.vercel.app",
		imageUrl: "/projects/lastmile.png",
	},
	{
		slug: "silvalobo",
		title: "Rede Silva Lobo",
		category: { en: "Marketplace", pt: "Marketplace" },
		year: "2025",
		description: {
			en: "Two-sided marketplace connecting clients and home service professionals. Profile creation, request flow and subscription plans for providers.",
			pt: "Marketplace de dois lados conectando clientes a profissionais de serviços residenciais. Criação de perfil, fluxo de pedidos e planos por assinatura para prestadores.",
		},
		metric: {
			en: "Two-sided flow · subscription plans",
			pt: "Fluxo de dois lados · planos por assinatura",
		},
		tags: ["Next.js", "TypeScript", "Mobile-first"],
		accent: ["#3b82f6", "#8b5cf6"],
		liveUrl: "https://redesilvalobo.com.br",
		imageUrl: "/projects/silvalobo.png",
	},
	{
		slug: "meraki",
		title: "Meraki",
		category: { en: "Healthcare · Dashboard", pt: "Saúde · Dashboard" },
		year: "2026",
		description: {
			en: "Clinical management dashboard for healthcare professionals. Patients, scheduling, financials, technical archive, supervision and study tracking in one place.",
			pt: "Dashboard de gestão clínica para profissionais de saúde. Pacientes, agenda, financeiro, acervo técnico, supervisão e estudos integrados em um só lugar.",
		},
		metric: {
			en: "Supabase RLS · Realtime supervision · multi-tenant ready",
			pt: "Supabase RLS · supervisão em Realtime · pronto para multi-tenant",
		},
		tags: ["Next.js 15", "Supabase", "TypeScript", "TanStack Query"],
		accent: ["#a855f7", "#ec4899"],
		liveUrl: "https://meraki-app-six.vercel.app",
		imageUrl: "/projects/meraki.png",
	},
	{
		slug: "veritas",
		title: "Veritas Task Manager",
		category: { en: "Open Source · Go", pt: "Open Source · Go" },
		year: "2025",
		description: {
			en: "High-performance Kanban board with a Go backend and React frontend. Docker containerization, clean architecture and CI/CD pipelines.",
			pt: "Sistema Kanban de alta performance com backend em Go e frontend em React. Conteinerização com Docker, arquitetura limpa e pipelines CI/CD.",
		},
		metric: {
			en: "Go concurrency · clean architecture · CI/CD",
			pt: "Concorrência em Go · arquitetura limpa · CI/CD",
		},
		tags: ["Go", "React", "PostgreSQL", "Docker"],
		accent: ["#0ea5e9", "#14b8a6"],
		githubUrl: "https://github.com/fap233/desafio-fullstack-veritas",
	},
];
