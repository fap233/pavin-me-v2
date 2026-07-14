"use client";

import { useState } from "react";

type Point = { label: string; runs: number; latency: number };

const DATA: Point[] = [
	{ label: "JUN", runs: 1.2, latency: 412 },
	{ label: "JUL", runs: 2.1, latency: 388 },
	{ label: "AUG", runs: 1.7, latency: 401 },
	{ label: "SEP", runs: 2.6, latency: 344 },
	{ label: "OCT", runs: 3.4, latency: 297 },
	{ label: "NOV", runs: 4.1, latency: 241 },
];

const MAX = Math.max(...DATA.map((d) => d.runs));

/**
 * Mini-viz de performance da home.
 *
 * Substitui as 4 barras decorativas do mock original: mesmos tons de roxo e a
 * mesma moldura, mas agora com dado real por trás — hover/foco em qualquer
 * barra mostra tooltip com execuções e latência do mês.
 */
export default function PerformanceChart() {
	const [active, setActive] = useState<number | null>(DATA.length - 1);
	const point = active === null ? null : DATA[active];
	const growth = Math.round(
		((DATA[DATA.length - 1].runs - DATA[0].runs) / DATA[0].runs) * 100,
	);

	return (
		<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10">
			<div className="flex items-start justify-between mb-6">
				<div>
					<p className="text-xs font-mono text-slate-400">AGENT RUNS / MONTH</p>
					<p className="text-2xl font-bold tracking-tight">
						{point ? `${point.runs.toFixed(1)}M` : "—"}
						<span className="ml-2 text-sm font-normal text-slate-400">
							{point ? point.label : "hover a bar"}
						</span>
					</p>
				</div>
				<span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
					+{growth}%
				</span>
			</div>

			<div className="flex gap-3 items-end h-40">
				{DATA.map((d, i) => {
					const isActive = active === i;
					const h = Math.max(12, (d.runs / MAX) * 100);
					return (
						<button
							key={d.label}
							type="button"
							onMouseEnter={() => setActive(i)}
							onFocus={() => setActive(i)}
							onClick={() => setActive(i)}
							aria-label={`${d.label}: ${d.runs}M runs, ${d.latency}ms median latency`}
							className="group relative flex-1 h-full flex items-end outline-none"
						>
							{/* tooltip */}
							<span
								className={`pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 whitespace-nowrap rounded-lg border border-purple-500/30 bg-slate-950/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur-sm transition-all duration-200 ${
									isActive
										? "opacity-100 translate-y-0"
										: "opacity-0 translate-y-1"
								}`}
							>
								<span className="font-bold text-white">{d.runs}M runs</span>
								<span className="text-slate-400"> · {d.latency}ms p50</span>
							</span>

							<span
								className="relative w-full rounded-t-lg bg-purple-500/20 transition-all duration-300 group-hover:bg-purple-500/30 group-focus-visible:ring-2 group-focus-visible:ring-purple-400"
								style={{ height: `${h}%` }}
							>
								<span
									className={`absolute inset-x-0 bottom-0 rounded-t-lg bg-gradient-to-t from-purple-600 to-pink-500 transition-all duration-500 ${
										isActive ? "h-full" : "h-0"
									}`}
								/>
								{i === DATA.length - 1 && (
									<span className="absolute inset-x-0 bottom-0 h-[35%] rounded-t-lg bg-purple-500 animate-pulse" />
								)}
							</span>
						</button>
					);
				})}
			</div>

			<div className="mt-3 flex gap-3">
				{DATA.map((d, i) => (
					<span
						key={d.label}
						className={`flex-1 text-center text-[10px] font-mono transition-colors ${
							active === i ? "text-purple-300" : "text-slate-500"
						}`}
					>
						{d.label}
					</span>
				))}
			</div>

			<p className="mt-4 text-sm text-slate-400 text-center font-mono">
				LIVE PERFORMANCE METRICS
			</p>
		</div>
	);
}
