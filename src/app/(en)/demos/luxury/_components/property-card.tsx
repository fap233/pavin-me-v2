"use client";

import Link from "next/link";
import { MapPin, Bed, Bath, Square, Bookmark } from "lucide-react";
import {
	areaFmt,
	precoBRL,
	unsplash,
	type Operacao,
	type Property,
} from "../_data/properties";
import { useLuxury } from "./luxury-context";
import { cx } from "./ui";

export function PropertyCard({
	imovel,
	operacao = "comprar",
	className,
}: {
	imovel: Property;
	/** Em "alugar", o card mostra o valor mensal em vez do preço de venda. */
	operacao?: Operacao;
	className?: string;
}) {
	const { isSalvo, toggleSalvo } = useLuxury();
	const salvo = isSalvo(imovel.slug);

	const alugando = operacao === "alugar" && typeof imovel.aluguel === "number";
	const valor = alugando ? imovel.aluguel! : imovel.preco;

	return (
		<article className={cx("group relative", className)}>
			<div className="relative overflow-hidden aspect-[4/3] mb-6 bg-stone-100">
				<img
					src={unsplash(imovel.fotos[0], 1200)}
					alt={imovel.titulo}
					loading="lazy"
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>

				{imovel.exclusivo ? (
					<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] tracking-widest uppercase font-bold">
						Exclusivo
					</div>
				) : null}

				{/* z-10 > z-[1] do link esticado: o botão fica clicável por cima dele. */}
				<button
					type="button"
					onClick={() => toggleSalvo(imovel.slug)}
					aria-pressed={salvo}
					aria-label={
						salvo
							? `Remover ${imovel.titulo} dos salvos`
							: `Salvar ${imovel.titulo}`
					}
					className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur p-2.5 text-stone-900 hover:bg-white transition-colors"
				>
					<Bookmark size={14} className={salvo ? "fill-current" : undefined} />
				</button>
			</div>

			<div className="flex justify-between items-start gap-6">
				<div>
					<h4 className="font-serif text-2xl mb-1 text-stone-900 group-hover:text-stone-600 transition-colors">
						{imovel.titulo}
					</h4>
					<div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
						<MapPin size={14} /> {imovel.bairro}, {imovel.uf}
					</div>
					<div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-400 uppercase tracking-wider border-t border-stone-100 pt-4">
						<span className="flex items-center gap-1">
							<Bed size={14} /> {imovel.suites} Suítes
						</span>
						<span className="flex items-center gap-1">
							<Bath size={14} /> {imovel.banheiros} Banheiros
						</span>
						<span className="flex items-center gap-1">
							<Square size={14} /> {areaFmt(imovel.area)}
						</span>
					</div>
				</div>

				<div className="text-right shrink-0">
					<p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
						{alugando ? "Aluguel" : "Preço"}
					</p>
					<p className="font-serif text-xl whitespace-nowrap">
						{precoBRL(valor)}
						{alugando ? (
							<span className="text-stone-400 text-sm">/mês</span>
						) : null}
					</p>
				</div>
			</div>

			{/* Link esticado: o card inteiro é clicável sem aninhar <a> no conteúdo. */}
			<Link
				href={`/demos/luxury/imovel/${imovel.slug}`}
				className="absolute inset-0 z-[1]"
			>
				<span className="sr-only">Ver {imovel.titulo}</span>
			</Link>
		</article>
	);
}
