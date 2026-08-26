"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, X, Minus } from "lucide-react";
import { PageHero, SectionHeading } from "../_components/ui";
import {
	PLANS,
	COMPARISON,
	brl,
	monthlyPrice,
	cycleTotal,
	annualSavings,
	type BillingCycle,
} from "../_data/gym";

export default function PlanosPage() {
	const [cycle, setCycle] = useState<BillingCycle>("mensal");
	const annual = cycle === "anual";

	return (
		<>
			<PageHero
				eyebrow="Planos de acesso"
				title={
					<>
						Escolha o seu <br />
						<span className="text-yellow-500">nível de dor</span>
					</>
				}
				description="Sem taxa de adesão, sem fidelidade e sem letra miúda. Você paga por mês ou fecha 12 meses e ganha 2 de graça."
				photo="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
			/>

			<section className="py-20 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto">
					{/* Toggle mensal / anual */}
					<div className="flex flex-col items-center mb-16">
						<div className="inline-flex border-2 border-neutral-700 bg-neutral-950 -skew-x-12 p-1">
							{(["mensal", "anual"] as const).map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => setCycle(option)}
									aria-pressed={cycle === option}
									className={`px-8 py-3 font-black uppercase italic tracking-wider text-sm transition-colors ${
										cycle === option
											? "bg-yellow-500 text-black"
											: "text-neutral-400 hover:text-white"
									}`}
								>
									<span className="skew-x-12 block">
										{option === "mensal" ? "Mensal" : "Anual"}
									</span>
								</button>
							))}
						</div>
						<p
							className={`mt-4 text-xs font-bold uppercase tracking-widest transition-colors ${
								annual ? "text-yellow-500" : "text-neutral-500"
							}`}
						>
							{annual
								? "2 meses grátis aplicados — paga 10, treina 12"
								: "Vire pra anual e ganhe 2 meses grátis"}
						</p>
					</div>

					{/* Cards */}
					<div className="grid md:grid-cols-3 gap-8 items-center">
						{PLANS.map((plan) => {
							const popular = plan.popular;
							const perMonth = monthlyPrice(plan, cycle);
							return (
								<div
									key={plan.id}
									className={
										popular
											? "bg-neutral-800 p-8 border-2 border-yellow-500 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(234,179,8,0.2)]"
											: "bg-neutral-800 p-8 border border-neutral-700 hover:border-white transition-colors"
									}
								>
									{popular ? (
										<div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 uppercase transform translate-x-2 -translate-y-2">
											Popular
										</div>
									) : null}
									<h3
										className={`text-xl font-bold uppercase mb-1 ${
											popular ? "text-yellow-500" : "text-neutral-400"
										}`}
									>
										{plan.name}
									</h3>
									<p className="text-xs font-medium text-neutral-500 mb-6 h-8">
										{plan.tagline}
									</p>

									<div
										className={`font-black text-white ${
											popular ? "text-5xl" : "text-4xl"
										}`}
									>
										{brl(perMonth)}
										<span className="text-lg text-neutral-500 font-medium">
											/mês
										</span>
									</div>

									<div className="mt-2 mb-6 min-h-[40px] text-xs font-bold uppercase tracking-widest">
										{annual ? (
											<>
												<div className="text-neutral-500 line-through">
													{brl(plan.monthly)}/mês
												</div>
												<div className="text-yellow-500">
													{brl(cycleTotal(plan, "anual"))} à vista · economize{" "}
													{brl(annualSavings(plan))}
												</div>
											</>
										) : (
											<div className="text-neutral-600">
												Cobrança mensal · cancele quando quiser
											</div>
										)}
									</div>

									<ul
										className={`space-y-4 mb-8 text-sm ${
											popular ? "text-white" : "text-neutral-300"
										}`}
									>
										{plan.features.map((f) => (
											<li key={f} className="flex items-center gap-3">
												<Check size={16} className="text-yellow-500 shrink-0" />{" "}
												{f}
											</li>
										))}
										{plan.missing?.map((f) => (
											<li
												key={f}
												className="flex items-center gap-3 text-neutral-600"
											>
												<X size={16} className="shrink-0" /> {f}
											</li>
										))}
									</ul>

									<Link
										href={`/demos/gym/matricula?plano=${plan.id}&ciclo=${cycle}`}
										className={
											popular
												? "block w-full py-4 bg-yellow-500 text-black font-black uppercase italic tracking-wider text-center hover:bg-white transition-colors"
												: "block w-full py-3 border border-white text-white font-bold uppercase tracking-wider text-center hover:bg-white hover:text-black transition-colors"
										}
									>
										{popular ? "Começar Agora" : "Escolher"}
									</Link>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Comparativo */}
			<section className="py-24 px-6 bg-black">
				<div className="max-w-7xl mx-auto">
					<SectionHeading
						title="O que entra em cada plano"
						subtitle="Tudo o que muda de um plano pro outro, sem asterisco escondido."
					/>

					<div className="overflow-x-auto border border-neutral-800">
						<table className="w-full min-w-[720px] border-collapse text-left">
							<thead>
								<tr className="bg-neutral-900">
									<th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-500">
										Benefício
									</th>
									{PLANS.map((plan) => (
										<th key={plan.id} className="p-5">
											<div
												className={`font-black italic uppercase tracking-tighter text-lg ${
													plan.popular ? "text-yellow-500" : "text-white"
												}`}
											>
												{plan.name}
											</div>
											<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-1">
												{brl(monthlyPrice(plan, cycle))}/mês
											</div>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{COMPARISON.map((row, i) => (
									<tr
										key={row.label}
										className={`border-t border-neutral-800 ${
											i % 2 === 1 ? "bg-neutral-950" : ""
										}`}
									>
										<td className="p-5 text-sm font-bold uppercase tracking-wide text-neutral-300">
											{row.label}
										</td>
										{PLANS.map((plan) => {
											const value = row.values[plan.id];
											return (
												<td
													key={plan.id}
													className={`p-5 text-sm font-medium ${
														plan.popular ? "bg-yellow-500/5" : ""
													}`}
												>
													{value === true ? (
														<Check size={20} className="text-yellow-500" />
													) : value === false ? (
														<Minus size={20} className="text-neutral-700" />
													) : (
														<span className="text-neutral-300">{value}</span>
													)}
												</td>
											);
										})}
									</tr>
								))}
								<tr className="border-t border-neutral-800 bg-neutral-900">
									<td className="p-5" />
									{PLANS.map((plan) => (
										<td key={plan.id} className="p-5">
											<Link
												href={`/demos/gym/matricula?plano=${plan.id}&ciclo=${cycle}`}
												className={`group inline-flex items-center gap-2 px-6 py-3 font-black uppercase italic tracking-wider text-sm -skew-x-12 transition-colors ${
													plan.popular
														? "bg-yellow-500 text-black hover:bg-white"
														: "border-2 border-white text-white hover:bg-white hover:text-black"
												}`}
											>
												<span className="skew-x-12 flex items-center gap-2">
													Escolher
													<ArrowRight
														size={16}
														className="group-hover:translate-x-1 transition-transform"
													/>
												</span>
											</Link>
										</td>
									))}
								</tr>
							</tbody>
						</table>
					</div>

					<p className="mt-6 text-xs font-bold uppercase tracking-widest text-neutral-600">
						Preços exibidos no ciclo{" "}
						<span className="text-yellow-500">{cycle}</span>. Trocar o ciclo
						recalcula a tabela inteira.
					</p>
				</div>
			</section>
		</>
	);
}
