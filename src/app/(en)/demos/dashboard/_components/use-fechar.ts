"use client";

import { useEffect, useRef } from "react";

/**
 * Fecha um popover no clique fora ou no Esc. Devolve a ref que deve envolver o
 * gatilho + o conteúdo (assim clicar no próprio botão não conta como "fora").
 */
export function useFechar<T extends HTMLElement>(
	aberto: boolean,
	aoFechar: () => void,
) {
	const ref = useRef<T | null>(null);

	useEffect(() => {
		if (!aberto) return;

		const noPointerDown = (evento: MouseEvent | TouchEvent) => {
			if (ref.current && !ref.current.contains(evento.target as Node)) {
				aoFechar();
			}
		};
		const noTeclado = (evento: KeyboardEvent) => {
			if (evento.key === "Escape") aoFechar();
		};

		document.addEventListener("mousedown", noPointerDown);
		document.addEventListener("touchstart", noPointerDown);
		document.addEventListener("keydown", noTeclado);
		return () => {
			document.removeEventListener("mousedown", noPointerDown);
			document.removeEventListener("touchstart", noPointerDown);
			document.removeEventListener("keydown", noTeclado);
		};
	}, [aberto, aoFechar]);

	return ref;
}
