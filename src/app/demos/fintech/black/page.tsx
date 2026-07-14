"use client";

import Link from "next/link";
import { useState } from "react";
import {
	ArrowUpRight,
	Check,
	ChevronDown,
	Coins,
	Crown,
	Headphones,
	Plane,
	ShieldCheck,
	Sparkles,
	UserRound,
} from "lucide-react";
import CreditCardVisual from "../_components/CreditCard";
import {
	FT,
	PLANS,
	annualTotal,
	brl,
	btnGhost,
	cx,
	planById,
} from "../_components/lumina";

const BENEFITS = [
	{
		icon: Plane,
		title: "Salas VIP ilimitadas",
		text: "Acesso a mais de 1.300 salas em aeroportos do mundo todo, com um acompanhante.",
	},
	{
		icon: Headphones,
		title: "Concierge 24h",
		text: "Restaurante lotado, voo remarcado, presente de última hora. É só chamar no WhatsApp.",
	},
	{
		icon: Coins,
		title: "2% de cashback + cripto",
		text: "Escolha receber em reais ou em cripto, direto na conta, todo mês.",
	},
	{
		icon: ShieldCheck,
		title: "Seguros que valem",
		text: "Seguro viagem, proteção de compra e garantia estendida em tudo que passar no cartão.",
	},
	{
		icon: UserRound,
		title: "Gerente dedicado",
		text: "Uma pessoa de verdade, com nome e telefone, cuidando da sua conta.",
	},
	{
		icon: Crown,
		title: "Cartão em metal",
		text: "Peso de 18g, acabamento fosco e seu nome gravado a laser. Sem custo de emissão.",
	},
];

const FAQ = [
	{
		q: "Preciso de investimento mínimo pra ter o Black?",
		a: "Não. O Lumina Black é um plano por assinatura — sem exigência de renda mínima, sem exigência de patrimônio investido. Você assina, usa, e cancela quando quiser.",
	},
	{
		q: "As salas VIP valem pra acompanhante?",
		a: "Sim. Você entra com um acompanhante em todas as visitas, sem cobrança adicional e sem limite de acessos por ano.",
	},
	{
		q: "Posso trocar de plano depois?",
		a: "Pode, a qualquer momento e sem taxa. Se descer pro Plus no meio do ciclo, devolvemos a diferença proporcional no seu saldo.",
	},
	{
		q: "O cashback em cripto é obrigatório?",
		a: "Não. Por padrão o cashback cai em reais. Se quiser, ative o recebimento em cripto nas configurações e escolha o ativo.",
	},
];

