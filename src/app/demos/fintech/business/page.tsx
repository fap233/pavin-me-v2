"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
	ArrowUpRight,
	Building2,
	Check,
	FileText,
	Globe,
	PieChart,
	Receipt,
	Send,
	Users,
	Zap,
} from "lucide-react";
import {
	FT,
	brl,
	btnGhost,
	btnPrimary,
	cx,
	errText,
	field,
	isValidEmail,
	label as labelCls,
	maskCNPJ,
	maskPhone,
	onlyDigits,
	pill,
} from "../_components/lumina";

const FEATURES = [
	{
		icon: Receipt,
		title: "Cobrança automática",
		text: "Boletos e Pix com QR Code, baixa automática e régua de cobrança que trabalha por você.",
	},
	{
		icon: Users,
		title: "Acessos por cargo",
		text: "Sócio aprova, financeiro lança, contador só olha. Cada um com seu login.",
	},
	{
		icon: FileText,
		title: "Conciliação sem planilha",
		text: "Exporte pro seu ERP ou contador em um clique. OFX, CSV e integração direta.",
	},
	{
		icon: Globe,
		title: "Recebimento internacional",
		text: "Receba em USD e EUR com câmbio comercial + 0,5%. Sem intermediário.",
	},
];

/** Custo médio mensal cobrado por banco tradicional (tarifas + TED + boletos). */
const LEGACY_MONTHLY_FEE = 89.9;
const LEGACY_RATE = 0.019; // 1,9% sobre o faturamento em taxas de recebimento
const LUMINA_RATE = 0.0059; // 0,59% na Lumina, sem mensalidade

