export type StatusPedido = "Pendente" | "Pago" | "Enviado" | "Cancelado";

export interface ItemPedido {
	descricao: string;
	quantidade: number;
	unitario: number;
}

export interface EventoPedido {
	titulo: string;
	descricao: string;
	data: string | null;
	concluido: boolean;
}

export interface Pedido {
	id: string;
	clienteId: string;
	cliente: string;
	data: string; // ISO (YYYY-MM-DD)
	valor: number;
	status: StatusPedido;
	pagamento: string;
	itens: ItemPedido[];
}

export interface Cliente {
	id: string;
	nome: string;
	email: string;
	telefone: string;
	cidade: string;
	uf: string;
	desde: string; // ISO
	segmento: string;
}

export interface ResumoCliente {
	pedidos: number;
	totalGasto: number;
	ultimoPedido: string | null;
	ativo: boolean;
}

export interface Notificacao {
	id: string;
	titulo: string;
	descricao: string;
	tempo: string;
	tipo: "pedido" | "cliente" | "sistema";
	alvo: string | null;
	lida: boolean;
}
