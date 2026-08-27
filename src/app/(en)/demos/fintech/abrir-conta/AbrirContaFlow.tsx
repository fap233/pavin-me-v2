"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import {
	ArrowLeft,
	ArrowUpRight,
	Check,
	Copy,
	CreditCard,
	PartyPopper,
	ShieldCheck,
	Wand2,
} from "lucide-react";
import CreditCardVisual from "../_components/CreditCard";
import {
	ACCOUNT,
	CARD_VARIANTS,
	FT,
	PLANS,
	annualTotal,
	brl,
	btnGhostSm,
	btnPrimary,
	cx,
	errText,
	field,
	isValidCPF,
	isValidEmail,
	label as labelCls,
	maskCPF,
	maskPhone,
	onlyDigits,
	pill,
	planById,
	priceFor,
	type CardVariantId,
	type PlanId,
} from "../_components/lumina";

type Cycle = "mensal" | "anual";

const STEPS = ["Dados pessoais", "Cartão e plano", "Revisão", "Pronto!"];

type Form = {
	nome: string;
	cpf: string;
	email: string;
	telefone: string;
	nascimento: string;
};

type Errors = Partial<Record<keyof Form, string>>;

const EMPTY: Form = {
	nome: "",
	cpf: "",
	email: "",
	telefone: "",
	nascimento: "",
};

