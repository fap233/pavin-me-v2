"use client";

import { Search, MapPin, Menu, Bed, Bath, Square } from "lucide-react";

export default function LuxuryPage() {
	return (
		<div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-stone-200">
			{/* Navbar Minimalista e Transparente */}
			{/* mix-blend-difference faz o texto inverter a cor dependendo do fundo (branco/preto) */}
			<nav className="fixed w-full z-50 mix-blend-difference text-white">
				<div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between">
					<div className="text-2xl font-serif tracking-widest uppercase">
						Aurum<span className="text-stone-400">.</span>
					</div>

					<div className="hidden md:flex gap-12 text-xs font-bold tracking-[0.2em] uppercase">
						<a href="#" className="hover:text-stone-400 transition-colors">
							Comprar
						</a>
						<a href="#" className="hover:text-stone-400 transition-colors">
							Alugar
						</a>
						<a href="#" className="hover:text-stone-400 transition-colors">
							Vender
						</a>
						<a href="#" className="hover:text-stone-400 transition-colors">
							Private Office
						</a>
					</div>

					<button className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase hover:text-stone-400 transition-colors">
						Menu <Menu size={20} />
					</button>
				</div>
			</nav>

			{/* Hero Section Imersiva */}
			<section className="relative h-screen w-full overflow-hidden">
				<div className="absolute inset-0">
					<img
						src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
						alt="Luxury Interior"
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-black/20"></div>
				</div>

				<div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
					<p className="font-serif italic text-xl md:text-2xl mb-6 opacity-90">
						Redefinindo o excepcional
					</p>
					<h1 className="text-5xl md:text-8xl font-serif uppercase tracking-widest mb-12 leading-tight">
						Exclusive <br /> Living
					</h1>

					{/* Barra de Busca Flutuante */}
					<div className="bg-white p-2 flex items-center max-w-2xl w-full shadow-2xl">
						<div className="flex-1 px-6 border-r border-stone-100">
							<label className="block text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">
								Localização
							</label>
							<input
								type="text"
								placeholder="Jardins, São Paulo"
								className="w-full outline-none text-stone-800 placeholder-stone-300 font-serif"
							/>
						</div>
						<div className="flex-1 px-6 border-r border-stone-100 hidden md:block">
							<label className="block text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1">
								Tipo
							</label>
							<select className="w-full outline-none text-stone-800 bg-transparent font-serif">
								<option>Cobertura Duplex</option>
								<option>Mansão</option>
								<option>Ilha Privada</option>
							</select>
						</div>
						<button className="bg-stone-900 text-white p-4 hover:bg-stone-800 transition-colors">
							<Search size={20} />
						</button>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-xs tracking-[0.3em] uppercase animate-bounce">
					Discover
				</div>
			</section>

			{/* Intro Text */}
			<section className="py-32 px-8 max-w-4xl mx-auto text-center">
				<span className="block w-px h-20 bg-stone-300 mx-auto mb-10"></span>
				<h2 className="font-serif text-3xl md:text-4xl leading-snug text-stone-800 mb-8">
					&quot;A arquitetura deve falar de seu tempo e lugar, mas anelar pela
					atemporalidade.&quot;
				</h2>
				<p className="text-stone-500 font-serif italic">— Frank Gehry</p>
			</section>

			{/* Featured Properties (Grid Assimétrico) */}
			<section className="px-4 md:px-12 pb-32">
				<div className="flex justify-between items-end mb-12 px-2">
					<h3 className="text-xs font-bold tracking-[0.3em] uppercase text-stone-400">
						Seleção Curada
					</h3>
					<a
						href="#"
						className="text-xs font-bold tracking-[0.2em] uppercase text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
					>
						Ver coleção completa
					</a>
				</div>

				<div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
					{/* Property 1 */}
					<div className="group cursor-pointer">
						<div className="relative overflow-hidden aspect-[4/3] mb-6">
							<img
								src="https://images.unsplash.com/photo-1600596542815-27b88e39e140?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
								alt="House 1"
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] tracking-widest uppercase font-bold">
								Exclusivo
							</div>
						</div>
						<div className="flex justify-between items-start">
							<div>
								<h4 className="font-serif text-2xl mb-1 text-stone-900 group-hover:text-stone-600 transition-colors">
									The Glass House
								</h4>
								<div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
									<MapPin size={14} /> Alto de Pinheiros, SP
								</div>
								<div className="flex gap-6 text-xs text-stone-400 uppercase tracking-wider border-t border-stone-100 pt-4">
									<span className="flex items-center gap-1">
										<Bed size={14} /> 4 Suites
									</span>
									<span className="flex items-center gap-1">
										<Bath size={14} /> 6 Banheiros
									</span>
									<span className="flex items-center gap-1">
										<Square size={14} /> 850m²
									</span>
								</div>
							</div>
							<div className="text-right">
								<p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
									Preço
								</p>
								<p className="font-serif text-xl">R$ 18.500.000</p>
							</div>
						</div>
					</div>

					{/* Property 2 */}
					<div className="group cursor-pointer md:mt-20">
						{" "}
						{/* Offset vertical para dar ritmo */}
						<div className="relative overflow-hidden aspect-[4/3] mb-6">
							<img
								src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
								alt="House 2"
								className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
						<div className="flex justify-between items-start">
							<div>
								<h4 className="font-serif text-2xl mb-1 text-stone-900 group-hover:text-stone-600 transition-colors">
									Villa Toscana
								</h4>
								<div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
									<MapPin size={14} /> Fazenda Boa Vista, SP
								</div>
								<div className="flex gap-6 text-xs text-stone-400 uppercase tracking-wider border-t border-stone-100 pt-4">
									<span className="flex items-center gap-1">
										<Bed size={14} /> 6 Suites
									</span>
									<span className="flex items-center gap-1">
										<Bath size={14} /> 8 Banheiros
									</span>
									<span className="flex items-center gap-1">
										<Square size={14} /> 2.100m²
									</span>
								</div>
							</div>
							<div className="text-right">
								<p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
									Preço
								</p>
								<p className="font-serif text-xl">R$ 42.000.000</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer Minimalista */}
			<footer className="bg-stone-50 py-20 px-12 border-t border-stone-200">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="text-2xl font-serif tracking-widest uppercase">
						Aurum<span className="text-stone-400">.</span>
					</div>
					<div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
						<a href="#">Instagram</a>
						<a href="#">LinkedIn</a>
						<a href="#">Contato</a>
					</div>
					<p className="text-[10px] text-stone-400">
						© 2024 Aurum Real Estate.
					</p>
				</div>
			</footer>
		</div>
	);
}
