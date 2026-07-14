import Link from "next/link";
import type { Metadata } from "next";
import { unsplash } from "../_data/properties";
import { EYEBROW, LINK_CTA, BTN_SOLIDO, Regua, cx } from "../_components/ui";

export const metadata: Metadata = {
	title: "Private Office · Aurum",
	description:
		"Assessoria imobiliária reservada para famílias, family offices e investidores.",
};

const SERVICOS = [
	{
		n: "01",
		titulo: "Mercado fechado",
		texto:
			"Cerca de 60% do que negociamos nunca é anunciado. Trabalhamos a partir do que você procura, não do que está na vitrine — inclusive batendo à porta de quem ainda não decidiu vender.",
	},
	{
		n: "02",
		titulo: "Representação do comprador",
		texto:
			"Ninguém compra bem negociando sozinho contra o corretor do vendedor. Sentamos do seu lado da mesa, do laudo à escritura, com honorário fixo e sem conflito.",
	},
	{
		n: "03",
		titulo: "Patrimônio e sucessão",
		texto:
			"Reorganização de carteira imobiliária, holding familiar e partilha — em conjunto com o seu escritório de advocacia e o seu family office.",
	},
	{
		n: "04",
		titulo: "Mudança internacional",
		texto:
			"Para quem chega ao Brasil ou parte dele: escola, visto, bancos e a casa certa no bairro certo. Um interlocutor único do começo ao fim.",
	},
];

const PASSOS = [
	{
		n: "01",
		titulo: "Conversa",
		texto: "Uma hora, sem compromisso, para entender o que de fato importa.",
	},
	{
		n: "02",
		titulo: "Mandato",
		texto: "Escopo, prazo e honorário por escrito. Exclusividade dos dois lados.",
	},
	{
		n: "03",
		titulo: "Busca",
		texto: "Relatórios quinzenais. Você só visita o que passou pelo nosso filtro.",
	},
];

export default function PrivateOfficePage() {
	return (
		<main>
			{/* Abertura em imagem cheia — o nav (mix-blend-difference) fica branco
			    por cima da foto escura. */}
			<section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden bg-stone-900">
				<img
					src={unsplash("photo-1600607687939-ce8a6c25118c", 2000)}
					alt="Salão de um imóvel atendido pelo Private Office"
					className="w-full h-full object-cover opacity-80"
				/>
				<div className="absolute inset-0 bg-black/40" />
				<div className="absolute inset-0 flex flex-col justify-end px-8 md:px-12 pb-16 md:pb-24 max-w-[1800px] mx-auto">
					<p className="text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-6">
						Private Office
					</p>
					<h1 className="font-serif text-4xl md:text-7xl text-white leading-tight max-w-3xl">
						Para quem prefere
						<br />
						não aparecer.
					</h1>
				</div>
			</section>

			{/* Manifesto */}
			<section className="py-24 md:py-32 px-8 max-w-3xl mx-auto text-center">
				<Regua className="mb-10" />
				<p className="font-serif text-2xl md:text-3xl leading-snug text-stone-800">
					Existe um mercado imobiliário que não tem anúncio, não tem placa e não
					tem visita aberta. Ele funciona por reputação — e é nele que a Aurum
					trabalha há dezoito anos.
				</p>
				<p className="text-stone-500 font-serif italic mt-10">
					— Helena Aurum, sócia-fundadora
				</p>
			</section>

			{/* Serviços */}
			<section className="border-t border-stone-200 px-8 md:px-12 py-24 md:py-32 max-w-[1800px] mx-auto">
				<h2 className={cx(EYEBROW, "mb-16")}>O que fazemos</h2>
				<div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-32 gap-y-16">
					{SERVICOS.map((s) => (
						<article key={s.n} className="flex gap-8">
							<span className="text-[10px] font-bold tracking-[0.2em] text-stone-400 pt-3">
								{s.n}
							</span>
							<div>
								<h3 className="font-serif text-3xl text-stone-900 mb-5">
									{s.titulo}
								</h3>
								<p className="font-serif text-lg text-stone-500 leading-relaxed max-w-md">
									{s.texto}
								</p>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Como funciona */}
			<section className="border-t border-stone-200 px-8 md:px-12 py-24 md:py-32 max-w-[1800px] mx-auto">
				<h2 className={cx(EYEBROW, "mb-16")}>Como começa</h2>
				<div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-200 border-y border-stone-200">
					{PASSOS.map((p) => (
						<div key={p.n} className="px-0 md:px-10 py-10 first:md:pl-0">
							<span className="text-[10px] font-bold tracking-[0.2em] text-stone-400">
								{p.n}
							</span>
							<h3 className="font-serif text-2xl text-stone-900 mt-4 mb-3">
								{p.titulo}
							</h3>
							<p className="text-stone-500 font-serif leading-relaxed max-w-xs">
								{p.texto}
							</p>
						</div>
					))}
				</div>

				<div className="grid md:grid-cols-3 gap-8 mt-24 text-center">
					{[
						{ n: "18", l: "Anos de operação" },
						{ n: "R$ 4,2 bi", l: "Transacionados" },
						{ n: "60%", l: "Fora do mercado listado" },
					].map((item) => (
						<div key={item.l}>
							<p className="font-serif text-4xl md:text-5xl text-stone-900">
								{item.n}
							</p>
							<p className={cx(EYEBROW, "mt-4")}>{item.l}</p>
						</div>
					))}
				</div>
			</section>

			{/* Convite */}
			<section className="border-t border-stone-200 px-8 py-24 md:py-32 text-center">
				<h2 className="font-serif text-3xl md:text-5xl text-stone-900 leading-snug max-w-2xl mx-auto mb-10">
					A primeira conversa é reservada — e não custa nada.
				</h2>
				<p className="text-stone-500 font-serif text-lg max-w-md mx-auto mb-12 leading-relaxed">
					Atendemos um número limitado de mandatos por ano para manter o padrão
					de dedicação.
				</p>
				<div className="flex flex-wrap items-center justify-center gap-10">
					<Link
						href="/demos/luxury/contato?assunto=private-office"
						className={BTN_SOLIDO}
					>
						Solicitar apresentação
					</Link>
					<Link href="/demos/luxury/colecao" className={LINK_CTA}>
						Ver a coleção pública
					</Link>
				</div>
			</section>
		</main>
	);
}
