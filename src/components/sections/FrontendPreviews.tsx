"use client";

import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

type Demo = {
	title: string;
	description: string;
	tags: string[];
	liveUrl: string;
	/** Flood colour pair — the tile paints itself with this on hover. */
	accent: [string, string];
	shape: "circle" | "triangle" | "square";
};

export function FrontendPreviews() {
	const { language, t } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.1);

	const demos: Demo[] = [
		{
			title: "Nexus AI",
			description:
				language === "en"
					? "Futuristic dark-mode landing page with neon gradients and glassmorphism."
					: "Landing page futurista em dark mode com gradientes neon e glassmorphism.",
			tags: ["React", "Tailwind", "UI Design"],
			liveUrl: "/demos/ai-saas",
			accent: ["#6366f1", "#8b5cf6"],
			shape: "circle",
		},
		{
			title: "Farine",
			description:
				language === "en"
					? "Artisanal bakery site — warm tones, serif typography, parallax."
					: "Padaria artesanal — tons terrosos, tipografia serifada, parallax.",
			tags: ["UX", "Frontend", "Responsive"],
			liveUrl: "/demos/bakery",
			accent: ["#f59e0b", "#f97316"],
			shape: "triangle",
		},
		{
			title: "Lumina",
			description:
				language === "en"
					? "Minimalist fintech dashboard — Bento grid and CSS-only charts."
					: "Dashboard fintech minimalista — Bento grid e gráficos só com CSS.",
			tags: ["Fintech", "Bento Grid", "Clean UI"],
			liveUrl: "/demos/fintech",
			accent: ["#06b6d4", "#3b82f6"],
			shape: "square",
		},
		{
			title: "Iron Forge",
			description:
				language === "en"
					? "High-energy brutalist gym design — skewed elements, hard contrast."
					: "Academia em brutalismo de alta energia — elementos inclinados, contraste duro.",
			tags: ["Brutalist", "High Energy", "CSS"],
			liveUrl: "/demos/gym",
			accent: ["#ef4444", "#f97316"],
			shape: "triangle",
		},
		{
			title: "Aurum",
			description:
				language === "en"
					? "Luxury real-estate landing — whitespace, typography, elegance."
					: "Imobiliária de luxo — espaço em branco, tipografia, elegância.",
			tags: ["Luxury", "Minimalist", "Real Estate"],
			liveUrl: "/demos/luxury",
			accent: ["#eab308", "#a16207"],
			shape: "circle",
		},
		{
			title: "Admin OS",
			description:
				language === "en"
					? "Complete admin interface — sidebar, data tables, analytics widgets."
					: "Interface administrativa completa — sidebar, tabelas e widgets de análise.",
			tags: ["Dashboard", "Admin", "Data Viz"],
			liveUrl: "/demos/dashboard",
			accent: ["#22c55e", "#14b8a6"],
			shape: "square",
		},
	];

	return (
		<section
			id="frontend-demos"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 overflow-hidden"
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
									<stop offset="50%" style={{ stopColor: "var(--brand-via)" }} />
									<stop offset="100%" style={{ stopColor: "var(--brand-to)" }} />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<p className="text-muted-foreground pt-3">{t.lab.subtitle}</p>
				</div>

				{/* Tate-Law-style block: gapless typographic tiles that flood with
				    their own colour when touched. */}
				<div className="lab-grid in-view-anim in-view-anim-2 mx-auto grid max-w-6xl overflow-hidden rounded-xl border md:grid-cols-2">
					{demos.map((demo, index) => (
						<a
							key={demo.title}
							href={demo.liveUrl}
							className="lab-tile group relative block overflow-hidden p-6 backdrop-blur-xl md:p-8"
							style={
								{
									"--accent-from": demo.accent[0],
									"--accent-to": demo.accent[1],
								} as React.CSSProperties
							}
						>
							<span aria-hidden="true" className="lab-tile-paint" />
							<span
								aria-hidden="true"
								className={`lab-tile-shape lab-tile-shape-${demo.shape}`}
							/>

							<div className="relative z-10 flex h-full flex-col gap-4">
								<div className="lab-tile-meta flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									<span>{String(index + 1).padStart(2, "0")}</span>
									<span className="lab-tile-cta inline-flex items-center gap-1">
										{language === "en" ? "Open demo" : "Abrir demo"}
										<ArrowUpRight className="h-3.5 w-3.5" />
									</span>
								</div>

								<h3 className="lab-tile-title text-4xl font-black uppercase tracking-tight md:text-6xl">
									{demo.title}
								</h3>

								<p className="lab-tile-desc max-w-md text-sm leading-relaxed text-muted-foreground">
									{demo.description}
								</p>

								<div className="lab-tile-tags mt-auto flex flex-wrap gap-1.5 pt-2">
									{demo.tags.map((tag) => (
										<span
											key={tag}
											className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
