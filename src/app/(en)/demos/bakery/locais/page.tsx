"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, MapPin, Phone } from "lucide-react";

import { useCart } from "../_components/CartProvider";
import { UNITS } from "../_components/data";

/**
 * /locais — as três casas da Farine.
 *
 * O mapa é 100% CSS (grid de ruas + pin absoluto): sem lib de mapa, sem chave
 * de API, sem chamada de rede. Selecionar uma unidade move o pin e destaca o
 * card; "Pedir desta unidade" grava a escolha no carrinho e leva pro /pedido
 * já em modo retirada — a mesma escolha aparece lá selecionada.
 */
export default function LocaisPage() {
	const router = useRouter();
	const { setFulfillment, setPickupUnit } = useCart();
	const [selected, setSelected] = useState(UNITS[0].id);

	const active = UNITS.find((unit) => unit.id === selected) ?? UNITS[0];

	function pedirDaqui(unitId: string) {
		setPickupUnit(unitId);
		setFulfillment("retirada");
		router.push("/demos/bakery/pedido");
	}

	return (
		<>
			{/* Cabeçalho */}
			<section className="pt-36 pb-12 px-6">
				<div className="max-w-6xl mx-auto">
					<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
						Locais — São Paulo
					</span>
					<h1 className="text-5xl md:text-6xl text-stone-900 mt-4 leading-[1.1]">
						Três casas, <br />
						<span className="italic text-stone-500">o mesmo levain.</span>
					</h1>
					<p className="font-sans text-stone-600 text-lg leading-relaxed max-w-md border-l-2 border-orange-700 pl-6 mt-8">
						Todas com fornada às 07h, 11h e 16h. Se chover, a fila anda mais
						rápido — é o nosso único segredo.
					</p>
				</div>
			</section>

			{/* Mapa + lista */}
			<section className="pb-24 px-6">
				<div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-12 items-start">
					{/* Mapa estilizado (puro CSS) */}
					<div className="lg:sticky lg:top-28">
						<div
							role="group"
							aria-label="Mapa das unidades da Farine"
							className="relative h-[460px] w-full overflow-hidden bg-[#F3EFEA] border border-stone-200 rounded-t-[6rem]"
						>
							{/* Malha viária */}
							<div
								aria-hidden
								className="absolute inset-0 opacity-70"
								style={{
									backgroundImage:
										"linear-gradient(to right, rgba(120,113,108,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,113,108,0.12) 1px, transparent 1px)",
									backgroundSize: "38px 38px",
								}}
							/>
							{/* Avenidas */}
							<div aria-hidden className="absolute left-0 right-0 top-[42%] h-3 bg-stone-300/60 -rotate-6" />
							<div aria-hidden className="absolute left-[38%] top-0 bottom-0 w-3 bg-stone-300/60 rotate-3" />
							<div aria-hidden className="absolute left-0 right-0 bottom-[18%] h-2 bg-stone-300/40 rotate-2" />
							{/* Parque */}
							<div aria-hidden className="absolute left-[6%] top-[8%] h-24 w-32 rounded-[2rem] bg-orange-700/10 border border-orange-700/20" />
							<div aria-hidden className="absolute left-[8%] top-[12%] font-sans text-[9px] uppercase tracking-widest text-stone-400">
								Parque
							</div>
							{/* Rio */}
							<div aria-hidden className="absolute right-[-10%] top-0 bottom-0 w-16 bg-stone-300/30 rotate-12" />

							{/* Pins */}
							{UNITS.map((unit) => {
								const isActive = unit.id === selected;
								return (
									<button
										key={unit.id}
										type="button"
										onClick={() => setSelected(unit.id)}
										aria-label={`Ver ${unit.name} no mapa`}
										style={{ top: `${unit.pin.top}%`, left: `${unit.pin.left}%` }}
										className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer group"
									>
										<span
											className={`font-sans text-[10px] uppercase tracking-widest whitespace-nowrap px-2 py-1 rounded-full mb-1 transition-all duration-300 ${
												isActive
													? "bg-stone-900 text-[#FDF8F5] opacity-100"
													: "bg-[#FDF8F5] text-stone-500 opacity-0 group-hover:opacity-100 border border-stone-200"
											}`}
										>
											{unit.neighborhood}
										</span>
										<span
											className={`flex items-center justify-center rounded-full transition-all duration-300 ${
												isActive
													? "w-9 h-9 bg-orange-700 text-[#FDF8F5] shadow-lg"
													: "w-6 h-6 bg-[#FDF8F5] text-orange-700 border border-orange-700/40 group-hover:border-orange-700"
											}`}
										>
											<MapPin size={isActive ? 18 : 12} />
										</span>
										{isActive && (
											<span className="absolute -bottom-1 w-9 h-9 rounded-full bg-orange-700/25 animate-ping" />
										)}
									</button>
								);
							})}
						</div>

						<div className="mt-5 flex items-start gap-3 font-sans text-xs text-stone-500 leading-relaxed">
							<MapPin size={14} className="mt-0.5 shrink-0 text-orange-700" />
							<p>
								<strong className="text-stone-800">{active.name}</strong> —{" "}
								{active.address}. {active.note}
							</p>
						</div>
					</div>

					{/* Cards das unidades */}
					<div className="space-y-6">
						{UNITS.map((unit) => {
							const isActive = unit.id === selected;
							return (
								<article
									key={unit.id}
									onMouseEnter={() => setSelected(unit.id)}
									onFocus={() => setSelected(unit.id)}
									className={`border p-8 transition-colors duration-300 ${
										isActive
											? "border-orange-700 bg-[#F3EFEA]"
											: "border-stone-200 bg-transparent hover:border-stone-300"
									}`}
								>
									<div className="flex items-baseline justify-between gap-4 mb-6">
										<h2 className="text-3xl text-stone-900">{unit.name}</h2>
										<span
											className={`font-sans text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shrink-0 transition-colors ${
												isActive
													? "bg-orange-700 text-[#FDF8F5]"
													: "bg-stone-200 text-stone-500"
											}`}
										>
											{unit.neighborhood}
										</span>
									</div>

									<div className="font-sans text-sm text-stone-600 space-y-3">
										<p className="flex items-start gap-3">
											<MapPin size={16} className="mt-0.5 shrink-0" />
											{unit.address} — {unit.neighborhood}, São Paulo
										</p>
										<p className="flex items-start gap-3">
											<Phone size={16} className="mt-0.5 shrink-0" />
											{unit.phone}
										</p>
										<div className="flex items-start gap-3">
											<Clock size={16} className="mt-0.5 shrink-0" />
											<div className="space-y-1">
												{unit.hours.map((slot) => (
													<p key={slot.days}>
														<span className="text-stone-800">{slot.days}:</span>{" "}
														{slot.time}
													</p>
												))}
											</div>
										</div>
									</div>

									<p className="font-sans text-sm text-stone-500 italic mt-6 pt-6 border-t border-stone-200">
										{unit.note}
									</p>

									<div className="flex flex-wrap gap-3 mt-6">
										<button
											type="button"
											onClick={() => pedirDaqui(unit.id)}
											className="bg-stone-900 text-[#FDF8F5] px-6 py-3 rounded-sm font-sans uppercase text-xs tracking-widest hover:bg-orange-800 transition-colors flex items-center gap-2 group cursor-pointer"
										>
											Pedir desta unidade
											<ArrowRight
												size={14}
												className="group-hover:translate-x-1 transition-transform"
											/>
										</button>
										<button
											type="button"
											onClick={() => setSelected(unit.id)}
											aria-pressed={isActive}
											className="border border-stone-300 text-stone-600 px-6 py-3 rounded-sm font-sans uppercase text-xs tracking-widest hover:border-orange-700 hover:text-orange-700 transition-colors cursor-pointer"
										>
											{isActive ? "No mapa ✓" : "Ver no mapa"}
										</button>
									</div>
								</article>
							);
						})}
					</div>
				</div>
			</section>

			{/* Chamada final */}
			<section className="pb-24 px-6">
				<div className="max-w-6xl mx-auto bg-stone-900 text-[#FDF8F5] px-8 py-16 text-center space-y-6">
					<span className="font-sans text-orange-200 font-bold tracking-widest text-xs uppercase">
						Não quer sair de casa?
					</span>
					<h2 className="text-4xl md:text-5xl max-w-2xl mx-auto leading-tight">
						A gente leva a fornada{" "}
						<span className="italic text-stone-400">até você.</span>
					</h2>
					<div className="pt-2">
						<Link
							href="/demos/bakery/cardapio"
							className="inline-flex items-center gap-2 bg-[#FDF8F5] text-stone-900 px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-700 hover:text-[#FDF8F5] transition-colors group"
						>
							Ver cardápio
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
