"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	Bath,
	Bed,
	Bookmark,
	Calendar,
	Car,
	ChevronLeft,
	ChevronRight,
	MapPin,
	Square,
	X,
} from "lucide-react";
import {
	areaFmt,
	precoBRL,
	relacionados,
	unsplash,
	type Property,
} from "../../_data/properties";
import { PropertyCard } from "../../_components/property-card";
import { useLuxury } from "../../_components/luxury-context";
import {
	BTN_SOLIDO,
	CAMPO,
	CAMPO_ERRO,
	Erro,
	EYEBROW,
	LABEL,
	LINK_CTA,
	MICRO,
	cx,
} from "../../_components/ui";

const HORARIOS = ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

export function ImovelClient({ imovel }: { imovel: Property }) {
	const { isSalvo, toggleSalvo } = useLuxury();
	const [foto, setFoto] = useState(0);
	const [agendando, setAgendando] = useState(false);

	const salvo = isSalvo(imovel.slug);
	const total = imovel.fotos.length;
	const outros = relacionados(imovel.slug, 2);

	// Troca de imóvel (link de "relacionados") sem desmontar o componente:
	// volta a galeria para a primeira foto.
	useEffect(() => {
		setFoto(0);
	}, [imovel.slug]);

	const anterior = () => setFoto((i) => (i - 1 + total) % total);
	const proxima = () => setFoto((i) => (i + 1) % total);

	const specs = [
		{ icone: Square, label: "Área", valor: areaFmt(imovel.area) },
		{ icone: Bed, label: "Suítes", valor: String(imovel.suites) },
		{ icone: Bath, label: "Banheiros", valor: String(imovel.banheiros) },
		{ icone: Car, label: "Vagas", valor: String(imovel.vagas) },
	];

	return (
		<main>
			{/* Galeria — painéis empilhados, trocados por opacidade. Sem lib. */}
			<section className="relative h-[70vh] md:h-[88vh] w-full overflow-hidden bg-stone-100">
				{imovel.fotos.map((f, i) => (
					<img
						key={f + i}
						src={unsplash(f, 2000)}
						alt={`${imovel.titulo} — imagem ${i + 1} de ${total}`}
						aria-hidden={i !== foto}
						className={cx(
							"absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out",
							i === foto ? "opacity-100" : "opacity-0",
						)}
					/>
				))}
				<div className="absolute inset-0 bg-black/15 pointer-events-none" />
				{/* Véu no topo: o nav usa mix-blend-difference e some contra céu
				    claro. Escurecer a faixa de trás devolve o contraste sem
				    inventar cor nenhuma. */}
				<div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />

				<button
					type="button"
					onClick={anterior}
					aria-label="Imagem anterior"
					className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 text-stone-900 hover:bg-white transition-colors"
				>
					<ChevronLeft size={20} />
				</button>
				<button
					type="button"
					onClick={proxima}
					aria-label="Próxima imagem"
					className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 text-stone-900 hover:bg-white transition-colors"
				>
					<ChevronRight size={20} />
				</button>

				{/* Contador + miniaturas à direita — o canto inferior esquerdo é do
				    pill "Voltar ao portfólio". */}
				<div className="absolute bottom-6 right-4 md:right-8 flex items-center gap-4 md:gap-6">
					<span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase tabular-nums drop-shadow">
						{String(foto + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
					</span>
					<div className="flex gap-2 md:gap-3">
						{imovel.fotos.map((f, i) => (
							<button
								key={f + i}
								type="button"
								onClick={() => setFoto(i)}
								aria-label={`Ver imagem ${i + 1}`}
								aria-current={i === foto}
								className={cx(
									"w-14 h-10 md:w-24 md:h-16 overflow-hidden transition-all duration-300",
									i === foto
										? "ring-2 ring-white opacity-100"
										: "opacity-50 hover:opacity-90",
								)}
							>
								<img
									src={unsplash(f, 240)}
									alt=""
									className="w-full h-full object-cover"
								/>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Cabeçalho do imóvel */}
			<section className="px-8 md:px-12 pt-12 md:pt-16 max-w-[1800px] mx-auto">
				<div className={cx(MICRO, "flex items-center gap-3 text-stone-400 mb-10")}>
					<Link
						href="/demos/luxury/colecao"
						className="hover:text-stone-900 transition-colors"
					>
						Coleção
					</Link>
					<span aria-hidden>/</span>
					<span className="text-stone-900">{imovel.titulo}</span>
				</div>

				<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
					<div>
						{imovel.exclusivo ? (
							<p className={cx(EYEBROW, "mb-6")}>Exclusivo Aurum</p>
						) : null}
						<h1 className="font-serif text-4xl md:text-6xl leading-tight text-stone-900">
							{imovel.titulo}
						</h1>
						<div className="flex items-center gap-2 text-stone-500 mt-5 font-serif text-lg">
							<MapPin size={16} /> {imovel.bairro}, {imovel.cidade} — {imovel.uf}
						</div>
					</div>

					<div className="lg:text-right shrink-0">
						<p className="text-xs text-stone-400 uppercase tracking-wider mb-2">
							Preço
						</p>
						<p className="font-serif text-3xl md:text-4xl text-stone-900">
							{precoBRL(imovel.preco)}
						</p>
						{imovel.aluguel ? (
							<p className="text-stone-400 font-serif mt-2">
								ou {precoBRL(imovel.aluguel)}/mês para locação
							</p>
						) : null}

						<div className="flex flex-wrap lg:justify-end items-center gap-6 mt-8">
							<button
								type="button"
								onClick={() => setAgendando(true)}
								className={cx(BTN_SOLIDO, "flex items-center gap-3")}
							>
								<Calendar size={16} /> Agendar visita
							</button>
							<button
								type="button"
								onClick={() => toggleSalvo(imovel.slug)}
								aria-pressed={salvo}
								className={cx(
									MICRO,
									"flex items-center gap-2 pb-1 border-b transition-colors",
									salvo
										? "text-stone-900 border-stone-900"
										: "text-stone-400 border-stone-300 hover:text-stone-900 hover:border-stone-900",
								)}
							>
								<Bookmark
									size={14}
									className={salvo ? "fill-current" : undefined}
								/>
								{salvo ? "Salvo" : "Salvar"}
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Ficha técnica */}
			<section className="px-8 md:px-12 mt-16 max-w-[1800px] mx-auto">
				<div className="grid grid-cols-2 md:grid-cols-5 border-y border-stone-200 divide-x divide-stone-200">
					{specs.map(({ icone: Icone, label, valor }) => (
						<div key={label} className="px-6 py-8 first:pl-0">
							<div className="flex items-center gap-2 text-stone-400 mb-3">
								<Icone size={14} />
								<span className="text-[10px] font-bold uppercase tracking-wider">
									{label}
								</span>
							</div>
							<p className="font-serif text-2xl text-stone-900">{valor}</p>
						</div>
					))}
					<div className="px-6 py-8 col-span-2 md:col-span-1">
						<div className="flex items-center gap-2 text-stone-400 mb-3">
							<Calendar size={14} />
							<span className="text-[10px] font-bold uppercase tracking-wider">
								Ano
							</span>
						</div>
						<p className="font-serif text-2xl text-stone-900">{imovel.ano}</p>
					</div>
				</div>
			</section>

			{/* Descrição + bairro */}
			<section className="px-8 md:px-12 py-24 md:py-32 max-w-[1800px] mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-16 lg:gap-24">
				<div>
					<h2 className={cx(EYEBROW, "mb-10")}>O imóvel</h2>
					<div className="space-y-8 max-w-2xl">
						{imovel.descricao.map((paragrafo, i) => (
							<p
								key={i}
								className={cx(
									"font-serif text-stone-700 leading-relaxed",
									i === 0 ? "text-2xl md:text-3xl leading-snug text-stone-900" : "text-lg",
								)}
							>
								{paragrafo}
							</p>
						))}
					</div>

					<h3 className={cx(EYEBROW, "mt-20 mb-8")}>O bairro</h3>
					<p className="font-serif text-lg text-stone-700 leading-relaxed max-w-2xl">
						{imovel.sobreOBairro}
					</p>
				</div>

				<aside>
					<h2 className={cx(EYEBROW, "mb-10")}>Destaques</h2>
					<ul className="border-t border-stone-200">
						{imovel.destaques.map((d) => (
							<li
								key={d}
								className="border-b border-stone-200 py-5 font-serif text-lg text-stone-700"
							>
								{d}
							</li>
						))}
					</ul>

					<div className="mt-12 bg-stone-50 border border-stone-200 p-8">
						<p className="font-serif text-xl text-stone-900 leading-snug mb-6">
							Quer conhecer pessoalmente?
						</p>
						<p className="text-stone-500 font-serif leading-relaxed mb-8">
							Visitas acompanhadas por um consultor da casa, de segunda a sábado.
						</p>
						<button
							type="button"
							onClick={() => setAgendando(true)}
							className={cx(BTN_SOLIDO, "w-full")}
						>
							Agendar visita
						</button>
						<Link
							href={`/demos/luxury/contato?assunto=comprar&imovel=${imovel.slug}`}
							className={cx(LINK_CTA, "inline-block mt-8")}
						>
							Falar com um consultor
						</Link>
					</div>
				</aside>
			</section>

			{/* Relacionados */}
			<section className="border-t border-stone-200 px-4 md:px-12 py-24">
				<div className="flex justify-between items-end mb-12 px-2 gap-6">
					<h2 className={EYEBROW}>Também na coleção</h2>
					<Link href="/demos/luxury/colecao" className={cx(LINK_CTA, "shrink-0")}>
						Ver tudo
					</Link>
				</div>
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
					{outros.map((p, i) => (
						<PropertyCard
							key={p.slug}
							imovel={p}
							className={i === 1 ? "md:mt-20" : undefined}
						/>
					))}
				</div>
			</section>

			{agendando ? (
				<AgendarVisita imovel={imovel} onFechar={() => setAgendando(false)} />
			) : null}
		</main>
	);
}

/* ------------------------------------------------------------------ */
/* Modal de agendamento                                                */
/* ------------------------------------------------------------------ */

type ErrosVisita = Partial<Record<"data" | "hora" | "nome" | "telefone", string>>;

function AgendarVisita({
	imovel,
	onFechar,
}: {
	imovel: Property;
	onFechar: () => void;
}) {
	const [data, setData] = useState("");
	const [hora, setHora] = useState("");
	const [nome, setNome] = useState("");
	const [telefone, setTelefone] = useState("");
	const [erros, setErros] = useState<ErrosVisita>({});
	const [confirmado, setConfirmado] = useState(false);
	const [hoje, setHoje] = useState("");

	const primeiroRef = useRef<HTMLInputElement>(null);

	// A data mínima depende do relógio do usuário: só no cliente, senão o HTML
	// do servidor pode divergir do primeiro render.
	useEffect(() => {
		setHoje(new Date().toISOString().slice(0, 10));
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onFechar();
		};
		const overflowAnterior = document.body.style.overflow;

		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		primeiroRef.current?.focus();

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflowAnterior;
		};
	}, [onFechar]);

	function enviar(e: React.FormEvent) {
		e.preventDefault();
		const novos: ErrosVisita = {};

		if (!data) novos.data = "Escolha uma data";
		if (!hora) novos.hora = "Escolha um horário";
		if (nome.trim().length < 3) novos.nome = "Informe seu nome completo";
		if (telefone.replace(/\D/g, "").length < 10)
			novos.telefone = "Informe um telefone com DDD";

		setErros(novos);
		if (Object.keys(novos).length > 0) return;

		setConfirmado(true);
	}

	const dataBR = data ? data.split("-").reverse().join("/") : "";

	return (
		// z-[80] fica abaixo do pill "Voltar ao portfólio" (z-100), que continua
		// visível e clicável no canto — de propósito.
		<div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8">
			<div
				className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
				onClick={onFechar}
				aria-hidden
			/>

			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="titulo-visita"
				className="relative w-full max-w-xl bg-white max-h-full overflow-y-auto"
			>
				<div className="flex items-start justify-between px-8 md:px-12 pt-8">
					<p className={EYEBROW}>Visita privada</p>
					<button
						type="button"
						onClick={onFechar}
						aria-label="Fechar"
						className="text-stone-400 hover:text-stone-900 transition-colors -mr-2 -mt-1 p-2"
					>
						<X size={20} />
					</button>
				</div>

				{confirmado ? (
					<div className="px-8 md:px-12 py-12 text-center">
						<span className="block w-px h-12 bg-stone-300 mx-auto mb-8" />
						<h2 id="titulo-visita" className="font-serif text-3xl text-stone-900 mb-6">
							Visita agendada.
						</h2>
						<p className="font-serif text-lg text-stone-500 leading-relaxed max-w-sm mx-auto">
							{nome.trim().split(" ")[0]}, sua visita ao{" "}
							<span className="text-stone-900">{imovel.titulo}</span> ficou para{" "}
							<span className="text-stone-900">
								{dataBR} às {hora}
							</span>
							. Um consultor confirma por telefone em até 2 horas.
						</p>
						<button
							type="button"
							onClick={onFechar}
							className={cx(BTN_SOLIDO, "mt-10")}
						>
							Fechar
						</button>
					</div>
				) : (
					<form onSubmit={enviar} noValidate className="px-8 md:px-12 pb-12 pt-6">
						<h2 id="titulo-visita" className="font-serif text-3xl text-stone-900 mb-2">
							Agendar visita
						</h2>
						<p className="font-serif text-stone-500 mb-10">{imovel.titulo}</p>

						<div className="grid sm:grid-cols-2 gap-8 mb-8">
							<div>
								<label htmlFor="v-data" className={LABEL}>
									Data
								</label>
								<input
									ref={primeiroRef}
									id="v-data"
									type="date"
									min={hoje || undefined}
									value={data}
									onChange={(e) => setData(e.target.value)}
									className={cx(erros.data ? CAMPO_ERRO : CAMPO, "font-sans text-base")}
								/>
								<Erro>{erros.data}</Erro>
							</div>

							<div>
								<label htmlFor="v-hora" className={LABEL}>
									Horário
								</label>
								<select
									id="v-hora"
									value={hora}
									onChange={(e) => setHora(e.target.value)}
									className={cx(erros.hora ? CAMPO_ERRO : CAMPO, "cursor-pointer")}
								>
									<option value="">Selecione</option>
									{HORARIOS.map((h) => (
										<option key={h} value={h}>
											{h}
										</option>
									))}
								</select>
								<Erro>{erros.hora}</Erro>
							</div>
						</div>

						<div className="mb-8">
							<label htmlFor="v-nome" className={LABEL}>
								Nome completo
							</label>
							<input
								id="v-nome"
								type="text"
								value={nome}
								onChange={(e) => setNome(e.target.value)}
								placeholder="Como devemos chamá-lo"
								className={erros.nome ? CAMPO_ERRO : CAMPO}
							/>
							<Erro>{erros.nome}</Erro>
						</div>

						<div className="mb-12">
							<label htmlFor="v-telefone" className={LABEL}>
								Telefone
							</label>
							<input
								id="v-telefone"
								type="tel"
								value={telefone}
								onChange={(e) => setTelefone(e.target.value)}
								placeholder="(11) 90000-0000"
								className={erros.telefone ? CAMPO_ERRO : CAMPO}
							/>
							<Erro>{erros.telefone}</Erro>
						</div>

						<button type="submit" className={cx(BTN_SOLIDO, "w-full")}>
							Confirmar visita
						</button>
						<p className="text-center text-[10px] uppercase tracking-wider text-stone-400 mt-6">
							Atendimento discreto: nenhum dado é compartilhado
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
