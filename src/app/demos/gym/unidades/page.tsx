"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Clock, MapPin, Phone } from "lucide-react";
import { PageHero, SkewLink } from "../_components/ui";
import { UNITS, programBySlug } from "../_data/gym";

export default function UnidadesPage() {
	const [selectedId, setSelectedId] = useState(UNITS[0].id);
	const selected = UNITS.find((u) => u.id === selectedId) ?? UNITS[0];

	return (
		<>
			<PageHero
				eyebrow="Unidades"
				title={
					<>
						Três galpões <br />
						<span className="text-yellow-500">de ferro puro</span>
					</>
				}
				description="Vila Madalena, Moema e Santo André. O plano Pro libera duas unidades; o Personal libera todas."
				photo="https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1600&q=80"
			/>

			<section className="py-20 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto">
					{/* Seletor de unidade */}
					<div className="flex flex-wrap gap-3 mb-12">
						{UNITS.map((unit) => (
							<button
								key={unit.id}
								type="button"
								onClick={() => setSelectedId(unit.id)}
								aria-pressed={selectedId === unit.id}
								className={`px-6 py-3 -skew-x-12 text-sm font-black uppercase italic tracking-wider border-2 transition-colors ${
									selectedId === unit.id
										? "bg-yellow-500 border-yellow-500 text-black"
										: "border-neutral-700 text-neutral-400 hover:border-white hover:text-white"
								}`}
							>
								<span className="skew-x-12 block">
									{unit.name.replace("Iron Forge — ", "")}
								</span>
							</button>
						))}
					</div>

					<div className="grid gap-8 lg:grid-cols-2 items-stretch">
						{/* Foto + mapa fake */}
						<div className="relative min-h-[340px] border border-neutral-800">
							<div
								style={{ backgroundImage: `url('${selected.photo}')` }}
								className="absolute inset-0 bg-cover bg-center grayscale"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

							{selected.flagship ? (
								<div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-black px-4 py-1.5 uppercase tracking-widest">
									Matriz
								</div>
							) : null}

							<div className="absolute bottom-0 left-0 right-0 p-6">
								<h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">
									{selected.name.replace("Iron Forge — ", "")}
								</h2>
								<div className="flex items-start gap-2 text-neutral-300 text-sm font-medium">
									<MapPin size={16} className="text-yellow-500 shrink-0 mt-0.5" />
									{selected.address}
								</div>
								<div className="flex items-center gap-2 text-neutral-300 text-sm font-medium mt-2">
									<Phone size={16} className="text-yellow-500 shrink-0" />
									{selected.phone}
								</div>
							</div>
						</div>

						{/* Horários + estrutura */}
						<div className="bg-neutral-950 border border-neutral-800 p-8">
							<div className="mb-8">
								<div className="flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
									<Clock size={14} /> Horários
								</div>
								<ul className="divide-y divide-neutral-800">
									{selected.hours.map((h) => (
										<li
											key={h.label}
											className="flex items-center justify-between py-3"
										>
											<span className="text-sm font-bold uppercase tracking-wide text-neutral-400">
												{h.label}
											</span>
											<span
												className={`text-sm font-black italic uppercase tracking-tighter ${
													h.value === "Fechado"
														? "text-neutral-600"
														: "text-white"
												}`}
											>
												{h.value}
											</span>
										</li>
									))}
								</ul>
							</div>

							<div className="mb-8">
								<div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
									Estrutura
								</div>
								<ul className="grid sm:grid-cols-2 gap-2">
									{selected.structure.map((s) => (
										<li
											key={s}
											className="flex gap-2 items-start text-sm font-medium text-neutral-300"
										>
											<Check
												size={16}
												className="text-yellow-500 shrink-0 mt-0.5"
											/>
											{s}
										</li>
									))}
								</ul>
							</div>

							<div className="mb-8">
								<div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">
									Programas nesta unidade
								</div>
								<div className="flex flex-wrap gap-2">
									{selected.programs.map((slug) => {
										const program = programBySlug(slug);
										if (!program) return null;
										return (
											<Link
												key={slug}
												href={`/demos/gym/programas/${slug}`}
												className="px-4 py-2 -skew-x-12 border border-neutral-700 text-neutral-300 text-xs font-black uppercase italic tracking-wider hover:border-yellow-500 hover:text-yellow-500 transition-colors"
											>
												<span className="skew-x-12 block">{program.name}</span>
											</Link>
										);
									})}
								</div>
							</div>

							<SkewLink
								href={`/demos/gym/matricula?plano=iron-pro&unidade=${selected.id}`}
								variant="solid"
								size="md"
								className="w-full"
							>
								Matricular nesta unidade <ArrowRight size={18} />
							</SkewLink>
						</div>
					</div>
				</div>
			</section>

			{/* Todas as unidades em lista */}
			<section className="py-20 px-6 bg-black border-t border-white/10">
				<div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-3">
					{UNITS.map((unit) => (
						<button
							key={unit.id}
							type="button"
							onClick={() => {
								setSelectedId(unit.id);
								window.scrollTo({ top: 0, behavior: "smooth" });
							}}
							className={`text-left p-6 border-2 transition-colors ${
								selectedId === unit.id
									? "border-yellow-500 bg-neutral-900"
									: "border-neutral-800 bg-neutral-950 hover:border-white"
							}`}
						>
							<div className="text-xl font-black italic uppercase tracking-tighter text-white mb-1">
								{unit.name.replace("Iron Forge — ", "")}
							</div>
							<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
								{unit.city}
							</div>
							<p className="text-sm text-neutral-400 font-medium">
								{unit.address}
							</p>
							<div className="mt-4 text-xs font-black uppercase italic tracking-wider text-yellow-500 flex items-center gap-2">
								Ver detalhes <ArrowRight size={14} />
							</div>
						</button>
					))}
				</div>
			</section>
		</>
	);
}
