"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

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
											<stop offset="50%" stopColor="#a855f7" />
											<stop offset="100%" stopColor="#ec4899" />
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
								<Card
									key={index}
									className="group relative p-6 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3),0_0_18px_-6px_rgba(236,72,153,0.22)]"
								>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										style={{
											background:
												"linear-gradient(to right, var(--color-primary), #a855f7, #ec4899)",
											WebkitMask:
												"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
											WebkitMaskComposite: "xor",
											maskComposite: "exclude",
											padding: "1.5px",
										}}
									/>
									<p className="text-sm text-muted-foreground mb-1">
										{stat.label}
									</p>
									<p className="text-2xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-purple-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent">
										{stat.value}
									</p>
								</Card>
							),
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
