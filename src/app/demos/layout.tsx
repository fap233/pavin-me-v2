import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

/**
 * Layout das demos do lab (/demos/*).
 *
 * Cada demo é uma página isolada, com design próprio e sem navegação — quem
 * abria uma ficava preso nela, sem caminho de volta pro portfólio. Este layout
 * injeta em TODAS as demos de uma vez (em vez de repetir em cada página):
 *
 *   1. o botão "voltar", ancorado na seção do lab de onde a demo saiu;
 *   2. o aviso de conteúdo fictício.
 *
 * O aviso existe porque as demos têm telefone, CNPJ, CREF, endereço e preço
 * com cara de reais — alguém pode ligar pro número da padaria, ou achar que a
 * imobiliária existe. Ele aparece em DOIS lugares de propósito: um selo fixo,
 * que quem só olha a primeira dobra também vê, e a tarja do rodapé, com o texto
 * completo. Ficar só no rodapé não resolveria: ninguém rola até lá antes de ler
 * o telefone que está no topo.
 *
 * Ambos ficam embaixo à esquerda / no rodapé de propósito: o topo é onde as
 * demos põem o próprio logo e menu, então qualquer coisa ali colidiria com o
 * design de cada uma — e o ponto do lab é justamente que cada demo mantenha a
 * identidade dela.
 */
export default function DemosLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{children}

			{/* Tarja de rodapé — o aviso por extenso, no fim de qualquer página */}
			<footer className="relative z-[90] border-t border-white/10 bg-neutral-950 px-5 py-6 text-center text-neutral-400">
				<p className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-1.5 text-[13px] leading-relaxed sm:flex-row sm:gap-2">
					<Info
						className="h-4 w-4 shrink-0 text-neutral-500"
						aria-hidden="true"
					/>
					<span>
						<strong className="font-semibold text-neutral-200">
							Demonstração de portfólio.
						</strong>{" "}
						Esta empresa não existe. Nomes, telefones, CNPJ, endereços, preços,
						pessoas e todos os demais dados são fictícios, criados apenas para
						demonstrar a interface.
					</span>
				</p>
				<Link
					href="/#frontend-demos"
					className="mt-3 inline-block text-[13px] font-medium text-neutral-300 underline underline-offset-4 transition-colors hover:text-white"
				>
					Ver o portfólio de Fellipe Pavin
				</Link>
			</footer>

			{/* Camada fixa — fora do design de cada demo, sempre visível */}
			<div className="fixed bottom-5 left-5 z-[100] flex flex-col items-start gap-2">
				<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-950/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md">
					<Info className="h-3.5 w-3.5" aria-hidden="true" />
					Demo · dados fictícios
				</span>

				<Link
					href="/#frontend-demos"
					aria-label="Voltar ao portfólio de Fellipe Pavin"
					className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 hover:gap-3 hover:border-white/30 hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
				>
					<ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
					<span>Voltar ao portfólio</span>
				</Link>
			</div>
		</>
	);
}
