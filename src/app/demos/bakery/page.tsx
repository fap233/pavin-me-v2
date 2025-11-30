"use client";

import {
	Coffee,
	MapPin,
	Clock,
	Instagram,
	Facebook,
	Star,
	ArrowRight,
} from "lucide-react";

export default function BakeryPage() {
	return (
		<div className="min-h-screen bg-[#FDF8F5] text-stone-800 font-serif selection:bg-orange-200">
			{/* Navigation */}
			<nav className="fixed w-full z-50 bg-[#FDF8F5]/90 backdrop-blur-sm border-b border-stone-200">
				<div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="text-2xl font-bold tracking-widest text-stone-900 uppercase">
						Farine<span className="text-orange-700">.</span>
					</div>
					<div className="hidden md:flex gap-8 font-sans text-sm tracking-wide text-stone-600 font-medium">
						<a href="#" className="hover:text-orange-700 transition-colors">
							MENU
						</a>
						<a href="#" className="hover:text-orange-700 transition-colors">
							NOSSA HISTÓRIA
						</a>
						<a href="#" className="hover:text-orange-700 transition-colors">
							LOCAIS
						</a>
					</div>
					<button className="bg-stone-900 text-[#FDF8F5] px-6 py-2 rounded-sm font-sans text-sm hover:bg-orange-800 transition-colors">
						PEÇA ONLINE
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center">
				<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
					<div className="order-2 md:order-1 space-y-8">
						<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
							Est. 2018 — São Paulo
						</span>
						<h1 className="text-6xl md:text-7xl leading-[1.1] font-medium text-stone-900">
							O pão como <br />
							<span className="italic text-stone-500">arte diária.</span>
						</h1>
						<p className="font-sans text-stone-600 text-lg leading-relaxed max-w-md border-l-2 border-orange-700 pl-6">
							Fermentação natural de 48 horas. Farinhas orgânicas importadas. Um
							café que abraça a alma. Bem-vindo à Farine.
						</p>
						<div className="flex gap-4 pt-4">
							<button className="bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2 group">
								Ver Cardápio
								<ArrowRight
									size={16}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</button>
						</div>
					</div>
					<div className="order-1 md:order-2 relative">
						{/* Imagem Principal */}
						<div className="relative z-10 h-[500px] w-full bg-stone-200 overflow-hidden rounded-t-[10rem] rounded-b-none shadow-2xl">
							{/* Nota: Em produção, configure o next/image para otimização */}
							<img
								src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
								alt="Pão artesanal"
								className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							/>
						</div>
						{/* Elemento Decorativo */}
						<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-700 rounded-full flex items-center justify-center z-20 text-[#FDF8F5] animate-spin-slow p-2">
							<div className="text-center text-xs font-sans font-bold leading-tight">
								FRESH
								<br />
								EVERY
								<br />
								MORNING
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Destaques (Features) */}
			<section className="py-24 bg-stone-900 text-[#FDF8F5]">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-3 gap-12">
						{[
							{
								icon: <Coffee size={32} />,
								title: "Grãos Especiais",
								desc: "Microlotes selecionados de produtores locais do Sul de Minas.",
							},
							{
								icon: <Star size={32} />,
								title: "Levain 100% Natural",
								desc: "Sem aditivos químicos. Apenas farinha, água, sal e paciência.",
							},
							{
								icon: <Clock size={32} />,
								title: "Sempre Fresco",
								desc: "Fornadas saindo às 07h, 11h e 16h todos os dias.",
							},
						].map((item, i) => (
							<div key={i} className="text-center md:text-left space-y-4 group">
								<div className="w-16 h-16 rounded-full border border-stone-700 flex items-center justify-center text-orange-200 group-hover:bg-orange-700 group-hover:border-orange-700 transition-colors mx-auto md:mx-0">
									{item.icon}
								</div>
								<h3 className="text-xl font-medium">{item.title}</h3>
								<p className="font-sans text-stone-400 leading-relaxed text-sm">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Galeria / Menu Preview */}
			<section className="py-24 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
							Nossos Favoritos
						</span>
						<h2 className="text-4xl md:text-5xl text-stone-900">
							Do Forno para a Mesa
						</h2>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
								title: "Croissant",
								price: "R$ 12",
							},
							{
								img: "https://images.unsplash.com/photo-1585476263060-655037f549dd?auto=format&fit=crop&w=600&q=80",
								title: "Sourdough Clássico",
								price: "R$ 28",
							},
							{
								img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
								title: "Café Latte",
								price: "R$ 14",
							},
							{
								img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=600&q=80",
								title: "Cinnamon Roll",
								price: "R$ 16",
							},
						].map((item, i) => (
							<div key={i} className="group cursor-pointer">
								<div className="overflow-hidden mb-4">
									<img
										src={item.img}
										alt={item.title}
										className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
									/>
								</div>
								<div className="flex justify-between items-end">
									<h3 className="text-xl text-stone-900">{item.title}</h3>
									<span className="font-sans font-bold text-orange-700">
										{item.price}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Footer Info */}
			<footer className="bg-[#F3EFEA] border-t border-stone-200 py-16 px-6 font-sans">
				<div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
					<div>
						<div className="text-xl font-serif font-bold tracking-widest text-stone-900 uppercase mb-6">
							Farine.
						</div>
						<p className="text-stone-600 text-sm leading-relaxed">
							Padaria artesanal focada em ingredientes reais e processos lentos.
							Feito com amor em São Paulo.
						</p>
					</div>
					<div>
						<h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">
							Contato
						</h4>
						<div className="space-y-3 text-stone-600 text-sm">
							<div className="flex items-center gap-3">
								<MapPin size={16} /> Rua dos Pinheiros, 1234
							</div>
							<div className="flex items-center gap-3">
								<Instagram size={16} /> @farine.padaria
							</div>
							<div className="flex items-center gap-3">
								<Facebook size={16} /> /farinepadaria
							</div>
						</div>
					</div>
					<div>
						<h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">
							Horários
						</h4>
						<div className="space-y-2 text-stone-600 text-sm">
							<p>Seg - Sex: 07h às 19h</p>
							<p>Sáb - Dom: 08h às 16h</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
