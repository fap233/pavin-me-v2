"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check, Mail, Phone, Wallet } from "lucide-react";
import { FT, cx, isValidEmail } from "./lumina";

const PRODUTOS = [
	{ href: FT, label: "Conta digital" },
	{ href: `${FT}/cartoes`, label: "Cartões" },
	{ href: `${FT}/planos`, label: "Planos e tarifas" },
	{ href: `${FT}/black`, label: "Lumina Black" },
];

const CONTA = [
	{ href: `${FT}/abrir-conta`, label: "Abrir conta" },
	{ href: `${FT}/login`, label: "Entrar" },
	{ href: `${FT}/app`, label: "Meu extrato" },
	{ href: `${FT}/business`, label: "Conta PJ" },
];

export default function LuminaFooter() {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [done, setDone] = useState(false);

	function subscribe(e: React.FormEvent) {
		e.preventDefault();
		if (!isValidEmail(email)) {
			setError("Informe um e-mail válido.");
			return;
		}
		setError("");
		setDone(true);
	}

	return (
		<footer className="bg-white border-t border-slate-200">
			<div className="max-w-7xl mx-auto px-6 pt-16">
				<div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
					{/* Marca + newsletter */}
					<div className="lg:col-span-1">
						<div className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
							<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
								<Wallet size={18} />
							</div>
							Lumina.
						</div>
						<p className="mt-4 text-sm text-slate-500 leading-relaxed max-w-xs">
							O banco que amplia sua visão. Sem taxas ocultas, sem agências
							lotadas.
						</p>
						<div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-green-600">
							<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							Todos os sistemas operando
						</div>
					</div>

					{/* Produtos */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-5">
							Produtos
						</h3>
						<ul className="space-y-3 text-sm text-slate-500">
							{PRODUTOS.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										className="hover:text-blue-600 transition-colors"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Conta */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-5">
							Sua conta
						</h3>
						<ul className="space-y-3 text-sm text-slate-500">
							{CONTA.map((item) => (
								<li key={item.label}>
									<Link
										href={item.href}
										className="hover:text-blue-600 transition-colors"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Newsletter + contato */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-5">
							Novidades
						</h3>

						{done ? (
							<div className="flex items-start gap-3 rounded-2xl bg-green-50 border border-green-100 p-4 lumina-fade-up">
								<div className="w-8 h-8 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-600">
									<Check size={16} />
								</div>
								<div className="text-sm">
									<p className="font-semibold text-slate-900">
										Inscrição confirmada
									</p>
									<p className="text-slate-500 text-xs mt-0.5">
										Vamos avisar você sobre novos recursos.
									</p>
								</div>
							</div>
						) : (
							<form onSubmit={subscribe} noValidate>
								<div className="flex gap-2">
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (error) setError("");
										}}
										placeholder="seu@email.com"
										aria-label="Seu e-mail"
										aria-invalid={!!error}
										className={cx(
											"w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all",
											error
												? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
												: "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
										)}
									/>
									<button
										type="submit"
										aria-label="Inscrever"
										className="shrink-0 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
									>
										<ArrowUpRight size={18} />
									</button>
								</div>
								{error && (
									<p className="mt-1.5 text-xs font-semibold text-red-500">
										{error}
									</p>
								)}
							</form>
						)}

						<div className="mt-6 space-y-3 text-sm text-slate-500">
							<a
								href="mailto:ola@lumina.com.br"
								className="flex items-center gap-2 hover:text-blue-600 transition-colors"
							>
								<Mail size={15} /> ola@lumina.com.br
							</a>
							<a
								href="tel:+551140028922"
								className="flex items-center gap-2 hover:text-blue-600 transition-colors"
							>
								<Phone size={15} /> 0800 402 8922
							</a>
						</div>
					</div>
				</div>

				{/* Barra inferior — pb generoso pra não brigar com a pílula
				    "Voltar ao portfólio", que é fixa no canto inferior esquerdo. */}
				<div className="mt-14 border-t border-slate-100 pt-8 pb-28 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-slate-400">
					<p>
						© 2026 Lumina Instituição de Pagamento S.A. · CNPJ
						48.902.117/0001-30
					</p>
					<p className="md:text-right">
						Projeto fictício de demonstração — não é uma instituição financeira
						real.
					</p>
				</div>
			</div>
		</footer>
	);
}
