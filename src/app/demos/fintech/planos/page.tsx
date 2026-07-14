"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Minus, Sparkles } from "lucide-react";
import {
	ANNUAL_MONTHS_CHARGED,
	COMPARE,
	FT,
	PLANS,
	annualTotal,
	brl,
	cx,
	pill,
	priceFor,
	type CompareRow,
	type Plan,
} from "../_components/lumina";

type Cycle = "mensal" | "anual";

export default function PlanosPage() {
	const [cycle, setCycle] = useState<Cycle>("mensal");

	return (
		<>
			{/* Cabeçalho */}
			<section className="pt-32 pb-12 px-6">
				<div className="max-w-3xl mx-auto text-center space-y-6">
					<div className={pill}>
						<Sparkles size={13} />
						PLANOS TRANSPARENTES
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
						Escolha o plano que{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
							cresce com você.
						</span>
					</h1>
					<p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
						Sem letra miúda, sem tarifa escondida. Troque ou cancele quando
						quiser, direto pelo app.
					</p>

					{/* Toggle mensal / anual */}
					<div className="flex flex-col items-center gap-3 pt-2">
						<div
							role="tablist"
							aria-label="Ciclo de cobrança"
							className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200 shadow-sm"
						>
							{(["mensal", "anual"] as const).map((c) => (
								<button
									key={c}
									role="tab"
									aria-selected={cycle === c}
									onClick={() => setCycle(c)}
									className={cx(
										"px-6 py-2 rounded-full text-sm font-semibold transition-all",
										cycle === c
											? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
											: "text-slate-600 hover:text-slate-900",
									)}
								>
									{c === "mensal" ? "Mensal" : "Anual"}
								</button>
							))}
						</div>
						<p
							className={cx(
								"text-xs font-semibold transition-colors",
								cycle === "anual" ? "text-green-600" : "text-slate-400",
							)}
						>
							No anual você paga {ANNUAL_MONTHS_CHARGED} meses e leva 12 — 2
							meses grátis.
						</p>
					</div>
				</div>
			</section>

			{/* Cards de plano */}
			<section className="pb-20 px-6">
				<div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3 items-start">
					{PLANS.map((plan) => (
						<PlanCard key={plan.id} plan={plan} cycle={cycle} />
					))}
				</div>
			</section>

			{/* Tabela comparativa */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-5xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Compare lado a lado
						</h2>
						<p className="text-slate-500">
							Tudo que muda de um plano pro outro, sem asterisco.
						</p>
					</div>

					<div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-slate-50">
						<table className="w-full min-w-[640px] text-sm">
							<thead>
								<tr className="border-b border-slate-200">
									<th className="text-left font-semibold text-slate-500 px-6 py-5">
										Recurso
									</th>
									{PLANS.map((plan) => (
										<th
											key={plan.id}
											className={cx(
												"px-6 py-5 text-center font-bold",
												plan.highlight ? "text-blue-600" : "text-slate-900",
											)}
										>
											{plan.name.replace("Lumina ", "")}
											<div className="text-xs font-medium text-slate-400 mt-0.5">
												{plan.monthly === 0
													? "Grátis"
													: `${brl(priceFor(plan, cycle))}/mês`}
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{COMPARE.map((row, i) => (
									<tr
										key={row.feature}
										className={cx(
											"border-b border-slate-100 last:border-0",
											i % 2 === 1 && "bg-white/60",
										)}
									>
										<td className="px-6 py-4 text-slate-700 font-medium">
											{row.feature}
										</td>
										<Cell value={row.free} />
										<Cell value={row.plus} highlight />
										<Cell value={row.black} />
									</tr>
								))}
								<tr>
									<td className="px-6 py-6" />
									{PLANS.map((plan) => (
										<td key={plan.id} className="px-6 py-6 text-center">
											<Link
												href={`${FT}/abrir-conta?plano=${plan.id}`}
												className={cx(
													"inline-flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
													plan.highlight
														? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
														: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
												)}
											>
												Assinar
											</Link>
										</td>
									))}
								</tr>
							</tbody>
						</table>
					</div>

					<p className="mt-6 text-center text-xs text-slate-400">
						Valores fictícios para fins de demonstração.
					</p>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 px-6">
				<div className="max-w-5xl mx-auto rounded-[2rem] bg-slate-900 text-white p-10 sm:p-14 relative overflow-hidden">
					<div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]" />
					<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
						<div className="max-w-md">
							<h2 className="text-2xl sm:text-3xl font-bold mb-2">
								Na dúvida, comece pelo Free.
							</h2>
							<p className="text-slate-400">
								Você troca de plano quando quiser, sem taxa e sem falar com
								ninguém.
							</p>
						</div>
						<Link
							href={`${FT}/abrir-conta?plano=free`}
							className="shrink-0 inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition-all"
						>
							Abrir conta grátis <ArrowUpRight size={18} />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: Cycle }) {
	const price = priceFor(plan, cycle);
	const free = plan.monthly === 0;

	return (
		<div
			className={cx(
				"relative rounded-[2rem] p-8 transition-all",
				plan.highlight
					? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20 md:-translate-y-4 overflow-hidden"
					: "bg-white border border-slate-100 shadow-sm hover:border-blue-200",
			)}
		>
			{plan.highlight && (
				<>
					<div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]" />
					<span className="relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider mb-4">
						<Sparkles size={12} /> Mais escolhido
					</span>
				</>
			)}

			<div className="relative z-10">
				<h3
					className={cx(
						"text-xl font-bold",
						plan.highlight ? "text-white" : "text-slate-900",
					)}
				>
					{plan.name}
				</h3>
				<p
					className={cx(
						"text-sm mt-1 mb-6 leading-relaxed",
						plan.highlight ? "text-slate-400" : "text-slate-500",
					)}
				>
					{plan.tagline}
				</p>

				<div className="mb-1 flex items-end gap-1">
					<span
						className={cx(
							"text-4xl font-bold tracking-tight",
							plan.highlight ? "text-white" : "text-slate-900",
						)}
					>
						{free ? "Grátis" : brl(price)}
					</span>
					{!free && (
						<span
							className={cx(
								"text-sm font-medium mb-1.5",
								plan.highlight ? "text-slate-400" : "text-slate-500",
							)}
						>
							/mês
						</span>
					)}
				</div>

				<p
					className={cx(
						"text-xs font-medium h-5",
						plan.highlight ? "text-blue-300" : "text-slate-400",
					)}
				>
					{free
						? "Para sempre, sem pegadinha."
						: cycle === "anual"
							? `Cobrado ${brl(annualTotal(plan))} por ano`
							: `Ou ${brl(annualTotal(plan))}/ano no plano anual`}
				</p>

				<Link
					href={`${FT}/abrir-conta?plano=${plan.id}`}
					className={cx(
						"mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all",
						plan.highlight
							? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/30"
							: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20",
					)}
				>
					{free ? "Criar conta grátis" : `Assinar ${plan.name.split(" ")[1]}`}
					<ArrowUpRight size={17} />
				</Link>

				<ul className="mt-8 space-y-3">
					{plan.perks.map((perk) => (
						<li key={perk} className="flex items-start gap-3 text-sm">
							<span
								className={cx(
									"mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center",
									plan.highlight
										? "bg-blue-600/20 text-blue-300"
										: "bg-blue-50 text-blue-600",
								)}
							>
								<Check size={12} strokeWidth={3} />
							</span>
							<span
								className={plan.highlight ? "text-slate-300" : "text-slate-600"}
							>
								{perk}
							</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

function Cell({
	value,
	highlight,
}: {
	value: CompareRow["free"];
	highlight?: boolean;
}) {
	return (
		<td
			className={cx(
				"px-6 py-4 text-center",
				highlight && "bg-blue-50/40 border-x border-blue-100/60",
			)}
		>
			{value === true ? (
				<span className="inline-flex w-6 h-6 rounded-full bg-blue-50 text-blue-600 items-center justify-center">
					<Check size={13} strokeWidth={3} />
				</span>
			) : value === false ? (
				<span className="inline-flex w-6 h-6 rounded-full bg-slate-100 text-slate-300 items-center justify-center">
					<Minus size={13} strokeWidth={3} />
				</span>
			) : (
				<span className="text-sm font-semibold text-slate-700">{value}</span>
			)}
		</td>
	);
}
