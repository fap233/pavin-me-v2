import { CLIENTES } from "./clientes";
import type {
	EventoPedido,
	ItemPedido,
	Pedido,
	ResumoCliente,
	StatusPedido,
} from "./types";

/**
 * "Hoje" do mundo da demo. Fixo de propósito: os dados são gerados a partir
 * daqui, então a data não pode andar sozinha e deixar o gráfico furado.
 */
export const HOJE = "2026-07-13";

const CATALOGO: Array<{ descricao: string; unitario: number }> = [
	{ descricao: 'Notebook Dell Vostro 15" i7', unitario: 5490.0 },
	{ descricao: 'Monitor LG UltraWide 29"', unitario: 1899.9 },
	{ descricao: "Cadeira ergonômica Flexform", unitario: 1249.0 },
	{ descricao: "Dock Station USB-C 11 portas", unitario: 749.9 },
	{ descricao: "Teclado mecânico ABNT2 Keychron", unitario: 589.0 },
	{ descricao: "Headset Jabra Evolve2 40", unitario: 899.0 },
	{ descricao: "Licença anual Figma Organization", unitario: 2160.0 },
	{ descricao: "Licença Microsoft 365 Business (12m)", unitario: 1380.0 },
	{ descricao: "Webcam Logitech Brio 4K", unitario: 1099.0 },
	{ descricao: "SSD NVMe 1TB Samsung 990", unitario: 679.9 },
	{ descricao: "Nobreak SMS 1500VA", unitario: 1290.0 },
	{ descricao: "Switch gerenciável 24 portas", unitario: 2340.0 },
	{ descricao: "Mesa elevável 140x70", unitario: 2190.0 },
	{ descricao: "Setup completo home office", unitario: 7890.0 },
	{ descricao: "Suporte técnico mensal (plano Pro)", unitario: 450.0 },
	{ descricao: "Impressora multifuncional Epson EcoTank", unitario: 1749.0 },
];

const PAGAMENTOS = [
	"Pix",
	"Cartão de crédito 3x",
	"Cartão de crédito 6x",
	"Boleto bancário",
	"Transferência",
];

