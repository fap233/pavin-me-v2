import Link from "next/link";
import { EYEBROW, LINK_CTA, Regua, cx } from "./_components/ui";

/** 404 do segmento — pega, entre outros, um slug de imóvel inexistente. */
export default function LuxuryNotFound() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center text-center px-8 py-40">
			<Regua className="mb-10" />
			<p className={cx(EYEBROW, "mb-8")}>Erro 404</p>
			<h1 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-8">
				Este endereço
				<br />
				não existe mais.
			</h1>
			<p className="text-stone-500 font-serif text-lg max-w-md mb-12 leading-relaxed">
				O imóvel pode ter sido vendido ou retirado da curadoria. A coleção
				completa continua aqui.
			</p>
			<div className="flex flex-wrap items-center justify-center gap-10">
				<Link href="/demos/luxury/colecao" className={LINK_CTA}>
					Ver a coleção
				</Link>
				<Link href="/demos/luxury/contato" className={LINK_CTA}>
					Falar com a Aurum
				</Link>
			</div>
		</main>
	);
}
