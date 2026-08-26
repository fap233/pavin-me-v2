import { diaMes, mesCurto } from "../_lib/format";
import { HOJE, PEDIDOS } from "./pedidos";
import type { Pedido } from "./types";

export type ChavePeriodo = "30d" | "6m" | "ano";

export const PERIODOS: Array<{
	chave: ChavePeriodo;
	rotulo: string;
	/** usado no meio da frase: "o resumo <resumo>" */
	resumo: string;
}> = [
	{ chave: "30d", rotulo: "Últimos 30 dias", resumo: "dos últimos 30 dias" },
	{ chave: "6m", rotulo: "Últimos 6 meses", resumo: "dos últimos 6 meses" },
	{ chave: "ano", rotulo: "Este ano", resumo: "deste ano" },
];

export interface Intervalo {
	inicio: string;
	fim: string;
}

export interface Barra {
	rotulo: string;
	valor: number;
	detalhe: string;
}

export interface KPIs {
	receita: number;
	pedidos: number;
	ticketMedio: number;
	clientes: number;
	variacao: {
		receita: number;
		pedidos: number;
		ticketMedio: number;
		clientes: number;
	};
}

function data(iso: string): Date {
	return new Date(`${iso}T00:00:00Z`);
}

function iso(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function somaDias(base: string, dias: number): string {
	const d = data(base);
	d.setUTCDate(d.getUTCDate() + dias);
	return iso(d);
}

function primeiroDiaDoMes(ano: number, mes: number): string {
	return iso(new Date(Date.UTC(ano, mes, 1)));
}

/** Intervalo atual e o equivalente anterior (base das variações %). */
export function intervalos(chave: ChavePeriodo): {
	atual: Intervalo;
	anterior: Intervalo;
} {
	const hoje = data(HOJE);
	const ano = hoje.getUTCFullYear();
	const mes = hoje.getUTCMonth();

	if (chave === "30d") {
		const inicio = somaDias(HOJE, -29);
		return {
			atual: { inicio, fim: HOJE },
			anterior: { inicio: somaDias(inicio, -30), fim: somaDias(inicio, -1) },
		};
	}

	if (chave === "6m") {
		const inicio = primeiroDiaDoMes(ano, mes - 5);
		return {
			atual: { inicio, fim: HOJE },
			anterior: {
				inicio: primeiroDiaDoMes(ano, mes - 11),
				fim: somaDias(inicio, -1),
			},
		};
	}

	const inicio = primeiroDiaDoMes(ano, 0);
	return {
		atual: { inicio, fim: HOJE },
		anterior: {
			inicio: primeiroDiaDoMes(ano - 1, 0),
			fim: iso(new Date(Date.UTC(ano - 1, mes, hoje.getUTCDate()))),
		},
	};
}

export function pedidosNoIntervalo(intervalo: Intervalo): Pedido[] {
	return PEDIDOS.filter(
		(p) => p.data >= intervalo.inicio && p.data <= intervalo.fim,
	);
}

/** Receita nunca conta pedido cancelado — é a regra que o cliente espera ver. */
function receitaDe(pedidos: Pedido[]): number {
	return pedidos
		.filter((p) => p.status !== "Cancelado")
		.reduce((soma, p) => soma + p.valor, 0);
}

function variacao(atual: number, anterior: number): number {
	if (anterior === 0) return atual === 0 ? 0 : 100;
	return ((atual - anterior) / anterior) * 100;
}

function kpisBrutos(pedidos: Pedido[]) {
	const validos = pedidos.filter((p) => p.status !== "Cancelado");
	const receita = receitaDe(pedidos);
	return {
		receita,
		pedidos: pedidos.length,
		ticketMedio: validos.length ? receita / validos.length : 0,
		clientes: new Set(pedidos.map((p) => p.clienteId)).size,
	};
}

export function kpisDoPeriodo(chave: ChavePeriodo): KPIs {
	const { atual, anterior } = intervalos(chave);
	const a = kpisBrutos(pedidosNoIntervalo(atual));
	const b = kpisBrutos(pedidosNoIntervalo(anterior));

	return {
		...a,
		variacao: {
			receita: variacao(a.receita, b.receita),
			pedidos: variacao(a.pedidos, b.pedidos),
			ticketMedio: variacao(a.ticketMedio, b.ticketMedio),
			clientes: variacao(a.clientes, b.clientes),
		},
	};
}

/**
 * Série do gráfico. O número de barras muda com o período (10 blocos de 3 dias,
 * 6 meses ou os meses do ano até hoje) — é o que prova que o select faz algo.
 */
export function serieDoPeriodo(chave: ChavePeriodo): Barra[] {
	const { atual } = intervalos(chave);
	const pedidos = pedidosNoIntervalo(atual).filter(
		(p) => p.status !== "Cancelado",
	);

	if (chave === "30d") {
		const barras: Barra[] = [];
		for (let bloco = 0; bloco < 10; bloco++) {
			const inicio = somaDias(atual.inicio, bloco * 3);
			const fim = somaDias(inicio, 2);
			const valor = pedidos
				.filter((p) => p.data >= inicio && p.data <= fim)
				.reduce((soma, p) => soma + p.valor, 0);
			barras.push({
				rotulo: diaMes(inicio),
				valor,
				detalhe: `${diaMes(inicio)} a ${diaMes(fim)}`,
			});
		}
		return barras;
	}

	const hoje = data(HOJE);
	const inicioMes = data(atual.inicio);
	const barras: Barra[] = [];
	const totalMeses =
		(hoje.getUTCFullYear() - inicioMes.getUTCFullYear()) * 12 +
		(hoje.getUTCMonth() - inicioMes.getUTCMonth()) +
		1;

	for (let i = 0; i < totalMeses; i++) {
		const d = new Date(
			Date.UTC(inicioMes.getUTCFullYear(), inicioMes.getUTCMonth() + i, 1),
		);
		const prefixo = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
		const valor = pedidos
			.filter((p) => p.data.startsWith(prefixo))
			.reduce((soma, p) => soma + p.valor, 0);
		barras.push({
			rotulo: mesCurto(d.getUTCMonth()),
			valor,
			detalhe: `${mesCurto(d.getUTCMonth())}/${d.getUTCFullYear()}`,
		});
	}

	return barras;
}
