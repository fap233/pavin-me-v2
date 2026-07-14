"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { NOTIFICACOES_INICIAIS } from "../_data/notificacoes";
import type { Notificacao } from "../_data/types";

/**
 * Alvo que a busca global (ou uma notificação) pediu pra abrir em outra página.
 * Guardado no contexto do layout — que sobrevive à troca de rota — em vez de
 * query string, pra página de destino já abrir com o painel de detalhe aberto.
 */
export interface Foco {
	tipo: "pedido" | "cliente";
	id: string;
}

interface PainelState {
	notificacoes: Notificacao[];
	naoLidas: number;
	marcarComoLida: (id: string) => void;
	marcarTodasComoLidas: () => void;
	foco: Foco | null;
	pedirFoco: (foco: Foco) => void;
	consumirFoco: () => void;
}

const Contexto = createContext<PainelState | null>(null);

export function PainelProvider({ children }: { children: React.ReactNode }) {
	const [notificacoes, setNotificacoes] = useState<Notificacao[]>(
		NOTIFICACOES_INICIAIS,
	);
	const [foco, setFoco] = useState<Foco | null>(null);

	const marcarComoLida = useCallback((id: string) => {
		setNotificacoes((atual) =>
			atual.map((n) => (n.id === id ? { ...n, lida: true } : n)),
		);
	}, []);

	const marcarTodasComoLidas = useCallback(() => {
		setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })));
	}, []);

	const pedirFoco = useCallback((novo: Foco) => setFoco(novo), []);
	const consumirFoco = useCallback(() => setFoco(null), []);

	const valor = useMemo<PainelState>(
		() => ({
			notificacoes,
			naoLidas: notificacoes.filter((n) => !n.lida).length,
			marcarComoLida,
			marcarTodasComoLidas,
			foco,
			pedirFoco,
			consumirFoco,
		}),
		[
			notificacoes,
			foco,
			marcarComoLida,
			marcarTodasComoLidas,
			pedirFoco,
			consumirFoco,
		],
	);

	return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePainel(): PainelState {
	const ctx = useContext(Contexto);
	if (!ctx) throw new Error("usePainel precisa estar dentro de PainelProvider");
	return ctx;
}
