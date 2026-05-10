"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const portfolioData = {
	name: "Fellipe Pavin",
};

const Footer = () => {
	const { t, language } = useLanguage();
	return (
		<footer className="py-10 border-t bg-secondary/10">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground space-y-2">
				<p className="text-base font-[family-name:var(--font-caveat)] tracking-wide text-foreground/80">
					{t.footer.tagline}
				</p>
				<p className="inline-flex items-center justify-center gap-1.5">
					<span>{new Date().getFullYear()}</span>
					<span>©</span>
					<span>{portfolioData.name}</span>
					<span aria-hidden="true">·</span>
					<span className="inline-flex items-center gap-1">
						{language === "en" ? "built with" : "feito com"}
						<Heart
							className="h-3.5 w-3.5 text-pink-500 fill-pink-500/80"
							aria-hidden="true"
						/>
						{language === "en" ? "and" : "e"}
						<span className="font-[family-name:var(--font-caveat)] text-foreground/80">
							Next.js
						</span>
					</span>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
