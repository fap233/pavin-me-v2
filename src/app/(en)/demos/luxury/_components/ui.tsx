/**
 * Tokens da AURUM — extraídos da home original e reusados em todas as páginas.
 *
 * A identidade é editorial: branco + stone-*, display em serifada, micro-caps
 * em sans com tracking largo, régua fina como separador e MUITO respiro. Nada
 * aqui inventa cor ou raio de borda novo: o vocabulário é fechado de propósito.
 */

/** Micro-caps dos links de nav / botões de texto. */
export const MICRO = "text-xs font-bold tracking-[0.2em] uppercase";

/** Sobretítulo de seção (o "Seleção Curada" da home). */
export const EYEBROW =
	"text-xs font-bold tracking-[0.3em] uppercase text-stone-400";

/** CTA de texto com a régua embaixo ("Ver coleção completa"). */
export const LINK_CTA = `${MICRO} text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors`;

/** Botão sólido (o quadrado preto da busca do hero). */
export const BTN_SOLIDO = `${MICRO} bg-stone-900 text-white px-8 py-4 hover:bg-stone-800 transition-colors disabled:opacity-40`;

/** Label de campo de formulário. */
export const LABEL =
	"block text-[10px] uppercase tracking-wider text-stone-400 font-bold mb-2";

/** Campo de formulário: régua embaixo, texto em serifada. */
export const CAMPO =
	"w-full bg-transparent border-b border-stone-200 py-3 font-serif text-lg text-stone-800 placeholder-stone-300 outline-none focus:border-stone-900 transition-colors";

/** Mesmo campo, em estado de erro. */
export const CAMPO_ERRO = CAMPO.replace(
	"border-stone-200",
	"border-rose-900/50",
);

export function cx(...partes: (string | false | null | undefined)[]): string {
	return partes.filter(Boolean).join(" ");
}

/** Régua vertical fina — o separador da home. */
export function Regua({ className = "" }: { className?: string }) {
	return (
		<span className={cx("block w-px h-20 bg-stone-300 mx-auto", className)} />
	);
}

/**
 * Cabeçalho das páginas internas. O nav é fixo (h-24) e usa
 * mix-blend-difference, então o topo precisa ser claro e com folga suficiente
 * para o texto invertido não encostar no conteúdo.
 */
export function PageHeader({
	eyebrow,
	titulo,
	texto,
	children,
}: {
	eyebrow: string;
	titulo: React.ReactNode;
	texto?: string;
	children?: React.ReactNode;
}) {
	return (
		<header className="px-8 pt-40 pb-16 md:pt-48 md:pb-20 max-w-[1800px] mx-auto">
			<p className={EYEBROW}>{eyebrow}</p>
			<h1 className="font-serif text-4xl md:text-6xl leading-tight text-stone-900 mt-6 max-w-3xl">
				{titulo}
			</h1>
			{texto ? (
				<p className="mt-8 max-w-xl text-stone-500 font-serif text-lg leading-relaxed">
					{texto}
				</p>
			) : null}
			{children}
		</header>
	);
}

/** Mensagem de erro dos formulários — discreta, em borgonha escuro. */
export function Erro({ children }: { children: React.ReactNode }) {
	if (!children) return null;
	return (
		<p className="mt-2 text-[10px] uppercase tracking-wider font-bold text-rose-900/80">
			{children}
		</p>
	);
}

/** Bloco de confirmação pós-envio, comum a todos os formulários. */
export function Confirmacao({
	titulo,
	children,
	acao,
}: {
	titulo: string;
	children: React.ReactNode;
	acao?: React.ReactNode;
}) {
	return (
		<div className="border border-stone-200 bg-stone-50 px-8 py-16 md:px-16 md:py-20 text-center">
			<Regua className="h-12 mb-8" />
			<h3 className="font-serif text-3xl md:text-4xl text-stone-900 mb-6">
				{titulo}
			</h3>
			<div className="text-stone-500 font-serif text-lg leading-relaxed max-w-md mx-auto">
				{children}
			</div>
			{acao ? <div className="mt-10">{acao}</div> : null}
		</div>
	);
}
