"use client";

import ProjectCard from "./ProjectCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

export function FrontendPreviews() {
	const { language, t } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.1);

	const demos = [
		{
			title: "Nexus AI SaaS",
			description:
				language === "en"
					? "Futuristic Dark Mode landing page with neon gradients and glassmorphism effects."
					: "Landing page futurista em Dark Mode com gradientes neon e efeitos de vidro (glassmorphism).",
			tags: ["React", "Tailwind", "UI Design"],
			liveUrl: "/demos/ai-saas",
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
		<section
			id="frontend-demos"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 bg-background overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_80%_at_50%_30%,#000_60%,transparent_100%)]"
			/>

			<div className="container mx-auto px-4">
				<div className="max-w-2xl mx-auto text-center mb-12 space-y-3 in-view-anim in-view-anim-1">
					<p className="text-base text-muted-foreground/80 font-[family-name:var(--font-caveat)] tracking-wide">
						{t.lab.kicker}
					</p>
					<div className="relative inline-block">
						<h2 className="text-3xl md:text-4xl font-bold">{t.lab.title}</h2>
						<svg
							aria-hidden="true"
							className="absolute left-0 right-0 -bottom-2 w-full max-w-sm mx-auto pointer-events-none"
							viewBox="0 0 360 14"
							fill="none"
							preserveAspectRatio="none"
						>
							<path
								d="M5 8 Q 50 2, 95 7 T 190 7 T 285 8 T 357 5"
								stroke="url(#lab-scribble-gradient)"
								strokeWidth="2"
								strokeLinecap="round"
								fill="none"
								opacity="0.85"
							/>
							<defs>
								<linearGradient
									id="lab-scribble-gradient"
									x1="0"
									y1="0"
									x2="1"
									y2="0"
								>
									<stop offset="0%" stopColor="oklch(0.922 0 0)" />
									<stop offset="50%" stopColor="#a855f7" />
									<stop offset="100%" stopColor="#ec4899" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<p className="text-muted-foreground pt-3">{t.lab.subtitle}</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto in-view-anim in-view-anim-2">
					{demos.map((demo, index) => (
						<ProjectCard
							key={index}
							title={demo.title}
							description={demo.description}
							tags={demo.tags}
							liveUrl={demo.liveUrl}
							githubUrl="https://github.com/fap233"
							featured={demo.featured}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
