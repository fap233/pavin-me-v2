"use client";

import Link from "next/link";
import { useState } from "react";
import {
	TIPO_LABEL,
	precoBRL,
	precoCurto,
	normalizar,
	type Tipo,
} from "../_data/properties";
import {
	BTN_SOLIDO,
	CAMPO,
	CAMPO_ERRO,
	Erro,
	EYEBROW,
	LABEL,
	LINK_CTA,
	MICRO,
	PageHeader,
	Regua,
	cx,
} from "../_components/ui";

/* ------------------------------------------------------------------ */
/* Modelo de avaliação (client-side, plausível — não é um oráculo)     */
/* ------------------------------------------------------------------ */

/** Valor de referência por m² construído, por tipo de imóvel. */
const BASE_M2: Record<Tipo, number> = {
	cobertura: 46_000,
	apartamento: 34_000,
	mansao: 30_000,
	casa: 27_000,
	ilha: 9_000,
};

/** Endereços que puxam o m² para cima — o bairro é o maior multiplicador. */
const BAIRROS_PREMIUM = [
	"jardins",
	"jardim europa",
	"jardim america",
	"vila nova conceicao",
	"itaim",
	"leblon",
	"ipanema",
	"alto de pinheiros",
	"iporanga",
	"trancoso",
	"fazenda boa vista",
	"vieira souto",
];

const BAIRROS_ALTOS = [
	"pinheiros",
	"perdizes",
	"higienopolis",
	"moema",
	"brooklin",
	"lagoa",
	"gavea",
	"barra da tijuca",
	"riviera",
	"guaruja",
	"campo belo",
];

const PADROES = [
	{ value: "classico", label: "Clássico / a reformar", fator: 0.9 },
	{ value: "alto", label: "Alto padrão", fator: 1 },
	{ value: "altissimo", label: "Altíssimo padrão / assinado", fator: 1.2 },
];

function fatorDoBairro(endereco: string): { fator: number; nota: string } {
	const alvo = normalizar(endereco);
	if (BAIRROS_PREMIUM.some((b) => alvo.includes(b))) {
		return { fator: 1.38, nota: "Endereço premium" };
	}
	if (BAIRROS_ALTOS.some((b) => alvo.includes(b))) {
		return { fator: 1.15, nota: "Região valorizada" };
	}
	return { fator: 1, nota: "Praça padrão" };
}

type Avaliacao = {
	min: number;
	max: number;
	medio: number;
	porM2: number;
	nota: string;
	compradores: number;
};

function avaliar(
	endereco: string,
	tipo: Tipo,
	area: number,
	suites: number,
	padrao: string,
): Avaliacao {
	const { fator, nota } = fatorDoBairro(endereco);
	const padraoFator = PADROES.find((p) => p.value === padrao)?.fator ?? 1;

	// Cada suíte acima de três agrega, com teto de 12%.
	const bonusSuites = Math.min(Math.max(suites - 3, 0) * 0.015, 0.12);

	const medio = area * BASE_M2[tipo] * fator * padraoFator * (1 + bonusSuites);

	return {
		min: Math.round((medio * 0.93) / 100_000) * 100_000,
		max: Math.round((medio * 1.09) / 100_000) * 100_000,
		medio,
		porM2: medio / area,
		nota,
		// Número "de mercado" derivado do próprio imóvel, para não parecer fixo.
		compradores: 18 + (Math.round(medio / 1_000_000) % 27),
	};
}

/* ------------------------------------------------------------------ */

type Erros = Partial<Record<"endereco" | "area" | "suites", string>>;

