"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import type { Operacao } from "../_data/properties";

const STORAGE_KEY = "aurum:salvos";

type LuxuryState = {
	salvos: string[];
	isSalvo: (slug: string) => boolean;
	toggleSalvo: (slug: string) => void;
	/**
	 * Operação que a coleção está exibindo no momento. A /colecao publica aqui o
	 * valor lido da query string; o nav consome para saber se destaca "Comprar"
	 * ou "Alugar". Evita um useSearchParams() no layout — que forçaria uma
	 * Suspense boundary em cima do site inteiro.
	 */
	operacao: Operacao;
	setOperacao: (op: Operacao) => void;
};

const Ctx = createContext<LuxuryState | null>(null);

export function LuxuryProvider({ children }: { children: React.ReactNode }) {
	const [salvos, setSalvos] = useState<string[]>([]);
	const [operacao, setOperacao] = useState<Operacao>("comprar");

	// localStorage só existe no browser: lemos depois da montagem para o HTML do
	// servidor e o primeiro render do cliente baterem (nada de mismatch).
	useEffect(() => {
		try {
			const bruto = window.localStorage.getItem(STORAGE_KEY);
			if (!bruto) return;
			const lista: unknown = JSON.parse(bruto);
			if (Array.isArray(lista)) {
				setSalvos(lista.filter((s): s is string => typeof s === "string"));
			}
		} catch {
			// localStorage bloqueado (modo privado/iframe) — segue sem persistência.
		}
	}, []);

	const toggleSalvo = useCallback((slug: string) => {
		setSalvos((atual) => {
			const proximo = atual.includes(slug)
				? atual.filter((s) => s !== slug)
				: [...atual, slug];
			try {
				window.localStorage.setItem(STORAGE_KEY, JSON.stringify(proximo));
			} catch {
				// idem: persistência é um bônus, não um requisito.
			}
			return proximo;
		});
	}, []);

	const valor = useMemo<LuxuryState>(
		() => ({
			salvos,
			isSalvo: (slug: string) => salvos.includes(slug),
			toggleSalvo,
			operacao,
			setOperacao,
		}),
		[salvos, toggleSalvo, operacao],
	);

	return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useLuxury(): LuxuryState {
	const ctx = useContext(Ctx);
	if (!ctx) {
		throw new Error("useLuxury precisa estar dentro de <LuxuryProvider>");
	}
	return ctx;
}
