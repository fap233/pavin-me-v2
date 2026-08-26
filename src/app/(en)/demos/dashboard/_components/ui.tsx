"use client";

import {
	ArrowDown,
	ArrowUp,
	ChevronLeft,
	ChevronRight,
	ChevronsUpDown,
	Search,
	X,
} from "lucide-react";
import { useEffect } from "react";
import { cx } from "../_lib/cx";
import { CORES_STATUS } from "../_data/pedidos";
import type { StatusPedido } from "../_data/types";

export function BadgeStatus({ status }: { status: StatusPedido }) {
	return (
		<span
			className={cx(
				"inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold",
				CORES_STATUS[status],
			)}
		>
			{status}
		</span>
	);
}

export function CampoBusca({
	valor,
	aoMudar,
	placeholder,
}: {
	valor: string;
	aoMudar: (valor: string) => void;
	placeholder: string;
}) {
	return (
		<div className="relative w-full sm:w-72">
			<Search
				className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
				size={18}
			/>
			<input
				type="text"
				value={valor}
				onChange={(e) => aoMudar(e.target.value)}
				placeholder={placeholder}
				className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
			/>
			{valor && (
				<button
					type="button"
					onClick={() => aoMudar("")}
					aria-label="Limpar busca"
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
				>
					<X size={14} />
				</button>
			)}
		</div>
	);
}

export type Direcao = "asc" | "desc";

export function ThOrdenavel<C extends string>({
	campo,
	rotulo,
	ordem,
	aoOrdenar,
	alinharDireita,
}: {
	campo: C;
	rotulo: string;
	ordem: { campo: C; direcao: Direcao };
	aoOrdenar: (campo: C) => void;
	alinharDireita?: boolean;
}) {
	const ativo = ordem.campo === campo;
	return (
		<th className={cx("px-6 py-4", alinharDireita && "text-right")}>
			<button
				type="button"
				onClick={() => aoOrdenar(campo)}
				aria-label={`Ordenar por ${rotulo}`}
				className={cx(
					"group inline-flex items-center gap-1.5 uppercase transition-colors hover:text-slate-800",
					ativo && "text-indigo-600",
					alinharDireita && "flex-row-reverse",
				)}
			>
				{rotulo}
				{ativo ? (
					ordem.direcao === "asc" ? (
						<ArrowUp size={12} />
					) : (
						<ArrowDown size={12} />
					)
				) : (
					<ChevronsUpDown
						size={12}
						className="text-slate-300 transition-colors group-hover:text-slate-400"
					/>
				)}
			</button>
		</th>
	);
}

export function Paginacao({
	pagina,
	totalPaginas,
	totalItens,
	porPagina,
	aoMudar,
}: {
	pagina: number;
	totalPaginas: number;
	totalItens: number;
	porPagina: number;
	aoMudar: (pagina: number) => void;
}) {
	const primeiro = totalItens === 0 ? 0 : (pagina - 1) * porPagina + 1;
	const ultimo = Math.min(pagina * porPagina, totalItens);

	return (
		<div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row">
			<p className="text-xs text-slate-500">
				Mostrando <span className="font-medium text-slate-700">{primeiro}</span>
				–<span className="font-medium text-slate-700">{ultimo}</span> de{" "}
				<span className="font-medium text-slate-700">{totalItens}</span>
			</p>

			<div className="flex items-center gap-1">
				<button
					type="button"
					onClick={() => aoMudar(pagina - 1)}
					disabled={pagina <= 1}
					aria-label="Página anterior"
					className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
				>
					<ChevronLeft size={16} />
				</button>

				{Array.from({ length: totalPaginas }, (_, i) => i + 1)
					.filter(
						(n) =>
							n === 1 ||
							n === totalPaginas ||
							Math.abs(n - pagina) <= 1 ||
							totalPaginas <= 7,
					)
					.map((n, i, lista) => (
						<span key={n} className="flex items-center">
							{i > 0 && n - lista[i - 1] > 1 && (
								<span className="px-1 text-xs text-slate-400">…</span>
							)}
							<button
								type="button"
								onClick={() => aoMudar(n)}
								aria-current={n === pagina ? "page" : undefined}
								className={cx(
									"min-w-8 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
									n === pagina
										? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
										: "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
								)}
							>
								{n}
							</button>
						</span>
					))}

				<button
					type="button"
					onClick={() => aoMudar(pagina + 1)}
					disabled={pagina >= totalPaginas}
					aria-label="Próxima página"
					className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
				>
					<ChevronRight size={16} />
				</button>
			</div>
		</div>
	);
}

export function SemResultados({ termo }: { termo: string }) {
	return (
		<div className="px-6 py-16 text-center">
			<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
				<Search className="text-slate-400" size={20} />
			</div>
			<p className="font-medium text-slate-700">Nenhum resultado encontrado</p>
			<p className="mt-1 text-sm text-slate-500">
				{termo
					? `Nada corresponde a “${termo}”. Tente outro termo ou limpe os filtros.`
					: "Ajuste os filtros para ver mais registros."}
			</p>
		</div>
	);
}

/** Painel lateral de detalhe, usado por pedidos e clientes. */
export function Drawer({
	aberto,
	aoFechar,
	titulo,
	subtitulo,
	children,
	rodape,
}: {
	aberto: boolean;
	aoFechar: () => void;
	titulo: string;
	subtitulo?: string;
	children: React.ReactNode;
	rodape?: React.ReactNode;
}) {
	useEffect(() => {
		if (!aberto) return;
		const noTeclado = (evento: KeyboardEvent) => {
			if (evento.key === "Escape") aoFechar();
		};
		document.addEventListener("keydown", noTeclado);
		return () => document.removeEventListener("keydown", noTeclado);
	}, [aberto, aoFechar]);

	return (
		<>
			<div
				onClick={aoFechar}
				aria-hidden
				className={cx(
					"fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-[1px] transition-opacity duration-300",
					aberto ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			/>
			<aside
				role="dialog"
				aria-modal="true"
				aria-label={titulo}
				aria-hidden={!aberto}
				className={cx(
					"fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out",
					aberto ? "translate-x-0" : "translate-x-full",
				)}
			>
				<header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
					<div className="min-w-0">
						<h2 className="truncate text-lg font-bold text-slate-800">
							{titulo}
						</h2>
						{subtitulo && (
							<p className="mt-0.5 truncate text-sm text-slate-500">
								{subtitulo}
							</p>
						)}
					</div>
					<button
						type="button"
						onClick={aoFechar}
						aria-label="Fechar painel"
						className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
					>
						<X size={18} />
					</button>
				</header>

				<div className="flex-1 overflow-y-auto px-6 py-6">{aberto && children}</div>

				{rodape && (
					<footer className="border-t border-slate-200 px-6 py-4">
						{rodape}
					</footer>
				)}
			</aside>
		</>
	);
}
