"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { HeroParticles } from "./HeroParticles";

export function HeroSection() {
	const { t, language } = useLanguage();
	const nameRef = useRef<HTMLSpanElement>(null);

	return (
		<section
			id="hero"
			className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden min-h-[92vh] flex flex-col justify-center select-none"
		>
			{/* Notebook grid over the site-wide animated background */}
			<div className="absolute inset-0 -z-10 h-full w-full">
				<div className="absolute h-full w-full bg-[linear-gradient(to_right,oklch(0.55_0.02_280_/_0.18)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.55_0.02_280_/_0.18)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_95%_at_50%_10%,#000_55%,transparent_100%)]"></div>
				<div className="absolute -inset-x-8 top-0 h-[420px] m-auto rounded-full bg-gradient-to-r from-primary/20 via-purple-500/15 to-pink-500/20 opacity-60 blur-[120px]"></div>
			</div>

			{/* Technical drafting overlay: alignment circle + crosshairs */}
			<div aria-hidden="true" className="hero-blueprint">
				<span className="hero-blueprint-circle" />
				<span className="hero-crosshair hero-crosshair-left" />
				<span className="hero-crosshair hero-crosshair-right" />
			</div>

			{/* Particle cloud behind the name — scatters around the pointer */}
			<HeroParticles anchorRef={nameRef} />

			<div className="container relative z-10 mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center space-y-8">
					<div className="hero-anim hero-anim-1 flex justify-center">
						<span className="hero-badge">
							<span className="hero-badge-dot" aria-hidden="true" />
							{t.hero.badge}
						</span>
					</div>

					<div className="space-y-6">
						<h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight hero-anim hero-anim-2">
							<span className="block text-2xl md:text-4xl lg:text-5xl font-normal text-muted-foreground/90 mb-2 font-[family-name:var(--font-caveat)] tracking-wide">
								{language === "en" ? "Hi, I'm" : "Olá, eu sou"}
							</span>
							{/* The visible name is drawn by HeroParticles; this copy stays
							    for screen readers, SEO and as the sampling anchor. */}
							<span
								ref={nameRef}
								className="pb-2 inline-block opacity-0"
								aria-hidden="false"
							>
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

					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 hero-anim hero-anim-5">
						<a href="#projects" className="hero-btn hero-btn-fill w-full sm:w-auto">
							<span className="relative z-10 inline-flex items-center gap-2">
								{t.hero.cta}
								<ArrowRight className="hero-btn-arrow h-5 w-5" />
							</span>
						</a>
						<a href="#contact" className="hero-btn hero-btn-outline w-full sm:w-auto">
							<span className="relative z-10">{t.hero.secondaryCta}</span>
						</a>
						<Link href="/cv" className="hero-btn-ghost group w-full sm:w-auto">
							<FileText className="h-4 w-4" />
							<span className="hero-btn-ghost-label">{t.hero.cvCta}</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Status strip — technical footer of the hero frame */}
			<div
				aria-hidden="true"
				className="hero-anim hero-anim-5 absolute inset-x-0 bottom-5 hidden md:flex items-center justify-between gap-4 px-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60"
			>
				<span>Fortaleza · BR — UTC-3</span>
				<span className="hero-status-bars" />
				<span>{language === "en" ? "Scroll" : "Role"} ↓</span>
			</div>
		</section>
	);
}
