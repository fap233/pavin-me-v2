"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";

import { ProductImage } from "../_components/ProductImage";

/**
 * /historia — a página editorial da demo.
 *
 * Mesma linguagem da home: creme, serifa grande com uma linha em itálico,
 * arco na foto, olho ("eyebrow") em laranja caixa-alta. A linha do tempo é
 * um acordeão de verdade — clicar abre o texto do ano.
 */

const MILESTONES = [
	{
		year: "2018",
		title: "Um forno alugado na Rua dos Pinheiros",
		text: "Helena Ravazi larga a cozinha de um restaurante no Itaim e aluga um forno de lastro usado. Assava 40 pães por dia e vendia todos numa mesa na calçada, antes das 10h.",
	},
	{
		year: "2020",
		title: "A padaria vira delivery da noite pro dia",
		text: "Com o salão fechado, a Farine passa a entregar de bicicleta em Pinheiros. O levain — batizado de Dona Zilda — sobreviveu à pandemia sendo alimentado todos os dias, sem exceção.",
	},
	{
		year: "2023",
		title: "Vila Madalena e a mesa comunal",
		text: "Segunda casa, com uma mesa de seis metros feita de peroba reaproveitada e o forno à vista de quem entra. A ideia era simples: quem come vê quem faz.",
	},
	{
		year: "2026",
		title: "Três casas, o mesmo levain",
		text: "Jardins abre com balcão de café e vitrine de folhados. As três unidades continuam usando a mesma isca de fermentação natural iniciada em 2018.",
	},
];

const PROCESS = [
	{
		step: "01",
		title: "O levain",
		text: "Farinha e água, alimentados duas vezes ao dia, todos os dias, desde 2018. É a única fermentação que usamos.",
	},
	{
		step: "02",
		title: "48 horas de espera",
		text: "A massa descansa em câmara fria por dois dias. É o tempo que dá casca escura, miolo alveolado e a acidez que a gente procura.",
	},
	{
		step: "03",
		title: "Forno de lastro",
		text: "Assado direto na pedra, com vapor nos primeiros minutos. Três fornadas por dia: 07h, 11h e 16h.",
	},
];

