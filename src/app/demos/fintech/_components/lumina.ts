/**
 * Núcleo da demo Lumina: rotas, design tokens em forma de className,
 * formatação pt-BR/BRL, máscaras e validações, planos e dados mock.
 *
 * Tudo aqui é determinístico (sem Intl, sem Date.now, sem random em render)
 * pra não quebrar hidratação no SSR.
 */

export const FT = "/demos/fintech";

/* ------------------------------------------------------------------ *
 * Design tokens (extraídos da home original)
 * ------------------------------------------------------------------ */

export const btnPrimary =
	"inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";

export const btnPrimarySm =
	"inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-40 disabled:cursor-not-allowed";

export const btnGhost =
	"inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all";

export const btnGhostSm =
	"inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all";

export const btnDark =
	"inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20";

export const pill =
	"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600";

export const surface =
	"bg-white rounded-[2rem] border border-slate-100 shadow-sm";

export const bento =
	"bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors";

export const inputBase =
	"w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all";

export const inputOk =
	"border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

export const inputBad =
	"border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100";

export const errText = "mt-1.5 text-xs font-semibold text-red-500";

export const label =
	"block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2";

export function field(hasError: boolean) {
	return `${inputBase} ${hasError ? inputBad : inputOk}`;
}

export function cx(...parts: Array<string | false | null | undefined>) {
	return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ *
 * Formatação / máscaras (determinísticas, sem Intl)
 * ------------------------------------------------------------------ */

export function brl(value: number): string {
	const negative = value < 0;
	const [int, dec] = Math.abs(value).toFixed(2).split(".");
	const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return `${negative ? "-" : ""}R$ ${grouped},${dec}`;
}

/** Só o número, sem o "R$" — pra saldos grandes em destaque. */
export function brlNumber(value: number): string {
	return brl(value).replace("R$ ", "");
}

export function onlyDigits(value: string): string {
	return value.replace(/\D/g, "");
}

export function maskCPF(value: string): string {
	const d = onlyDigits(value).slice(0, 11);
	if (d.length <= 3) return d;
	if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
	if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
	return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** Validação real de CPF (dígitos verificadores), não só contagem de chars. */
export function isValidCPF(value: string): boolean {
	const d = onlyDigits(value);
	if (d.length !== 11) return false;
	if (/^(\d)\1{10}$/.test(d)) return false; // 111.111.111-11 & cia

	const digits = d.split("").map(Number);

	for (const round of [9, 10]) {
		let sum = 0;
		for (let i = 0; i < round; i++) {
			sum += digits[i] * (round + 1 - i);
		}
		const rest = (sum * 10) % 11;
		const check = rest === 10 || rest === 11 ? 0 : rest;
		if (check !== digits[round]) return false;
	}
	return true;
}

export function maskPhone(value: string): string {
	const d = onlyDigits(value).slice(0, 11);
	if (d.length <= 2) return d;
	if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
	if (d.length <= 10)
		return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
	return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCNPJ(value: string): string {
	const d = onlyDigits(value).slice(0, 14);
	if (d.length <= 2) return d;
	if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
	if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
	if (d.length <= 12)
		return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
	return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(
		8,
		12,
	)}-${d.slice(12)}`;
}

/** Input de dinheiro: usuário digita centavos, a máscara monta o valor. */
export function maskMoney(value: string): string {
	const d = onlyDigits(value).slice(0, 11);
	if (!d) return "";
	const cents = Number(d) / 100;
	return brlNumber(cents);
}

export function parseMoney(masked: string): number {
	const d = onlyDigits(masked);
	return d ? Number(d) / 100 : 0;
}

export function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(value.trim());
}

/** Iniciais pra avatar ("Fellipe Pavin" -> "FP"). */
export function initials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	if (!parts.length) return "LU";
	const first = parts[0][0] ?? "";
	const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
	return (first + last).toUpperCase();
}

/* ------------------------------------------------------------------ *
 * Planos
 * ------------------------------------------------------------------ */

export type PlanId = "free" | "plus" | "black";

export type Plan = {
	id: PlanId;
	name: string;
	tagline: string;
	monthly: number;
	highlight?: boolean;
	perks: string[];
};

/** No anual o cliente paga 10 meses e leva 12 (2 meses grátis). */
export const ANNUAL_MONTHS_CHARGED = 10;

export const PLANS: Plan[] = [
	{
		id: "free",
		name: "Lumina Free",
		tagline: "O essencial pra sair do banco tradicional.",
		monthly: 0,
		perks: [
			"Conta digital sem tarifa de manutenção",
			"Cartão virtual e Pix ilimitados",
			"Rendimento de 100% do CDI",
			"Analytics de gastos por categoria",
		],
	},
	{
		id: "plus",
		name: "Lumina Plus",
		tagline: "Pra quem usa o banco todos os dias.",
		monthly: 19.9,
		highlight: true,
		perks: [
			"Tudo do Free, sem limites",
			"Cartão físico grátis + 1% de cashback",
			"Rendimento de 110% do CDI",
			"Conta global com IOF reduzido",
			"Suporte humano em até 3 minutos",
		],
	},
	{
		id: "black",
		name: "Lumina Black",
		tagline: "Concierge, salas VIP e limites sob medida.",
		monthly: 59.9,
		perks: [
			"Tudo do Plus, com prioridade",
			"Salas VIP ilimitadas em aeroportos",
			"Concierge 24h por WhatsApp",
			"2% de cashback + cashback em cripto",
			"Seguro viagem e proteção de compra",
			"Gerente dedicado",
		],
	},
];

export function planById(id: string | null | undefined): Plan {
	return PLANS.find((p) => p.id === id) ?? PLANS[1];
}

/** Preço mensal exibido conforme o ciclo escolhido. */
export function priceFor(plan: Plan, cycle: "mensal" | "anual"): number {
	if (plan.monthly === 0) return 0;
	if (cycle === "mensal") return plan.monthly;
	return (plan.monthly * ANNUAL_MONTHS_CHARGED) / 12;
}

export function annualTotal(plan: Plan): number {
	return plan.monthly * ANNUAL_MONTHS_CHARGED;
}

/* ------------------------------------------------------------------ *
 * Comparativo de planos
 * ------------------------------------------------------------------ */

export type CompareRow = {
	feature: string;
	free: string | boolean;
	plus: string | boolean;
	black: string | boolean;
};

export const COMPARE: CompareRow[] = [
	{ feature: "Conta digital + Pix ilimitado", free: true, plus: true, black: true },
	{ feature: "Cartão virtual", free: true, plus: true, black: true },
	{ feature: "Cartão físico", free: "R$ 29 (uma vez)", plus: "Grátis", black: "Metal, grátis" },
	{ feature: "Rendimento do saldo", free: "100% do CDI", plus: "110% do CDI", black: "115% do CDI" },
	{ feature: "Cashback", free: false, plus: "1%", black: "2% + cripto" },
	{ feature: "Saques em 24h", free: "2 por mês", plus: "8 por mês", black: "Ilimitados" },
	{ feature: "Conta global (USD/EUR)", free: false, plus: true, black: true },
	{ feature: "Salas VIP em aeroportos", free: false, plus: "4 por ano", black: "Ilimitadas" },
	{ feature: "Concierge 24h", free: false, plus: false, black: true },
	{ feature: "Gerente dedicado", free: false, plus: false, black: true },
];

/* ------------------------------------------------------------------ *
 * Variantes do cartão
 * ------------------------------------------------------------------ */

export type CardVariantId = "grafite" | "indigo" | "gelo";

export type CardVariant = {
	id: CardVariantId;
	name: string;
	/** Amostra no seletor de cor. */
	swatch: string;
	face: string;
	back: string;
	text: string;
	subtext: string;
	stripe: string;
	chip: string;
};

export const CARD_VARIANTS: CardVariant[] = [
	{
		id: "grafite",
		name: "Grafite",
		swatch: "bg-gradient-to-br from-slate-900 to-slate-800",
		face: "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50",
		back: "bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50",
		text: "text-white",
		subtext: "text-slate-400",
		stripe: "bg-slate-950",
		chip: "bg-white/20",
	},
	{
		id: "indigo",
		name: "Índigo",
		swatch: "bg-gradient-to-br from-blue-600 to-indigo-600",
		face: "bg-gradient-to-br from-blue-600 to-indigo-600 border border-indigo-400/40",
		back: "bg-gradient-to-br from-blue-600 to-indigo-600 border border-indigo-400/40",
		text: "text-white",
		subtext: "text-blue-100",
		stripe: "bg-indigo-900",
		chip: "bg-white/25",
	},
	{
		id: "gelo",
		name: "Gelo",
		swatch: "bg-gradient-to-br from-white to-slate-200",
		face: "bg-gradient-to-br from-white to-slate-100 border border-slate-200",
		back: "bg-gradient-to-br from-white to-slate-100 border border-slate-200",
		text: "text-slate-900",
		subtext: "text-slate-500",
		stripe: "bg-slate-300",
		chip: "bg-slate-900/10",
	},
];

export function variantById(id: CardVariantId): CardVariant {
	return CARD_VARIANTS.find((v) => v.id === id) ?? CARD_VARIANTS[0];
}

/* ------------------------------------------------------------------ *
 * Conta mock (usada no /app e no /cartoes)
 * ------------------------------------------------------------------ */

export const ACCOUNT = {
	holder: "Fellipe Pavin",
	cpf: "472.918.305-11",
	agencia: "0001",
	conta: "38.204-7",
	pixKey: "fellipe@lumina.com.br",
	balance: 12480.35,
	invested: 34210.9,
	cardLast4: "4291",
	cardCvv: "318",
	cardExp: "09/31",
	limitDefault: 8000,
	limitMax: 20000,
	limitUsed: 2340.6,
};

export type TxKind =
	| "pix"
	| "cartao"
	| "salario"
	| "alimentacao"
	| "transporte"
	| "assinatura"
	| "compras"
	| "investimento";

export type Tx = {
	id: string;
	title: string;
	subtitle: string;
	amount: number; // + entrada, - saída
	date: string; // dd/mm
	kind: TxKind;
};

export const SEED_TXS: Tx[] = [
	{
		id: "t01",
		title: "Pix recebido · Marina Costa",
		subtitle: "Chave: (11) 99812-4477",
		amount: 1250,
		date: "12/07",
		kind: "pix",
	},
	{
		id: "t02",
		title: "iFood",
		subtitle: "Cartão final 4291 · Alimentação",
		amount: -74.3,
		date: "12/07",
		kind: "alimentacao",
	},
	{
		id: "t03",
		title: "Uber",
		subtitle: "Cartão final 4291 · Transporte",
		amount: -23.9,
		date: "11/07",
		kind: "transporte",
	},
	{
		id: "t04",
		title: "Posto Ipiranga",
		subtitle: "Cartão final 4291 · Transporte",
		amount: -180,
		date: "11/07",
		kind: "transporte",
	},
	{
		id: "t05",
		title: "Salário · Ateliê Digital LTDA",
		subtitle: "Transferência recebida",
		amount: 8400,
		date: "10/07",
		kind: "salario",
	},
	{
		id: "t06",
		title: "Netflix",
		subtitle: "Assinatura mensal",
		amount: -55.9,
		date: "09/07",
		kind: "assinatura",
	},
	{
		id: "t07",
		title: "Amazon.com.br",
		subtitle: "Cartão final 4291 · Compras",
		amount: -312.45,
		date: "08/07",
		kind: "compras",
	},
	{
		id: "t08",
		title: "Pix enviado · Rafael Menezes",
		subtitle: "Chave: rafael.menezes@email.com",
		amount: -450,
		date: "07/07",
		kind: "pix",
	},
	{
		id: "t09",
		title: "Conta de luz · Enel",
		subtitle: "Débito automático",
		amount: -238.71,
		date: "06/07",
		kind: "assinatura",
	},
	{
		id: "t10",
		title: "Rendimento CDB 110% CDI",
		subtitle: "Cofre Lumina",
		amount: 96.12,
		date: "05/07",
		kind: "investimento",
	},
	{
		id: "t11",
		title: "Pão de Açúcar",
		subtitle: "Cartão final 4291 · Mercado",
		amount: -527.8,
		date: "04/07",
		kind: "compras",
	},
	{
		id: "t12",
		title: "Pix recebido · Juliana Alves",
		subtitle: "Chave: 529.982.247-25",
		amount: 2000,
		date: "03/07",
		kind: "pix",
	},
	{
		id: "t13",
		title: "Smart Fit",
		subtitle: "Assinatura mensal",
		amount: -119.9,
		date: "02/07",
		kind: "assinatura",
	},
];
