"use client";

import Link from "next/link";
import { useState } from "react";
import {
	ArrowUpRight,
	Check,
	Copy,
	CreditCard,
	Lock,
	Plus,
	RotateCw,
	ShieldCheck,
	Snowflake,
	Trash2,
	Wallet,
} from "lucide-react";
import CreditCardVisual from "../_components/CreditCard";
import {
	ACCOUNT,
	CARD_VARIANTS,
	FT,
	brl,
	btnGhostSm,
	btnPrimary,
	cx,
	pill,
	type CardVariantId,
} from "../_components/lumina";

type VirtualCard = {
	id: string;
	last4: string;
	label: string;
};

export default function CartoesPage() {
	const [variant, setVariant] = useState<CardVariantId>("grafite");
	const [flipped, setFlipped] = useState(false);
	const [blocked, setBlocked] = useState(false);
	const [limit, setLimit] = useState(ACCOUNT.limitDefault);
	const [virtuals, setVirtuals] = useState<VirtualCard[]>([
		{ id: "v1", last4: "8823", label: "Assinaturas" },
	]);
	const [copied, setCopied] = useState<string | null>(null);

	const usedPct = Math.min(100, (ACCOUNT.limitUsed / limit) * 100);

	function addVirtual() {
		// Gerado no clique (nunca no render) — sem risco de mismatch de hidratação.
		const last4 = String(Math.floor(1000 + Math.random() * 9000));
		setVirtuals((list) => [
			{ id: `v-${Date.now()}`, last4, label: `Cartão virtual ${list.length + 1}` },
			...list,
		]);
	}

	async function copyCard(card: VirtualCard) {
		try {
			await navigator.clipboard.writeText(`**** **** **** ${card.last4}`);
			setCopied(card.id);
			window.setTimeout(() => setCopied(null), 2000);
		} catch {
			// Clipboard indisponível — silencioso.
		}
	}

	return (
		<>
			{/* Estúdio do cartão */}
			<section className="pt-32 pb-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div className="max-w-2xl mb-12 space-y-5">
						<div className={pill}>
							<CreditCard size={13} />
							SEUS CARTÕES
						</div>
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
							Um cartão que{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
								obedece você.
							</span>
						</h1>
						<p className="text-lg text-slate-500 leading-relaxed">
							Bloqueie, ajuste o limite e crie cartões virtuais em um toque —
							sem ligar pra ninguém.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-10 items-center">
						{/* Cartão 3D */}
						<div className="relative flex flex-col items-center justify-center py-8 perspective-1000">
							<div className="absolute w-[380px] h-[380px] bg-blue-200/50 rounded-full blur-3xl -z-10" />

							<CreditCardVisual
								variant={variant}
								holder={ACCOUNT.holder}
								last4={ACCOUNT.cardLast4}
								cvv={ACCOUNT.cardCvv}
								exp={ACCOUNT.cardExp}
								flipped={flipped}
								blocked={blocked}
								onFlip={() => setFlipped((v) => !v)}
								className="w-full max-w-md h-60"
							/>

							<button
								type="button"
								onClick={() => setFlipped((v) => !v)}
								className={cx(btnGhostSm, "mt-10")}
							>
								<RotateCw size={15} />
								{flipped ? "Ver frente" : "Ver verso e CVV"}
							</button>
						</div>

						{/* Controles */}
						<div className="space-y-6">
							{/* Cor */}
							<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
								<h2 className="font-bold text-slate-900 mb-1">Cor do cartão</h2>
								<p className="text-sm text-slate-500 mb-6">
									A troca é gratuita uma vez por ano.
								</p>

								<div className="grid grid-cols-3 gap-3">
									{CARD_VARIANTS.map((v) => (
										<button
											key={v.id}
											type="button"
											onClick={() => setVariant(v.id)}
											aria-pressed={variant === v.id}
											className={cx(
												"rounded-2xl border p-3 transition-all text-left",
												variant === v.id
													? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/50"
													: "border-slate-200 hover:border-blue-200",
											)}
										>
											<span
												className={cx(
													"block w-full h-12 rounded-xl shadow-sm border border-slate-200/50",
													v.swatch,
												)}
											/>
											<span className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
												{variant === v.id && (
													<Check
														size={12}
														strokeWidth={3}
														className="text-blue-600"
													/>
												)}
												{v.name}
											</span>
										</button>
									))}
								</div>
							</div>

							{/* Limite */}
							<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
								<div className="flex items-end justify-between gap-4 mb-6">
									<div>
										<h2 className="font-bold text-slate-900 mb-1">
											Limite do cartão
										</h2>
										<p className="text-sm text-slate-500">
											Ajuste quando quiser, sem análise.
										</p>
									</div>
									<div className="text-right shrink-0">
										<div className="text-2xl font-bold text-slate-900 tabular-nums">
											{brl(limit)}
										</div>
										<div className="text-[11px] text-slate-400">
											de {brl(ACCOUNT.limitMax)}
										</div>
									</div>
								</div>

								<input
									type="range"
									min={500}
									max={ACCOUNT.limitMax}
									step={500}
									value={limit}
									onChange={(e) => setLimit(Number(e.target.value))}
									aria-label="Limite do cartão"
									className="w-full accent-blue-600 cursor-pointer"
								/>

								<div className="mt-6 pt-6 border-t border-slate-100">
									<div className="flex justify-between text-xs font-semibold mb-2">
										<span className="text-slate-500">
											Fatura atual: {brl(ACCOUNT.limitUsed)}
										</span>
										<span className="text-slate-900">
											Disponível: {brl(Math.max(0, limit - ACCOUNT.limitUsed))}
										</span>
									</div>
									<div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
										<div
											className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
											style={{ width: `${usedPct}%` }}
										/>
									</div>
								</div>
							</div>

							{/* Bloqueio */}
							<div
								className={cx(
									"rounded-[2rem] border shadow-sm p-6 sm:p-8 transition-colors",
									blocked
										? "bg-red-50 border-red-100"
										: "bg-white border-slate-100",
								)}
							>
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-4">
										<div
											className={cx(
												"w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
												blocked
													? "bg-red-100 text-red-600"
													: "bg-slate-50 text-slate-500",
											)}
										>
											{blocked ? <Lock size={20} /> : <Snowflake size={20} />}
										</div>
										<div>
											<h2 className="font-bold text-slate-900">
												{blocked ? "Cartão bloqueado" : "Bloquear cartão"}
											</h2>
											<p className="text-sm text-slate-500">
												{blocked
													? "Nenhuma compra será aprovada."
													: "Congele na hora, desbloqueie quando quiser."}
											</p>
										</div>
									</div>

									<button
										type="button"
										role="switch"
										aria-checked={blocked}
										aria-label="Bloquear cartão"
										onClick={() => setBlocked((v) => !v)}
										className={cx(
											"relative shrink-0 w-14 h-8 rounded-full transition-colors",
											blocked ? "bg-red-500" : "bg-slate-200",
										)}
									>
										<span
											className={cx(
												"absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-sm transition-transform",
												blocked && "translate-x-6",
											)}
										/>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Cartões virtuais */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-5xl mx-auto">
					<div className="flex flex-wrap items-end justify-between gap-4 mb-10">
						<div>
							<h2 className="text-3xl font-bold text-slate-900 mb-2">
								Cartões virtuais
							</h2>
							<p className="text-slate-500">
								Um número diferente pra cada assinatura. Apagou, acabou.
							</p>
						</div>
						<button type="button" onClick={addVirtual} className={btnPrimary}>
							<Plus size={18} /> Gerar cartão virtual
						</button>
					</div>

					{virtuals.length === 0 ? (
						<div className="rounded-[2rem] bg-slate-50 border border-slate-100 py-16 text-center">
							<div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm text-slate-300 flex items-center justify-center">
								<CreditCard size={22} />
							</div>
							<p className="mt-4 font-semibold text-slate-900">
								Nenhum cartão virtual
							</p>
							<p className="mt-1 text-sm text-slate-500">
								Gere um pra usar em compras online sem expor o cartão físico.
							</p>
						</div>
					) : (
						<ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{virtuals.map((card) => (
								<li
									key={card.id}
									className="rounded-[2rem] bg-slate-50 border border-slate-100 p-6 hover:border-blue-200 transition-colors lumina-fade-up"
								>
									<div className="flex items-start justify-between">
										<div className="w-11 h-11 rounded-xl bg-white shadow-sm text-blue-600 flex items-center justify-center">
											<Wallet size={19} />
										</div>
										<button
											type="button"
											onClick={() =>
												setVirtuals((list) =>
													list.filter((c) => c.id !== card.id),
												)
											}
											aria-label={`Excluir ${card.label}`}
											className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
										>
											<Trash2 size={16} />
										</button>
									</div>

									<p className="mt-5 font-bold text-slate-900">{card.label}</p>
									<p className="font-mono text-sm tracking-widest text-slate-500 mt-1">
										**** **** **** {card.last4}
									</p>

									<button
										type="button"
										onClick={() => copyCard(card)}
										className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
									>
										{copied === card.id ? (
											<>
												<Check size={15} className="text-green-600" /> Copiado!
											</>
										) : (
											<>
												<Copy size={15} /> Copiar número
											</>
										)}
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 px-6">
				<div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
					<div className="md:col-span-2 bg-slate-900 text-white rounded-[2rem] p-8 flex items-center justify-between overflow-hidden relative">
						<div className="relative z-10 max-w-md">
							<h3 className="text-2xl font-bold mb-2">
								Quer o cartão de metal?
							</h3>
							<p className="text-slate-400 mb-6">
								O Lumina Black vem em metal, com salas VIP e concierge 24h.
							</p>
							<Link
								href={`${FT}/black`}
								className="inline-block text-sm font-bold border-b border-white pb-1 hover:text-blue-300 hover:border-blue-300 transition-colors"
							>
								CONHECER BENEFÍCIOS
							</Link>
						</div>
						<div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]" />
					</div>

					<div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors">
						<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
							<ShieldCheck />
						</div>
						<h3 className="text-xl font-bold mb-2">Ainda não é cliente?</h3>
						<p className="text-slate-500 text-sm mb-6">
							Abra a conta e receba o cartão virtual na hora.
						</p>
						<Link
							href={`${FT}/abrir-conta`}
							className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700"
						>
							Abrir conta <ArrowUpRight size={15} />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
