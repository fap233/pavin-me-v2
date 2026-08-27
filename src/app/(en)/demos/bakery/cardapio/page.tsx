"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AddButton } from "../_components/AddButton";
import { CartBar } from "../_components/CartBar";
import { ProductImage } from "../_components/ProductImage";
import {
	CATEGORIES,
	PRODUCTS,
	formatBRL,
	type Category,
} from "../_components/data";

/**
 * Cardápio completo, com filtro por categoria que filtra de verdade.
 *
 * O estado é local (useState) — não vai pra URL de propósito: a demo roda dentro
 * do portfólio e não quero mexer em query string/history de quem só está
 * passeando pelas telas.
 */

type Filter = "Todos" | Category;

const FILTERS: Filter[] = ["Todos", ...CATEGORIES];

export default function CardapioPage() {
	const [filter, setFilter] = useState<Filter>("Todos");

	const items = useMemo(
		() =>
			filter === "Todos"
				? PRODUCTS
				: PRODUCTS.filter((product) => product.category === filter),
		[filter],
	);

	const countByFilter = useMemo(() => {
		const counts = new Map<Filter, number>([["Todos", PRODUCTS.length]]);
		for (const category of CATEGORIES) {
			counts.set(
				category,
				PRODUCTS.filter((product) => product.category === category).length,
			);
		}
		return counts;
	}, []);

	return (
		<>
			{/* Cabeçalho */}
			<section className="pt-36 pb-12 px-6">
				<div className="max-w-6xl mx-auto">
					<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
						Cardápio — Fornadas diárias
					</span>
					<h1 className="text-5xl md:text-6xl text-stone-900 mt-4 leading-[1.1]">
						Tudo que sai <br />
						<span className="italic text-stone-500">do nosso forno.</span>
					</h1>
					<p className="font-sans text-stone-600 text-lg leading-relaxed max-w-md border-l-2 border-orange-700 pl-6 mt-8">
						Preços por unidade. Os itens da manhã costumam acabar antes das 11h —
						quem chega cedo leva o croissant ainda quente.
					</p>
				</div>
			</section>

			{/* Filtros */}
			<section className="px-6 sticky top-20 z-30 bg-[#FDF8F5]/95 backdrop-blur-sm border-y border-stone-200 py-4">
				<div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-1">
					{FILTERS.map((option) => {
						const active = filter === option;
						return (
							<button
								key={option}
								type="button"
								onClick={() => setFilter(option)}
								aria-pressed={active}
								className={`shrink-0 rounded-full border px-5 py-2 font-sans text-xs uppercase tracking-widest transition-colors cursor-pointer ${
									active
										? "border-orange-700 bg-orange-700 text-[#FDF8F5]"
										: "border-stone-300 text-stone-600 hover:border-orange-700 hover:text-orange-700"
								}`}
							>
								{option}
								<span
									className={`ml-2 text-[10px] font-bold ${
										active ? "text-orange-100" : "text-stone-400"
									}`}
								>
									{countByFilter.get(option) ?? 0}
								</span>
							</button>
						);
					})}
				</div>
			</section>

			{/* Itens */}
			<section className="py-16 px-6">
				<div className="max-w-6xl mx-auto">
					<p className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-10">
						{items.length} {items.length === 1 ? "item" : "itens"}
						{filter !== "Todos" && ` em ${filter}`}
					</p>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
						{items.map((product) => (
							<article key={product.id} className="group flex flex-col">
								<div className="relative overflow-hidden rounded-t-[6rem] bg-stone-200 mb-5">
									<ProductImage
										src={product.img}
										alt={product.name}
										className="w-full h-72"
									/>
									{product.tag && (
										<span className="absolute top-5 left-5 bg-[#FDF8F5]/95 text-orange-800 font-sans text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
											{product.tag}
										</span>
									)}
								</div>

								<div className="flex justify-between items-baseline gap-4">
									<h2 className="text-2xl text-stone-900 leading-tight">
										{product.name}
									</h2>
									<span className="font-sans font-bold text-orange-700 shrink-0">
										{formatBRL(product.price)}
									</span>
								</div>

								<p className="font-sans text-sm text-stone-600 leading-relaxed mt-3 mb-6 flex-1">
									{product.desc}
								</p>

								<AddButton product={product} className="w-full" />
							</article>
						))}
					</div>
				</div>
			</section>

			{/* Rodapé da página */}
			<section className="pb-24 px-6">
				<div className="max-w-6xl mx-auto border-t border-stone-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
					<p className="font-sans text-stone-600 text-sm max-w-sm leading-relaxed">
						Encomendas de bolos e panetones: fale com a gente em qualquer uma das
						três unidades.
					</p>
					<Link
						href="/demos/bakery/pedido"
						className="bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors flex items-center gap-2 group shrink-0"
					>
						Fechar pedido
						<ArrowRight
							size={16}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>
			</section>

			<CartBar />
		</>
	);
}
