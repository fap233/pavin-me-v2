import Link from "next/link";
import { ArrowRight, Clock, Flame } from "lucide-react";
import { PageHero, IntensityBar, SkewLink } from "../_components/ui";
import { PROGRAMS, coachById } from "../_data/gym";

export default function ProgramasPage() {
	return (
		<>
			<PageHero
				eyebrow="Programas"
				title={
					<>
						Quatro jeitos <br />
						<span className="text-yellow-500">de sofrer bem</span>
					</>
				}
				description="Cada modalidade tem coach responsável, grade fixa de aulas e turma com tamanho limitado. Clique em qualquer uma pra ver a grade da semana e reservar sua vaga."
				photo="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80"
			/>

			<section className="py-20 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2">
					{PROGRAMS.map((program) => {
						const coach = coachById(program.coachId);
						return (
							<Link
								key={program.slug}
								href={`/demos/gym/programas/${program.slug}`}
								className="group relative block border border-neutral-800 bg-neutral-950 hover:border-yellow-500 transition-colors overflow-hidden"
							>
								<div className="h-56 overflow-hidden relative">
									<div
										style={{ backgroundImage: `url('${program.photo}')` }}
										className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
									/>
									<div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors" />
									<h2 className="absolute bottom-4 left-6 text-4xl font-black italic uppercase tracking-tighter text-white group-hover:text-yellow-500 transition-colors">
										{program.name}
									</h2>
								</div>

								<div className="p-6">
									<p className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-4">
										{program.tagline}
									</p>
									<p className="text-neutral-400 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
										{program.description}
									</p>

									<div className="flex flex-wrap items-center gap-6 mb-6">
										<div>
											<div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1">
												Intensidade
											</div>
											<IntensityBar value={program.intensity} />
										</div>
										<div className="flex items-center gap-2 text-neutral-300 text-sm font-bold uppercase tracking-wide">
											<Clock size={16} className="text-yellow-500" />
											{program.duration}
										</div>
										<div className="flex items-center gap-2 text-neutral-300 text-sm font-bold uppercase tracking-wide">
											<Flame size={16} className="text-yellow-500" />
											{program.calories}
										</div>
									</div>

									<div className="flex items-center justify-between border-t border-neutral-800 pt-4">
										<span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
											Coach {coach?.name}
										</span>
										<span className="flex items-center gap-2 text-xs font-black uppercase italic tracking-wider text-white group-hover:text-yellow-500 transition-colors">
											Ver grade
											<ArrowRight
												size={16}
												className="group-hover:translate-x-1 transition-transform"
											/>
										</span>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				<div className="max-w-7xl mx-auto text-center mt-16">
					<p className="text-neutral-400 font-medium mb-6">
						Aulas em grupo estão inclusas a partir do plano{" "}
						<span className="text-yellow-500 font-bold">Iron Pro</span>.
					</p>
					<SkewLink href="/demos/gym/planos" variant="solid" size="md">
						Ver planos <ArrowRight size={18} />
					</SkewLink>
				</div>
			</section>
		</>
	);
}