export default function BusinessPage() {
	const [faturamento, setFaturamento] = useState(80000);

	const { legacy, lumina, economia } = useMemo(() => {
		const legacy = LEGACY_MONTHLY_FEE + faturamento * LEGACY_RATE;
		const lumina = faturamento * LUMINA_RATE;
		return { legacy, lumina, economia: Math.max(0, legacy - lumina) };
	}, [faturamento]);

	return (
		<>
			{/* Hero */}
			<section className="pt-32 pb-20 px-6">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
					<div className="space-y-8">
						<div className={pill}>
							<Building2 size={13} />
							LUMINA BUSINESS · PJ
						</div>

						<h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
							A conta PJ que <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
								não atrapalha.
							</span>
						</h1>

						<p className="text-lg text-slate-500 max-w-md leading-relaxed">
							Do MEI ao time de 50 pessoas: cobrança, folha e conciliação num
							lugar só. Abertura em 1 dia útil, sem tarifa de manutenção.
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<a href="#falar-com-especialista" className={btnPrimary}>
								Falar com especialista <ArrowUpRight size={18} />
							</a>
							<Link href={`${FT}/abrir-conta?plano=black`} className={btnGhost}>
								Abrir conta PJ
							</Link>
						</div>

						<div className="pt-6 grid grid-cols-3 gap-6 max-w-md">
							{[
								{ v: "48 mil", l: "empresas" },
								{ v: "1 dia", l: "pra abrir" },
								{ v: "R$ 0", l: "mensalidade" },
							].map((s) => (
								<div key={s.l}>
									<div className="text-2xl font-bold text-slate-900">{s.v}</div>
									<div className="text-xs text-slate-500">{s.l}</div>
								</div>
							))}
						</div>
					</div>

					{/* Painel PJ */}
					<div className="relative">
						<div className="absolute inset-0 bg-blue-200/50 rounded-full blur-3xl -z-10" />

						<div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-8">
							<div className="flex items-center justify-between mb-8">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
										Ateliê Digital LTDA
									</p>
									<p className="font-mono text-xs text-slate-500 mt-1">
										CNPJ 48.902.117/0001-30
									</p>
								</div>
								<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center">
									<Building2 size={19} />
								</div>
							</div>

							<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
								Saldo em conta
							</p>
							<p className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums mt-1">
								{brl(287430.18)}
							</p>

							<div className="mt-8 flex items-end gap-2 h-28">
								{[45, 62, 38, 78, 55, 90].map((h, i) => (
									<div key={i} className="flex-1 flex flex-col justify-end">
										<div
											className={cx(
												"w-full rounded-t-md transition-all",
												i === 5 ? "bg-blue-600" : "bg-blue-100",
											)}
											style={{ height: `${h}%` }}
										/>
									</div>
								))}
							</div>
							<div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
								{["FEV", "MAR", "ABR", "MAI", "JUN", "JUL"].map((m) => (
									<span key={m} className="flex-1 text-center">
										{m}
									</span>
								))}
							</div>

							<div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
										<Receipt size={16} />
									</div>
									<div>
										<p className="text-[11px] text-slate-400 font-semibold">
											A receber
										</p>
										<p className="text-sm font-bold text-slate-900">
											{brl(42890)}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
										<Zap size={16} />
									</div>
									<div>
										<p className="text-[11px] text-slate-400 font-semibold">
											Pix hoje
										</p>
										<p className="text-sm font-bold text-slate-900">37</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Recursos */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Feito pra quem tem empresa pra tocar
						</h2>
						<p className="text-slate-500">
							Menos tempo no banco, mais tempo no negócio.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{FEATURES.map((f) => (
							<div
								key={f.title}
								className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors"
							>
								<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
									<f.icon size={22} />
								</div>
								<h3 className="text-xl font-bold mb-2">{f.title}</h3>
								<p className="text-slate-500 text-sm leading-relaxed">
									{f.text}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Simulador de economia */}
			<section className="py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-12">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Quanto sua empresa economiza?
						</h2>
						<p className="text-slate-500">
							Arraste pelo seu faturamento mensal e compare com um banco
							tradicional.
						</p>
					</div>

					<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-8 sm:p-10">
						<div className="flex flex-wrap items-end justify-between gap-4 mb-8">
							<div>
								<p className={labelCls}>Faturamento mensal</p>
								<p className="text-3xl font-bold text-slate-900 tabular-nums">
									{brl(faturamento)}
								</p>
							</div>
							<div className="text-right">
								<p className={labelCls}>Economia por ano</p>
								<p className="text-3xl font-bold text-green-600 tabular-nums">
									{brl(economia * 12)}
								</p>
							</div>
						</div>

						<input
							type="range"
							min={5000}
							max={500000}
							step={5000}
							value={faturamento}
							onChange={(e) => setFaturamento(Number(e.target.value))}
							aria-label="Faturamento mensal"
							className="w-full accent-blue-600 cursor-pointer"
						/>
						<div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
							<span>{brl(5000)}</span>
							<span>{brl(500000)}</span>
						</div>

						<div className="mt-10 grid sm:grid-cols-2 gap-6">
							<div className="rounded-2xl bg-slate-50 border border-slate-100 p-6">
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
									Banco tradicional
								</p>
								<p className="text-2xl font-bold text-slate-900 tabular-nums">
									{brl(legacy)}
									<span className="text-sm font-medium text-slate-400">
										/mês
									</span>
								</p>
								<p className="mt-2 text-xs text-slate-500">
									Mensalidade de {brl(LEGACY_MONTHLY_FEE)} + 1,9% de taxa de
									recebimento.
								</p>
							</div>

							<div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
								<div className="absolute right-0 top-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px]" />
								<div className="relative z-10">
									<p className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-2">
										Lumina Business
									</p>
									<p className="text-2xl font-bold tabular-nums">
										{brl(lumina)}
										<span className="text-sm font-medium text-blue-200">
											/mês
										</span>
									</p>
									<p className="mt-2 text-xs text-blue-100">
										Sem mensalidade. Só 0,59% de taxa de recebimento.
									</p>
								</div>
							</div>
						</div>

						<p className="mt-6 text-center text-xs text-slate-400">
							Simulação ilustrativa com valores fictícios.
						</p>
					</div>
				</div>
			</section>

			{/* Contato */}
			<section id="falar-com-especialista" className="py-20 px-6 bg-white">
				<div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
					<div className="space-y-6">
						<h2 className="text-3xl font-bold text-slate-900">
							Fale com um especialista PJ
						</h2>
						<p className="text-slate-500 leading-relaxed">
							A gente entende o seu fluxo de caixa antes de propor qualquer
							coisa. Sem script, sem empurrar produto.
						</p>

						<div className="space-y-4 pt-2">
							{[
								"Resposta em até 2 horas úteis",
								"Migração da folha sem custo",
								"Onboarding com o seu contador junto",
							].map((item) => (
								<div key={item} className="flex items-center gap-3">
									<span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
										<Check size={13} strokeWidth={3} />
									</span>
									<span className="text-sm font-medium text-slate-600">
										{item}
									</span>
								</div>
							))}
						</div>

						<div className="pt-4 flex items-center gap-3 text-sm text-slate-500">
							<PieChart size={16} className="text-blue-600" />
							Já é cliente?{" "}
							<Link
								href={`${FT}/app`}
								className="font-semibold text-blue-600 hover:text-blue-700"
							>
								Abrir meu extrato
							</Link>
						</div>
					</div>

					<ContatoForm />
				</div>
			</section>
		</>
	);
}

/* ------------------------------------------------------------------ */

type ContatoErrors = Partial<
	Record<"empresa" | "cnpj" | "email" | "telefone", string>
>;

function ContatoForm() {
	const [empresa, setEmpresa] = useState("");
	const [cnpj, setCnpj] = useState("");
	const [email, setEmail] = useState("");
	const [telefone, setTelefone] = useState("");
	const [errors, setErrors] = useState<ContatoErrors>({});
	const [sent, setSent] = useState(false);

	function submit(e: React.FormEvent) {
		e.preventDefault();

		const next: ContatoErrors = {};
		if (empresa.trim().length < 2) next.empresa = "Informe o nome da empresa.";
		if (onlyDigits(cnpj).length !== 14) next.cnpj = "O CNPJ precisa ter 14 dígitos.";
		if (!isValidEmail(email)) next.email = "Informe um e-mail válido.";
		if (onlyDigits(telefone).length < 10)
			next.telefone = "Informe um telefone com DDD.";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		setSent(true);
	}

	if (sent) {
		return (
			<div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-10 text-center lumina-fade-up">
				<div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
					<Check size={30} strokeWidth={3} />
				</div>
				<h3 className="mt-6 text-xl font-bold text-slate-900">
					Recebemos seu contato
				</h3>
				<p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
					Um especialista fala com a{" "}
					<span className="font-semibold text-slate-700">{empresa}</span> em até
					2 horas úteis.
				</p>
				<button
					type="button"
					onClick={() => {
						setSent(false);
						setEmpresa("");
						setCnpj("");
						setEmail("");
						setTelefone("");
					}}
					className={cx(btnGhost, "mt-8")}
				>
					Enviar outro contato
				</button>
			</div>
		);
	}

	return (
		<form
			onSubmit={submit}
			noValidate
			className="rounded-[2rem] bg-slate-50 border border-slate-100 p-8 space-y-5"
		>
			<div>
				<label htmlFor="empresa" className={labelCls}>
					Nome da empresa
				</label>
				<input
					id="empresa"
					value={empresa}
					onChange={(e) => {
						setEmpresa(e.target.value);
						if (errors.empresa) setErrors((x) => ({ ...x, empresa: undefined }));
					}}
					placeholder="Ateliê Digital LTDA"
					aria-invalid={!!errors.empresa}
					className={field(!!errors.empresa)}
				/>
				{errors.empresa && <p className={errText}>{errors.empresa}</p>}
			</div>

			<div>
				<label htmlFor="cnpj" className={labelCls}>
					CNPJ
				</label>
				<input
					id="cnpj"
					inputMode="numeric"
					value={cnpj}
					onChange={(e) => {
						setCnpj(maskCNPJ(e.target.value));
						if (errors.cnpj) setErrors((x) => ({ ...x, cnpj: undefined }));
					}}
					placeholder="00.000.000/0000-00"
					aria-invalid={!!errors.cnpj}
					className={cx(field(!!errors.cnpj), "font-mono")}
				/>
				{errors.cnpj && <p className={errText}>{errors.cnpj}</p>}
			</div>

			<div className="grid sm:grid-cols-2 gap-5">
				<div>
					<label htmlFor="email-pj" className={labelCls}>
						E-mail
					</label>
					<input
						id="email-pj"
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
						}}
						placeholder="voce@empresa.com"
						aria-invalid={!!errors.email}
						className={field(!!errors.email)}
					/>
					{errors.email && <p className={errText}>{errors.email}</p>}
				</div>

				<div>
					<label htmlFor="tel-pj" className={labelCls}>
						Telefone
					</label>
					<input
						id="tel-pj"
						inputMode="tel"
						value={telefone}
						onChange={(e) => {
							setTelefone(maskPhone(e.target.value));
							if (errors.telefone)
								setErrors((x) => ({ ...x, telefone: undefined }));
						}}
						placeholder="(11) 90000-0000"
						aria-invalid={!!errors.telefone}
						className={cx(field(!!errors.telefone), "font-mono")}
					/>
					{errors.telefone && <p className={errText}>{errors.telefone}</p>}
				</div>
			</div>

			<button type="submit" className={cx(btnPrimary, "w-full")}>
				<Send size={17} /> Falar com especialista
			</button>

			<p className="text-center text-xs text-slate-400">
				Demo de portfólio — nenhum dado é enviado.
			</p>
		</form>
	);
}
