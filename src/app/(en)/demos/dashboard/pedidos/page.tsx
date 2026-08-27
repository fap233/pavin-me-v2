"use client";

import { Check, Clock, Download, Package, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePainel } from "../_components/painel-context";
import {
	BadgeStatus,
	CampoBusca,
	Drawer,
	Paginacao,
	SemResultados,
	ThOrdenavel,
	type Direcao,
} from "../_components/ui";
import { CLIENTES_POR_ID } from "../_data/clientes";
import {
	linhaDoTempo,
	PEDIDOS,
	PEDIDOS_POR_ID,
	STATUS_PEDIDO,
} from "../_data/pedidos";
import type { StatusPedido } from "../_data/types";
import { baixarCSV, csvValor } from "../_lib/csv";
import { cx } from "../_lib/cx";
import { brl, dataCurta } from "../_lib/format";

type Campo = "id" | "cliente" | "data" | "valor" | "status";
type Aba = "Todos" | StatusPedido;

const ABAS: Aba[] = ["Todos", ...STATUS_PEDIDO];
const POR_PAGINA = 10;

export default function PedidosPage() {
	const [aba, setAba] = useState<Aba>("Todos");
	const [termo, setTermo] = useState("");
	const [ordem, setOrdem] = useState<{ campo: Campo; direcao: Direcao }>({
		campo: "data",
		direcao: "desc",
	});
	const [pagina, setPagina] = useState(1);
	const [selecionado, setSelecionado] = useState<string | null>(null);

	const router = useRouter();
	const { foco, consumirFoco, pedirFoco } = usePainel();

	// veio da busca global / de uma notificação / do card de atividade? abre o pedido
	useEffect(() => {
		if (foco?.tipo === "pedido") {
			setSelecionado(foco.id);
			consumirFoco();
		}
	}, [foco, consumirFoco]);

	const contagem = useMemo(() => {
		const mapa: Record<string, number> = { Todos: PEDIDOS.length };
		for (const status of STATUS_PEDIDO) {
			mapa[status] = PEDIDOS.filter((p) => p.status === status).length;
		}
		return mapa;
	}, []);

	const filtrados = useMemo(() => {
		const busca = termo.trim().toLowerCase();
		const lista = PEDIDOS.filter((pedido) => {
			if (aba !== "Todos" && pedido.status !== aba) return false;
			if (!busca) return true;
			return (
				pedido.id.toLowerCase().includes(busca) ||
				pedido.cliente.toLowerCase().includes(busca) ||
				pedido.pagamento.toLowerCase().includes(busca)
			);
		});

		const fator = ordem.direcao === "asc" ? 1 : -1;
		return [...lista].sort((a, b) => {
			if (ordem.campo === "valor") return (a.valor - b.valor) * fator;
			return String(a[ordem.campo]).localeCompare(String(b[ordem.campo]), "pt-BR") * fator;
		});
	}, [aba, termo, ordem]);

	// filtro mudou e a página atual sumiu? volta pra 1 (senão a tabela fica vazia)
	const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
	const paginaAtual = Math.min(pagina, totalPaginas);
	const visiveis = filtrados.slice(
		(paginaAtual - 1) * POR_PAGINA,
		paginaAtual * POR_PAGINA,
	);

	const ordenar = (campo: Campo) => {
		setOrdem((atual) =>
			atual.campo === campo
				? { campo, direcao: atual.direcao === "asc" ? "desc" : "asc" }
				: { campo, direcao: campo === "data" || campo === "valor" ? "desc" : "asc" },
		);
		setPagina(1);
	};

	const trocarAba = (nova: Aba) => {
		setAba(nova);
		setPagina(1);
	};

	const buscar = (valor: string) => {
		setTermo(valor);
		setPagina(1);
	};

	const exportar = () => {
		baixarCSV(
			`pedidos-${aba.toLowerCase()}.csv`,
			["Pedido", "Cliente", "Data", "Status", "Pagamento", "Valor (R$)"],
			filtrados.map((p) => [
				p.id,
				p.cliente,
				p.data,
				p.status,
				p.pagamento,
				csvValor(p.valor),
			]),
		);
	};

	const fecharDrawer = useCallback(() => setSelecionado(null), []);
	const pedido = selecionado ? PEDIDOS_POR_ID[selecionado] : null;
	const cliente = pedido ? CLIENTES_POR_ID[pedido.clienteId] : null;
	const eventos = pedido ? linhaDoTempo(pedido) : [];
	const subtotal = pedido
		? pedido.itens.reduce((s, i) => s + i.quantidade * i.unitario, 0)
		: 0;

	return (
		<>
			<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Pedidos</h1>
					<p className="text-slate-500">
						{PEDIDOS.length} pedidos registrados. Clique numa linha para ver os
						detalhes.
					</p>
				</div>
				<button
					type="button"
					onClick={exportar}
					className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
				>
					<Download size={16} />
					Exportar {filtrados.length} pedidos
				</button>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="flex flex-wrap gap-1">
						{ABAS.map((item) => (
							<button
								key={item}
								type="button"
								onClick={() => trocarAba(item)}
								aria-pressed={aba === item}
								className={cx(
									"rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
									aba === item
										? "bg-indigo-50 text-indigo-600"
										: "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
								)}
							>
								{item}
								<span
									className={cx(
										"ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-bold",
										aba === item
											? "bg-indigo-100 text-indigo-600"
											: "bg-slate-100 text-slate-500",
									)}
								>
									{contagem[item]}
								</span>
							</button>
						))}
					</div>

					<CampoBusca
						valor={termo}
						aoMudar={buscar}
						placeholder="Buscar por ID, cliente ou pagamento..."
					/>
				</div>

				{visiveis.length === 0 ? (
					<SemResultados termo={termo} />
				) : (
					<>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm text-slate-600">
								<thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
									<tr>
										<ThOrdenavel
											campo="id"
											rotulo="ID do Pedido"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="cliente"
											rotulo="Cliente"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="data"
											rotulo="Data"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="status"
											rotulo="Status"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="valor"
											rotulo="Valor"
											ordem={ordem}
											aoOrdenar={ordenar}
											alinharDireita
										/>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{visiveis.map((linha) => (
										<tr
											key={linha.id}
											onClick={() => setSelecionado(linha.id)}
											tabIndex={0}
											onKeyDown={(e) => {
												if (e.key === "Enter") setSelecionado(linha.id);
											}}
											className={cx(
												"cursor-pointer transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none",
												selecionado === linha.id && "bg-indigo-50/50",
											)}
										>
											<td className="px-6 py-4 font-medium text-slate-900">
												{linha.id}
											</td>
											<td className="px-6 py-4">{linha.cliente}</td>
											<td className="whitespace-nowrap px-6 py-4">
												{dataCurta(linha.data)}
											</td>
											<td className="px-6 py-4">
												<BadgeStatus status={linha.status} />
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-800">
												{brl(linha.valor)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<Paginacao
							pagina={paginaAtual}
							totalPaginas={totalPaginas}
							totalItens={filtrados.length}
							porPagina={POR_PAGINA}
							aoMudar={setPagina}
						/>
					</>
				)}
			</div>

			<Drawer
				aberto={pedido !== null}
				aoFechar={fecharDrawer}
				titulo={pedido?.id ?? ""}
				subtitulo={pedido ? `${dataCurta(pedido.data)} · ${pedido.pagamento}` : ""}
				rodape={
					pedido ? (
						<div className="flex items-center justify-between">
							<span className="text-sm text-slate-500">Total do pedido</span>
							<span className="text-lg font-bold text-slate-800">
								{brl(pedido.valor)}
							</span>
						</div>
					) : null
				}
			>
				{pedido && (
					<div className="space-y-8">
						<div className="flex items-center justify-between">
							<BadgeStatus status={pedido.status} />
							{cliente && (
								<button
									type="button"
									onClick={() => {
										pedirFoco({ tipo: "cliente", id: cliente.id });
										router.push("/demos/dashboard/clientes");
									}}
									className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
								>
									<User size={14} /> Ver cliente
								</button>
							)}
						</div>

						{cliente && (
							<section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
								<h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
									Cliente
								</h3>
								<p className="font-medium text-slate-800">{cliente.nome}</p>
								<p className="text-sm text-slate-500">{cliente.email}</p>
								<p className="text-sm text-slate-500">
									{cliente.telefone} · {cliente.cidade}/{cliente.uf}
								</p>
							</section>
						)}

						<section>
							<h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
								<Package size={14} /> Itens ({pedido.itens.length})
							</h3>
							<ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
								{pedido.itens.map((item) => (
									<li
										key={item.descricao}
										className="flex items-start justify-between gap-4 p-3"
									>
										<div className="min-w-0">
											<p className="text-sm font-medium text-slate-800">
												{item.descricao}
											</p>
											<p className="text-xs text-slate-500">
												{item.quantidade} × {brl(item.unitario)}
											</p>
										</div>
										<p className="whitespace-nowrap text-sm font-medium text-slate-800">
											{brl(item.quantidade * item.unitario)}
										</p>
									</li>
								))}
							</ul>
							<div className="mt-3 flex justify-between px-1 text-sm">
								<span className="text-slate-500">Subtotal</span>
								<span className="font-medium text-slate-700">
									{brl(subtotal)}
								</span>
							</div>
							<div className="mt-1 flex justify-between px-1 text-sm">
								<span className="text-slate-500">Frete</span>
								<span className="font-medium text-green-600">Grátis</span>
							</div>
						</section>

						<section>
							<h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
								<Clock size={14} /> Linha do tempo
							</h3>
							<ol className="relative space-y-5 border-l border-slate-200 pl-6">
								{eventos.map((evento) => (
									<li key={evento.titulo} className="relative">
										<span
											className={cx(
												"absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-white",
												evento.concluido
													? pedido.status === "Cancelado" &&
														evento.titulo.includes("cancelado")
														? "bg-red-500"
														: "bg-indigo-500"
													: "bg-slate-300",
											)}
										>
											{evento.concluido && (
												<Check size={11} className="text-white" strokeWidth={3} />
											)}
										</span>
										<p
											className={cx(
												"text-sm font-medium",
												evento.concluido ? "text-slate-800" : "text-slate-400",
											)}
										>
											{evento.titulo}
										</p>
										<p className="text-xs text-slate-500">{evento.descricao}</p>
										<p className="mt-0.5 text-xs text-slate-400">
											{evento.data ? dataCurta(evento.data) : "Aguardando"}
										</p>
									</li>
								))}
							</ol>
						</section>
					</div>
				)}
			</Drawer>
		</>
	);
}