export default function AbrirContaFlow() {
	const params = useSearchParams();
	const planoParam = params.get("plano");

	const [step, setStep] = useState(0);
	const [form, setForm] = useState<Form>(EMPTY);
	const [errors, setErrors] = useState<Errors>({});
	const [plano, setPlano] = useState<PlanId>(
		() => planById(planoParam).id, // pré-seleção via ?plano=
	);
	const [cycle, setCycle] = useState<Cycle>("mensal");
	const [variant, setVariant] = useState<CardVariantId>("grafite");
	const [conta, setConta] = useState("");
	const [copied, setCopied] = useState(false);

	const selectedPlan = useMemo(() => planById(plano), [plano]);

	function set<K extends keyof Form>(key: K, value: string) {
		setForm((f) => ({ ...f, [key]: value }));
		if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
	}

	function validateStep1(): boolean {
		const next: Errors = {};

		if (form.nome.trim().split(/\s+/).filter(Boolean).length < 2) {
			next.nome = "Informe seu nome completo (nome e sobrenome).";
		}
		if (!form.cpf.trim()) {
			next.cpf = "Informe seu CPF.";
		} else if (onlyDigits(form.cpf).length !== 11) {
			next.cpf = "O CPF precisa ter 11 dígitos.";
		} else if (!isValidCPF(form.cpf)) {
			next.cpf = "CPF inválido — confira os dígitos verificadores.";
		}
		if (!isValidEmail(form.email)) {
			next.email = "Informe um e-mail válido.";
		}
		if (onlyDigits(form.telefone).length < 10) {
			next.telefone = "Informe um celular com DDD.";
		}
		if (!form.nascimento) {
			next.nascimento = "Informe sua data de nascimento.";
		} else {
			const year = Number(form.nascimento.slice(0, 4));
			if (Number.isNaN(year) || year < 1900 || year > 2008) {
				next.nascimento = "É preciso ter 18 anos ou mais para abrir a conta.";
			}
		}

		setErrors(next);
		return Object.keys(next).length === 0;
	}

	function goNext() {
		if (step === 0 && !validateStep1()) return;

		if (step === 2) {
			// Gera a conta só no clique (nunca no render) pra não quebrar a hidratação.
			const n = String(Math.floor(10000 + Math.random() * 89999));
			const dv = String(Math.floor(Math.random() * 10));
			setConta(`${n.slice(0, 2)}.${n.slice(2)}-${dv}`);
		}

		setStep((s) => Math.min(s + 1, STEPS.length - 1));
		if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	}

	function goBack() {
		setStep((s) => Math.max(s - 1, 0));
		if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	}

	function fillDemo() {
		setForm({
			nome: "Camila Ribeiro",
			cpf: "529.982.247-25", // CPF fictício, mas válido nos dígitos verificadores
			email: "camila.ribeiro@email.com",
			telefone: "(11) 98812-4477",
			nascimento: "1994-03-22",
		});
		setErrors({});
	}

	async function copyConta() {
		try {
			await navigator.clipboard.writeText(
				`Agência ${ACCOUNT.agencia} · Conta ${conta}`,
			);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard bloqueado (contexto inseguro) — silencioso de propósito.
		}
	}

	const price = priceFor(selectedPlan, cycle);

	return (
		<section className="pt-32 pb-24 px-6">
			<div className="max-w-3xl mx-auto">
				{/* Cabeçalho */}
				<div className="text-center mb-10">
					<div className={pill}>
						<ShieldCheck size={13} />
						ABERTURA 100% DIGITAL
					</div>
					<h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">
						{step === 3 ? "Sua conta está aberta." : "Abra sua conta Lumina"}
					</h1>
					<p className="mt-3 text-slate-500">
						{step === 3
							? "Leva menos tempo que uma fila de banco."
							: "Leva 3 minutos. Sem papelada, sem tarifa de manutenção."}
					</p>
				</div>

				{/* Indicador de passos */}
				<ol className="mb-10 flex items-center justify-between gap-2">
					{STEPS.map((name, i) => {
						const done = i < step;
						const current = i === step;
						return (
							<li key={name} className="flex-1 flex items-center gap-2">
								<div className="flex flex-col items-center gap-2 flex-1">
									<div className="flex items-center w-full">
										<div
											className={cx(
												"w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all",
												done && "bg-blue-600 text-white",
												current &&
													"bg-blue-600 text-white ring-4 ring-blue-100",
												!done && !current && "bg-white border border-slate-200 text-slate-400",
											)}
										>
											{done ? <Check size={15} strokeWidth={3} /> : i + 1}
										</div>
										{i < STEPS.length - 1 && (
											<div
												className={cx(
													"h-0.5 flex-1 mx-2 rounded-full transition-colors",
													i < step ? "bg-blue-600" : "bg-slate-200",
												)}
											/>
										)}
									</div>
									<span
										className={cx(
											"text-[11px] font-semibold text-center hidden sm:block w-full",
											current
												? "text-blue-600"
												: done
													? "text-slate-700"
													: "text-slate-400",
										)}
									>
										{name}
									</span>
								</div>
							</li>
						);
					})}
				</ol>

				<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 sm:p-10">
					{/* ---------------- Passo 1: dados pessoais ---------------- */}
					{step === 0 && (
						<div className="lumina-fade-up space-y-5">
							<div className="flex items-start justify-between gap-4 mb-2">
								<div>
									<h2 className="text-xl font-bold text-slate-900">
										Seus dados
									</h2>
									<p className="text-sm text-slate-500 mt-1">
										Precisamos deles pra criar sua conta de pagamento.
									</p>
								</div>
								<button
									type="button"
									onClick={fillDemo}
									className={cx(btnGhostSm, "shrink-0")}
								>
									<Wand2 size={14} /> Preencher exemplo
								</button>
							</div>

							<div>
								<label htmlFor="nome" className={labelCls}>
									Nome completo
								</label>
								<input
									id="nome"
									value={form.nome}
									onChange={(e) => set("nome", e.target.value)}
									placeholder="Camila Ribeiro"
									aria-invalid={!!errors.nome}
									className={field(!!errors.nome)}
								/>
								{errors.nome && <p className={errText}>{errors.nome}</p>}
							</div>

							<div className="grid sm:grid-cols-2 gap-5">
								<div>
									<label htmlFor="cpf" className={labelCls}>
										CPF
									</label>
									<input
										id="cpf"
										inputMode="numeric"
										value={form.cpf}
										onChange={(e) => set("cpf", maskCPF(e.target.value))}
										placeholder="000.000.000-00"
										aria-invalid={!!errors.cpf}
										className={cx(field(!!errors.cpf), "font-mono")}
									/>
									{errors.cpf && <p className={errText}>{errors.cpf}</p>}
								</div>

								<div>
									<label htmlFor="nascimento" className={labelCls}>
										Data de nascimento
									</label>
									<input
										id="nascimento"
										type="date"
										value={form.nascimento}
										onChange={(e) => set("nascimento", e.target.value)}
										aria-invalid={!!errors.nascimento}
										className={field(!!errors.nascimento)}
									/>
									{errors.nascimento && (
										<p className={errText}>{errors.nascimento}</p>
									)}
								</div>
							</div>

							<div className="grid sm:grid-cols-2 gap-5">
								<div>
									<label htmlFor="email" className={labelCls}>
										E-mail
									</label>
									<input
										id="email"
										type="email"
										value={form.email}
										onChange={(e) => set("email", e.target.value)}
										placeholder="voce@email.com"
										aria-invalid={!!errors.email}
										className={field(!!errors.email)}
									/>
									{errors.email && <p className={errText}>{errors.email}</p>}
								</div>

								<div>
									<label htmlFor="telefone" className={labelCls}>
										Celular
									</label>
									<input
										id="telefone"
										inputMode="tel"
										value={form.telefone}
										onChange={(e) => set("telefone", maskPhone(e.target.value))}
										placeholder="(11) 90000-0000"
										aria-invalid={!!errors.telefone}
										className={cx(field(!!errors.telefone), "font-mono")}
									/>
									{errors.telefone && (
										<p className={errText}>{errors.telefone}</p>
									)}
								</div>
							</div>

							<div className="flex items-start gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-xs text-slate-500">
								<ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
								<p>
									Demo de portfólio: nada é enviado a lugar nenhum. O CPF é
									validado de verdade (dígitos verificadores), mas fica só no
									seu navegador.
								</p>
							</div>
						</div>
					)}

					{/* ---------------- Passo 2: cartão e plano ---------------- */}
					{step === 1 && (
						<div className="lumina-fade-up space-y-8">
							<div>
								<h2 className="text-xl font-bold text-slate-900">
									Escolha seu plano
								</h2>
								<p className="text-sm text-slate-500 mt-1">
									Dá pra trocar depois, quando quiser, sem taxa.
								</p>
							</div>

							{/* Ciclo */}
							<div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-50 border border-slate-200">
								{(["mensal", "anual"] as const).map((c) => (
									<button
										key={c}
										type="button"
										onClick={() => setCycle(c)}
										className={cx(
											"px-5 py-1.5 rounded-full text-xs font-semibold transition-all",
											cycle === c
												? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
												: "text-slate-600 hover:text-slate-900",
										)}
									>
										{c === "mensal" ? "Mensal" : "Anual (2 meses grátis)"}
									</button>
								))}
							</div>

							<div className="grid gap-3">
								{PLANS.map((p) => {
									const active = p.id === plano;
									const value = priceFor(p, cycle);
									return (
										<button
											key={p.id}
											type="button"
											onClick={() => setPlano(p.id)}
											aria-pressed={active}
											className={cx(
												"w-full text-left rounded-2xl border p-5 transition-all flex items-center gap-4",
												active
													? "border-blue-500 bg-blue-50/50 ring-4 ring-blue-100"
													: "border-slate-200 bg-white hover:border-blue-200",
											)}
										>
											<span
												className={cx(
													"w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
													active
														? "border-blue-600 bg-blue-600 text-white"
														: "border-slate-300",
												)}
											>
												{active && <Check size={11} strokeWidth={4} />}
											</span>
											<span className="flex-1 min-w-0">
												<span className="flex items-center gap-2">
													<span className="font-bold text-slate-900">
														{p.name}
													</span>
													{p.highlight && (
														<span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
															Popular
														</span>
													)}
												</span>
												<span className="block text-sm text-slate-500 mt-0.5">
													{p.tagline}
												</span>
											</span>
											<span className="text-right shrink-0">
												<span className="block font-bold text-slate-900">
													{p.monthly === 0 ? "Grátis" : brl(value)}
												</span>
												{p.monthly > 0 && (
													<span className="block text-[11px] text-slate-400">
														por mês
													</span>
												)}
											</span>
										</button>
									);
								})}
							</div>

							{/* Cartão */}
							<div className="pt-2">
								<h2 className="text-xl font-bold text-slate-900">
									Escolha a cor do cartão
								</h2>
								<p className="text-sm text-slate-500 mt-1 mb-6">
									O cartão virtual já nasce ativo. O físico chega em 5 dias
									úteis.
								</p>

								<div className="grid sm:grid-cols-[1fr_auto] gap-8 items-center">
									<CreditCardVisual
										variant={variant}
										holder={form.nome || "Seu Nome"}
										last4="4291"
										cvv="318"
										exp="09/31"
										className="w-full max-w-sm h-56 mx-auto"
									/>

									<div className="flex sm:flex-col gap-3 justify-center">
										{CARD_VARIANTS.map((v) => (
											<button
												key={v.id}
												type="button"
												onClick={() => setVariant(v.id)}
												aria-label={`Cartão ${v.name}`}
												aria-pressed={variant === v.id}
												className={cx(
													"group flex items-center gap-3 rounded-xl border p-2 pr-4 transition-all",
													variant === v.id
														? "border-blue-500 ring-4 ring-blue-100 bg-blue-50/50"
														: "border-slate-200 hover:border-blue-200",
												)}
											>
												<span
													className={cx(
														"w-9 h-9 rounded-lg shadow-sm border border-slate-200/50",
														v.swatch,
													)}
												/>
												<span className="text-sm font-semibold text-slate-700 hidden sm:inline">
													{v.name}
												</span>
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* ---------------- Passo 3: revisão ---------------- */}
					{step === 2 && (
						<div className="lumina-fade-up space-y-6">
							<div>
								<h2 className="text-xl font-bold text-slate-900">
									Confira antes de abrir
								</h2>
								<p className="text-sm text-slate-500 mt-1">
									Tudo certo? É só confirmar.
								</p>
							</div>

							<div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-200/70">
								<Review label="Nome" value={form.nome} />
								<Review label="CPF" value={form.cpf} mono />
								<Review label="E-mail" value={form.email} />
								<Review label="Celular" value={form.telefone} mono />
								<Review
									label="Nascimento"
									value={form.nascimento.split("-").reverse().join("/")}
									mono
								/>
							</div>

							<div className="rounded-2xl border border-slate-100 bg-slate-50 divide-y divide-slate-200/70">
								<Review
									label="Plano"
									value={`${selectedPlan.name} · ${cycle === "anual" ? "anual" : "mensal"}`}
								/>
								<Review
									label="Cartão"
									value={
										CARD_VARIANTS.find((v) => v.id === variant)?.name ?? "—"
									}
								/>
								<div className="flex items-center justify-between px-5 py-4">
									<span className="text-sm text-slate-500">Você paga</span>
									<span className="text-right">
										<span className="block font-bold text-slate-900">
											{selectedPlan.monthly === 0
												? "Grátis"
												: `${brl(price)}/mês`}
										</span>
										{selectedPlan.monthly > 0 && cycle === "anual" && (
											<span className="block text-[11px] text-slate-400">
												cobrado {brl(annualTotal(selectedPlan))} por ano
											</span>
										)}
									</span>
								</div>
							</div>

							<label className="flex items-start gap-3 text-xs text-slate-500 cursor-default">
								<ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
								<span>
									Ao confirmar, você aceita os termos da conta Lumina. Este é um
									protótipo de demonstração — nenhum dado sai do seu navegador.
								</span>
							</label>
						</div>
					)}

					{/* ---------------- Passo 4: confirmação ---------------- */}
					{step === 3 && (
						<div className="lumina-fade-up text-center">
							<div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
								<PartyPopper size={28} />
							</div>
							<h2 className="mt-6 text-2xl font-bold text-slate-900">
								Bem-vinda(o), {form.nome.split(" ")[0]}!
							</h2>
							<p className="mt-2 text-slate-500 max-w-sm mx-auto">
								Sua conta {selectedPlan.name} está ativa e o cartão virtual já
								pode ser usado.
							</p>

							<div className="mt-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 text-left relative overflow-hidden">
								<div className="absolute right-0 top-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px]" />
								<div className="relative z-10 flex items-center justify-between gap-4">
									<div>
										<div className="text-[10px] uppercase tracking-wider text-blue-100 mb-1">
											Agência
										</div>
										<div className="font-mono text-xl tracking-widest">
											{ACCOUNT.agencia}
										</div>
									</div>
									<div className="w-px h-10 bg-white/20" />
									<div className="flex-1">
										<div className="text-[10px] uppercase tracking-wider text-blue-100 mb-1">
											Conta corrente
										</div>
										<div className="font-mono text-xl tracking-widest">
											{conta}
										</div>
									</div>
									<button
										type="button"
										onClick={copyConta}
										aria-label="Copiar dados da conta"
										className="shrink-0 w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center"
									>
										{copied ? <Check size={17} /> : <Copy size={17} />}
									</button>
								</div>
							</div>

							{copied && (
								<p className="mt-3 text-xs font-semibold text-green-600 lumina-fade-in">
									Dados copiados!
								</p>
							)}

							<div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
								<Link href={`${FT}/app`} className={btnPrimary}>
									Entrar na conta <ArrowUpRight size={18} />
								</Link>
								<Link
									href={`${FT}/cartoes`}
									className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all"
								>
									<CreditCard size={17} /> Ver meu cartão
								</Link>
							</div>
						</div>
					)}

					{/* Navegação do wizard */}
					{step < 3 && (
						<div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
							{step > 0 ? (
								<button
									type="button"
									onClick={goBack}
									className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
								>
									<ArrowLeft size={17} /> Voltar
								</button>
							) : (
								<Link
									href={`${FT}/planos`}
									className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
								>
									<ArrowLeft size={17} /> Ver planos
								</Link>
							)}

							<button type="button" onClick={goNext} className={btnPrimary}>
								{step === 2 ? "Confirmar e abrir conta" : "Continuar"}
								<ArrowUpRight size={18} />
							</button>
						</div>
					)}
				</div>

				{step < 3 && (
					<p className="mt-6 text-center text-sm text-slate-500">
						Já tem conta?{" "}
						<Link
							href={`${FT}/login`}
							className="font-semibold text-blue-600 hover:text-blue-700"
						>
							Entrar
						</Link>
					</p>
				)}
			</div>
		</section>
	);
}

function Review({
	label,
	value,
	mono,
}: {
	label: string;
	value: string;
	mono?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 px-5 py-4">
			<span className="text-sm text-slate-500">{label}</span>
			<span
				className={cx(
					"text-sm font-semibold text-slate-900 text-right truncate",
					mono && "font-mono",
				)}
			>
				{value || "—"}
			</span>
		</div>
	);
}
