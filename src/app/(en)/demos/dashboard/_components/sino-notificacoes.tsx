"use client";

import { Bell, CheckCheck, Package, Server, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import type { Notificacao } from "../_data/types";
import { cx } from "../_lib/cx";
import { usePainel } from "./painel-context";
import { useFechar } from "./use-fechar";

const ICONE = {
	pedido: Package,
	cliente: User,
	sistema: Server,
} as const;

const COR = {
	pedido: "bg-orange-100 text-orange-600",
	cliente: "bg-blue-100 text-blue-600",
	sistema: "bg-slate-100 text-slate-500",
} as const;

export function SinoNotificacoes() {
	const [aberto, setAberto] = useState(false);
	const router = useRouter();
	const { notificacoes, naoLidas, marcarComoLida, marcarTodasComoLidas, pedirFoco } =
		usePainel();

	const fechar = useCallback(() => setAberto(false), []);
	const ref = useFechar<HTMLDivElement>(aberto, fechar);

	const clicar = (notificacao: Notificacao) => {
		marcarComoLida(notificacao.id);
		if (notificacao.alvo) {
			pedirFoco({ tipo: "pedido", id: notificacao.alvo });
			router.push("/demos/dashboard/pedidos");
			setAberto(false);
		}
	};

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setAberto((v) => !v)}
				aria-label={`Notificações${naoLidas ? ` (${naoLidas} não lidas)` : ""}`}
				aria-expanded={aberto}
				className={cx(
					"relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100",
					aberto && "bg-slate-100 text-slate-700",
				)}
			>
				<Bell size={20} />
				{naoLidas > 0 && (
					<span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
						{naoLidas}
					</span>
				)}
			</button>

			{aberto && (
				<div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
					<header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
						<h3 className="text-sm font-bold text-slate-800">
							Notificações
							{naoLidas > 0 && (
								<span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
									{naoLidas} nova{naoLidas > 1 ? "s" : ""}
								</span>
							)}
						</h3>
						<button
							type="button"
							onClick={marcarTodasComoLidas}
							disabled={naoLidas === 0}
							className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
						>
							<CheckCheck size={14} />
							Marcar todas como lidas
						</button>
					</header>

					<ul className="max-h-96 overflow-y-auto">
						{notificacoes.map((notificacao) => {
							const Icone = ICONE[notificacao.tipo];
							return (
								<li key={notificacao.id}>
									<button
										type="button"
										onClick={() => clicar(notificacao)}
										className={cx(
											"flex w-full items-start gap-3 border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50",
											!notificacao.lida && "bg-indigo-50/40",
										)}
									>
										<span
											className={cx(
												"flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
												COR[notificacao.tipo],
											)}
										>
											<Icone size={16} />
										</span>
										<span className="min-w-0 flex-1">
											<span className="flex items-center gap-2">
												<span
													className={cx(
														"truncate text-sm text-slate-800",
														notificacao.lida ? "font-medium" : "font-bold",
													)}
												>
													{notificacao.titulo}
												</span>
												{!notificacao.lida && (
													<span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
												)}
											</span>
											<span className="mt-0.5 block truncate text-xs text-slate-500">
												{notificacao.descricao}
											</span>
											<span className="mt-1 block text-[11px] text-slate-400">
												{notificacao.tempo}
												{notificacao.alvo && " · clique para abrir o pedido"}
											</span>
										</span>
									</button>
								</li>
							);
						})}
					</ul>
				</div>
			)}
		</div>
	);
}