export default function VenderPage() {
	const [endereco, setEndereco] = useState("");
	const [tipo, setTipo] = useState<Tipo>("casa");
	const [area, setArea] = useState("");
	const [suites, setSuites] = useState("");
	const [padrao, setPadrao] = useState("alto");
	const [erros, setErros] = useState<Erros>({});
	const [resultado, setResultado] = useState<Avaliacao | null>(null);

	function calcular(e: React.FormEvent) {
		e.preventDefault();
		const novos: Erros = {};

		const areaNum = Number(area);
		const suitesNum = Number(suites);

		if (endereco.trim().length < 5)
			novos.endereco = "Informe rua e bairro";
		if (!area || Number.isNaN(areaNum) || areaNum < 40 || areaNum > 20_000)
			novos.area = "Área construída entre 40 e 20.000 m²";
		if (!suites || Number.isNaN(suitesNum) || suitesNum < 1 || suitesNum > 20)
			novos.suites = "Entre 1 e 20 quartos";

		setErros(novos);
		if (Object.keys(novos).length > 0) return;

		setResultado(avaliar(endereco, tipo, areaNum, suitesNum, padrao));
	}

	return (
		<main>
			<PageHeader
				eyebrow="Vender"
				titulo={
					<>
						O seu imóvel,
						<br />
						no lugar certo.
					</>
				}
				texto="Uma avaliação preliminar em segundos — e, se fizer sentido, a visita de um consultor com a proposta completa em 48 horas."
			/>

			<section className="px-8 pb-32 max-w-[1800px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-32">
				<div>
					{resultado ? (
						<Resultado
							avaliacao={resultado}
							area={Number(area)}
							tipo={tipo}
							endereco={endereco}
							onRefazer={() => setResultado(null)}
						/>
					) : (
						<form onSubmit={calcular} noValidate>
							<div className="mb-8">
								<label htmlFor="v-endereco" className={LABEL}>
									Endereço
								</label>
								<input
									id="v-endereco"
									type="text"
									value={endereco}
									onChange={(e) => setEndereco(e.target.value)}
									placeholder="Rua Groenlândia, Jardins"
									className={erros.endereco ? CAMPO_ERRO : CAMPO}
								/>
								<Erro>{erros.endereco}</Erro>
							</div>

							<div className="grid sm:grid-cols-2 gap-8 mb-8">
								<div>
									<label htmlFor="v-tipo" className={LABEL}>
										Tipo
									</label>
									<select
										id="v-tipo"
										value={tipo}
										onChange={(e) => setTipo(e.target.value as Tipo)}
										className={cx(CAMPO, "cursor-pointer")}
									>
										{(Object.keys(BASE_M2) as Tipo[]).map((t) => (
											<option key={t} value={t}>
												{TIPO_LABEL[t]}
											</option>
										))}
									</select>
								</div>

								<div>
									<label htmlFor="v-padrao" className={LABEL}>
										Padrão de acabamento
									</label>
									<select
										id="v-padrao"
										value={padrao}
										onChange={(e) => setPadrao(e.target.value)}
										className={cx(CAMPO, "cursor-pointer")}
									>
										{PADROES.map((p) => (
											<option key={p.value} value={p.value}>
												{p.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="grid sm:grid-cols-2 gap-8 mb-12">
								<div>
									<label htmlFor="v-area" className={LABEL}>
										Área construída (m²)
									</label>
									<input
										id="v-area"
										type="number"
										inputMode="numeric"
										value={area}
										onChange={(e) => setArea(e.target.value)}
										placeholder="480"
										className={erros.area ? CAMPO_ERRO : CAMPO}
									/>
									<Erro>{erros.area}</Erro>
								</div>

								<div>
									<label htmlFor="v-suites" className={LABEL}>
										Quartos
									</label>
									<input
										id="v-suites"
										type="number"
										inputMode="numeric"
										value={suites}
										onChange={(e) => setSuites(e.target.value)}
										placeholder="4"
										className={erros.suites ? CAMPO_ERRO : CAMPO}
									/>
									<Erro>{erros.suites}</Erro>
								</div>
							</div>

							<button type="submit" className={BTN_SOLIDO}>
								Avaliar meu imóvel
							</button>
							<p className="text-[10px] uppercase tracking-wider text-stone-400 mt-6">
								Estimativa preliminar — não substitui a avaliação presencial
							</p>
						</form>
					)}
				</div>

				<aside className="lg:pt-4">
					<h2 className={cx(EYEBROW, "mb-8")}>Como trabalhamos</h2>
					<ol className="border-t border-stone-200">
						{[
							{
								n: "01",
								t: "Avaliação",
								d: "Cruzamos o seu endereço com as transações fechadas nos últimos 18 meses na mesma quadra.",
							},
							{
								n: "02",
								t: "Apresentação",
								d: "Fotografia, planta e filme feitos pela nossa equipe. Nada de foto de celular.",
							},
							{
								n: "03",
								t: "Mercado fechado",
								d: "O imóvel vai primeiro à nossa carteira de compradores — muitos vendem sem nunca ser anunciados.",
							},
						].map((passo) => (
							<li
								key={passo.n}
								className="border-b border-stone-200 py-8 flex gap-6"
							>
								<span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 pt-1.5">
									{passo.n}
								</span>
								<div>
									<h3 className="font-serif text-xl text-stone-900 mb-2">
										{passo.t}
									</h3>
									<p className="text-stone-500 font-serif leading-relaxed">
										{passo.d}
									</p>
								</div>
							</li>
						))}
					</ol>

					<p className="mt-10 text-stone-500 font-serif leading-relaxed">
						Comissão de 5% sobre a venda, sem custo antecipado — a apresentação
						do imóvel é por nossa conta.
					</p>
				</aside>
			</section>
		</main>
	);
}

function Resultado({
	avaliacao,
	area,
	tipo,
	endereco,
	onRefazer,
}: {
	avaliacao: Avaliacao;
	area: number;
	tipo: Tipo;
	endereco: string;
	onRefazer: () => void;
}) {
	return (
		<div className="border border-stone-200 bg-stone-50 p-8 md:p-12">
			<Regua className="h-12 mb-8" />

			<p className={cx(EYEBROW, "text-center")}>Estimativa preliminar</p>
			<p className="text-center font-serif text-stone-500 mt-4 mb-10">
				{TIPO_LABEL[tipo]} · {area}m² · {endereco.trim()}
			</p>

			<div className="text-center">
				<p className="font-serif text-3xl md:text-5xl text-stone-900 leading-tight">
					{precoCurto(avaliacao.min)}
					<span className="text-stone-300 mx-3">—</span>
					{precoCurto(avaliacao.max)}
				</p>
			</div>

			<div className="grid sm:grid-cols-3 gap-px bg-stone-200 border border-stone-200 mt-12">
				{[
					{ label: "Valor por m²", valor: precoBRL(avaliacao.porM2) },
					{ label: "Praça", valor: avaliacao.nota },
					{
						label: "Compradores no radar",
						valor: String(avaliacao.compradores),
					},
				].map((item) => (
					<div key={item.label} className="bg-stone-50 px-6 py-6 text-center">
						<p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
							{item.label}
						</p>
						<p className="font-serif text-lg text-stone-900">{item.valor}</p>
					</div>
				))}
			</div>

			<p className="text-stone-500 font-serif leading-relaxed mt-10 text-center max-w-md mx-auto">
				A faixa considera o padrão informado e o histórico da região. Uma visita
				do consultor costuma ajustá-la em até 8%.
			</p>

			<div className="flex flex-wrap items-center justify-center gap-8 mt-10">
				<Link href="/demos/luxury/contato?assunto=vender" className={BTN_SOLIDO}>
					Quero a avaliação completa
				</Link>
				<button
					type="button"
					onClick={onRefazer}
					className={cx(MICRO, "text-stone-400 hover:text-stone-900 transition-colors")}
				>
					Refazer cálculo
				</button>
			</div>

			<p className="text-center mt-10">
				<Link href="/demos/luxury/colecao" className={LINK_CTA}>
					Ver imóveis parecidos na coleção
				</Link>
			</p>
		</div>
	);
}
