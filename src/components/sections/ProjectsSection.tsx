"use client";

import ProjectCard from "./ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";

export function ProjectsSection() {
	const { language, t } = useLanguage();

	const projects = [
		{
			title: "MedSpace Brasil",
			description:
				language === "en"
					? "B2B marketplace connecting clinics and medical equipment suppliers. Listings, account management and contact flow for healthcare professionals."
					: "Marketplace B2B conectando clínicas e fornecedores de equipamentos médicos. Listagens, gestão de conta e fluxo de contato para profissionais de saúde.",
			tags: ["Next.js", "TypeScript", "Tailwind", "Marketplace"],
			liveUrl: "https://medspacebrasil.com.br",
			imageUrl: "/projects/medspace.png",
			featured: true,
		},
		{
			title: "Fresh Cleaning 4U",
			description:
				language === "en"
					? "Operations platform for an Australian cleaning company. Client management, calendar, employees, invoices, payments, SMS reminders and ABN-compliant PDF invoicing."
					: "Plataforma operacional para empresa de limpeza australiana. Gestão de clientes, calendário, funcionários, faturas, pagamentos, lembretes por SMS e emissão de notas em PDF compatível com ABN.",
			tags: ["Next.js", "TypeScript", "SaaS", "Operations"],
			imageUrl: "/projects/cleanapp.png",
			featured: true,
		},
		{
			title: "Macroluz",
			description:
				language === "en"
					? "Corporate site for a natural lighting engineering company specializing in industrial roofing solutions. Product catalog and lead capture."
					: "Site corporativo para engenharia de iluminação natural especializada em soluções para coberturas industriais. Catálogo de produtos e captura de leads.",
			tags: ["Next.js", "TypeScript", "Corporate", "B2B"],
			liveUrl: "https://macroluz.com.br",
			imageUrl: "/projects/macroluz.png",
			featured: true,
		},
		{
			title: "ARQforyou",
			description:
				language === "en"
					? "Platform connecting architects and clients across Brazil. Professional profiles, subscription plans and project briefing flow."
					: "Plataforma que conecta arquitetos e clientes em todo o Brasil. Perfis profissionais, planos por assinatura e fluxo de briefing de projetos.",
			tags: ["React", "TypeScript", "Platform", "Subscriptions"],
			liveUrl: "https://arqforyou.lovable.app",
			imageUrl: "/projects/arqforyou.png",
			featured: false,
		},
		{
			title: "Meraki",
			description:
				language === "en"
					? "Clinical management dashboard for healthcare professionals. Patients, scheduling, financials, technical archive, supervision and study tracking in one place."
					: "Dashboard de gestão clínica para profissionais de saúde. Pacientes, agenda, financeiro, acervo técnico, supervisão e estudos integrados em um só lugar.",
			tags: ["React", "TypeScript", "Healthcare", "Dashboard"],
			liveUrl: "https://meraki-app-six.vercel.app",
			imageUrl: "/projects/meraki.png",
			featured: false,
		},
		{
			title: "LastMile Brasil",
			description:
				language === "en"
					? "Last-mile coverage platform for ISPs. Geographic precision with PostGIS, viability search and integrated checkout for lead-to-customer conversion."
					: "Plataforma de cobertura de última milha para provedores de internet. Precisão geográfica com PostGIS, busca de viabilidade e checkout integrado para conversão de leads.",
			tags: ["Next.js", "PostGIS", "Geolocation", "B2B"],
			liveUrl: "https://projeto-lastmile-brasil.vercel.app",
			imageUrl: "/projects/lastmile.png",
			featured: false,
		},
		{
			title: "Rede Silva Lobo",
			description:
				language === "en"
					? "Two-sided marketplace connecting clients and home service professionals. Profile creation, request flow and subscription plans for providers."
					: "Marketplace de dois lados conectando clientes a profissionais de serviços residenciais. Criação de perfil, fluxo de pedidos e planos por assinatura para prestadores.",
			tags: ["Next.js", "TypeScript", "Marketplace", "Mobile-first"],
			liveUrl: "https://redesilvalobo.com.br",
			imageUrl: "/projects/silvalobo.png",
			featured: false,
		},
		{
			title: "Lorflux",
			description:
				language === "en"
					? "PWA for cinematic comics and vertical video streaming. Manga reader, anime episodes via Bunny CDN, mobile-first with offline support."
					: "PWA para cinematic comics e streaming de vídeo vertical. Leitor de mangás, episódios de anime via Bunny CDN, mobile-first com suporte offline.",
			tags: ["PWA", "React", "Bunny CDN", "Streaming"],
			liveUrl: "https://lorflux.com",
			imageUrl: "/projects/lorflux.png",
			featured: false,
		},
		{
			title: "Veritas Task Manager",
			description:
				language === "en"
					? "High-performance Kanban board with Go backend and React frontend. Docker containerization, clean architecture and CI/CD pipelines."
					: "Sistema Kanban de alta performance com backend em Go e frontend em React. Conteinerização com Docker, arquitetura limpa e pipelines CI/CD.",
			tags: ["Go", "React", "PostgreSQL", "Docker"],
			githubUrl: "https://github.com/fap233/desafio-fullstack-veritas",
			featured: false,
		},
		{
			title: language === "en" ? "Scheduling API" : "Agendamento API (.NET)",
			description:
				language === "en"
					? "Scalable REST API built with .NET 9 and Clean Architecture principles. Complex booking logic with Entity Framework Core."
					: "API RESTful escalável com .NET 9 e princípios de Clean Architecture. Lógica de agendamento complexa com Entity Framework Core.",
			tags: ["C#", ".NET 9", "SQL Server", "EF Core"],
			githubUrl: "https://github.com/fap233/schedulingapi",
			featured: false,
		},
	];

	return (
		<section id="projects" className="py-20 bg-secondary/20">
			<div className="container mx-auto px-4">
				<div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
					<h2 className="text-3xl font-bold">{t.projects.title}</h2>
					<p className="text-muted-foreground">{t.projects.subtitle}</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
					{projects.map((project, index) => (
						<ProjectCard key={index} {...project} />
					))}
				</div>
			</div>
		</section>
	);
}
