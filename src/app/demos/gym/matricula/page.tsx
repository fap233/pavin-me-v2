"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import {
	AlertTriangle,
	ArrowLeft,
	ArrowRight,
	Check,
	CreditCard,
	QrCode,
	Ticket,
} from "lucide-react";
import { SkewButton, SkewLink } from "../_components/ui";
import {
	PLANS,
	UNITS,
	brl,
	cycleTotal,
	monthlyPrice,
	planById,
	unitById,
	annualSavings,
	type BillingCycle,
	type PlanId,
} from "../_data/gym";

/* ------------------------------------------------------------------ */
/* Máscaras e validação (tudo client-side — a demo não tem backend)     */
/* ------------------------------------------------------------------ */

const onlyDigits = (v: string) => v.replace(/\D/g, "");

function maskPhone(v: string) {
	const d = onlyDigits(v).slice(0, 11);
	if (d.length <= 2) return d.length ? `(${d}` : "";
	if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	if (d.length <= 10)
		return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCPF(v: string) {
	const d = onlyDigits(v).slice(0, 11);
	if (d.length <= 3) return d;
	if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
	if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
	return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCard(v: string) {
	const d = onlyDigits(v).slice(0, 16);
	return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function maskExpiry(v: string) {
	const d = onlyDigits(v).slice(0, 4);
	if (d.length <= 2) return d;
	return `${d.slice(0, 2)}/${d.slice(2)}`;
}

/** Validação real de CPF (dígitos verificadores), não só contagem de dígitos. */
function isValidCPF(value: string) {
	const cpf = onlyDigits(value);
	if (cpf.length !== 11) return false;
	if (/^(\d)\1{10}$/.test(cpf)) return false;

	const digit = (upTo: number) => {
		let sum = 0;
		for (let i = 0; i < upTo; i++) {
			sum += Number(cpf[i]) * (upTo + 1 - i);
		}
		const rest = (sum * 10) % 11;
		return rest === 10 ? 0 : rest;
	};

	return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

/** Luhn — pega número de cartão digitado errado antes de "cobrar". */
function isValidCard(value: string) {
	const d = onlyDigits(value);
	if (d.length !== 16) return false;
	let sum = 0;
	for (let i = 0; i < d.length; i++) {
		let n = Number(d[d.length - 1 - i]);
		if (i % 2 === 1) {
			n *= 2;
			if (n > 9) n -= 9;
		}
		sum += n;
	}
	return sum % 10 === 0;
}

function isValidExpiry(value: string) {
	const m = /^(\d{2})\/(\d{2})$/.exec(value);
	if (!m) return false;
	const month = Number(m[1]);
	const year = 2000 + Number(m[2]);
	if (month < 1 || month > 12) return false;
	const now = new Date();
	const last = new Date(year, month, 0, 23, 59, 59);
	return last.getTime() > now.getTime();
}

function ageFrom(birth: string) {
	const d = new Date(`${birth}T00:00:00`);
	if (Number.isNaN(d.getTime())) return NaN;
	const now = new Date();
	let age = now.getFullYear() - d.getFullYear();
	const before =
		now.getMonth() < d.getMonth() ||
		(now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
	if (before) age -= 1;
	return age;
}

/* ------------------------------------------------------------------ */
/* Tipos do formulário                                                  */
/* ------------------------------------------------------------------ */

type PaymentMethod = "cartao" | "pix";

type FormState = {
	nome: string;
	email: string;
	telefone: string;
	cpf: string;
	nascimento: string;
	metodo: PaymentMethod;
	cardNumber: string;
	cardName: string;
	cardExpiry: string;
	cardCvv: string;
};

const EMPTY: FormState = {
	nome: "",
	email: "",
	telefone: "",
	cpf: "",
	nascimento: "",
	metodo: "cartao",
	cardNumber: "",
	cardName: "",
	cardExpiry: "",
	cardCvv: "",
};

const STEPS = ["Plano", "Dados", "Pagamento", "Confirmação"] as const;

/* ------------------------------------------------------------------ */
/* Página                                                               */
/* ------------------------------------------------------------------ */

export default function MatriculaPage() {
	return (
		<Suspense
			fallback={
				<div className="pt-40 pb-32 px-6 text-center font-black italic uppercase tracking-tighter text-neutral-600">
					Carregando matrícula...
				</div>
			}
		>
			<MatriculaFlow />
		</Suspense>
	);
}

function MatriculaFlow() {
	const params = useSearchParams();

	// O plano/ciclo/unidade chegam da página de planos (?plano=iron-pro&ciclo=anual).
	const initialPlan = (planById(params.get("plano"))?.id ??
		"iron-pro") as PlanId;
	const initialCycle: BillingCycle =
		params.get("ciclo") === "anual" ? "anual" : "mensal";
	const initialUnit = unitById(params.get("unidade"))?.id ?? UNITS[0].id;

	const [step, setStep] = useState(0);
	const [planId, setPlanId] = useState<PlanId>(initialPlan);
	const [cycle, setCycle] = useState<BillingCycle>(initialCycle);
	const [unitId, setUnitId] = useState(initialUnit);
	const [form, setForm] = useState<FormState>(EMPTY);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [matricula, setMatricula] = useState<string | null>(null);

	const plan = planById(planId) ?? PLANS[1];
	const unit = unitById(unitId) ?? UNITS[0];
	const perMonth = monthlyPrice(plan, cycle);
	const total = cycleTotal(plan, cycle);

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setForm((f) => ({ ...f, [key]: value }));
		// Erro some assim que o usuário mexe no campo — nada de mensagem grudada.
		setErrors((e) => {
			if (!e[key]) return e;
			const next = { ...e };
			delete next[key];
			return next;
		});
	};

	function validateDados() {
		const e: Record<string, string> = {};

		const nome = form.nome.trim();
		if (!nome) e.nome = "Informe seu nome completo";
		else if (nome.split(/\s+/).filter((p) => p.length >= 2).length < 2)
			e.nome = "Nome e sobrenome, por favor";

		if (!form.email.trim()) e.email = "Informe seu e-mail";
		else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
			e.email = "E-mail inválido";

		const tel = onlyDigits(form.telefone);
		if (!tel) e.telefone = "Informe seu celular";
		else if (tel.length < 10) e.telefone = "Celular incompleto (DDD + número)";

		if (!form.cpf) e.cpf = "Informe seu CPF";
		else if (!isValidCPF(form.cpf)) e.cpf = "CPF inválido — confira os dígitos";

		if (!form.nascimento) e.nascimento = "Informe sua data de nascimento";
		else {
			const age = ageFrom(form.nascimento);
			if (Number.isNaN(age)) e.nascimento = "Data inválida";
			else if (age < 16)
				e.nascimento = "Menores de 16 só com responsável na unidade";
			else if (age > 100) e.nascimento = "Data inválida";
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function validatePagamento() {
		const e: Record<string, string> = {};

		if (form.metodo === "cartao") {
			if (!form.cardNumber) e.cardNumber = "Informe o número do cartão";
			else if (!isValidCard(form.cardNumber))
				e.cardNumber = "Número de cartão inválido (16 dígitos)";

			if (!form.cardName.trim())
				e.cardName = "Nome impresso no cartão";
			else if (form.cardName.trim().length < 5)
				e.cardName = "Nome muito curto";

			if (!form.cardExpiry) e.cardExpiry = "Validade (MM/AA)";
			else if (!isValidExpiry(form.cardExpiry))
				e.cardExpiry = "Validade inválida ou vencida";

			const cvv = onlyDigits(form.cardCvv);
			if (!cvv) e.cardCvv = "CVV";
			else if (cvv.length < 3) e.cardCvv = "CVV tem 3 dígitos";
		}

		setErrors(e);
		return Object.keys(e).length === 0;
	}

	function next() {
		if (step === 1 && !validateDados()) return;
		if (step === 2) {
			if (!validatePagamento()) return;
			// "Processa" e emite a matrícula. Número gerado no clique (client),
			// então não há risco de divergência com o HTML do servidor.
			const serial = String(Math.floor(10000 + Math.random() * 89999));
			setMatricula(`IF-2026-${serial}`);
			setStep(3);
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		setStep((s) => Math.min(s + 1, 3));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function back() {
		setErrors({});
		setStep((s) => Math.max(s - 1, 0));
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	const firstName = useMemo(
		() => form.nome.trim().split(/\s+/)[0] || "atleta",
		[form.nome],
	);

	/* ------------------------------ Confirmação ------------------------------ */
	if (step === 3 && matricula) {
		return (
			<section className="pt-32 pb-24 px-6 bg-neutral-950 min-h-screen">
				<div className="max-w-3xl mx-auto">
					<div className="border-2 border-yellow-500 bg-neutral-900 shadow-[0_0_40px_rgba(234,179,8,0.15)]">
						<div className="bg-yellow-500 text-black px-8 py-6 flex items-center gap-4">
							<Check size={40} strokeWidth={4} className="shrink-0" />
							<div>
								<div className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">
									Bem-vindo ao ferro, {firstName}
								</div>
								<div className="text-xs font-bold uppercase tracking-widest mt-2 text-black/70">
									Matrícula confirmada · sem taxa de adesão
								</div>
							</div>
						</div>

						<div className="p-8">
							<div className="border border-dashed border-neutral-700 bg-neutral-950 p-6 mb-8 flex items-center gap-4">
								<Ticket className="text-yellow-500 shrink-0" size={32} />
								<div>
									<div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
										Número da matrícula
									</div>
									<div className="text-3xl font-black italic tracking-tighter text-white">
										{matricula}
									</div>
								</div>
							</div>

							<dl className="divide-y divide-neutral-800 mb-8">
								<Row label="Plano" value={`${plan.name} · ${cycle}`} />
								<Row
									label="Valor"
									value={`${brl(perMonth)}/mês${
										cycle === "anual" ? ` · ${brl(total)} à vista` : ""
									}`}
								/>
								<Row label="Unidade" value={unit.name} />
								<Row label="Aluno" value={form.nome.trim()} />
								<Row label="E-mail" value={form.email.trim()} />
								<Row
									label="Pagamento"
									value={
										form.metodo === "pix"
											? "Pix — QR Code enviado por e-mail"
											: `Cartão final ${onlyDigits(form.cardNumber).slice(-4)}`
									}
								/>
							</dl>

							<p className="text-neutral-400 text-sm font-medium mb-8">
								Sua carteirinha digital e o QR de acesso à catraca já foram
								enviados para{" "}
								<span className="text-white font-bold">
									{form.email.trim()}
								</span>
								. É só aparecer — a primeira semana é por nossa conta.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<SkewLink href="/demos/gym/programas" variant="solid" size="md">
									Reservar minha 1ª aula <ArrowRight size={18} />
								</SkewLink>
								<SkewLink href="/demos/gym" variant="outline" size="md">
									Voltar ao início
								</SkewLink>
							</div>
						</div>
					</div>

					<p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-700 mt-6">
						Demo fictícia — nenhum pagamento foi processado
					</p>
				</div>
			</section>
		);
	}

	/* --------------------------------- Fluxo --------------------------------- */
	return (
		<section className="pt-32 pb-24 px-6 bg-neutral-950 min-h-screen">
			<div className="max-w-6xl mx-auto">
				<div className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs mb-4">
					Matrícula
				</div>
				<h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tighter mb-10">
					Três passos <span className="text-yellow-500">e você treina</span>
				</h1>

				{/* Barra de progresso */}
				<ol className="grid grid-cols-4 gap-2 mb-12">
					{STEPS.map((label, i) => {
						const done = i < step;
						const current = i === step;
						return (
							<li key={label}>
								<div
									className={`h-2 -skew-x-12 ${
										done || current ? "bg-yellow-500" : "bg-neutral-800"
									}`}
								/>
								<div
									className={`mt-3 text-[10px] sm:text-xs font-black uppercase italic tracking-wider flex items-center gap-1 ${
										current
											? "text-yellow-500"
											: done
												? "text-neutral-400"
												: "text-neutral-700"
									}`}
								>
									{done ? <Check size={12} /> : <span>{i + 1}.</span>}
									{label}
								</div>
							</li>
						);
					})}
				</ol>

				<div className="grid lg:grid-cols-3 gap-8 items-start">
					{/* Coluna do formulário */}
					<div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 md:p-10">
						{step === 0 ? (
							<StepPlano
								planId={planId}
								cycle={cycle}
								unitId={unitId}
								onPlan={setPlanId}
								onCycle={setCycle}
								onUnit={setUnitId}
							/>
						) : null}

						{step === 1 ? (
							<StepDados form={form} errors={errors} set={set} />
						) : null}

						{step === 2 ? (
							<StepPagamento
								form={form}
								errors={errors}
								set={set}
								total={total}
								cycle={cycle}
							/>
						) : null}

						<div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col-reverse sm:flex-row gap-4 justify-between">
							{step > 0 ? (
								<SkewButton variant="ghost" size="sm" onClick={back}>
									<ArrowLeft size={16} /> Voltar
								</SkewButton>
							) : (
								<SkewLink href="/demos/gym/planos" variant="ghost" size="sm">
									<ArrowLeft size={16} /> Ver todos os planos
								</SkewLink>
							)}

							<SkewButton variant="solid" size="md" onClick={next}>
								{step === 2 ? "Confirmar matrícula" : "Continuar"}
								<ArrowRight
									size={18}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</SkewButton>
						</div>
					</div>

					{/* Resumo lateral */}
					<aside className="bg-black border-2 border-yellow-500 p-6 lg:sticky lg:top-28">
						<div className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-6">
							Seu pedido
						</div>

						<div className="mb-6">
							<div className="text-2xl font-black italic uppercase tracking-tighter text-white">
								{plan.name}
							</div>
							<div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-1">
								Ciclo {cycle}
							</div>
						</div>

						<div className="mb-6">
							<div className="text-4xl font-black text-white leading-none">
								{brl(perMonth)}
								<span className="text-base text-neutral-500 font-medium">
									/mês
								</span>
							</div>
							{cycle === "anual" ? (
								<div className="text-xs font-bold uppercase tracking-widest text-yellow-500 mt-2">
									{brl(total)} à vista · economia de {brl(annualSavings(plan))}
								</div>
							) : (
								<div className="text-xs font-bold uppercase tracking-widest text-neutral-600 mt-2">
									Cobrado todo mês · sem fidelidade
								</div>
							)}
						</div>

						<dl className="divide-y divide-neutral-800 text-sm">
							<Row label="Unidade" value={unit.name.replace("Iron Forge — ", "")} />
							<Row label="Adesão" value="Isenta" />
							<Row
								label="Total hoje"
								value={brl(total)}
								strong
							/>
						</dl>

						<ul className="mt-6 space-y-2">
							{plan.features.map((f) => (
								<li
									key={f}
									className="flex gap-2 items-start text-xs font-bold uppercase tracking-wide text-neutral-400"
								>
									<Check size={14} className="text-yellow-500 shrink-0 mt-0.5" />
									{f}
								</li>
							))}
						</ul>

						<Link
							href="/demos/gym/planos"
							className="mt-6 inline-block text-[10px] font-bold uppercase tracking-widest text-neutral-600 hover:text-yellow-500 transition-colors underline underline-offset-4"
						>
							Comparar com os outros planos
						</Link>
					</aside>
				</div>
			</div>
		</section>
	);
}

/* ------------------------------------------------------------------ */
/* Passos                                                               */
/* ------------------------------------------------------------------ */

function StepPlano({
	planId,
	cycle,
	unitId,
	onPlan,
	onCycle,
	onUnit,
}: {
	planId: PlanId;
	cycle: BillingCycle;
	unitId: string;
	onPlan: (id: PlanId) => void;
	onCycle: (c: BillingCycle) => void;
	onUnit: (id: string) => void;
}) {
	return (
		<div>
			<StepTitle index={1} title="Escolha o plano" />

			<div className="flex mb-8 border-2 border-neutral-700 bg-neutral-950 -skew-x-12 p-1 w-fit">
				{(["mensal", "anual"] as const).map((option) => (
					<button
						key={option}
						type="button"
						onClick={() => onCycle(option)}
						aria-pressed={cycle === option}
						className={`px-6 py-2 text-xs font-black uppercase italic tracking-wider transition-colors ${
							cycle === option
								? "bg-yellow-500 text-black"
								: "text-neutral-400 hover:text-white"
						}`}
					>
						<span className="skew-x-12 block">
							{option === "anual" ? "Anual (2 meses grátis)" : "Mensal"}
						</span>
					</button>
				))}
			</div>

			<div className="grid gap-4 mb-10">
				{PLANS.map((p) => {
					const selected = p.id === planId;
					return (
						<button
							key={p.id}
							type="button"
							onClick={() => onPlan(p.id)}
							aria-pressed={selected}
							className={`text-left p-5 border-2 transition-all flex items-center gap-4 ${
								selected
									? "border-yellow-500 bg-yellow-500/5"
									: "border-neutral-800 bg-neutral-950 hover:border-white"
							}`}
						>
							<span
								className={`w-5 h-5 shrink-0 border-2 -skew-x-12 flex items-center justify-center ${
									selected
										? "border-yellow-500 bg-yellow-500"
										: "border-neutral-600"
								}`}
							>
								{selected ? (
									<Check size={12} strokeWidth={4} className="text-black" />
								) : null}
							</span>

							<span className="flex-1">
								<span className="flex items-center gap-2">
									<span
										className={`font-black italic uppercase tracking-tighter text-lg ${
											selected ? "text-yellow-500" : "text-white"
										}`}
									>
										{p.name}
									</span>
									{p.popular ? (
										<span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest">
											Popular
										</span>
									) : null}
								</span>
								<span className="block text-xs font-medium text-neutral-500 mt-1">
									{p.tagline}
								</span>
							</span>

							<span className="text-right shrink-0">
								<span className="block text-2xl font-black text-white leading-none">
									{brl(monthlyPrice(p, cycle))}
								</span>
								<span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mt-1">
									por mês
								</span>
							</span>
						</button>
					);
				})}
			</div>

			<StepTitle index={2} title="Onde você vai treinar" />
			<div className="grid sm:grid-cols-3 gap-4">
				{UNITS.map((u) => {
					const selected = u.id === unitId;
					return (
						<button
							key={u.id}
							type="button"
							onClick={() => onUnit(u.id)}
							aria-pressed={selected}
							className={`text-left p-4 border-2 transition-colors ${
								selected
									? "border-yellow-500 bg-yellow-500/5"
									: "border-neutral-800 bg-neutral-950 hover:border-white"
							}`}
						>
							<div
								className={`font-black italic uppercase tracking-tighter ${
									selected ? "text-yellow-500" : "text-white"
								}`}
							>
								{u.name.replace("Iron Forge — ", "")}
							</div>
							<div className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 mt-1">
								{u.city}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function StepDados({
	form,
	errors,
	set,
}: {
	form: FormState;
	errors: Record<string, string>;
	set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
	return (
		<div>
			<StepTitle title="Seus dados" />

			<div className="grid gap-6">
				<Field label="Nome completo" error={errors.nome} htmlFor="nome">
					<input
						id="nome"
						value={form.nome}
						onChange={(e) => set("nome", e.target.value)}
						placeholder="Ana Beatriz Ferreira"
						autoComplete="name"
						className={inputClass(!!errors.nome)}
					/>
				</Field>

				<div className="grid sm:grid-cols-2 gap-6">
					<Field label="E-mail" error={errors.email} htmlFor="email">
						<input
							id="email"
							type="email"
							value={form.email}
							onChange={(e) => set("email", e.target.value)}
							placeholder="ana@email.com.br"
							autoComplete="email"
							className={inputClass(!!errors.email)}
						/>
					</Field>

					<Field label="Celular" error={errors.telefone} htmlFor="telefone">
						<input
							id="telefone"
							inputMode="numeric"
							value={form.telefone}
							onChange={(e) => set("telefone", maskPhone(e.target.value))}
							placeholder="(11) 98765-4321"
							autoComplete="tel"
							className={inputClass(!!errors.telefone)}
						/>
					</Field>
				</div>

				<div className="grid sm:grid-cols-2 gap-6">
					<Field label="CPF" error={errors.cpf} htmlFor="cpf">
						<input
							id="cpf"
							inputMode="numeric"
							value={form.cpf}
							onChange={(e) => set("cpf", maskCPF(e.target.value))}
							placeholder="123.456.789-09"
							className={inputClass(!!errors.cpf)}
						/>
					</Field>

					<Field
						label="Nascimento"
						error={errors.nascimento}
						htmlFor="nascimento"
					>
						<input
							id="nascimento"
							type="date"
							value={form.nascimento}
							onChange={(e) => set("nascimento", e.target.value)}
							className={`${inputClass(!!errors.nascimento)} [color-scheme:dark]`}
						/>
					</Field>
				</div>
			</div>

			<p className="mt-8 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
				Usamos o CPF só pra emitir a carteirinha. Nada é enviado a lugar nenhum —
				esta é uma demo.
			</p>
		</div>
	);
}

function StepPagamento({
	form,
	errors,
	set,
	total,
	cycle,
}: {
	form: FormState;
	errors: Record<string, string>;
	set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
	total: number;
	cycle: BillingCycle;
}) {
	return (
		<div>
			<StepTitle title="Pagamento" />

			<div className="grid sm:grid-cols-2 gap-4 mb-8">
				{(
					[
						{ id: "cartao", label: "Cartão de crédito", icon: CreditCard },
						{ id: "pix", label: "Pix", icon: QrCode },
					] as const
				).map((option) => {
					const selected = form.metodo === option.id;
					const Icon = option.icon;
					return (
						<button
							key={option.id}
							type="button"
							onClick={() => set("metodo", option.id as PaymentMethod)}
							aria-pressed={selected}
							className={`p-5 border-2 flex items-center gap-3 transition-colors ${
								selected
									? "border-yellow-500 bg-yellow-500/5 text-yellow-500"
									: "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-white hover:text-white"
							}`}
						>
							<Icon size={22} className="shrink-0" />
							<span className="font-black italic uppercase tracking-tighter">
								{option.label}
							</span>
						</button>
					);
				})}
			</div>

			{form.metodo === "cartao" ? (
				<div className="grid gap-6">
					<Field
						label="Número do cartão"
						error={errors.cardNumber}
						htmlFor="cardNumber"
					>
						<input
							id="cardNumber"
							inputMode="numeric"
							value={form.cardNumber}
							onChange={(e) => set("cardNumber", maskCard(e.target.value))}
							placeholder="4539 1488 0343 6467"
							autoComplete="cc-number"
							className={inputClass(!!errors.cardNumber)}
						/>
					</Field>

					<Field
						label="Nome impresso no cartão"
						error={errors.cardName}
						htmlFor="cardName"
					>
						<input
							id="cardName"
							value={form.cardName}
							onChange={(e) =>
								set("cardName", e.target.value.toUpperCase())
							}
							placeholder="ANA B FERREIRA"
							autoComplete="cc-name"
							className={inputClass(!!errors.cardName)}
						/>
					</Field>

					<div className="grid grid-cols-2 gap-6">
						<Field
							label="Validade"
							error={errors.cardExpiry}
							htmlFor="cardExpiry"
						>
							<input
								id="cardExpiry"
								inputMode="numeric"
								value={form.cardExpiry}
								onChange={(e) => set("cardExpiry", maskExpiry(e.target.value))}
								placeholder="12/29"
								autoComplete="cc-exp"
								className={inputClass(!!errors.cardExpiry)}
							/>
						</Field>

						<Field label="CVV" error={errors.cardCvv} htmlFor="cardCvv">
							<input
								id="cardCvv"
								inputMode="numeric"
								value={form.cardCvv}
								onChange={(e) =>
									set("cardCvv", onlyDigits(e.target.value).slice(0, 4))
								}
								placeholder="123"
								autoComplete="cc-csc"
								className={inputClass(!!errors.cardCvv)}
							/>
						</Field>
					</div>
				</div>
			) : (
				<div className="border-2 border-dashed border-neutral-700 bg-neutral-950 p-8 text-center">
					<QrCode size={64} className="text-yellow-500 mx-auto mb-4" />
					<div className="font-black italic uppercase tracking-tighter text-xl text-white mb-2">
						Pix de {brl(total)}
					</div>
					<p className="text-neutral-500 text-sm font-medium max-w-sm mx-auto">
						Ao confirmar, o QR Code do {cycle === "anual" ? "anual" : "primeiro mês"}{" "}
						vai pro seu e-mail e vale por 30 minutos.
					</p>
				</div>
			)}

			<div className="mt-8 flex items-start gap-3 border-l-4 border-yellow-500 bg-neutral-950 p-4">
				<AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
				<p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
					Demo: nenhum dado é enviado nem cobrado. Use qualquer cartão de teste
					(ex.: 4539 1488 0343 6467).
				</p>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* Peças do formulário                                                  */
/* ------------------------------------------------------------------ */

function inputClass(hasError: boolean) {
	return `w-full bg-neutral-950 border-2 px-4 py-3 text-white font-bold tracking-wide placeholder:text-neutral-700 placeholder:font-medium focus:outline-none transition-colors ${
		hasError
			? "border-red-500 focus:border-red-400"
			: "border-neutral-700 focus:border-yellow-500"
	}`;
}

function Field({
	label,
	error,
	htmlFor,
	children,
}: {
	label: string;
	error?: string;
	htmlFor: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<label
				htmlFor={htmlFor}
				className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2"
			>
				{label}
			</label>
			{children}
			{error ? (
				<div className="mt-2 flex items-center gap-2 bg-red-500 text-black px-3 py-1.5 -skew-x-12 w-fit">
					<span className="skew-x-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
						<AlertTriangle size={12} strokeWidth={3} />
						{error}
					</span>
				</div>
			) : null}
		</div>
	);
}

function StepTitle({ index, title }: { index?: number; title: string }) {
	return (
		<div className="mb-8">
			<h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
				{index ? <span className="text-yellow-500">{index}.</span> : null} {title}
			</h2>
			<div className="w-16 h-1.5 bg-yellow-500 -skew-x-12 mt-3" />
		</div>
	);
}

function Row({
	label,
	value,
	strong,
}: {
	label: string;
	value: string;
	strong?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 py-3">
			<dt className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 shrink-0">
				{label}
			</dt>
			<dd
				className={`text-right font-bold ${
					strong
						? "text-yellow-500 text-xl font-black italic tracking-tighter"
						: "text-white text-sm"
				}`}
			>
				{value}
			</dd>
		</div>
	);
}
