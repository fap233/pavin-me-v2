"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wallet, Menu, X, LogOut } from "lucide-react";
import { ACCOUNT, FT, cx, initials } from "./lumina";

const LINKS = [
	{ href: FT, label: "Pessoal" },
	{ href: `${FT}/business`, label: "Business" },
	{ href: `${FT}/cartoes`, label: "Cartões" },
	{ href: `${FT}/planos`, label: "Planos" },
];

export default function LuminaNav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	// Fecha o menu mobile ao trocar de rota.
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	const isActive = (href: string) =>
		href === FT ? pathname === FT : pathname.startsWith(href);

	// Dentro da área logada a barra vira "conta": avatar + sair.
	const loggedIn = pathname.startsWith(`${FT}/app`);

	return (
		<nav className="fixed w-full z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link
					href={FT}
					className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600"
				>
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
						<Wallet size={18} />
					</div>
					Lumina.
				</Link>

				<div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
					{LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={cx(
								"relative py-1 transition-colors hover:text-blue-600",
								isActive(link.href) && "text-blue-600",
							)}
						>
							{link.label}
							{isActive(link.href) && (
								<span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
							)}
						</Link>
					))}
				</div>

				<div className="flex items-center gap-4">
					{loggedIn ? (
						<>
							<div className="hidden sm:flex items-center gap-3">
								<div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
									{initials(ACCOUNT.holder)}
								</div>
								<div className="text-left leading-tight">
									<div className="text-sm font-semibold text-slate-900">
										{ACCOUNT.holder}
									</div>
									<div className="text-[11px] text-slate-500 font-mono">
										Ag. {ACCOUNT.agencia} · C/C {ACCOUNT.conta}
									</div>
								</div>
							</div>
							<Link
								href={FT}
								className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
								aria-label="Sair da conta"
							>
								<LogOut size={16} />
								<span className="hidden sm:inline">Sair</span>
							</Link>
						</>
					) : (
						<>
							<Link
								href={`${FT}/login`}
								className={cx(
									"hidden md:block font-medium transition-colors hover:text-slate-900",
									isActive(`${FT}/login`) ? "text-slate-900" : "text-slate-600",
								)}
							>
								Login
							</Link>
							<Link
								href={`${FT}/abrir-conta`}
								className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
							>
								Abrir conta
							</Link>
						</>
					)}

					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-label={open ? "Fechar menu" : "Abrir menu"}
						aria-expanded={open}
						className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-200/60 transition-colors"
					>
						{open ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Menu mobile */}
			{open && (
				<div className="md:hidden border-t border-slate-200 bg-slate-50/95 backdrop-blur-md lumina-fade-in">
					<div className="px-6 py-4 flex flex-col gap-1">
						{LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={cx(
									"px-3 py-3 rounded-xl text-base font-medium transition-colors",
									isActive(link.href)
										? "bg-blue-50 text-blue-600"
										: "text-slate-600 hover:bg-slate-100",
								)}
							>
								{link.label}
							</Link>
						))}

						<div className="h-px bg-slate-200 my-2" />

						{loggedIn ? (
							<Link
								href={FT}
								className="px-3 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-100"
							>
								Sair da conta
							</Link>
						) : (
							<>
								<Link
									href={`${FT}/login`}
									className="px-3 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-100"
								>
									Login
								</Link>
								<Link
									href={`${FT}/abrir-conta`}
									className="mt-1 bg-slate-900 text-white px-5 py-3 rounded-xl text-center text-sm font-semibold hover:bg-slate-800 transition-all"
								>
									Abrir conta
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
