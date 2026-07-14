"use client";

import {
	ArrowDown,
	ArrowUp,
	CreditCard,
	Download,
	DollarSign,
	Eye,
	EyeOff,
	Minus,
	MoreVertical,
	RefreshCw,
	ShoppingBag,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { usePainel } from "./_components/painel-context";
import { BadgeStatus } from "./_components/ui";
import { useFechar } from "./_components/use-fechar";
import { ATIVIDADE_RECENTE } from "./_data/notificacoes";
import {
	intervalos,
	kpisDoPeriodo,
	pedidosNoIntervalo,
	PERIODOS,
	serieDoPeriodo,
	type ChavePeriodo,
} from "./_data/periodos";
import { baixarCSV, csvValor } from "./_lib/csv";
import { cx } from "./_lib/cx";
import { brl, brlCurto, dataCurta, iniciais, numero, percentual } from "./_lib/format";

export default function VisaoGeralPage() {
	const [periodo, setPeriodo] = useState<ChavePeriodo>("6m");
	const [tabelaVisivel, setTabelaVisivel] = useState(true);
	const [menuAberto, setMenuAberto] = useState(false);
	const [atualizando, setAtualizando] = useState(false);
	const [atualizadoEm, setAtualizadoEm] = useState<string | null>(null);

	const router = useRouter();
	const { pedirFoco } = usePainel();

	const fecharMenu = useCallback(() => setMenuAberto(false), []);
	const refMenu = useFechar<HTMLDivElement>(menuAberto, fecharMenu);

	// tudo aqui embaixo é recalculado quando o período muda
	const kpis = useMemo(() => kpisDoPeriodo(periodo), [periodo]);
	const serie = useMemo(() => serieDoPeriodo(periodo), [periodo]);
	const pedidosDoPeriodo = useMemo(
		() => pedidosNoIntervalo(intervalos(periodo).atual),
		[periodo],
	);
	const ultimosPedidos = useMemo(
		() => pedidosDoPeriodo.slice(0, 5),
		[pedidosDoPeriodo],
	);

	const maiorBarra = Math.max(...serie.map((b) => b.valor), 1);
	const resumoPeriodo =
		PERIODOS.find((p) => p.chave === periodo)?.resumo ?? "do período";

	const cards = [
		{
			titulo: "Receita Total",
			valor: brlCurto(kpis.receita),
			variacao: kpis.variacao.receita,
			icone: DollarSign,
			cor: "bg-green-100 text-green-600",
		},
		{
			titulo: "Clientes Ativos",
			valor: numero(kpis.clientes),
			variacao: kpis.variacao.clientes,
			icone: Users,
			cor: "bg-blue-100 text-blue-600",
		},
		{
			titulo: "Novos Pedidos",
			valor: numero(kpis.pedidos),
			variacao: kpis.variacao.pedidos,
			icone: ShoppingBag,
			cor: "bg-orange-100 text-orange-600",
		},
		{
			titulo: "Ticket Médio",
			valor: brlCurto(kpis.ticketMedio),
			variacao: kpis.variacao.ticketMedio,
			icone: CreditCard,
			cor: "bg-purple-100 text-purple-600",
		},
	];

	const exportarPedidos = () => {
		baixarCSV(
			`relatorio-${periodo}-${intervalos(periodo).atual.fim}.csv`,
			["Pedido", "Cliente", "Data", "Status", "Pagamento", "Valor (R$)"],
			pedidosDoPeriodo.map((p) => [
				p.id,
				p.cliente,
				p.data,
				p.status,
				p.pagamento,
				csvValor(p.valor),
			]),
		);
	};

	const atualizar = () => {
		setMenuAberto(false);
		setAtualizando(true);
		window.setTimeout(() => {
			setAtualizando(false);
			setAtualizadoEm(
				new Date().toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			);
		}, 700);
	};

	const abrirPedido = (id: string) => {
		pedirFoco({ tipo: "pedido", id });
		router.push("/demos/dashboard/pedidos");
	};

	return (
		<>
			<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
					<p className="text-slate-500">
						Bem-vindo de volta! Aqui está o resumo {resumoPeriodo}.
					</p>
				</div>
				<button
					type="button"
					onClick={exportarPedidos}
					className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
				>
					<Download size={16} />
					Download Relatório
				</button>
			</div>

			{/* KPIs — recalculados a partir do período selecionado no gráfico */}
			<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => {
					// variação zerada não é "alta": seta verde com 0,0% parece bug
					const estavel = Math.abs(card.variacao) < 0.05;
					const positivo = card.variacao > 0;
					return (
						<div
							key={card.titulo}
							className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
						>
							<div className="mb-4 flex items-start justify-between">
								<div className={cx("rounded-lg p-3", card.cor)}>
									<card.icone size={20} />
								</div>
								<span
									className={cx(
										"flex items-center rounded-full px-2 py-1 text-xs font-bold",
										estavel
											? "bg-slate-100 text-slate-500"
											: positivo
												? "bg-green-50 text-green-600"
												: "bg-red-50 text-red-600",
									)}
									title="Comparado ao período anterior"
								>
									{estavel ? (
										<Minus size={12} className="mr-1" />
									) : positivo ? (
										<ArrowUp size={12} className="mr-1" />
									) : (
										<ArrowDown size={12} className="mr-1" />
									)}
									{estavel ? "estável" : percentual(card.variacao)}
								</span>
							</div>
							<h3 className="text-sm font-medium text-slate-500">
								{card.titulo}
							</h3>
							<p className="mt-1 text-2xl font-bold text-slate-800">
								{card.valor}
							</p>
						</div>
					);
				})}
			</div>

			<div className="grid gap-8 lg:grid-cols-3">
				{/* Gráfico (CSS puro) — a série inteira troca junto com o período */}
				<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
					<div className="mb-8 flex items-center justify-between gap-4">
						<div>
							<h3 className="font-bold text-slate-800">Receita por período</h3>
							<p className="text-xs text-slate-400">
								{brlCurto(kpis.receita)} no período · cancelados não entram
							</p>
						</div>
						<select
							value={periodo}
							onChange={(e) => setPeriodo(e.target.value as ChavePeriodo)}
							aria-label="Período do gráfico"
							className="cursor-pointer rounded-md border-none bg-slate-50 px-2 py-1 text-sm text-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
						>
							{PERIODOS.map((p) => (
								<option key={p.chave} value={p.chave}>
									{p.rotulo}
								</option>
							))}
						</select>
					</div>

					<div className="flex h-64 items-end justify-between gap-2 px-2 md:gap-4">
						{serie.map((barra) => (
							<div
								key={barra.rotulo}
								className="group flex h-full w-full flex-col justify-end"
							>
								<div className="relative flex h-full w-full items-end rounded-t-lg bg-indigo-50">
									<div
										className="relative w-full rounded-t-md bg-indigo-500 transition-all duration-500 group-hover:bg-indigo-600"
										style={{
											height: `${Math.max((barra.valor / maiorBarra) * 100, 2)}%`,
										}}
									/>
									{/* Tooltip com o valor real da barra */}
									<div className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
										<span className="font-bold">{brlCurto(barra.valor)}</span>
										<span className="ml-1 text-slate-300">{barra.detalhe}</span>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="mt-4 flex justify-between gap-2 px-2 md:gap-4">
						{serie.map((barra) => (
							<span
								key={barra.rotulo}
								className="w-full text-center text-xs font-medium uppercase text-slate-400"
							>
								{barra.rotulo}
							</span>
						))}
					</div>
				</div>

				{/* Atividade recente — cada item é um pedido de verdade */}
				<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 className="mb-6 font-bold text-slate-800">Atividade Recente</h3>
					<div className="space-y-2">
						{ATIVIDADE_RECENTE.map((item) => (
							<button
								key={item.pedidoId}
								type="button"
								onClick={() => abrirPedido(item.pedidoId)}
								className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-4 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-slate-50"
							>
								<span
									className={cx(
										"flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
										item.cor,
									)}
								>
									{iniciais(item.cliente)}
								</span>
								<span className="min-w-0 flex-1">
									<span className="block truncate text-sm font-medium text-slate-800">
										{item.cliente}
									</span>
									<span className="block truncate text-xs text-slate-500">
										{item.acao}
									</span>
								</span>
								<span className="whitespace-nowrap text-xs text-slate-400">
									{item.tempo}
								</span>
							</button>
						))}
					</div>
					<Link
						href="/demos/dashboard/pedidos"
						className="mt-8 block w-full rounded-lg py-2 text-center text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
					>
						Ver todo histórico
					</Link>
				</div>
			</div>

			{/* Últimos pedidos */}
			{tabelaVisivel ? (
				<div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
					<div className="flex items-center justify-between border-b border-slate-200 p-6">
						<div>
							<h3 className="font-bold text-slate-800">Últimos Pedidos</h3>
							<p className="text-xs text-slate-400">
								{atualizando
									? "Atualizando..."
									: atualizadoEm
										? `Atualizado às ${atualizadoEm}`
										: "Clique numa linha para ver o pedido completo"}
							</p>
						</div>

						<div ref={refMenu} className="relative">
							<button
								type="button"
								onClick={() => setMenuAberto((v) => !v)}
								aria-label="Ações da tabela"
								aria-expanded={menuAberto}
								className={cx(
									"rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600",
									menuAberto && "bg-slate-100 text-slate-600",
								)}
							>
								<MoreVertical size={20} />
							</button>

							{menuAberto && (
								<div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
									<button
										type="button"
										onClick={() => {
											setMenuAberto(false);
											exportarPedidos();
										}}
										className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
									>
										<Download size={15} /> Exportar CSV
									</button>
									<button
										type="button"
										onClick={atualizar}
										className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
									>
										<RefreshCw
											size={15}
											className={cx(atualizando && "animate-spin")}
										/>{" "}
										Atualizar
									</button>
									<button
										type="button"
										onClick={() => {
											setMenuAberto(false);
											setTabelaVisivel(false);
										}}
										className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-600 transition-colors hover:bg-slate-50"
									>
										<EyeOff size={15} /> Ocultar
									</button>
								</div>
							)}
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm text-slate-600">
							<thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
								<tr>
									<th className="px-6 py-4">ID do Pedido</th>
									<th className="px-6 py-4">Cliente</th>
									<th className="px-6 py-4">Status</th>
									<th className="px-6 py-4">Valor</th>
									<th className="px-6 py-4">Data</th>
								</tr>
							</thead>
							<tbody
								className={cx(
									"divide-y divide-slate-100 transition-opacity",
									atualizando && "opacity-40",
								)}
							>
								{ultimosPedidos.map((pedido) => (
									<tr
										key={pedido.id}
										onClick={() => abrirPedido(pedido.id)}
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter") abrirPedido(pedido.id);
										}}
										className="cursor-pointer transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
									>
										<td className="px-6 py-4 font-medium text-slate-900">
											{pedido.id}
										</td>
										<td className="px-6 py-4">{pedido.cliente}</td>
										<td className="px-6 py-4">
											<BadgeStatus status={pedido.status} />
										</td>
										<td className="px-6 py-4">{brl(pedido.valor)}</td>
										<td className="px-6 py-4">{dataCurta(pedido.data)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={() => setTabelaVisivel(true)}
					className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 py-8 text-sm font-medium text-slate-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
				>
					<Eye size={16} /> Mostrar tabela de Últimos Pedidos
				</button>
			)}
		</>
	);
}
