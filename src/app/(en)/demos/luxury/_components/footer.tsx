"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cx, MICRO } from "./ui";

const BASE = "/demos/luxury";

const NAVEGACAO = [
	{ href: `${BASE}/colecao?operacao=comprar`, label: "Comprar" },
	{ href: `${BASE}/colecao?operacao=alugar`, label: "Alugar" },
	{ href: `${BASE}/vender`, label: "Vender" },
	{ href: `${BASE}/private-office`, label: "Private Office" },
	{ href: `${BASE}/contato`, label: "Contato" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function LuxuryFooter() {
	const [email, setEmail] = useState("");
	const [erro, setErro] = useState("");
	const [assinado, setAssinado] = useState(false);

	function assinar(e: React.FormEvent) {
		e.preventDefault();
		if (!EMAIL_RE.test(email.trim())) {
			setErro("Informe um e-mail válido");
			return;
		}
		setErro("");
		setAssinado(true);
	}

	return (
		<footer className="bg-stone-50 border-t border-stone-200">
			<div className="max-w-[1800px] mx-auto px-8 md:px-12 py-20 md:py-24">
				<div className="grid md:grid-cols-3 gap-16 md:gap-8 mb-20">
					<div>
						<Link
							href={BASE}
							className="text-2xl font-serif tracking-widest uppercase text-stone-900"
						>
							Aurum<span className="text-stone-400">.</span>
						</Link>
						<p className="mt-6 max-w-xs text-stone-500 font-serif leading-relaxed">
							Curadoria de imóveis de exceção em São Paulo, Rio de Janeiro e no
							litoral. Do primeiro café à escritura.
						</p>
					</div>

					<nav>
						<p className={cx(MICRO, "text-stone-400 mb-6")}>Navegação</p>
						<ul className="space-y-3">
							{NAVEGACAO.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										className="font-serif text-lg text-stone-700 hover:text-stone-900 transition-colors"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<p className={cx(MICRO, "text-stone-400 mb-6")}>A curadoria</p>
						{assinado ? (
							<p className="font-serif text-lg text-stone-700 leading-relaxed">
								Inscrição confirmada.
								<br />
								<span className="text-stone-400">
									Você receberá as próximas entradas em primeira mão.
								</span>
							</p>
						) : (
							<>
								<p className="font-serif text-lg text-stone-500 leading-relaxed mb-6">
									Imóveis off-market, antes do anúncio.
								</p>
								<form onSubmit={assinar} noValidate>
									<div className="flex items-center border-b border-stone-300 focus-within:border-stone-900 transition-colors">
										<label htmlFor="footer-email" className="sr-only">
											Seu e-mail
										</label>
										<input
											id="footer-email"
											type="email"
											value={email}
											onChange={(e) => {
												setEmail(e.target.value);
												if (erro) setErro("");
											}}
											placeholder="seu@email.com"
											className="flex-1 bg-transparent py-3 font-serif text-lg text-stone-800 placeholder-stone-300 outline-none"
										/>
										<button
											type="submit"
											aria-label="Assinar a curadoria"
											className="p-2 text-stone-900 hover:text-stone-500 transition-colors"
										>
											<ArrowRight size={18} />
										</button>
									</div>
									{erro ? (
										<p className="mt-2 text-[10px] uppercase tracking-wider font-bold text-rose-900/80">
											{erro}
										</p>
									) : null}
								</form>
							</>
						)}
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-stone-200">
					<div className="flex gap-8 text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-stone-900 transition-colors"
						>
							Instagram
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-stone-900 transition-colors"
						>
							LinkedIn
						</a>
						<Link
							href={`${BASE}/contato`}
							className="hover:text-stone-900 transition-colors"
						>
							Contato
						</Link>
					</div>
					<p className="text-[10px] text-stone-400">
						© 2026 Aurum Real Estate. CRECI 12.345-J
					</p>
				</div>
			</div>
		</footer>
	);
}
