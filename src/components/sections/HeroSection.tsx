"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
	const { t, language } = useLanguage();

	return (
		<section
			id="hero"
			className="relative pt-24 pb-16 md:pt-32 md:pb-32 overflow-hidden min-h-[90vh] flex flex-col justify-center"
		>
			<div className="absolute inset-0 -z-10 h-full w-full bg-background">
				<div className="absolute h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_90%_at_50%_0%,#000_70%,transparent_100%)]"></div>
				<div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-50 blur-[100px]"></div>
			</div>

			<div className="container relative z-10 mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center space-y-8">
					{" "}
					<Badge
						variant="secondary"
						className="px-4 py-2 text-sm backdrop-blur-md bg-secondary/50 border-primary/20"
					>
						{t.hero.badge}
					</Badge>
					<div className="space-y-6">
						{" "}
						<h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
							{language === "en" ? "Hi, I'm" : "Olá, eu sou"}{" "}
							<span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent pb-2 inline-block">
								Fellipe Pavin
							</span>
						</h1>
						<h2 className="text-2xl md:text-4xl font-medium text-muted-foreground">
							{t.hero.title}
						</h2>
					</div>
					{/* Subtítulo */}
					<p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
						{t.hero.subtitle}
					</p>
					{/* Botões */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
						<Button
							size="lg"
							className="w-full sm:w-auto gap-2 shadow-lg shadow-primary/20 text-base px-8 py-6"
							asChild
						>
							<a href="#projects">
								{t.hero.cta} <ArrowRight className="h-5 w-5" />
							</a>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="w-full sm:w-auto gap-2 backdrop-blur-sm bg-background/50 text-base px-8 py-6"
							asChild
						>
							<a href="#contact">{t.hero.secondaryCta}</a>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
