"use client";

// Avaliações — prova social real. Os textos vêm de src/data/reviews.ts (10
// depoimentos reais do perfil do Fellipe no 99freelas) e NÃO são editados aqui.
// Cabeçalho traz o selo "4,92 de média em 28 avaliações" com link pro perfil.

import { ArrowUpRight, Star } from "lucide-react";
import { REVIEWS, REVIEW_SUMMARY } from "@/data/reviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

/** Fila de 5 estrelas; preenche floor(rating) e meia estrela no resto. */
function Stars({ rating }: { rating: number }) {
	const full = Math.floor(rating);
	const hasHalf = rating - full >= 0.25 && rating - full < 0.85;
	return (
		<div
			className="flex items-center gap-0.5"
			aria-label={`${rating} de 5`}
			role="img"
		>
			{Array.from({ length: 5 }).map((_, i) => {
				const filled = i < full;
				const half = !filled && i === full && hasHalf;
				return (
					<Star
						key={i}
						aria-hidden="true"
						className={
							filled || half
								? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
								: "h-3.5 w-3.5 text-muted-foreground/35"
						}
						style={half ? { clipPath: "inset(0 50% 0 0)" } : undefined}
					/>
				);
			})}
		</div>
	);
}

export function ReviewsSection() {
	const { t, language } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.12);

	const avg = REVIEW_SUMMARY.average.toLocaleString(
		language === "pt" ? "pt-BR" : "en-US",
		{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
	);

	return (
		<section
			id="reviews"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 md:py-28 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<p className="in-view-anim in-view-anim-1 font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
						{t.reviews.kicker}
					</p>
					<h2 className="in-view-anim in-view-anim-2 mt-2 text-3xl font-bold tracking-tight md:text-5xl">
						{t.reviews.title}
					</h2>
					<p className="in-view-anim in-view-anim-3 mt-4 text-muted-foreground">
						{t.reviews.subtitle}
					</p>

					{/* Selo 4,92 / 28 + link pro perfil */}
					<a
						href={REVIEW_SUMMARY.profileUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="in-view-anim in-view-anim-3 group mt-6 inline-flex items-center gap-3 rounded-full border bg-card/60 px-4 py-2 backdrop-blur transition-colors hover:border-[var(--brand-via)]/50"
					>
						<span className="flex items-center gap-1.5">
							<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
							<span className="text-sm font-bold tabular-nums">{avg}</span>
						</span>
						<span className="h-4 w-px bg-border" />
						<span className="text-sm text-muted-foreground">
							{t.reviews.summary(avg, REVIEW_SUMMARY.total)}
						</span>
						<ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
					</a>
				</div>

				{/* Parede de depoimentos — colunas (masonry) pra textos de tamanhos
				    diferentes assentarem sem buraco. */}
				<div className="in-view-anim in-view-anim-4 mt-12 gap-5 [column-fill:balance] sm:columns-2 lg:columns-3">
					{REVIEWS.map((r, i) => (
						<figure
							key={i}
							className="mb-5 break-inside-avoid rounded-2xl border bg-card/70 p-5 shadow-[0_18px_50px_-32px_rgb(0_0_0/0.55)] backdrop-blur-md transition-colors duration-300 hover:border-[var(--brand-via)]/45"
						>
							<div className="flex items-center justify-between gap-3">
								<Stars rating={r.rating} />
								<span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
									{r.date}
								</span>
							</div>
							<blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">
								“{r.text}”
							</blockquote>
							<figcaption className="mt-3 border-t pt-3 text-xs leading-snug text-muted-foreground">
								{r.project}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
