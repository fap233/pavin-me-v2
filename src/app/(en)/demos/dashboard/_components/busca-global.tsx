"use client";

import { Search, ShoppingBag, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { CLIENTES } from "../_data/clientes";
import { PEDIDOS } from "../_data/pedidos";
import { brl, dataCurta } from "../_lib/format";
import { cx } from "../_lib/cx";
import { usePainel } from "./painel-context";
import { useFechar } from "./use-fechar";

interface Resultado {
	tipo: "pedido" | "cliente";
	id: string;
	titulo: string;
	detalhe: string;
}

/** Busca global do topbar: procura em pedidos e clientes e navega no clique. */
export function BuscaGlobal() {
	const [termo, setTermo] = useState("");
	const [aberto, setAberto] = useState(false);
	const router = useRouter();
	const { pedirFoco } = usePainel();

	const fechar = useCallback(() => setAberto(false), []);
	const ref = useFechar<HTMLDivElement>(aberto, fechar);

	const resultados = useMemo<Resultado[]>(() => {
		const busca = termo.trim().toLowerCase();
		if (busca.length < 2) return [];

		const pedidos: Resultado[] = PEDIDOS.filter(
			(p) =>
				p.id.toLowerCase().includes(busca) ||
				p.cliente.toLowerCase().includes(busca),
		)
			.slice(0, 4)
			.map((p) => ({
				tipo: "pedido",
				id: p.id,
				titulo: `${p.id} · ${p.cliente}`,
				detalhe: `${brl(p.valor)} · ${dataCurta(p.data)} · ${p.status}`,
			}));

		const clientes: Resultado[] = CLIENTES.filter(
			(c) =>
				c.nome.toLowerCase().includes(busca) ||
				c.email.toLowerCase().includes(busca) ||
				c.cidade.toLowerCase().includes(busca),
		)
			.slice(0, 4)
			.map((c) => ({
				tipo: "cliente",
				id: c.id,
				titulo: c.nome,
				detalhe: `${c.email} · ${c.cidade}/${c.uf}`,
			}));

		return [...pedidos, ...clientes];
	}, [termo]);

	const abrir = (resultado: Resultado) => {
		pedirFoco({ tipo: resultado.tipo, id: resultado.id });
		router.push(
			resultado.tipo === "pedido"
				? "/demos/dashboard/pedidos"
				: "/demos/dashboard/clientes",
		);
		setTermo("");
		setAberto(false);
	};

	const mostrarPainel = aberto && termo.trim().length >= 2;

	return (
		<div ref={ref} className="relative">
			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
					size={18}
				/>
				<input
					type="text"
					value={termo}
					onChange={(e) => {
						setTermo(e.target.value);
						setAberto(true);
					}}
					onFocus={() => setAberto(true)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && resultados.length > 0) abrir(resultados[0]);
					}}
					placeholder="Buscar pedidos, clientes..."
					aria-label="Buscar pedidos e clientes"
					className="w-48 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-64 lg:w-80"
				/>
				{termo && (
					<button
						type="button"
						onClick={() => setTermo("")}
						aria-label="Limpar busca"
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
					>
						<X size={14} />
					</button>
				)}
			</div>

			{mostrarPainel && (
				<div className="absolute left-0 top-full z-50 mt-2 w-[22rem] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-[26rem]">
					{resultados.length === 0 ? (
						<p className="px-4 py-6 text-center text-sm text-slate-500">
							Nada encontrado para{" "}
							<span className="font-medium text-slate-700">“{termo}”</span>
						</p>
					) : (
						<ul className="max-h-96 overflow-y-auto py-1">
							{resultados.map((resultado) => (
								<li key={`${resultado.tipo}-${resultado.id}`}>
									<button
										type="button"
										onClick={() => abrir(resultado)}
										className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
									>
										<span
											className={cx(
												"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
												resultado.tipo === "pedido"
													? "bg-orange-100 text-orange-600"
													: "bg-blue-100 text-blue-600",
											)}
										>
											{resultado.tipo === "pedido" ? (
												<ShoppingBag size={16} />
											) : (
												<Users size={16} />
											)}
										</span>
										<span className="min-w-0 flex-1">
											<span className="block truncate text-sm font-medium text-slate-800">
												{resultado.titulo}
											</span>
											<span className="block truncate text-xs text-slate-500">
												{resultado.detalhe}
											</span>
										</span>
									</button>
								</li>
							))}
						</ul>
					)}
					<p className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400">
						Enter abre o primeiro resultado · Esc fecha
					</p>
				</div>
			)}
		</div>
	);
}
