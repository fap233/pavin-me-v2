"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, Bookmark } from "lucide-react";
import {
	FAIXAS_ALUGUEL,
	FAIXAS_VENDA,
	ORDENS,
	PROPERTIES,
	TIPO_OPTIONS,
	normalizar,
	type Operacao,
	type Ordem,
} from "../_data/properties";
import { PropertyCard } from "../_components/property-card";
import { useLuxury } from "../_components/luxury-context";
import { EYEBROW, LABEL, LINK_CTA, MICRO, cx } from "../_components/ui";

/* ------------------------------------------------------------------ */
/* Filtros: o estado é a fonte da verdade; a URL é um espelho.         */
/*                                                                     */
/* Já tentei o contrário (ler tudo de searchParams e escrever a cada   */
/* mexida) e dá corrida: o router.replace do App Router só atualiza o  */
/* histórico quando a transição COMMITA, então dois writes seguidos —  */
/* o do select e o do debounce do campo de texto — leem a mesma query  */
/* velha e um ressuscita o filtro que o outro tinha acabado de tirar.  */
/* Com um único escritor (o efeito lá embaixo) isso não acontece.      */
/* ------------------------------------------------------------------ */

type Filtros = {
	operacao: Operacao;
	tipo: (typeof TIPO_OPTIONS)[number]["value"];
	faixa: string;
	ordem: Ordem;
	salvos: boolean;
	local: string;
};

function lerDaURL(sp: URLSearchParams): Filtros {
	const operacao: Operacao =
		sp.get("operacao") === "alugar" ? "alugar" : "comprar";

	const faixas = operacao === "alugar" ? FAIXAS_ALUGUEL : FAIXAS_VENDA;

	return {
		operacao,
		tipo:
			TIPO_OPTIONS.find((t) => t.value === sp.get("tipo"))?.value ?? "todos",
		faixa: faixas.find((f) => f.value === sp.get("faixa"))?.value ?? "todas",
		ordem: ORDENS.find((o) => o.value === sp.get("ordem"))?.value ?? "recentes",
		salvos: sp.get("salvos") === "1",
		local: sp.get("local") ?? "",
	};
}

/** Só os filtros fora do padrão entram na URL — link limpo, do jeito editorial. */
function escreverQS(f: Filtros): string {
	const sp = new URLSearchParams();
	if (f.operacao !== "comprar") sp.set("operacao", f.operacao);
	if (f.tipo !== "todos") sp.set("tipo", f.tipo);
	if (f.faixa !== "todas") sp.set("faixa", f.faixa);
	if (f.ordem !== "recentes") sp.set("ordem", f.ordem);
	if (f.salvos) sp.set("salvos", "1");
	if (f.local.trim()) sp.set("local", f.local.trim());
	return sp.toString();
}

