import { Suspense } from "react";
import { ColecaoClient } from "./colecao-client";

/**
 * A coleção lê a query string (?local=&tipo=&operacao=&faixa=&ordem=&salvos=),
 * e useSearchParams() exige uma Suspense boundary para a página continuar
 * prerenderizada estaticamente. Daí a casca de servidor.
 */
export default function ColecaoPage() {
	return (
		<Suspense fallback={<div className="min-h-screen" />}>
			<ColecaoClient />
		</Suspense>
	);
}
