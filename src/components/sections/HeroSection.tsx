"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
	const { t, language } = useLanguage();

	return (
		<section
			id="hero"
			className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center"
		>
			{/* Notebook grid background */}
			<div className="absolute inset-0 -z-10 h-full w-full bg-background">
				<div className="absolute h-full w-full bg-[linear-gradient(to_right,oklch(0.55_0.02_280_/_0.18)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.02_280_/_0.18)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_95%_at_50%_10%,#000_55%,transparent_100%)]"></div>
				<div className="absolute -inset-x-8 top-0 h-[420px] m-auto rounded-full bg-gradient-to-r from-primary/20 via-purple-500/15 to-pink-500/20 opacity-60 blur-[120px]"></div>
			</div>

			<div className="container relative z-10 mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center space-y-8">
					<div className="hero-anim hero-anim-1">
						<Badge
							variant="secondary"
							className="px-4 py-2 text-base backdrop-blur-md bg-secondary/50 border-primary/20 font-[family-name:var(--font-caveat)] tracking-wide"
						>
							{t.hero.badge}
						</Badge>
					</div>

					<div className="space-y-6">
						<h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight hero-anim hero-anim-2">
							<span className="block text-2xl md:text-4xl lg:text-5xl font-normal text-muted-foreground/90 mb-2 font-[family-name:var(--font-caveat)] tracking-wide">
								{language === "en" ? "Hi, I'm" : "Olá, eu sou"}
							</span>
							<span className="hero-name-gradient bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent pb-2 inline-block">
								Fellipe Pavin
							</span>
						</h1>

						<div className="hero-anim hero-anim-3 relative inline-block">
							<h2 className="text-2xl md:text-4xl font-medium text-muted-foreground">
								{t.hero.title}
							</h2>
							{/* Hand-drawn scribble underline */}
							<svg
								aria-hidden="true"
								className="hero-scribble absolute left-0 right-0 -bottom-3 mx-auto w-full max-w-md pointer-events-none"
								viewBox="0 0 400 18"
								fill="none"
								preserveAspectRatio="none"
							>
								<path
									d="M5 10 Q 50 4, 100 9 T 200 8 T 300 10 T 395 7"
									stroke="url(#scribble-gradient)"
									strokeWidth="2.5"
									strokeLinecap="round"
									fill="none"
								/>
								<defs>
									<linearGradient
										id="scribble-gradient"
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

					<p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto hero-anim hero-anim-4">
						{t.hero.subtitle}
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 hero-anim hero-anim-5">
						<Button
							size="lg"
							className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 text-base px-8 py-6 transition-all hover:shadow-xl hover:shadow-pink-500/20 hover:-translate-y-0.5"
							asChild
						>
							<a href="#projects">
								{t.hero.cta} <ArrowRight className="h-5 w-5" />
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto gap-2 backdrop-blur-sm bg-background/50 text-base px-8 py-6 transition-all hover:border-purple-500/50 hover:-translate-y-0.5"
							asChild
						>
							<a href="#contact">{t.hero.secondaryCta}</a>
						</Button>
						<Button
							size="lg"
							variant="ghost"
							className="w-full sm:w-auto gap-2 text-base px-6 py-6 text-muted-foreground hover:text-primary transition-all hover:-translate-y-0.5"
							asChild
						>
							<Link href="/cv">
								<FileText className="h-5 w-5" /> {t.hero.cvCta}
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
