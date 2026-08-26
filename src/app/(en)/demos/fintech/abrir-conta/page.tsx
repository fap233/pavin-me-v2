import { Suspense } from "react";
import AbrirContaFlow from "./AbrirContaFlow";

export default function AbrirContaPage() {
	return (
		<Suspense
			fallback={
				<div className="pt-40 pb-32 px-6 text-center text-slate-400">
					Carregando…
				</div>
			}
		>
			<AbrirContaFlow />
		</Suspense>
	);
}
