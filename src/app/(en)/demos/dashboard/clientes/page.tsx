"use client";

import { Download, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
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
import { CLIENTES, CLIENTES_POR_ID } from "../_data/clientes";
import { pedidosDoCliente, resumoCliente } from "../_data/pedidos";
import { baixarCSV, csvValor } from "../_lib/csv";
import { cx } from "../_lib/cx";
import { brl, brlCurto, dataCurta, iniciais, numero } from "../_lib/format";

type Campo = "nome" | "cidade" | "segmento" | "desde" | "pedidos" | "total";
const POR_PAGINA = 8;

const CORES_AVATAR = [
	"bg-pink-500",
	"bg-blue-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-indigo-500",
	"bg-purple-500",
];

export default function ClientesPage() {
	const [termo, setTermo] = useState("");
	const [ordem, setOrdem] = useState<{ campo: Campo; direcao: Direcao }>({
		campo: "total",
		direcao: "desc",
	});
	const [pagina, setPagina] = useState(1);
	const [selecionado, setSelecionado] = useState<string | null>(null);

	const router = useRouter();
	const { foco, consumirFoco, pedirFoco } = usePainel();

	useEffect(() => {
		if (foco?.tipo === "cliente") {
			setSelecionado(foco.id);
			consumirFoco();
		}
	}, [foco, consumirFoco]);

	// junta cadastro + números derivados dos pedidos (fonte única de verdade)
	const enriquecidos = useMemo(
		() =>
			CLIENTES.map((cliente) => ({
				...cliente,
				resumo: resumoCliente(cliente.id),
			})),
		[],
	);

	const filtrados = useMemo(() => {
		const busca = termo.trim().toLowerCase();
		const lista = enriquecidos.filter((cliente) => {
			if (!busca) return true;
			return (
				cliente.nome.toLowerCase().includes(busca) ||
				cliente.email.toLowerCase().includes(busca) ||
				cliente.cidade.toLowerCase().includes(busca) ||
				cliente.segmento.toLowerCase().includes(busca)
			);
		});

		const fator = ordem.direcao === "asc" ? 1 : -1;
		return [...lista].sort((a, b) => {
			switch (ordem.campo) {
				case "total":
					return (a.resumo.totalGasto - b.resumo.totalGasto) * fator;
				case "pedidos":
					return (a.resumo.pedidos - b.resumo.pedidos) * fator;
				case "desde":
					return a.desde.localeCompare(b.desde) * fator;
				default:
					return a[ordem.campo].localeCompare(b[ordem.campo], "pt-BR") * fator;
			}
		});
	}, [enriquecidos, termo, ordem]);

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
				: {
						campo,
						direcao:
							campo === "total" || campo === "pedidos" || campo === "desde"
								? "desc"
								: "asc",
					},
		);
		setPagina(1);
	};

	const exportar = () => {
		baixarCSV(
			"clientes.csv",
			[
				"ID",
				"Nome",
				"E-mail",
				"Telefone",
				"Cidade",
				"UF",
				"Segmento",
				"Cliente desde",
				"Pedidos",
				"Total gasto (R$)",
			],
			filtrados.map((c) => [
				c.id,
				c.nome,
				c.email,
				c.telefone,
				c.cidade,
				c.uf,
				c.segmento,
				c.desde,
				c.resumo.pedidos,
				csvValor(c.resumo.totalGasto),
			]),
		);
	};

	const fecharDrawer = useCallback(() => setSelecionado(null), []);
	const cliente = selecionado ? CLIENTES_POR_ID[selecionado] : null;
	const resumo = selecionado ? resumoCliente(selecionado) : null;
	const historico = selecionado ? pedidosDoCliente(selecionado) : [];

	return (
		<>
			<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
				<div>
					<h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
					<p className="text-slate-500">
						{CLIENTES.length} clientes na base. Clique para ver o histórico de
						compras.
					</p>
				</div>
				<button
					type="button"
					onClick={exportar}
					className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
				>
					<Download size={16} />
					Exportar CSV
				</button>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				<div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-slate-500">
						<span className="font-medium text-slate-700">
							{filtrados.length}
						</span>{" "}
						{filtrados.length === 1 ? "cliente" : "clientes"}
						{termo && " encontrados"}
					</p>
					<CampoBusca
						valor={termo}
						aoMudar={(valor) => {
							setTermo(valor);
							setPagina(1);
						}}
						placeholder="Buscar por nome, e-mail, cidade..."
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
											campo="nome"
											rotulo="Cliente"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="cidade"
											rotulo="Cidade"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="segmento"
											rotulo="Segmento"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="desde"
											rotulo="Cliente desde"
											ordem={ordem}
											aoOrdenar={ordenar}
										/>
										<ThOrdenavel
											campo="pedidos"
											rotulo="Pedidos"
											ordem={ordem}
											aoOrdenar={ordenar}
											alinharDireita
										/>
										<ThOrdenavel
											campo="total"
											rotulo="Total gasto"
											ordem={ordem}
											aoOrdenar={ordenar}
											alinharDireita
										/>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{visiveis.map((linha, i) => (
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
											<td className="px-6 py-4">
												<div className="flex items-center gap-3">
													<span
														className={cx(
															"flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
															CORES_AVATAR[
																(i + paginaAtual) % CORES_AVATAR.length
															],
														)}
													>
														{iniciais(linha.nome)}
													</span>
													<span className="min-w-0">
														<span className="block truncate font-medium text-slate-900">
															{linha.nome}
														</span>
														<span className="block truncate text-xs text-slate-500">
															{linha.email}
														</span>
													</span>
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4">
												{linha.cidade}/{linha.uf}
											</td>
											<td className="px-6 py-4">{linha.segmento}</td>
											<td className="whitespace-nowrap px-6 py-4">
												{dataCurta(linha.desde)}
											</td>
											<td className="px-6 py-4 text-right">
												{numero(linha.resumo.pedidos)}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-800">
												{brl(linha.resumo.totalGasto)}
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
				aberto={cliente !== null}
				aoFechar={fecharDrawer}
				titulo={cliente?.nome ?? ""}
				subtitulo={
					cliente ? `${cliente.id} · cliente desde ${dataCurta(cliente.desde)}` : ""
				}
			>
				{cliente && resumo && (
					<div className="space-y-8">
						<section className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-medium text-slate-500">Total gasto</p>
								<p className="mt-1 text-xl font-bold text-slate-800">
									{brlCurto(resumo.totalGasto)}
								</p>
							</div>
							<div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
								<p className="text-xs font-medium text-slate-500">Pedidos</p>
								<p className="mt-1 text-xl font-bold text-slate-800">
									{numero(resumo.pedidos)}
								</p>
							</div>
						</section>

						<section className="space-y-2">
							<h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
								Contato
							</h3>
							<a
								href={`mailto:${cliente.email}`}
								className="flex items-center gap-3 text-sm text-slate-600 transition-colors hover:text-indigo-600"
							>
								<Mail size={16} className="text-slate-400" /> {cliente.email}
							</a>
							<p className="flex items-center gap-3 text-sm text-slate-600">
								<Phone size={16} className="text-slate-400" /> {cliente.telefone}
							</p>
							<p className="flex items-center gap-3 text-sm text-slate-600">
								<MapPin size={16} className="text-slate-400" /> {cliente.cidade}/
								{cliente.uf} · {cliente.segmento}
							</p>
						</section>

						<section>
							<h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
								<ShoppingBag size={14} /> Histórico ({historico.length})
							</h3>
							{historico.length === 0 ? (
								<p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
									Este cliente ainda não fez pedidos no período.
								</p>
							) : (
								<ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
									{historico.map((pedido) => (
										<li key={pedido.id}>
											<button
												type="button"
												onClick={() => {
													pedirFoco({ tipo: "pedido", id: pedido.id });
													router.push("/demos/dashboard/pedidos");
												}}
												className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-slate-50"
											>
												<span className="min-w-0">
													<span className="block text-sm font-medium text-slate-800">
														{pedido.id}
													</span>
													<span className="block text-xs text-slate-500">
														{dataCurta(pedido.data)}
													</span>
												</span>
												<span className="flex shrink-0 items-center gap-3">
													<BadgeStatus status={pedido.status} />
													<span className="whitespace-nowrap text-sm font-medium text-slate-800">
														{brl(pedido.valor)}
													</span>
												</span>
											</button>
										</li>
									))}
								</ul>
							)}
						</section>
					</div>
				)}
			</Drawer>
		</>
	);
}
