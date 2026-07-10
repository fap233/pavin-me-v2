"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

/** Accent pair per stat card — lemontree-style colored blocks. */
const ABOUT_ACCENTS: [string, string][] = [
	["#6366f1", "#8b5cf6"],
	["#a855f7", "#ec4899"],
	["#06b6d4", "#6366f1"],
];

export function AboutSection() {
	const { t, language } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.15);

	const kicker = language === "en" ? "// about" : "// sobre";

	return (
		<section
			id="about"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
					<div className="space-y-6">
						<div className="in-view-anim in-view-anim-1 space-y-2">
							<p className="text-base text-muted-foreground/80 font-[family-name:var(--font-caveat)] tracking-wide">
								{kicker}
							</p>
							<div className="relative inline-block">
								<h2 className="text-3xl md:text-4xl font-bold">
									{t.about.title}
								</h2>
								<svg
									aria-hidden="true"
									className="absolute left-0 right-0 -bottom-2 w-full max-w-[180px] pointer-events-none"
									viewBox="0 0 200 12"
									fill="none"
									preserveAspectRatio="none"
								>
									<path
										d="M3 7 Q 30 2, 60 6 T 130 6 T 197 4"
										stroke="url(#about-scribble-gradient)"
										strokeWidth="2"
										strokeLinecap="round"
										fill="none"
										opacity="0.85"
									/>
									<defs>
										<linearGradient
											id="about-scribble-gradient"
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
						</div>

						<p className="text-muted-foreground leading-relaxed in-view-anim in-view-anim-2">
							{t.about.description}
						</p>
					</div>

					<div className="grid gap-4 in-view-anim in-view-anim-3">
						{t.about.stats.map(
							(stat: { label: string; value: string }, index: number) => (
								<div
									key={index}
									className="about-stat group backdrop-blur-lg"
									style={
										{
											"--accent-from": ABOUT_ACCENTS[index % 3][0],
											"--accent-to": ABOUT_ACCENTS[index % 3][1],
											"--tilt": index % 2 === 0 ? "-1.2deg" : "1.2deg",
										} as React.CSSProperties
									}
								>
									<div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
										<span>{String(index + 1).padStart(2, "0")}</span>
										<span>{stat.label}</span>
									</div>
									<p className="about-stat-value mt-3 text-5xl font-black tracking-tight md:text-6xl">
										{stat.value}
									</p>
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
