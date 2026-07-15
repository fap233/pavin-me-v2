"use client";

// Projetos atuais — prova social de "tem obra rodando agora". Lê o snapshot
// AGREGADO e JÁ ANONIMIZADO de public_stats (linha singleton id=1) com a ANON
// key. Nome de cliente / título real / repo NUNCA chegam aqui: o Monitor publica
// só rótulo genérico + sprint X de Y + LOC da semana. Se não houver projeto, a
// seção SOME (não renderiza vazia).

import { useEffect, useState } from "react";
import { Activity, Code2 } from "lucide-react";
import {
	supabase,
	parsePublicStats,
	type PublicStatsPayload,
} from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

/** Pares de accent (from,to) por card — mesma linguagem do About/Projects. */
const ACCENTS: [string, string][] = [
	["#6366f1", "#a855f7"],
	["#06b6d4", "#6366f1"],
	["#a855f7", "#ec4899"],
	["#f59e0b", "#ec4899"],
];

export function CurrentWorkSection() {
	const { t, language } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.15);
	const [data, setData] = useState<PublicStatsPayload | null>(null);

	useEffect(() => {
		let alive = true;
		if (!supabase) return;
		supabase
			.from("public_stats")
			.select("payload")
			.eq("id", 1)
			.maybeSingle()
			.then(({ data: row }) => {
				if (!alive) return;
				if (row?.payload) setData(parsePublicStats(row.payload));
			});
		return () => {
			alive = false;
		};
	}, []);

	// Regra da home: sem projeto em andamento, a seção não aparece. (Também cobre
	// o estado de carregamento e o Supabase não configurado — nada de placeholder.)
	if (!data || data.projects.length === 0) return null;

	const nf = (n: number) =>
		n.toLocaleString(language === "pt" ? "pt-BR" : "en-US");

	const totalLoc = data.totals.loc_week;

	return (
		<section
			id="current-work"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 md:py-28 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div className="max-w-2xl space-y-3">
						<p className="in-view-anim in-view-anim-1 font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
							{t.currentWork.kicker}
						</p>
						<h2 className="in-view-anim in-view-anim-2 text-3xl font-bold tracking-tight md:text-5xl">
							{t.currentWork.title}
						</h2>
						<p className="in-view-anim in-view-anim-3 text-muted-foreground">
							{t.currentWork.subtitle}
						</p>
					</div>

					{/* Totais — a linha viva do topo */}
					<dl className="in-view-anim in-view-anim-3 flex gap-6 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
						<div className="space-y-1">
							<dt className="inline-flex items-center gap-1.5 text-muted-foreground/60">
								<Activity className="h-3.5 w-3.5" />
								{t.currentWork.activeProjects}
							</dt>
							<dd className="text-2xl font-bold tabular-nums text-foreground">
								{nf(data.totals.active_projects)}
							</dd>
						</div>
						{totalLoc != null && totalLoc > 0 && (
							<div className="space-y-1">
								<dt className="inline-flex items-center gap-1.5 text-muted-foreground/60">
									<Code2 className="h-3.5 w-3.5" />
									{t.currentWork.linesThisWeek}
								</dt>
								<dd className="text-2xl font-bold tabular-nums text-foreground">
									{nf(totalLoc)}
								</dd>
							</div>
						)}
					</dl>
				</div>

				<div className="in-view-anim in-view-anim-4 mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
					{data.projects.map((p, i) => {
						const [from, to] = ACCENTS[i % ACCENTS.length];
						const total = Math.max(p.sprint_total, p.sprint_current, 1);
						const pct = Math.min(100, Math.round((p.sprint_current / total) * 100));
						return (
							<article
								key={i}
								className="group relative overflow-hidden rounded-2xl border bg-card/70 p-6 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
								style={{ ["--acc" as string]: to }}
							>
								{/* Filete gradiente no topo (linguagem do login/cards) */}
								<span
									aria-hidden="true"
									className="absolute inset-x-0 top-0 h-[3px]"
									style={{ background: `linear-gradient(to right, ${from}, ${to})` }}
								/>

								<div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
									<span>{String(i + 1).padStart(2, "0")}</span>
									<span className="inline-flex items-center gap-1.5">
										<span
											className="h-1.5 w-1.5 animate-pulse rounded-full"
											style={{ background: to }}
										/>
										live
									</span>
								</div>

								<h3 className="mt-3 text-lg font-semibold leading-snug">
									{p.label}
								</h3>

								{/* Sprint X de Y + barra */}
								<div className="mt-4">
									<div className="mb-1.5 flex items-baseline justify-between text-xs">
										<span className="font-mono uppercase tracking-[0.16em] text-muted-foreground">
											{t.currentWork.sprint}{" "}
											<span className="text-foreground">{p.sprint_current}</span>{" "}
											{t.currentWork.of} {p.sprint_total}
										</span>
										<span className="tabular-nums text-muted-foreground/70">
											{pct}%
										</span>
									</div>
									<div className="h-1.5 overflow-hidden rounded-full bg-secondary/70">
										<div
											className="h-full rounded-full transition-all duration-500"
											style={{
												width: `${pct}%`,
												background: `linear-gradient(to right, ${from}, ${to})`,
											}}
										/>
									</div>
								</div>

								{/* LOC da semana — ausente quando o projeto não tem repo mapeado */}
								{p.loc_week != null && p.loc_week > 0 && (
									<p className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
										<Code2 className="h-3.5 w-3.5" style={{ color: to }} />
										<span className="font-bold tabular-nums text-foreground">
											+{nf(p.loc_week)}
										</span>
										{t.currentWork.linesThisWeek}
									</p>
								)}
							</article>
						);
					})}
				</div>
			</div>
		</section>
	);
}
