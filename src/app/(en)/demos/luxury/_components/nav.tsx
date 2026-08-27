"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Bookmark } from "lucide-react";
import { useLuxury } from "./luxury-context";
import { cx, MICRO } from "./ui";

const BASE = "/demos/luxury";

/** Links do menu full-screen (o nav do topo mostra só os quatro do meio). */
const MENU_LINKS = [
	{ href: BASE, label: "Início" },
	{ href: `${BASE}/colecao`, label: "Coleção" },
	{ href: `${BASE}/colecao?operacao=comprar`, label: "Comprar" },
	{ href: `${BASE}/colecao?operacao=alugar`, label: "Alugar" },
	{ href: `${BASE}/vender`, label: "Vender" },
	{ href: `${BASE}/private-office`, label: "Private Office" },
	{ href: `${BASE}/contato`, label: "Contato" },
];

export function LuxuryNav() {
	const pathname = usePathname();
	const { salvos, operacao } = useLuxury();
	const [aberto, setAberto] = useState(false);
	const fecharRef = useRef<HTMLButtonElement>(null);

	// Navegou? Fecha o menu. (O clique num link não desmonta o overlay sozinho.)
	useEffect(() => {
		setAberto(false);
	}, [pathname]);

	// Esc fecha + trava o scroll do fundo enquanto o menu está aberto.
	useEffect(() => {
		if (!aberto) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setAberto(false);
		};
		const overflowAnterior = document.body.style.overflow;

		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		fecharRef.current?.focus();

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = overflowAnterior;
		};
	}, [aberto]);

	const naColecao = pathname.startsWith(`${BASE}/colecao`);
	const ativo = {
		comprar: naColecao && operacao === "comprar",
		alugar: naColecao && operacao === "alugar",
		vender: pathname.startsWith(`${BASE}/vender`),
		office: pathname.startsWith(`${BASE}/private-office`),
	};

	const linkNav = (isAtivo: boolean) =>
		cx(
			"relative transition-colors hover:text-stone-400",
			// A régua do ativo usa `bg-current` pra sobreviver ao
			// mix-blend-difference: ela inverte junto com o texto.
			isAtivo &&
				"after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-current",
		);

	const contador = String(salvos.length).padStart(2, "0");

	return (
		<>
			{/* Navbar — mix-blend-difference inverte o texto conforme o fundo:
			    branco sobre a foto do hero, preto sobre as páginas claras. */}
			<nav className="fixed w-full z-50 mix-blend-difference text-white">
				<div className="max-w-[1800px] mx-auto px-8 h-24 flex items-center justify-between">
					<Link
						href={BASE}
						className="text-2xl font-serif tracking-widest uppercase"
					>
						Aurum<span className="text-stone-400">.</span>
					</Link>

					<div className={cx("hidden md:flex gap-12", MICRO)}>
						<Link
							href={`${BASE}/colecao?operacao=comprar`}
							className={linkNav(ativo.comprar)}
						>
							Comprar
						</Link>
						<Link
							href={`${BASE}/colecao?operacao=alugar`}
							className={linkNav(ativo.alugar)}
						>
							Alugar
						</Link>
						<Link href={`${BASE}/vender`} className={linkNav(ativo.vender)}>
							Vender
						</Link>
						<Link
							href={`${BASE}/private-office`}
							className={linkNav(ativo.office)}
						>
							Private Office
						</Link>
					</div>

					<div className={cx("flex items-center gap-6 md:gap-8", MICRO)}>
						<Link
							href={`${BASE}/colecao?salvos=1`}
							aria-label={`Imóveis salvos: ${salvos.length}`}
							className="flex items-center gap-2 hover:text-stone-400 transition-colors"
						>
							<Bookmark
								size={16}
								className={salvos.length > 0 ? "fill-current" : undefined}
							/>
							<span className="hidden sm:inline">Salvos</span>
							{salvos.length > 0 ? <span>{contador}</span> : null}
						</Link>

						<button
							type="button"
							onClick={() => setAberto(true)}
							aria-expanded={aberto}
							aria-label="Abrir menu"
							className="flex items-center gap-2 hover:text-stone-400 transition-colors"
						>
							<span className="hidden sm:inline">Menu</span>
							<Menu size={20} />
						</button>
					</div>
				</div>
			</nav>

			{/* Overlay de menu — IRMÃO do <nav>, nunca filho: mix-blend-difference
			    cria um contexto de empilhamento e inverteria as cores daqui também.
			    z-[90] fica abaixo do pill "Voltar ao portfólio" (z-100), que segue
			    clicável por cima. */}
			<div
				id="aurum-menu"
				aria-hidden={!aberto}
				className={cx(
					"fixed inset-0 z-[90] bg-stone-950 text-white overflow-y-auto",
					"transition-[opacity,visibility] duration-500 ease-out",
					aberto ? "visible opacity-100" : "invisible opacity-0",
				)}
			>
				<div className="max-w-[1800px] mx-auto px-8">
					<div className="h-24 flex items-center justify-between">
						<Link
							href={BASE}
							className="text-2xl font-serif tracking-widest uppercase"
						>
							Aurum<span className="text-stone-400">.</span>
						</Link>
						<button
							ref={fecharRef}
							type="button"
							onClick={() => setAberto(false)}
							aria-label="Fechar menu"
							className={cx(
								MICRO,
								"flex items-center gap-2 hover:text-stone-400 transition-colors",
							)}
						>
							<span className="hidden sm:inline">Fechar</span>
							<X size={20} />
						</button>
					</div>

					{/* Escala calibrada para os sete itens caberem sem rolagem numa
					    janela de 900px — o menu deve ser lido de uma vez só. */}
					<div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 pt-10 pb-16 md:pt-14">
						<nav>
							<ul>
								{MENU_LINKS.map((item, i) => (
									<li key={item.label} className="overflow-hidden">
										<Link
											href={item.href}
											tabIndex={aberto ? undefined : -1}
											className="group block py-2 md:py-3"
										>
											<span
												style={{
													transitionDelay: aberto ? `${120 + i * 60}ms` : "0ms",
												}}
												className={cx(
													"flex items-baseline gap-6 transition-all duration-700 ease-out",
													aberto
														? "translate-y-0 opacity-100"
														: "translate-y-8 opacity-0",
												)}
											>
												<span className="text-[10px] font-bold tracking-[0.2em] text-stone-600 tabular-nums">
													{String(i + 1).padStart(2, "0")}
												</span>
												<span className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-stone-100 group-hover:text-stone-400 transition-colors">
													{item.label}
												</span>
											</span>
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Coluna discreta: escritório + salvos. */}
						<div
							style={{ transitionDelay: aberto ? "560ms" : "0ms" }}
							className={cx(
								"lg:w-64 lg:text-right transition-all duration-700 ease-out",
								aberto ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
							)}
						>
							<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 mb-4">
								Escritório
							</p>
							<p className="font-serif text-lg text-stone-300 leading-relaxed">
								Rua Haddock Lobo, 1626
								<br />
								Jardins — São Paulo
							</p>

							<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600 mt-10 mb-4">
								Atendimento reservado
							</p>
							<p className="font-serif text-lg text-stone-300 leading-relaxed">
								+55 11 3062 0099
								<br />
								privado@aurum.com.br
							</p>

							<Link
								href={`${BASE}/colecao?salvos=1`}
								tabIndex={aberto ? undefined : -1}
								className={cx(
									MICRO,
									"inline-flex items-center gap-2 mt-10 text-stone-400 border-b border-stone-700 pb-1 hover:text-white hover:border-white transition-colors",
								)}
							>
								<Bookmark
									size={14}
									className={salvos.length > 0 ? "fill-current" : undefined}
								/>
								Salvos {contador}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
