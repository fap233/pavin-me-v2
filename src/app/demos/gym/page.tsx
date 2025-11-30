"use client";

import { Flame, ArrowRight, Check } from "lucide-react";

export default function GymPage() {
	return (
		<div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-yellow-500 selection:text-black">
			{/* Navbar com corte diagonal */}
			<nav className="fixed w-full z-50 bg-black/90 border-b border-white/10 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2">
						<Flame className="text-yellow-500 fill-yellow-500" />
						IRON<span className="text-yellow-500">FORGE</span>
					</div>
					<div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-neutral-400">
						<a href="#" className="hover:text-yellow-500 transition-colors">
							Programas
						</a>
						<a href="#" className="hover:text-yellow-500 transition-colors">
							Treinadores
						</a>
						<a href="#" className="hover:text-yellow-500 transition-colors">
							Unidades
						</a>
					</div>
					<button className="bg-yellow-500 text-black px-6 py-2 font-black uppercase italic -skew-x-12 hover:bg-white transition-colors">
						<span className="skew-x-12 block">Matricule-se</span>
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative h-screen flex items-center justify-center overflow-hidden">
				{/* Background Image com Overlay */}
				<div className="absolute inset-0 z-0">
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
						<button className="bg-yellow-500 text-black px-10 py-4 font-black text-xl uppercase italic -skew-x-12 hover:bg-white hover:scale-105 transition-all group">
							<span className="skew-x-12 flex items-center gap-2">
								Começar Hoje{" "}
								<ArrowRight className="group-hover:translate-x-1 transition-transform" />
							</span>
						</button>
						<button className="border-2 border-white text-white px-10 py-4 font-bold text-xl uppercase italic -skew-x-12 hover:bg-white hover:text-black transition-all">
							<span className="skew-x-12 block">Ver Planos</span>
						</button>
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
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-4">
							Planos de Acesso
						</h2>
						<div className="w-24 h-2 bg-yellow-500 mx-auto -skew-x-12"></div>
					</div>

					<div className="grid md:grid-cols-3 gap-8 items-center">
						{/* Basic */}
						<div className="bg-neutral-800 p-8 border border-neutral-700 hover:border-white transition-colors group">
							<h3 className="text-xl font-bold uppercase text-neutral-400 mb-2">
								Iron Basic
							</h3>
							<div className="text-4xl font-black text-white mb-6">
								R$ 89
								<span className="text-lg text-neutral-500 font-medium">
									/mês
								</span>
							</div>
							<ul className="space-y-4 mb-8 text-neutral-300 text-sm">
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Acesso horário
									limitado
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Área de
									musculação
								</li>
								<li className="flex items-center gap-3 text-neutral-600">
									<Check size={16} /> Aulas em grupo
								</li>
							</ul>
							<button className="w-full py-3 border border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
								Escolher
							</button>
						</div>

						{/* Pro (Highlighted) */}
						<div className="bg-neutral-800 p-8 border-2 border-yellow-500 relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
							<div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 uppercase transform translate-x-2 -translate-y-2">
								Popular
							</div>
							<h3 className="text-xl font-bold uppercase text-yellow-500 mb-2">
								Iron Pro
							</h3>
							<div className="text-5xl font-black text-white mb-6">
								R$ 149
								<span className="text-lg text-neutral-500 font-medium">
									/mês
								</span>
							</div>
							<ul className="space-y-4 mb-8 text-white text-sm">
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Acesso 24h
									irrestrito
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Aulas de
									Crossfit
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Direito a 1
									convidado
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> App de Treino
									Exclusivo
								</li>
							</ul>
							<button className="w-full py-4 bg-yellow-500 text-black font-black uppercase italic tracking-wider hover:bg-white transition-colors">
								Começar Agora
							</button>
						</div>

						{/* Ultra */}
						<div className="bg-neutral-800 p-8 border border-neutral-700 hover:border-white transition-colors">
							<h3 className="text-xl font-bold uppercase text-neutral-400 mb-2">
								Personal
							</h3>
							<div className="text-4xl font-black text-white mb-6">
								R$ 299
								<span className="text-lg text-neutral-500 font-medium">
									/mês
								</span>
							</div>
							<ul className="space-y-4 mb-8 text-neutral-300 text-sm">
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Tudo do plano
									Pro
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> 4h Personal
									Trainer
								</li>
								<li className="flex items-center gap-3">
									<Check size={16} className="text-yellow-500" /> Nutricionista
									mensal
								</li>
							</ul>
							<button className="w-full py-3 border border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
								Escolher
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Motivation Grid */}
			<section className="py-20 bg-black">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-[400px]">
					<div className="bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center group relative cursor-pointer">
						<div className="absolute inset-0 bg-black/60 group-hover:bg-yellow-500/80 transition-colors flex items-center justify-center">
							<h3 className="text-2xl font-black italic uppercase text-white group-hover:text-black tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform">
								Crossfit
							</h3>
						</div>
					</div>
					<div className="bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center group relative cursor-pointer">
						<div className="absolute inset-0 bg-black/60 group-hover:bg-yellow-500/80 transition-colors flex items-center justify-center">
							<h3 className="text-2xl font-black italic uppercase text-white group-hover:text-black tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform">
								Musculação
							</h3>
						</div>
					</div>
					<div className="bg-[url('https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center group relative cursor-pointer">
						<div className="absolute inset-0 bg-black/60 group-hover:bg-yellow-500/80 transition-colors flex items-center justify-center">
							<h3 className="text-2xl font-black italic uppercase text-white group-hover:text-black tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform">
								Cardio
							</h3>
						</div>
					</div>
					<div className="bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center group relative cursor-pointer">
						<div className="absolute inset-0 bg-black/60 group-hover:bg-yellow-500/80 transition-colors flex items-center justify-center">
							<h3 className="text-2xl font-black italic uppercase text-white group-hover:text-black tracking-tighter transform translate-y-4 group-hover:translate-y-0 transition-transform">
								Boxe
							</h3>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
