"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { PageHero, SkewLink } from "../_components/ui";
import { COACHES, PROGRAMS } from "../_data/gym";

const FILTERS = ["Todos", "Crossfit", "Musculação", "Cardio", "Boxe", "Personal", "Mobilidade"];

export default function TreinadoresPage() {
	const [filter, setFilter] = useState("Todos");

	const visible =
		filter === "Todos"
			? COACHES
			: COACHES.filter((c) => c.specialty === filter);

	const programSlug = (specialty: string) =>
		PROGRAMS.find((p) => p.name === specialty)?.slug;

	return (
		<>
			<PageHero
				eyebrow="Treinadores"
				title={
					<>
						Ninguém treina <br />
						<span className="text-yellow-500">no escuro aqui</span>
					</>
				}
				description="Seis coaches com registro no CREF, especialização de verdade e uma média de 11 anos corrigindo execução alheia."
				photo="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1600&q=80"
			/>

			<section className="py-20 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto">
					{/* Filtro por especialidade */}
					<div className="flex flex-wrap gap-3 mb-12">
						{FILTERS.map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setFilter(f)}
								aria-pressed={filter === f}
								className={`px-5 py-2 -skew-x-12 text-xs font-black uppercase italic tracking-wider border-2 transition-colors ${
									filter === f
										? "bg-yellow-500 border-yellow-500 text-black"
										: "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
								}`}
							>
								<span className="skew-x-12 block">{f}</span>
							</button>
						))}
					</div>

					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{visible.map((coach) => {
							const slug = programSlug(coach.specialty);
							return (
								<article
									key={coach.id}
									className="group bg-neutral-950 border border-neutral-800 hover:border-yellow-500 transition-colors flex flex-col"
								>
									<div className="h-72 overflow-hidden relative">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={coach.photo}
											alt={coach.name}
											className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
										/>
										<div className="absolute top-0 left-0 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 uppercase tracking-widest">
											{coach.specialty}
										</div>
									</div>

									<div className="p-6 flex flex-col flex-1">
										<h2 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-yellow-500 transition-colors">
											{coach.name}
										</h2>
										<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-1 mb-4">
											{coach.role}
										</div>

										<p className="text-neutral-400 text-sm font-medium leading-relaxed mb-6">
											{coach.bio}
										</p>

										<ul className="space-y-2 mb-6">
											{coach.credentials.map((c) => (
												<li
													key={c}
													className="flex gap-2 items-start text-xs font-bold uppercase tracking-wide text-neutral-500"
												>
													<BadgeCheck
														size={14}
														className="text-yellow-500 shrink-0 mt-0.5"
													/>
													{c}
												</li>
											))}
										</ul>

										<div className="mt-auto pt-4 border-t border-neutral-800 flex items-center justify-between">
											<span className="text-3xl font-black italic text-yellow-500 leading-none">
												{coach.years}
												<span className="text-xs text-neutral-600 ml-1 not-italic font-bold uppercase tracking-widest">
													anos
												</span>
											</span>

											{slug ? (
												<Link
													href={`/demos/gym/programas/${slug}`}
													className="inline-flex items-center gap-2 text-xs font-black uppercase italic tracking-wider text-white hover:text-yellow-500 transition-colors"
												>
													Aulas de {coach.specialty}
													<ArrowRight size={14} />
												</Link>
											) : (
												<Link
													href="/demos/gym/planos"
													className="inline-flex items-center gap-2 text-xs font-black uppercase italic tracking-wider text-white hover:text-yellow-500 transition-colors"
												>
													Ver planos <ArrowRight size={14} />
												</Link>
											)}
										</div>
									</div>
								</article>
							);
						})}
					</div>

					{visible.length === 0 ? (
						<p className="text-center text-neutral-500 font-bold uppercase tracking-widest py-16">
							Nenhum treinador nessa especialidade.
						</p>
					) : null}
				</div>
			</section>

			<section className="py-20 px-6 bg-black border-t border-white/10">
				<div className="max-w-7xl mx-auto text-center">
					<h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
						Quer treinar com um deles?
					</h2>
					<p className="text-neutral-400 font-medium mb-8 max-w-xl mx-auto">
						Aulas em grupo entram no Iron Pro. Personal trainer com hora marcada
						vem no plano Personal.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<SkewLink href="/demos/gym/planos" variant="solid" size="md">
							Ver planos
						</SkewLink>
						<SkewLink
							href="/demos/gym/matricula?plano=personal"
							variant="outline"
							size="md"
						>
							Matricular no Personal
						</SkewLink>
					</div>
				</div>
			</section>
		</>
	);
}
