"use client";

// Avaliações — prova social real. Duas procedências, uma parede só:
//   1. As 10 estáticas do perfil do Fellipe no 99freelas (src/data/reviews.ts),
//      texto NÃO editado — são depoimentos reais.
//   2. As avaliações de cliente do portal pavin.me que o Fellipe JÁ APROVOU. A
//      home lê elas de `public_reviews` com a ANON key (o Monitor publica lá só
//      as aprovadas, já anonimizadas). Nada aparece aqui sem aprovação.
//
// O texto do cliente é conteúdo não-confiável: renderizamos como TEXTO (React
// escapa {expr} por padrão) — nunca dangerouslySetInnerHTML —, então não há
// caminho de XSS/HTML injection vindo do banco. Se não houver aprovadas (ou a
// tabela ainda não existir), a seção fica idêntica a antes: só as do 99freelas.

import { useEffect, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { REVIEWS, REVIEW_SUMMARY } from "@/data/reviews";
import { supabase, parsePublicReview, type PublicReview } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

type WallReview = {
	key: string;
	rating: number;
	text: string;
	date: string;
	caption: string;
	source: "client" | "99freelas";
};

/** "jul. 2026" a partir de um ISO — mesmo estilo curto das estáticas. */
function monthYear(iso: string | null, lang: "pt" | "en"): string {
	if (!iso) return "";
	const d = new Date(iso);
	if (isNaN(d.getTime())) return "";
	return d
		.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
			month: "short",
			year: "numeric",
		})
		.replace(" de ", " ");
}

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

	// Avaliações de cliente aprovadas (public_reviews). Fetch client-side com a
	// anon key; erro (ex.: tabela ainda não criada) cai em silêncio → só as do 99.
	const [approved, setApproved] = useState<PublicReview[]>([]);
	useEffect(() => {
		if (!supabase) return;
		let alive = true;
		supabase
			.from("public_reviews")
			.select("*")
			.then(({ data, error }) => {
				if (!alive || error || !data) return;
				const parsed = data
					.map(parsePublicReview)
					.filter((r): r is PublicReview => r !== null);
				setApproved(parsed);
			});
		return () => {
			alive = false;
		};
	}, []);

	const avg = REVIEW_SUMMARY.average.toLocaleString(
		language === "pt" ? "pt-BR" : "en-US",
		{ minimumFractionDigits: 2, maximumFractionDigits: 2 },
	);

	// Parede mesclada: as de cliente aprovadas primeiro (prova mais recente e
	// nativa), depois as 10 do 99freelas. O texto do cliente entra como string —
	// React escapa no render.
	const clientWall: WallReview[] = approved.map((r) => ({
		key: `client-${r.id}`,
		rating: r.rating,
		text: r.body,
		date: monthYear(r.published_at, language),
		caption: r.context ? `${r.author} · ${r.context}` : r.author,
		source: "client",
	}));

	const staticWall: WallReview[] = REVIEWS.map((r, i) => ({
		key: `99-${i}`,
		rating: r.rating,
		text: language === "en" ? r.text_en : r.text,
		date: monthYear(r.date, language),
		caption: language === "en" ? r.project_en : r.project,
		source: "99freelas",
	}));

	const wall = [...clientWall, ...staticWall];

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

					{/* Selo 4,92 / 28 — só o número, sem link externo (decisão do Fellipe). */}
					<div className="in-view-anim in-view-anim-3 mt-6 inline-flex items-center gap-3 rounded-full border bg-card/60 px-4 py-2 backdrop-blur">
						<span className="flex items-center gap-1.5">
							<Star className="h-4 w-4 fill-amber-400 text-amber-400" />
							<span className="text-sm font-bold tabular-nums">{avg}</span>
						</span>
						<span className="h-4 w-px bg-border" />
						<span className="text-sm text-muted-foreground">
							{t.reviews.summary(avg, REVIEW_SUMMARY.total)}
						</span>
					</div>
				</div>

				{/* Parede de depoimentos — colunas (masonry) pra textos de tamanhos
				    diferentes assentarem sem buraco. */}
				<div className="in-view-anim in-view-anim-4 mt-12 gap-5 [column-fill:balance] sm:columns-2 lg:columns-3">
					{wall.map((r) => (
						<figure
							key={r.key}
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
							<figcaption className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs leading-snug text-muted-foreground">
								<span className="min-w-0 truncate">{r.caption}</span>
								{r.source === "client" ? (
									<span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--brand-via)]/30 bg-[var(--brand-via)]/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--brand-via)]">
										<BadgeCheck className="h-3 w-3" />
										{t.reviews.badgeClient}
									</span>
								) : (
									<span className="inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/70">
										{t.reviews.badge99}
									</span>
								)}
							</figcaption>
						</figure>
					))}
				</div>
			</div>
		</section>
	);
}
