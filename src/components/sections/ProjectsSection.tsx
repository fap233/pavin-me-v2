"use client";

import ProjectCard from "./ProjectCard"; // Import default (sem chaves)
import { useLanguage } from "@/contexts/LanguageContext";

export function ProjectsSection() {
	const { language, t } = useLanguage();

	const projects = [
		{
			title: "Veritas Task Manager",
			description:
				language === "en"
					? "High-performance Kanban board with Go backend and React frontend. Features Docker containerization, clean architecture, and CI/CD pipelines."
					: "Sistema de gestão de tarefas Full Stack. Backend robusto, Frontend moderno e infraestrutura configurada com Docker.",
			tags: ["Go", "React", "PostgreSQL", "Docker"],
			githubUrl: "https://github.com/fap233/desafio-fullstack-veritas",
			liveUrl: "#",
			featured: true,
		},
		{
			title: language === "en" ? "Scheduling API" : "Agendamento API (.NET)",
			description:
				language === "en"
					? "Scalable REST API built with .NET 9 and Clean Architecture principles. Handles complex booking logic with Entity Framework Core."
					: "API RESTful desenvolvida com C# e .NET 9. Foco em padrões corporativos, Entity Framework e Swagger para documentação.",
			tags: ["C#", ".NET 9", "SQL Server", "EF Core"],
			githubUrl: "https://github.com/fap233/schedulingapi",
			liveUrl: "#",
			featured: true,
		},
		{
			title: "GoNotes App",
			description:
				language === "en"
					? "Lightweight notes API using Go Standard Library (net/http). Focus on memory management, concurrency safety, and minimal dependencies."
					: "Aplicação para gestão de notas rápidas. Backend otimizado e Frontend reativo, demonstrando fundamentos sólidos de programação.",
			tags: ["Go", "Std Lib", "React", "TypeScript"],
			githubUrl: "https://github.com/fap233/fullstack-notas",
			liveUrl: "#",
			featured: false,
		},
		{
			title: "SMMStore Platform",
			description:
				language === "en"
					? "Complete E-commerce platform with Admin Dashboard. Built with Node.js/Express and React, featuring JWT Auth and Prisma ORM."
					: "Plataforma de E-commerce completa. Painel administrativo, autenticação segura e integração com banco de dados relacional.",
			tags: ["Node.js", "TypeScript", "Prisma", "React"],
			githubUrl: "https://github.com/fap233/smmstore-ecommerce-website",
			liveUrl: "#",
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

				<div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
					{projects.map((project, index) => (
						// O erro sumirá porque ProjectCard agora aceita as props espalhadas aqui
						<ProjectCard key={index} {...project} />
					))}
				</div>
			</div>
		</section>
	);
}