export function ColecaoClient() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { salvos, setOperacao } = useLuxury();

	const qsDaURL = searchParams.toString();

	const [filtros, setFiltros] = useState<Filtros>(() =>
		lerDaURL(new URLSearchParams(qsDaURL)),
	);

	// URL → estado: entradas externas (links "Comprar"/"Alugar" do nav, "Salvos",
	// voltar/avançar do browser).
	useEffect(() => {
		const daURL = lerDaURL(new URLSearchParams(qsDaURL));
		setFiltros((atual) =>
			escreverQS(atual) === escreverQS(daURL) ? atual : daURL,
		);
	}, [qsDaURL]);

	// Estado → URL: escritor único, coalescido. Serve de debounce pro campo de
	// texto e mantém a query compartilhável.
	useEffect(() => {
		const qs = escreverQS(filtros);
		if (qs === qsDaURL) return;
		const t = setTimeout(() => {
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		}, 300);
		return () => clearTimeout(t);
	}, [filtros, qsDaURL, pathname, router]);

	const { operacao, tipo, ordem, local } = filtros;
	const soSalvos = filtros.salvos;

	const faixas = operacao === "alugar" ? FAIXAS_ALUGUEL : FAIXAS_VENDA;
	const faixa = faixas.find((f) => f.value === filtros.faixa) ?? faixas[0];

	const mudar = useCallback(
		(mudancas: Partial<Filtros>) => setFiltros((a) => ({ ...a, ...mudancas })),
		[],
	);

	// O nav destaca Comprar/Alugar a partir daqui (em vez de ler a query ele
	// mesmo, o que exigiria uma Suspense boundary em volta do layout inteiro).
	useEffect(() => {
		setOperacao(operacao);
	}, [operacao, setOperacao]);

	/* --- Filtro + ordenação ------------------------------------------------ */
	const lista = useMemo(() => {
		const busca = normalizar(local);

		const filtrados = PROPERTIES.filter((p) => {
			if (!p.operacoes.includes(operacao)) return false;

			if (busca) {
				const alvo = normalizar(
					`${p.bairro} ${p.cidade} ${p.uf} ${p.titulo}`,
				);
				if (!alvo.includes(busca)) return false;
			}

			if (tipo !== "todos" && p.tipo !== tipo) return false;

			const valor = operacao === "alugar" ? (p.aluguel ?? 0) : p.preco;
			if (!faixa.test(valor)) return false;

			if (soSalvos && !salvos.includes(p.slug)) return false;

			return true;
		});

		const valorDe = (p: (typeof PROPERTIES)[number]) =>
			operacao === "alugar" ? (p.aluguel ?? 0) : p.preco;

		return [...filtrados].sort((a, b) => {
			switch (ordem) {
				case "preco-desc":
					return valorDe(b) - valorDe(a);
				case "preco-asc":
					return valorDe(a) - valorDe(b);
				case "area-desc":
					return b.area - a.area;
				default:
					return b.listadoEm.localeCompare(a.listadoEm);
			}
		});
	}, [local, operacao, tipo, faixa, ordem, soSalvos, salvos]);

	const temFiltro =
		Boolean(local) ||
		tipo !== "todos" ||
		faixa.value !== faixas[0].value ||
		ordem !== "recentes" ||
		soSalvos;

	/** Zera tudo menos a operação — o usuário continua onde estava. */
	function limpar() {
		setFiltros({
			operacao,
			tipo: "todos",
			faixa: "todas",
			ordem: "recentes",
			salvos: false,
			local: "",
		});
	}

	const total = String(lista.length).padStart(2, "0");

	return (
		<main>
			<header className="px-8 pt-40 pb-12 md:pt-48 md:pb-16 max-w-[1800px] mx-auto">
				<p className={EYEBROW}>Coleção</p>
				<h1 className="font-serif text-4xl md:text-6xl leading-tight text-stone-900 mt-6">
					{operacao === "alugar" ? "Para locação" : "Para aquisição"}
				</h1>
				<p className="mt-8 max-w-xl text-stone-500 font-serif text-lg leading-relaxed">
					Dez endereços sob curadoria em São Paulo, Rio de Janeiro e no litoral.
					Cada um visitado, fotografado e negociado por nós.
				</p>
			</header>

			{/* Operação + salvos */}
			<div className="px-8 max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-6 pb-8">
				<div className={cx("flex items-center gap-8", MICRO)}>
					{(["comprar", "alugar"] as const).map((op) => (
						<button
							key={op}
							type="button"
							// A faixa de preço volta ao padrão: as faixas de venda e de
							// aluguel são escalas diferentes.
							onClick={() => mudar({ operacao: op, faixa: "todas" })}
							className={cx(
								"pb-1 border-b transition-colors",
								operacao === op
									? "text-stone-900 border-stone-900"
									: "text-stone-400 border-transparent hover:text-stone-600",
							)}
						>
							{op === "comprar" ? "Comprar" : "Alugar"}
						</button>
					))}
				</div>

				<button
					type="button"
					onClick={() => mudar({ salvos: !soSalvos })}
					aria-pressed={soSalvos}
					className={cx(
						MICRO,
						"flex items-center gap-2 pb-1 border-b transition-colors",
						soSalvos
							? "text-stone-900 border-stone-900"
							: "text-stone-400 border-transparent hover:text-stone-600",
					)}
				>
					<Bookmark size={14} className={soSalvos ? "fill-current" : undefined} />
					Apenas salvos
				</button>
			</div>

			{/* Filtros */}
			<div className="border-y border-stone-200">
				<div className="max-w-[1800px] mx-auto grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-200">
					<div className="px-8 py-6">
						<label htmlFor="f-local" className={LABEL}>
							Localização
						</label>
						<input
							id="f-local"
							type="text"
							value={local}
							onChange={(e) => mudar({ local: e.target.value })}
							placeholder="Bairro ou cidade"
							className="w-full bg-transparent outline-none font-serif text-lg text-stone-800 placeholder-stone-300"
						/>
					</div>

					<Select
						id="f-tipo"
						label="Tipo"
						value={tipo}
						onChange={(v) =>
							mudar({ tipo: v as Filtros["tipo"] })
						}
						options={TIPO_OPTIONS.map((t) => ({
							value: t.value,
							label: t.label,
						}))}
					/>

					<Select
						id="f-faixa"
						label="Faixa de preço"
						value={faixa.value}
						onChange={(v) => mudar({ faixa: v })}
						options={faixas.map((f) => ({ value: f.value, label: f.label }))}
					/>

					<Select
						id="f-ordem"
						label="Ordenar por"
						value={ordem}
						onChange={(v) => mudar({ ordem: v as Ordem })}
						options={ORDENS.map((o) => ({ value: o.value, label: o.label }))}
					/>
				</div>
			</div>

			{/* Resultados */}
			<section className="px-4 md:px-12 pt-12 pb-32">
				<div className="flex items-center justify-between gap-6 mb-12 px-2">
					<p className={EYEBROW}>
						{lista.length === 1 ? "01 imóvel" : `${total} imóveis`}
					</p>
					{temFiltro ? (
						<button type="button" onClick={limpar} className={cx(MICRO, "text-stone-400 hover:text-stone-900 transition-colors")}>
							Limpar filtros
						</button>
					) : null}
				</div>

				{lista.length === 0 ? (
					<div className="border border-stone-200 px-8 py-24 text-center">
						<h2 className="font-serif text-3xl text-stone-900 mb-6">
							{soSalvos && salvos.length === 0
								? "Nenhum imóvel salvo ainda."
								: "Nada corresponde a estes critérios."}
						</h2>
						<p className="text-stone-500 font-serif text-lg max-w-md mx-auto mb-10 leading-relaxed">
							{soSalvos && salvos.length === 0
								? "Use o marcador no canto das fotos para guardar os imóveis que interessam — eles ficam aqui."
								: "Boa parte do nosso portfólio nunca chega a ser listado. Diga o que procura e buscamos no mercado fechado."}
						</p>
						<div className="flex flex-wrap items-center justify-center gap-8">
							<button type="button" onClick={limpar} className={LINK_CTA}>
								Limpar filtros
							</button>
							<Link href="/demos/luxury/contato" className={LINK_CTA}>
								Buscar off-market
							</Link>
						</div>
					</div>
				) : (
					<div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
						{lista.map((imovel, i) => (
							<PropertyCard
								key={imovel.slug}
								imovel={imovel}
								operacao={operacao}
								className={i % 2 === 1 ? "md:mt-20" : undefined}
							/>
						))}
					</div>
				)}
			</section>

			{/* Off-market */}
			<section className="border-t border-stone-200 px-8 md:px-12 py-24 text-center">
				<p className={cx(EYEBROW, "mb-8")}>Fora do catálogo</p>
				<h2 className="font-serif text-3xl md:text-4xl text-stone-800 max-w-2xl mx-auto leading-snug mb-10">
					Os melhores imóveis do país nunca são anunciados.
				</h2>
				<Link href="/demos/luxury/private-office" className={LINK_CTA}>
					Conhecer o Private Office
				</Link>
			</section>
		</main>
	);
}

/** Select nativo com a chevron da lucide — mesma pegada dos campos do hero. */
function Select({
	id,
	label,
	value,
	onChange,
	options,
}: {
	id: string;
	label: string;
	value: string;
	onChange: (valor: string) => void;
	options: { value: string; label: string }[];
}) {
	return (
		<div className="px-8 py-6">
			<label htmlFor={id} className={LABEL}>
				{label}
			</label>
			<div className="relative">
				<select
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full appearance-none bg-transparent outline-none font-serif text-lg text-stone-800 pr-8 cursor-pointer"
				>
					{options.map((o) => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
				<ChevronDown
					size={16}
					className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
				/>
			</div>
		</div>
	);
}
