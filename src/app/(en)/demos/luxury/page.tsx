"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import {
	DESTAQUES_HOME,
	PROPERTIES,
	TIPO_OPTIONS,
	unsplash,
} from "./_data/properties";
import { PropertyCard } from "./_components/property-card";
import { EYEBROW, LINK_CTA, Regua, cx } from "./_components/ui";

const SERVICOS = [
	{
		titulo: "Vender",
		texto:
			"Avaliação em 48 horas e uma lista de compradores que já procuram o seu endereço.",
		href: "/demos/luxury/vender",
		cta: "Avaliar meu imóvel",
	},
	{
		titulo: "Private Office",
		texto:
			"Assessoria reservada para famílias e family offices — inclusive fora do mercado listado.",
		href: "/demos/luxury/private-office",
		cta: "Conhecer",
	},
	{
		titulo: "Contato",
		texto:
			"Uma conversa privada, sem compromisso, com quem conhece cada esquina do seu bairro.",
		href: "/demos/luxury/contato",
		cta: "Falar com a Aurum",
	},
];

export default function LuxuryPage() {
	const router = useRouter();
	const [local, setLocal] = useState("");
	const [tipo, setTipo] = useState("todos");

	// A busca do hero não é decorativa: ela monta a query string e entrega a
	// /colecao já filtrada.
	function buscar(e: React.FormEvent) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (local.trim()) params.set("local", local.trim());
		if (tipo !== "todos") params.set("tipo", tipo);
		const qs = params.toString();
		router.push(`/demos/luxury/colecao${qs ? `?${qs}` : ""}`);
	}

	const destaques = PROPERTIES.filter((p) => DESTAQUES_HOME.includes(p.slug));

	return (
		<>
			{/* Hero Section Imersiva */}
			<section className="relative h-screen w-full overflow-hidden">
				<div className="absolute inset-0">
					<img
						src={unsplash("photo-1600607687939-ce8a6c25118c", 2000)}
						alt="Interior de luxo"
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
					<form
						onSubmit={buscar}
						className="bg-white p-2 flex items-center max-w-2xl w-full shadow-2xl"
					>
						<div className="flex-1 px-6 border-r border-stone-100 text-left">
							<label
								htmlFor="hero-local"
								className="block text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1"
							>
								Localização
							</label>
							<input
								id="hero-local"
								type="text"
								value={local}
								onChange={(e) => setLocal(e.target.value)}
								placeholder="Jardins, São Paulo"
								className="w-full outline-none text-stone-800 placeholder-stone-300 font-serif"
							/>
						</div>
						<div className="flex-1 px-6 border-r border-stone-100 hidden md:block text-left">
							<label
								htmlFor="hero-tipo"
								className="block text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-1"
							>
								Tipo
							</label>
							<select
								id="hero-tipo"
								value={tipo}
								onChange={(e) => setTipo(e.target.value)}
								className="w-full outline-none text-stone-800 bg-transparent font-serif"
							>
								{TIPO_OPTIONS.map((op) => (
									<option key={op.value} value={op.value}>
										{op.label}
									</option>
								))}
							</select>
						</div>
						<button
							type="submit"
							aria-label="Buscar imóveis"
							className="bg-stone-900 text-white p-4 hover:bg-stone-800 transition-colors"
						>
							<Search size={20} />
						</button>
					</form>
				</div>

				{/* Scroll Indicator */}
				<a
					href="#selecao"
					className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-xs tracking-[0.3em] uppercase animate-bounce"
				>
					Discover
				</a>
			</section>

			{/* Intro Text */}
			<section className="py-32 px-8 max-w-4xl mx-auto text-center">
				<Regua className="mb-10" />
				<h2 className="font-serif text-3xl md:text-4xl leading-snug text-stone-800 mb-8">
					&quot;A arquitetura deve falar de seu tempo e lugar, mas anelar pela
					atemporalidade.&quot;
				</h2>
				<p className="text-stone-500 font-serif italic">— Frank Gehry</p>
			</section>

			{/* Featured Properties (Grid Assimétrico) */}
			<section id="selecao" className="px-4 md:px-12 pb-32 scroll-mt-24">
				<div className="flex justify-between items-end mb-12 px-2 gap-6">
					<h3 className={EYEBROW}>Seleção Curada</h3>
					<Link href="/demos/luxury/colecao" className={cx(LINK_CTA, "shrink-0")}>
						Ver coleção completa
					</Link>
				</div>

				<div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
					{destaques.map((imovel, i) => (
						<PropertyCard
							key={imovel.slug}
							imovel={imovel}
							// Offset vertical no segundo card para dar ritmo.
							className={i === 1 ? "md:mt-20" : undefined}
						/>
					))}
				</div>
			</section>

			{/* Serviços */}
			<section className="border-t border-stone-200 px-8 md:px-12 py-24 md:py-32">
				<h3 className={cx(EYEBROW, "mb-16")}>A Casa Aurum</h3>
				<div className="grid md:grid-cols-3 gap-12 md:gap-16">
					{SERVICOS.map((s) => (
						<div key={s.titulo} className="flex flex-col items-start">
							<h4 className="font-serif text-3xl text-stone-900 mb-5">
								{s.titulo}
							</h4>
							<p className="text-stone-500 font-serif leading-relaxed mb-8 max-w-xs">
								{s.texto}
							</p>
							<Link href={s.href} className={cx(LINK_CTA, "mt-auto")}>
								{s.cta}
							</Link>
						</div>
					))}
				</div>
			</section>
		</>
	);
}
