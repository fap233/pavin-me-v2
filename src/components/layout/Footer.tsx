"use client";

import React from "react";
import { Heart, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePaint } from "@/contexts/PaintContext";

const portfolioData = {
	name: "Fellipe Pavin",
};

/* The slider track shows raw hues; brand-via sits 29° below --paint-h, so we
   shift the mapping to keep the thumb over the colour it actually paints. */
const VIA_OFFSET = 29;

const Footer = () => {
	const { t, language } = useLanguage();
	const { hue, setHue, reset, isDefault } = usePaint();
	const sliderValue = (((hue - VIA_OFFSET) % 360) + 360) % 360;

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

				{/* Paint the site — fredbergwitz-style hue picker. The chosen hue
				    recolours every brand gradient, the nebulas and the name. */}
				<div className="mx-auto mt-6 flex w-fit flex-col items-center gap-2.5 rounded-2xl border border-border/60 bg-card/40 px-6 py-4 backdrop-blur-md">
					<span className="font-[family-name:var(--font-caveat)] text-lg tracking-wide text-foreground/80">
						{language === "en"
							? "paint the site your colour"
							: "pinte o site com a sua cor"}
					</span>
					<div className="flex items-center gap-3">
						<input
							type="range"
							min={0}
							max={360}
							step={1}
							value={sliderValue}
							onChange={(e) => setHue(Number(e.target.value) + VIA_OFFSET)}
							aria-label={language === "en" ? "Site hue" : "Matiz do site"}
							className="paint-slider"
						/>
						<button
							type="button"
							onClick={reset}
							disabled={isDefault}
							aria-label={language === "en" ? "Reset colour" : "Restaurar cor"}
							title={language === "en" ? "Reset colour" : "Restaurar cor"}
							className="rounded-full border border-border/70 p-1.5 text-muted-foreground transition enabled:hover:border-border enabled:hover:text-foreground disabled:opacity-30"
						>
							<RotateCcw className="h-3.5 w-3.5" />
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
