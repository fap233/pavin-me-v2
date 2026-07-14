import Link from "next/link";
import { ArrowRight, Clock, Coffee, Star } from "lucide-react";

import { AddButton } from "./_components/AddButton";
import { CartBar } from "./_components/CartBar";
import { ProductImage } from "./_components/ProductImage";
import {
	HIGHLIGHT_IDS,
	formatBRL,
	productById,
	type Product,
} from "./_components/data";

/**
 * Home da Farine.
 *
 * A identidade visual é a da versão estática original (creme #FDF8F5, serifa +
 * sans, laranja 700, arco na foto do hero, selo girando). O que mudou é que
 * nada aqui é decorativo: cada botão leva a uma rota real e cada card de
 * produto joga o item no carrinho.
 */

const HIGHLIGHTS = HIGHLIGHT_IDS.map((id) => productById(id)).filter(
	(product): product is Product => product !== undefined,
);

const FEATURES = [
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
];

export default function BakeryPage() {
	return (
		<>
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
						<div className="flex flex-wrap gap-4 pt-4">
							<Link
								href="/demos/bakery/cardapio"
								className="bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-stone-800 transition-colors flex items-center gap-2 group"
							>
								Ver Cardápio
								<ArrowRight
									size={16}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</Link>
							<Link
								href="/demos/bakery/historia"
								className="border border-stone-300 text-stone-700 px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:border-orange-700 hover:text-orange-700 transition-colors flex items-center gap-2"
							>
								Nossa História
							</Link>
						</div>
					</div>
					<div className="order-1 md:order-2 relative">
						{/* Imagem Principal */}
						<div className="group relative z-10 h-[500px] w-full bg-stone-200 overflow-hidden rounded-t-[10rem] rounded-b-none shadow-2xl">
							<ProductImage
								src="https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
								alt="Pão artesanal"
								zoom={false}
								className="w-full h-full hover:scale-105 transition-transform duration-700"
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
						{FEATURES.map((item, i) => (
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
						{HIGHLIGHTS.map((item) => (
							<div key={item.id} className="group">
								<Link
									href="/demos/bakery/cardapio"
									className="block overflow-hidden mb-4 relative"
									aria-label={`Ver ${item.name} no cardápio`}
								>
									<ProductImage
										src={item.img}
										alt={item.name}
										className="w-full h-80"
									/>
									<span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-stone-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 font-sans text-xs uppercase tracking-widest text-[#FDF8F5]">
										Ver no cardápio
									</span>
								</Link>
								<div className="flex justify-between items-end mb-4">
									<h3 className="text-xl text-stone-900">{item.name}</h3>
									<span className="font-sans font-bold text-orange-700">
										{formatBRL(item.price)}
									</span>
								</div>
								<AddButton product={item} variant="outline" className="w-full" />
							</div>
						))}
					</div>

					<div className="text-center mt-16">
						<Link
							href="/demos/bakery/cardapio"
							className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-stone-700 border-b border-stone-300 pb-1 hover:text-orange-700 hover:border-orange-700 transition-colors group"
						>
							Ver cardápio completo
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
					</div>
				</div>
			</section>

			{/* Chamada final */}
			<section className="pb-24 px-6">
				<div className="max-w-6xl mx-auto bg-[#F3EFEA] border border-stone-200 px-8 py-16 text-center space-y-6">
					<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
						Fornadas às 07h · 11h · 16h
					</span>
					<h2 className="text-4xl md:text-5xl text-stone-900 max-w-2xl mx-auto leading-tight">
						Peça agora e receba <span className="italic text-stone-500">ainda quente.</span>
					</h2>
					<p className="font-sans text-stone-600 max-w-md mx-auto leading-relaxed">
						Entrega em até 45 minutos em Pinheiros, Vila Madalena e Jardins — ou
						retire na loja mais perto de você.
					</p>
					<div className="flex flex-wrap gap-4 justify-center pt-2">
						<Link
							href="/demos/bakery/pedido"
							className="bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors flex items-center gap-2 group"
						>
							Peça online
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href="/demos/bakery/locais"
							className="border border-stone-300 text-stone-700 px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:border-orange-700 hover:text-orange-700 transition-colors"
						>
							Ver locais
						</Link>
					</div>
				</div>
			</section>

			<CartBar />
		</>
	);
}