export default function BlackPage() {
	const [open, setOpen] = useState<number | null>(0);
	const black = planById("black");
	const plus = PLANS.find((p) => p.id === "plus");

	return (
		<>
			{/* Hero */}
			<section className="pt-32 pb-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white p-8 sm:p-14">
						<div className="absolute right-0 top-0 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[80px]" />
						<div className="absolute -left-20 bottom-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[80px]" />

						<div className="relative z-10 grid lg:grid-cols-2 gap-14 items-center">
							<div className="space-y-8">
								<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-blue-300">
									<Crown size={13} />
									LUMINA BLACK
								</div>

								<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
									O banco sai da <br />
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
										sua frente.
									</span>
								</h1>

								<p className="text-lg text-slate-400 max-w-md leading-relaxed">
									Salas VIP, concierge 24h e um gerente que atende no primeiro
									toque. Por {brl(black.monthly)} ao mês — menos que um jantar.
								</p>

								<div className="flex flex-col sm:flex-row gap-4">
									<Link
										href={`${FT}/abrir-conta?plano=black`}
										className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30"
									>
										Quero o Black <ArrowUpRight size={18} />
									</Link>
									<Link
										href={`${FT}/planos`}
										className="inline-flex items-center justify-center gap-2 border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
									>
										Comparar planos
									</Link>
								</div>

								<p className="text-xs text-slate-500">
									{brl(annualTotal(black))} no plano anual · cancele quando
									quiser
								</p>
							</div>

							<div className="flex items-center justify-center py-6 perspective-1000">
								<div className="animate-bounce-slow w-full max-w-md">
									<CreditCardVisual
										variant="grafite"
										holder="Camila Ribeiro"
										last4="0007"
										cvv="904"
										exp="12/32"
										className="w-full h-60"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefícios */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							O que vem junto
						</h2>
						<p className="text-slate-500">
							Nada de benefício que ninguém usa. Só o que muda seu dia.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{BENEFITS.map((b) => (
							<div
								key={b.title}
								className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors"
							>
								<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
									<b.icon size={22} />
								</div>
								<h3 className="text-xl font-bold mb-2">{b.title}</h3>
								<p className="text-slate-500 text-sm leading-relaxed">
									{b.text}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Black x Plus */}
			<section className="py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Vale a pena subir do Plus?
						</h2>
						<p className="text-slate-500">
							A diferença é de {plus ? brl(black.monthly - plus.monthly) : "—"}{" "}
							por mês. Veja o que ela compra.
						</p>
					</div>

					<div className="grid sm:grid-cols-2 gap-6">
						{plus && (
							<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-8">
								<h3 className="text-xl font-bold text-slate-900">
									{plus.name}
								</h3>
								<p className="mt-1 text-3xl font-bold text-slate-900">
									{brl(plus.monthly)}
									<span className="text-sm font-medium text-slate-400">
										/mês
									</span>
								</p>
								<ul className="mt-8 space-y-3">
									{plus.perks.map((perk) => (
										<li key={perk} className="flex items-start gap-3 text-sm">
											<span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
												<Check size={12} strokeWidth={3} />
											</span>
											<span className="text-slate-600">{perk}</span>
										</li>
									))}
								</ul>
								<Link
									href={`${FT}/abrir-conta?plano=plus`}
									className={cx(btnGhost, "mt-8 w-full")}
								>
									Assinar Plus
								</Link>
							</div>
						)}

						<div className="relative overflow-hidden rounded-[2rem] bg-slate-900 text-white p-8 shadow-2xl shadow-slate-900/20">
							<div className="absolute right-0 top-0 w-[280px] h-[280px] bg-blue-600/20 rounded-full blur-[80px]" />
							<div className="relative z-10">
								<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider mb-4">
									<Sparkles size={12} /> Recomendado
								</span>
								<h3 className="text-xl font-bold">{black.name}</h3>
								<p className="mt-1 text-3xl font-bold">
									{brl(black.monthly)}
									<span className="text-sm font-medium text-slate-400">
										/mês
									</span>
								</p>
								<ul className="mt-8 space-y-3">
									{black.perks.map((perk) => (
										<li key={perk} className="flex items-start gap-3 text-sm">
											<span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-blue-600/20 text-blue-300 flex items-center justify-center">
												<Check size={12} strokeWidth={3} />
											</span>
											<span className="text-slate-300">{perk}</span>
										</li>
									))}
								</ul>
								<Link
									href={`${FT}/abrir-conta?plano=black`}
									className="mt-8 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30"
								>
									Quero o Black <ArrowUpRight size={17} />
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-3xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Perguntas frequentes
						</h2>
						<p className="text-slate-500">
							O que a gente mais escuta antes de alguém assinar.
						</p>
					</div>

					<div className="space-y-3">
						{FAQ.map((item, i) => {
							const isOpen = open === i;
							return (
								<div
									key={item.q}
									className={cx(
										"rounded-2xl border transition-colors overflow-hidden",
										isOpen
											? "bg-slate-50 border-blue-200"
											: "bg-slate-50 border-slate-100 hover:border-blue-200",
									)}
								>
									<button
										type="button"
										onClick={() => setOpen(isOpen ? null : i)}
										aria-expanded={isOpen}
										className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
									>
										<span className="font-semibold text-slate-900">
											{item.q}
										</span>
										<ChevronDown
											size={18}
											className={cx(
												"shrink-0 text-slate-400 transition-transform duration-300",
												isOpen && "rotate-180 text-blue-600",
											)}
										/>
									</button>
									{isOpen && (
										<p className="px-6 pb-5 -mt-1 text-sm text-slate-500 leading-relaxed lumina-fade-in">
											{item.a}
										</p>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>
		</>
	);
}