/** PRNG determinístico (mulberry32): mesma saída no servidor e no cliente. */
function mulberry32(semente: number) {
	let a = semente;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function toISO(d: Date): string {
	return d.toISOString().slice(0, 10);
}

function somaDias(iso: string, dias: number): string {
	const d = new Date(`${iso}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + dias);
	return toISO(d);
}

function gerarPedidos(): Pedido[] {
	const rand = mulberry32(20260713);
	const pedidos: Pedido[] = [];

	/*
	 * Começa em 2025: os KPIs comparam o período atual com o anterior, então sem
	 * um ano de histórico a base de comparação ficava vazia e as variações
	 * estouravam (+500%). Com histórico real, a variação fica plausível.
	 */
	const inicio = new Date("2025-01-06T00:00:00Z");
	const fim = new Date(`${HOJE}T00:00:00Z`);
	let sequencial = 2100;

	for (
		let dia = new Date(inicio);
		dia <= fim;
		dia.setUTCDate(dia.getUTCDate() + 1)
	) {
		const diaSemana = dia.getUTCDay();
		// fim de semana vende menos — detalhe bobo que faz o gráfico parecer real
		const chance = diaSemana === 0 || diaSemana === 6 ? 0.25 : 0.85;
		if (rand() > chance) continue;

		const data = toISO(dia);
		const quantosPedidos = rand() > 0.72 ? 2 : 1;
		for (let n = 0; n < quantosPedidos; n++) {
			// ninguém compra antes de virar cliente
			const elegiveis = CLIENTES.filter((c) => c.desde <= data);
			if (elegiveis.length === 0) continue;
			const cliente = elegiveis[Math.floor(rand() * elegiveis.length)];
			const qtdItens = rand() > 0.62 ? (rand() > 0.85 ? 3 : 2) : 1;

			const itens: ItemPedido[] = [];
			for (let i = 0; i < qtdItens; i++) {
				const produto = CATALOGO[Math.floor(rand() * CATALOGO.length)];
				if (itens.some((it) => it.descricao === produto.descricao)) continue;
				itens.push({
					descricao: produto.descricao,
					quantidade: rand() > 0.75 ? Math.floor(rand() * 3) + 2 : 1,
					unitario: produto.unitario,
				});
			}

			const valor = itens.reduce(
				(soma, it) => soma + it.quantidade * it.unitario,
				0,
			);

			const idade = Math.round(
				(fim.getTime() - dia.getTime()) / (1000 * 60 * 60 * 24),
			);

			// status coerente com a idade: pedido de março não fica "Pendente"
			let status: StatusPedido;
			const sorte = rand();
			if (sorte < 0.07) {
				status = "Cancelado";
			} else if (idade <= 2) {
				status = sorte < 0.55 ? "Pendente" : "Pago";
			} else if (idade <= 6) {
				status = sorte < 0.25 ? "Pendente" : sorte < 0.7 ? "Pago" : "Enviado";
			} else {
				// uma fatia dos antigos segue pendente: boleto emitido e nunca pago
				status =
					sorte < 0.11 ? "Pendente" : sorte < 0.36 ? "Pago" : "Enviado";
			}

			sequencial += 1;
			pedidos.push({
				id: `PED-${sequencial}`,
				clienteId: cliente.id,
				cliente: cliente.nome,
				data,
				valor: Math.round(valor * 100) / 100,
				status,
				pagamento: PAGAMENTOS[Math.floor(rand() * PAGAMENTOS.length)],
				itens,
			});
		}
	}

	// mais recentes primeiro — é o que a tabela mostra por padrão
	return pedidos.reverse();
}

export const PEDIDOS: Pedido[] = gerarPedidos();

export const PEDIDOS_POR_ID: Record<string, Pedido> = Object.fromEntries(
	PEDIDOS.map((p) => [p.id, p]),
);

export const STATUS_PEDIDO: StatusPedido[] = [
	"Pendente",
	"Pago",
	"Enviado",
	"Cancelado",
];

/** Cores dos badges — mesmas famílias que a página já usava. */
export const CORES_STATUS: Record<StatusPedido, string> = {
	Pendente: "bg-yellow-100 text-yellow-700",
	Pago: "bg-green-100 text-green-700",
	Enviado: "bg-blue-100 text-blue-700",
	Cancelado: "bg-red-100 text-red-700",
};

export function pedidosDoCliente(clienteId: string): Pedido[] {
	return PEDIDOS.filter((p) => p.clienteId === clienteId);
}

export function resumoCliente(clienteId: string): ResumoCliente {
	const doCliente = pedidosDoCliente(clienteId);
	const validos = doCliente.filter((p) => p.status !== "Cancelado");
	const ultimo = doCliente[0]?.data ?? null;
	const diasSemComprar = ultimo
		? (new Date(`${HOJE}T00:00:00Z`).getTime() -
				new Date(`${ultimo}T00:00:00Z`).getTime()) /
			86400000
		: Infinity;

	return {
		pedidos: doCliente.length,
		totalGasto: validos.reduce((soma, p) => soma + p.valor, 0),
		ultimoPedido: ultimo,
		ativo: diasSemComprar <= 60,
	};
}

/** Linha do tempo do pedido, derivada do status (nada de timeline chumbada). */
export function linhaDoTempo(pedido: Pedido): EventoPedido[] {
	const { data, status } = pedido;

	if (status === "Cancelado") {
		return [
			{
				titulo: "Pedido criado",
				descricao: "Pedido registrado no sistema",
				data,
				concluido: true,
			},
			{
				titulo: "Pedido cancelado",
				descricao: "Cancelado a pedido do cliente",
				data: somaDias(data, 1),
				concluido: true,
			},
		];
	}

	const eventos: EventoPedido[] = [
		{
			titulo: "Pedido criado",
			descricao: "Pedido registrado no sistema",
			data,
			concluido: true,
		},
		{
			titulo: "Pagamento confirmado",
			descricao: pedido.pagamento,
			data: status === "Pendente" ? null : somaDias(data, 1),
			concluido: status !== "Pendente",
		},
		{
			titulo: "Pedido enviado",
			descricao:
				status === "Enviado"
					? "Objeto postado — rastreio BR" +
						pedido.id.replace("PED-", "") +
						"BR"
					: "Aguardando separação no estoque",
			data: status === "Enviado" ? somaDias(data, 3) : null,
			concluido: status === "Enviado",
		},
		{
			titulo: "Entrega prevista",
			descricao: "Prazo estimado pela transportadora",
			data: somaDias(data, 8),
			concluido: false,
		},
	];

	return eventos;
}
