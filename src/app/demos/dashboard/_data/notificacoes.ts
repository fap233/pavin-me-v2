import { brlCurto } from "../_lib/format";
import { PEDIDOS } from "./pedidos";
import type { Notificacao } from "./types";

/**
 * Notificações e atividade recente saem dos MESMOS pedidos da tabela — clicar
 * numa notificação abre um pedido que existe de verdade.
 */
const RECENTES = PEDIDOS.slice(0, 6);

export const NOTIFICACOES_INICIAIS: Notificacao[] = [
	{
		id: "NOT-1",
		titulo: "Novo pedido recebido",
		descricao: `${RECENTES[0].cliente} — ${brlCurto(RECENTES[0].valor)}`,
		tempo: "há 8 min",
		tipo: "pedido",
		alvo: RECENTES[0].id,
		lida: false,
	},
	{
		id: "NOT-2",
		titulo: "Pagamento confirmado",
		descricao: `${RECENTES[1].id} · ${RECENTES[1].pagamento}`,
		tempo: "há 42 min",
		tipo: "pedido",
		alvo: RECENTES[1].id,
		lida: false,
	},
	{
		id: "NOT-3",
		titulo: "Pagamento recusado",
		descricao: `${RECENTES[2].cliente} — cartão sem saldo`,
		tempo: "há 2 horas",
		tipo: "pedido",
		alvo: RECENTES[2].id,
		lida: false,
	},
	{
		id: "NOT-4",
		titulo: "Estoque baixo",
		descricao: "Monitor LG UltraWide 29\" — 3 unidades restantes",
		tempo: "há 5 horas",
		tipo: "sistema",
		alvo: null,
		lida: true,
	},
	{
		id: "NOT-5",
		titulo: "Relatório mensal disponível",
		descricao: "O fechamento de junho já pode ser exportado",
		tempo: "ontem",
		tipo: "sistema",
		alvo: null,
		lida: true,
	},
];

export interface ItemAtividade {
	pedidoId: string;
	cliente: string;
	acao: string;
	tempo: string;
	cor: string;
}

const TEMPOS = [
	"8 min atrás",
	"42 min atrás",
	"2 horas atrás",
	"5 horas atrás",
	"ontem",
];
const CORES = [
	"bg-pink-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-indigo-500",
];

export const ATIVIDADE_RECENTE: ItemAtividade[] = RECENTES.slice(0, 5).map(
	(pedido, i) => ({
		pedidoId: pedido.id,
		cliente: pedido.cliente,
		acao:
			pedido.status === "Cancelado"
				? `Pedido ${pedido.id} cancelado`
				: pedido.status === "Pendente"
					? `Novo pedido ${pedido.id}`
					: pedido.status === "Pago"
						? `Pagamento de ${pedido.id} confirmado`
						: `Pedido ${pedido.id} enviado`,
		tempo: TEMPOS[i],
		cor: CORES[i],
	}),
);
