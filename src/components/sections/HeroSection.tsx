import React from "react";
import { Button } from "../ui/button";
import { Code, Mail } from "lucide-react";

const portfolioData = {
	name: "Pavin",
	title: "Full Stack Software Engineer",
	tagline: "Building scalable web applications and engaging user experiences.",
};

const HeroSection = () => (
	<section
		id="hero"
		className="py-24 md:py-40 bg-background relative overflow-hidden bg-grid-pattern"
	>
		<div className="absolute inset-0 bg-gradient-hero opacity-30 dark:opacity-20 z-0 pointer-events-none"></div>

		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
			<div className="flex flex-col items-center text-center">
				<h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl md:text-8xl lg:text-9xl mb-4">
					Hello, I am&nbsp;
					<span className="text-gradient-hero inline-block">
						{portfolioData.name}
					</span>
					.dev
				</h1>
				<p className="max-w-4xl text-2xl md:text-3xl text-muted-foreground mb-8 font-light">
					{portfolioData.title}
				</p>

				<p className="max-w-5xl text-xl md:text-2xl font-medium text-foreground mb-12">
					{portfolioData.tagline}
				</p>

				<div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
					<a href="#projects">
						<Button size="lg" className="shadow-lg">
							<Code className="mr-2 h-5 w-5" />
							Show Projects
						</Button>
					</a>

					<a href="#contact">
						<Button
							size="lg"
							variant="outline"
							className="hover:bg-primary/10 transition-colors duration-300"
						>
							<Mail className="mr-2 h-5 w-5" />
							Get in Touch
						</Button>
					</a>
				</div>
			</div>
		</div>
	</section>
);

export default HeroSection;