export default function HistoriaPage() {
	const [openYear, setOpenYear] = useState<string>(MILESTONES[0].year);

	return (
		<>
			{/* Abertura */}
			<section className="pt-36 pb-20 px-6">
				<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
					<div className="order-2 md:order-1 space-y-8">
						<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
							Nossa história — desde 2018
						</span>
						<h1 className="text-5xl md:text-6xl leading-[1.1] font-medium text-stone-900">
							Começou com <br />
							<span className="italic text-stone-500">
								quarenta pães por dia.
							</span>
						</h1>
						<p className="font-sans text-stone-600 text-lg leading-relaxed max-w-md border-l-2 border-orange-700 pl-6">
							Nenhum plano de negócio, nenhum investidor. Um forno de lastro
							usado, uma isca de fermentação natural e a teimosia de não apressar
							a massa.
						</p>
					</div>

					<div className="order-1 md:order-2 relative">
						<div className="group relative z-10 h-[500px] w-full bg-stone-200 overflow-hidden rounded-t-[10rem] shadow-2xl">
							<ProductImage
								src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1000&q=80"
								alt="Padeira sovando a massa"
								zoom={false}
								className="w-full h-full hover:scale-105 transition-transform duration-700"
							/>
						</div>
						<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-700 rounded-full flex items-center justify-center z-20 text-[#FDF8F5] animate-spin-slow p-2">
							<div className="text-center text-xs font-sans font-bold leading-tight">
								SINCE
								<br />
								2018
								<br />
								SP
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Texto editorial */}
			<section className="py-20 px-6">
				<div className="max-w-4xl mx-auto">
					<p className="text-3xl md:text-4xl text-stone-900 leading-snug first-letter:float-left first-letter:text-7xl first-letter:pr-3 first-letter:leading-[0.8] first-letter:text-orange-700 first-letter:font-medium">
						A Farine nasceu de uma recusa. Helena Ravazi passou nove anos em
						cozinhas que mediam sucesso em pratos por hora — e queria fazer o
						oposto: uma comida que só fica boa se você esperar.
					</p>
					<div className="grid md:grid-cols-2 gap-10 mt-12 font-sans text-stone-600 leading-relaxed">
						<p>
							O pão de fermentação natural é isso levado ao limite. São 48 horas
							entre misturar a farinha e tirar o pão do forno, e não existe atalho
							que não se pague na casca, no miolo ou no sabor. A gente tentou os
							atalhos. Nenhum funcionou.
						</p>
						<p>
							Hoje são três casas em São Paulo, cinquenta e dois quilos de farinha
							orgânica por dia e o mesmo levain de 2018 — a Dona Zilda, que viaja
							de pote entre as unidades e nunca passou um dia sem ser alimentada.
						</p>
					</div>
				</div>
			</section>

			{/* Linha do tempo (acordeão) */}
			<section className="py-24 px-6 bg-stone-900 text-[#FDF8F5]">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<span className="font-sans text-orange-200 font-bold tracking-widest text-xs uppercase">
							Linha do tempo
						</span>
						<h2 className="text-4xl md:text-5xl">Oito anos de fornada</h2>
					</div>

					<ul>
						{MILESTONES.map((milestone) => {
							const open = openYear === milestone.year;
							return (
								<li
									key={milestone.year}
									className="border-b border-stone-700 first:border-t"
								>
									<button
										type="button"
										onClick={() =>
											setOpenYear(open ? "" : milestone.year)
										}
										aria-expanded={open}
										className="w-full flex items-baseline gap-6 md:gap-10 py-7 text-left group cursor-pointer"
									>
										<span
											className={`font-sans text-sm font-bold tracking-widest shrink-0 transition-colors ${
												open
													? "text-orange-200"
													: "text-stone-500 group-hover:text-orange-200"
											}`}
										>
											{milestone.year}
										</span>
										<span
											className={`text-xl md:text-2xl flex-1 transition-colors ${
												open ? "" : "text-stone-400 group-hover:text-[#FDF8F5]"
											}`}
										>
											{milestone.title}
										</span>
										<span
											aria-hidden
											className={`text-orange-200 text-2xl shrink-0 transition-transform duration-300 ${
												open ? "rotate-45" : ""
											}`}
										>
											+
										</span>
									</button>

									<div
										className={`grid transition-all duration-500 ease-out ${
											open
												? "grid-rows-[1fr] opacity-100 pb-8"
												: "grid-rows-[0fr] opacity-0"
										}`}
									>
										<div className="overflow-hidden">
											<p className="font-sans text-stone-400 leading-relaxed max-w-2xl md:pl-[5.5rem]">
												{milestone.text}
											</p>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</section>

			{/* A padeira */}
			<section className="py-24 px-6">
				<div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
					<div className="group relative h-[460px] bg-stone-200 overflow-hidden rounded-t-[8rem]">
						<ProductImage
							src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"
							alt="Helena Ravazi, padeira e fundadora"
							className="w-full h-full"
						/>
					</div>

					<div className="space-y-8">
						<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
							A padeira
						</span>
						<Quote size={40} className="text-orange-700" />
						<blockquote className="text-3xl md:text-4xl text-stone-900 leading-snug italic">
							“Pão bom não é o que você faz. É o que você deixa acontecer.”
						</blockquote>
						<div className="font-sans">
							<p className="font-bold text-stone-900">Helena Ravazi</p>
							<p className="text-stone-500 text-sm">
								Fundadora e padeira-chefe · desde 2018
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Processo */}
			<section className="pb-24 px-6">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
							O processo
						</span>
						<h2 className="text-4xl md:text-5xl text-stone-900">
							Três dias em cada pão
						</h2>
					</div>

					<div className="grid md:grid-cols-3 gap-12">
						{PROCESS.map((item) => (
							<div key={item.step} className="space-y-4 group">
								<div className="w-16 h-16 rounded-full border border-stone-300 flex items-center justify-center font-sans font-bold text-orange-700 group-hover:bg-orange-700 group-hover:text-[#FDF8F5] group-hover:border-orange-700 transition-colors">
									{item.step}
								</div>
								<h3 className="text-2xl text-stone-900">{item.title}</h3>
								<p className="font-sans text-stone-600 leading-relaxed text-sm">
									{item.text}
								</p>
							</div>
						))}
					</div>

					<div className="mt-20 text-center">
						<Link
							href="/demos/bakery/cardapio"
							className="inline-flex items-center gap-2 bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors group"
						>
							Provar o resultado
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
