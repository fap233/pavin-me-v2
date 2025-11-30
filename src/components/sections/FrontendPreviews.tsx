"use client";

import ProjectCard from "./ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";

export function FrontendPreviews() {
	const { language } = useLanguage();

	const demos = [
		{
			title: "Nexus AI SaaS",
			description:
				language === "en"
					? "Futuristic Dark Mode landing page with neon gradients and glassmorphism effects."
					: "Landing page futurista em Dark Mode com gradientes neon e efeitos de vidro (glassmorphism).",
			tags: ["React", "Tailwind", "UI Design"],
			liveUrl: "/demos/ai-saas", // Rota interna
			featured: false,
		},
		{
			title: "Farine Bakery",
			description:
				language === "en"
					? "Artisanal bakery website featuring warm tones, serif typography and parallax effects."
					: "Site de padaria artesanal com tons terrosos, tipografia serifada e efeitos parallax.",
			tags: ["UX", "Frontend", "Responsive"],
			liveUrl: "/demos/bakery",
			featured: false,
		},
		{
			title: "Lumina Fintech",
			description:
				language === "en"
					? "Clean and minimalist fintech dashboard using Bento Grid layout and CSS-only charts."
					: "Dashboard fintech limpo e minimalista usando layout Bento Grid e gráficos pure CSS.",
			tags: ["Fintech", "Bento Grid", "Clean UI"],
			liveUrl: "/demos/fintech",
			featured: false,
		},
		{
			title: "Iron Forge Gym",
			description:
				language === "en"
					? "High-energy brutalist design for a gym, using skewed elements and high contrast."
					: "Design brutalista de alta energia para academia, usando elementos inclinados e alto contraste.",
			tags: ["Brutalist", "High Energy", "CSS"],
			liveUrl: "/demos/gym",
			featured: false,
		},
		{
			title: "Aurum Real Estate",
			description:
				language === "en"
					? "Luxury real estate landing page focusing on whitespace, typography and elegance."
					: "Landing page imobiliária de luxo focada em espaço em branco, tipografia e elegância.",
			tags: ["Luxury", "Minimalist", "Real Estate"],
			liveUrl: "/demos/luxury",
			featured: false,
		},
		{
			title: "SaaS Admin Dashboard",
			description:
				language === "en"
					? "Complete admin interface with sidebar, data tables, and analytics widgets."
					: "Interface administrativa completa com sidebar, tabelas de dados e widgets de análise.",
			tags: ["Dashboard", "Admin", "Data Viz"],
			liveUrl: "/demos/dashboard",
			featured: true,
		},
	];

	return (
		<section id="frontend-demos" className="py-20 bg-background">
			<div className="container mx-auto px-4">
				<div className="max-w-2xl mx-auto text-center mb-12 space-y-4">
					<h2 className="text-3xl font-bold">
						{language === "en"
							? "Frontend UI/UX Lab"
							: "Laboratório UI/UX Frontend"}
					</h2>
					<p className="text-muted-foreground">
						{language === "en"
							? "A collection of high-fidelity interfaces demonstrating versatility in design and CSS mastery."
							: "Uma coleção de interfaces de alta fidelidade demonstrando versatilidade em design e domínio de CSS."}
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
					{demos.map((demo, index) => (
						<ProjectCard
							key={index}
							title={demo.title}
							description={demo.description}
							tags={demo.tags}
							liveUrl={demo.liveUrl}
							// Github Url pode ser o repo geral ou null se não quiser linkar direto
							githubUrl="https://github.com/fap233"
							featured={demo.featured}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
