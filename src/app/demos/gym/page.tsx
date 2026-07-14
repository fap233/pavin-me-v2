import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { SkewLink, SectionHeading } from "./_components/ui";
import { PLANS, PROGRAMS, COACHES, brl } from "./_data/gym";

export default function GymPage() {
	return (
		<>
			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{/* Background Image com Overlay */}
				<div className="absolute inset-0 z-0">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
						alt="Gym Background"
						className="w-full h-full object-cover opacity-40 grayscale"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent"></div>
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
					<h2 className="text-yellow-500 font-bold tracking-[0.5em] uppercase mb-4 animate-pulse">
						Sem Desculpas
					</h2>
					<h1 className="text-6xl md:text-8xl font-black italic uppercase leading-none mb-8">
						Construa sua <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
							Melhor Versão
						</span>
					</h1>
					<p className="text-xl text-neutral-300 max-w-2xl mx-auto mb-10 font-medium">
						Alta intensidade. Equipamentos de elite. Uma comunidade que não
						aceita falhas. O seu corpo dos sonhos é forjado no ferro.
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center">
						<Link
							href="/demos/gym/matricula"
							className="bg-yellow-500 text-black px-10 py-4 font-black text-xl uppercase italic -skew-x-12 hover:bg-white hover:scale-105 transition-all group"
						>
							<span className="skew-x-12 flex items-center justify-center gap-2">
								Começar Hoje{" "}
								<ArrowRight className="group-hover:translate-x-1 transition-transform" />
							</span>
						</Link>
						<Link
							href="/demos/gym/planos"
							className="border-2 border-white text-white px-10 py-4 font-bold text-xl uppercase italic -skew-x-12 hover:bg-white hover:text-black transition-all"
						>
							<span className="skew-x-12 block">Ver Planos</span>
						</Link>
					</div>
				</div>

				{/* Stats Strip */}
				<div className="absolute bottom-0 w-full bg-yellow-500 text-black py-6 border-t-4 border-black">
					<div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center text-center gap-4">
						<div className="flex-1">
							<div className="text-3xl font-black italic">24/7</div>
							<div className="text-xs font-bold uppercase tracking-widest">
								Acesso Total
							</div>
						</div>
						<div className="w-px h-10 bg-black/20 hidden md:block"></div>
						<div className="flex-1">
							<div className="text-3xl font-black italic">+50</div>
							<div className="text-xs font-bold uppercase tracking-widest">
								Equipamentos
							</div>
						</div>
						<div className="w-px h-10 bg-black/20 hidden md:block"></div>
						<div className="flex-1">
							<div className="text-3xl font-black italic">PRO</div>
							<div className="text-xs font-bold uppercase tracking-widest">
								Treinadores
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section (Dark Cards) */}
			<section className="py-24 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto">
					<SectionHeading title="Planos de Acesso" />

					<div className="grid md:grid-cols-3 gap-8 items-center">
						{PLANS.map((plan) => {
							const popular = plan.popular;
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
										className={`text-xl font-bold uppercase mb-2 ${
											popular ? "text-yellow-500" : "text-neutral-400"
										}`}
									>
										{plan.name}
									</h3>
									<div
										className={`font-black text-white mb-6 ${
											popular ? "text-5xl" : "text-4xl"
										}`}
									>
										{brl(plan.monthly)}
										<span className="text-lg text-neutral-500 font-medium">
											/mês
										</span>
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
										href={`/demos/gym/matricula?plano=${plan.id}`}
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

					<div className="text-center mt-12">
						<SkewLink href="/demos/gym/planos" variant="ghost" size="sm">
							Comparar planos em detalhe{" "}
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</SkewLink>
					</div>
				</div>
			</section>

			{/* Motivation Grid — cada tile abre a página da modalidade */}
			<section className="py-20 bg-black">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-[400px] lg:h-[400px]">
					{PROGRAMS.map((program) => (
						<Link
							key={program.slug}
							href={`/demos/gym/programas/${program.slug}`}
							style={{ backgroundImage: `url('${program.photo}')` }}
							className="bg-cover bg-center group relative cursor-pointer min-h-[160px]"
						>
							<div className="absolute inset-0 bg-black/60 group-hover:bg-yellow-500/80 transition-colors flex flex-col items-center justify-center gap-2">
								<h3 className="text-2xl font-black italic uppercase text-white group-hover:text-black tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform">
									{program.name}
								</h3>
								<span className="text-xs font-bold uppercase tracking-widest text-transparent group-hover:text-black transition-colors flex items-center gap-1">
									Ver programa <ArrowRight size={14} />
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Treinadores (teaser) */}
			<section className="py-24 px-6 bg-neutral-900">
				<div className="max-w-7xl mx-auto">
					<SectionHeading
						title="Quem comanda o ferro"
						subtitle="Seis coaches, nenhum improviso. Cada programa tem um responsável técnico com registro no CREF."
					/>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{COACHES.slice(0, 4).map((coach) => (
							<Link
								key={coach.id}
								href="/demos/gym/treinadores"
								className="group border border-neutral-800 bg-neutral-950 hover:border-yellow-500 transition-colors"
							>
								<div className="h-48 overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={coach.photo}
										alt={coach.name}
										className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
									/>
								</div>
								<div className="p-4">
									<div className="font-black italic uppercase tracking-tighter text-white group-hover:text-yellow-500 transition-colors">
										{coach.name}
									</div>
									<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-1">
										{coach.specialty}
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="text-center mt-12">
						<SkewLink href="/demos/gym/treinadores" variant="outline" size="sm">
							Conhecer a equipe
						</SkewLink>
					</div>
				</div>
			</section>

			{/* CTA final */}
			<section className="bg-yellow-500 text-black py-16 px-6 border-y-4 border-black">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
					<div>
						<h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
							A primeira semana <br /> é por nossa conta.
						</h2>
						<p className="font-bold uppercase tracking-widest text-sm mt-4 text-black/70">
							Sem taxa de adesão · Sem fidelidade · Cancele quando quiser
						</p>
					</div>
					<Link
						href="/demos/gym/matricula?plano=iron-pro"
						className="bg-black text-white px-10 py-4 font-black text-xl uppercase italic -skew-x-12 hover:bg-neutral-900 transition-all group shrink-0"
					>
						<span className="skew-x-12 flex items-center gap-2">
							Matricule-se
							<ArrowRight className="group-hover:translate-x-1 transition-transform" />
						</span>
					</Link>
				</div>
			</section>
		</>
	);
}
