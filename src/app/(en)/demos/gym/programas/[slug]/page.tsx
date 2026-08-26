"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, Flame, Users } from "lucide-react";
import { PageHero, IntensityBar, SkewLink } from "../../_components/ui";
import {
	DAYS,
	PROGRAMS,
	coachById,
	programBySlug,
	type ClassSlot,
} from "../../_data/gym";

export default function ProgramaDetalhePage() {
	const params = useParams<{ slug: string }>();
	const slug = typeof params.slug === "string" ? params.slug : "";
	const program = programBySlug(slug);

	// Reservas ficam só na memória do client: a demo não tem backend.
	const [reserved, setReserved] = useState<string[]>([]);

	const byDay = useMemo(() => {
		const map: Record<string, ClassSlot[]> = {};
		for (const day of DAYS) map[day] = [];
		if (program) {
			for (const slot of program.schedule) {
				map[slot.day]?.push(slot);
			}
		}
		return map;
	}, [program]);

	if (!program) notFound();

	const coach = coachById(program.coachId);
	const others = PROGRAMS.filter((p) => p.slug !== program.slug);

	const keyOf = (slot: ClassSlot) => `${slot.day}-${slot.time}`;
	const isReserved = (slot: ClassSlot) => reserved.includes(keyOf(slot));

	const toggle = (slot: ClassSlot) => {
		const key = keyOf(slot);
		setReserved((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
		);
	};

	return (
		<>
			<PageHero
				eyebrow={`Programas / ${program.name}`}
				title={program.name}
				description={program.tagline}
				photo={program.photo}
			>
				<div className="mt-8 flex flex-wrap gap-8 items-end">
					<div>
						<div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
							Intensidade
						</div>
						<IntensityBar value={program.intensity} />
					</div>
					<div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-sm">
						<Clock size={18} className="text-yellow-500" />
						{program.duration}
					</div>
					<div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-sm">
						<Flame size={18} className="text-yellow-500" />
						{program.calories}
					</div>
					<div className="flex items-center gap-2 text-white font-bold uppercase tracking-wide text-sm">
						<Users size={18} className="text-yellow-500" />
						{program.level}
					</div>
				</div>
			</PageHero>

			{/* O que é + coach */}
			<section className="py-20 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto grid gap-12 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
							O que é
						</h2>
						<div className="w-24 h-2 bg-yellow-500 -skew-x-12 mb-8" />
						<p className="text-neutral-300 text-lg font-medium leading-relaxed mb-10">
							{program.description}
						</p>

						<ul className="grid sm:grid-cols-2 gap-4">
							{program.highlights.map((h) => (
								<li
									key={h}
									className="flex gap-3 items-start bg-neutral-950 border border-neutral-800 p-4"
								>
									<Check size={18} className="text-yellow-500 shrink-0 mt-0.5" />
									<span className="text-neutral-300 text-sm font-medium">
										{h}
									</span>
								</li>
							))}
						</ul>
					</div>

					{/* Coach responsável */}
					{coach ? (
						<div className="bg-neutral-950 border border-neutral-800 self-start">
							<div className="h-64 overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={coach.photo}
									alt={coach.name}
									className="w-full h-full object-cover grayscale"
								/>
							</div>
							<div className="p-6">
								<div className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mb-2">
									Coach responsável
								</div>
								<div className="text-2xl font-black italic uppercase tracking-tighter mb-1">
									{coach.name}
								</div>
								<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
									{coach.years} anos de casa
								</div>
								<p className="text-neutral-400 text-sm font-medium leading-relaxed mb-4">
									{coach.bio}
								</p>
								<ul className="space-y-1 mb-6">
									{coach.credentials.map((c) => (
										<li
											key={c}
											className="text-xs font-bold uppercase tracking-wide text-neutral-500"
										>
											· {c}
										</li>
									))}
								</ul>
								<Link
									href="/demos/gym/treinadores"
									className="text-xs font-black uppercase italic tracking-wider text-white hover:text-yellow-500 transition-colors inline-flex items-center gap-2"
								>
									Ver equipe completa <ArrowRight size={14} />
								</Link>
							</div>
						</div>
					) : null}
				</div>
			</section>

			{/* Grade semanal */}
			<section className="py-20 px-6 bg-black">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
						<div>
							<h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4">
								Grade da semana
							</h2>
							<div className="w-24 h-2 bg-yellow-500 -skew-x-12" />
							<p className="mt-6 text-neutral-400 font-medium max-w-xl">
								Clique numa aula pra reservar sua vaga. Turmas lotadas entram em
								lista de espera automaticamente.
							</p>
						</div>

						<div className="shrink-0 border-2 border-yellow-500 bg-neutral-950 p-4 -skew-x-12">
							<div className="skew-x-12 flex items-center gap-4">
								<div>
									<div className="text-3xl font-black italic text-yellow-500 leading-none">
										{reserved.length}
									</div>
									<div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">
										{reserved.length === 1
											? "aula reservada"
											: "aulas reservadas"}
									</div>
								</div>
								{reserved.length > 0 ? (
									<button
										type="button"
										onClick={() => setReserved([])}
										className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors underline underline-offset-4"
									>
										Limpar
									</button>
								) : null}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						{DAYS.map((day) => (
							<div key={day} className="flex flex-col">
								<div className="bg-yellow-500 text-black text-center font-black italic uppercase tracking-tighter py-2 mb-3">
									{day}
								</div>

								<div className="flex flex-col gap-3">
									{byDay[day].length === 0 ? (
										<div className="border border-dashed border-neutral-800 p-4 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-700">
											Sem aula
										</div>
									) : null}

									{byDay[day].map((slot) => {
										const full = slot.taken >= slot.spots;
										const mine = isReserved(slot);
										const left = slot.spots - slot.taken;

										return (
											<button
												key={keyOf(slot)}
												type="button"
												onClick={() => toggle(slot)}
												aria-pressed={mine}
												className={`text-left p-4 border-2 transition-all ${
													mine
														? "bg-yellow-500 border-yellow-500 text-black"
														: full
															? "bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-600"
															: "bg-neutral-900 border-neutral-800 text-white hover:border-yellow-500 hover:-translate-y-0.5"
												}`}
											>
												<div className="font-black italic text-xl tracking-tighter leading-none">
													{slot.time}
												</div>
												<div
													className={`text-[11px] font-bold uppercase tracking-wide mt-2 leading-tight ${
														mine ? "text-black/70" : "text-neutral-400"
													}`}
												>
													{slot.label}
												</div>
												<div
													className={`text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center gap-1 ${
														mine
															? "text-black"
															: full
																? "text-neutral-600"
																: "text-yellow-500"
													}`}
												>
													{mine ? (
														<>
															<Check size={12} />{" "}
															{full ? "Na espera" : "Reservado"}
														</>
													) : full ? (
														"Lotada · espera"
													) : (
														`${left} ${left === 1 ? "vaga" : "vagas"}`
													)}
												</div>
											</button>
										);
									})}
								</div>
							</div>
						))}
					</div>

					{reserved.length > 0 ? (
						<div className="mt-10 border-l-4 border-yellow-500 bg-neutral-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
							<p className="font-bold uppercase tracking-wide text-sm text-neutral-300">
								{reserved.length}{" "}
								{reserved.length === 1
									? "aula guardada no seu nome"
									: "aulas guardadas no seu nome"}
								. Pra confirmar, é só ter um plano ativo.
							</p>
							<SkewLink
								href="/demos/gym/matricula?plano=iron-pro"
								variant="solid"
								size="sm"
								className="shrink-0"
							>
								Confirmar com o Iron Pro <ArrowRight size={16} />
							</SkewLink>
						</div>
					) : null}
				</div>
			</section>

			{/* Outros programas */}
			<section className="py-20 px-6 bg-neutral-900 border-t border-white/10">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-black italic uppercase tracking-tighter">
							Outros programas
						</h2>
						<Link
							href="/demos/gym/programas"
							className="text-xs font-black uppercase italic tracking-wider text-neutral-400 hover:text-yellow-500 transition-colors inline-flex items-center gap-2"
						>
							<ArrowLeft size={14} /> Todos
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{others.map((p) => (
							<Link
								key={p.slug}
								href={`/demos/gym/programas/${p.slug}`}
								style={{ backgroundImage: `url('${p.photo}')` }}
								className="group relative h-40 bg-cover bg-center"
							>
								<div className="absolute inset-0 bg-black/70 group-hover:bg-yellow-500/80 transition-colors flex items-center justify-center">
									<span className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-black transition-colors">
										{p.name}
									</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
