"use client";

import {
	Activity,
	LayoutDashboard,
	Menu,
	Settings,
	ShoppingBag,
	Users,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cx } from "../_lib/cx";
import { BuscaGlobal } from "./busca-global";
import { SinoNotificacoes } from "./sino-notificacoes";

const NAV = [
	{
		grupo: "Principal",
		itens: [
			{ href: "/demos/dashboard", rotulo: "Dashboard", icone: LayoutDashboard },
			{ href: "/demos/dashboard/clientes", rotulo: "Clientes", icone: Users },
			{ href: "/demos/dashboard/pedidos", rotulo: "Pedidos", icone: ShoppingBag },
		],
	},
	{
		grupo: "Sistema",
		itens: [
			{
				href: "/demos/dashboard/configuracoes",
				rotulo: "Configurações",
				icone: Settings,
			},
		],
	},
];

export function AppShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [menuAberto, setMenuAberto] = useState(false);

	// trocou de rota no mobile? fecha a gaveta sozinha
	useEffect(() => {
		setMenuAberto(false);
	}, [pathname]);

	// Esc fecha o menu mobile
	useEffect(() => {
		if (!menuAberto) return;
		const noTeclado = (evento: KeyboardEvent) => {
			if (evento.key === "Escape") setMenuAberto(false);
		};
		document.addEventListener("keydown", noTeclado);
		return () => document.removeEventListener("keydown", noTeclado);
	}, [menuAberto]);

	const ehAtiva = (href: string) =>
		href === "/demos/dashboard"
			? pathname === href
			: pathname.startsWith(href);

	return (
		<div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
			{/* Fundo escuro do menu mobile (abaixo da sidebar, acima do conteúdo) */}
			<div
				onClick={() => setMenuAberto(false)}
				aria-hidden
				className={cx(
					"fixed inset-0 z-20 bg-slate-900/50 transition-opacity duration-300 md:hidden",
					menuAberto ? "opacity-100" : "pointer-events-none opacity-0",
				)}
			/>

			{/* Sidebar: fixa no desktop, gaveta deslizante no mobile */}
			<aside
				className={cx(
					"fixed left-0 top-0 z-30 flex h-full w-64 flex-col bg-slate-900 text-slate-300 transition-transform duration-300 ease-out md:translate-x-0",
					menuAberto ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
					<Link
						href="/demos/dashboard"
						className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
					>
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500">
							<Activity className="text-white" size={18} />
						</div>
						ADMIN<span className="text-indigo-400">UI</span>
					</Link>
					<button
						type="button"
						onClick={() => setMenuAberto(false)}
						aria-label="Fechar menu"
						className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white md:hidden"
					>
						<X size={18} />
					</button>
				</div>

				<nav className="flex-1 space-y-2 overflow-y-auto p-4">
					{NAV.map((secao, i) => (
						<div key={secao.grupo}>
							<p
								className={cx(
									"mb-2 px-4 text-xs font-bold uppercase tracking-wider text-slate-500",
									i === 0 ? "mt-4" : "mt-8",
								)}
							>
								{secao.grupo}
							</p>
							{secao.itens.map((item) => {
								const ativa = ehAtiva(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										aria-current={ativa ? "page" : undefined}
										className={cx(
											"flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
											ativa
												? "border border-indigo-500/10 bg-indigo-600/10 font-medium text-indigo-400"
												: "border border-transparent hover:bg-slate-800 hover:text-white",
										)}
									>
										<item.icone size={20} /> {item.rotulo}
									</Link>
								);
							})}
						</div>
					))}
				</nav>

				{/*
				 * pb-32: o lab fixa DOIS elementos no canto inferior esquerdo (z-100) — o
				 * selo "demo — dados fictícios" e a pílula "Voltar ao portfólio" — e eles
				 * cairiam justo em cima deste bloco. O respiro extra mantém o perfil
				 * visível acima dos dois. (Era pb-20, dimensionado só pra pílula; o selo
				 * chegou depois e passou a cobrir o nome do usuário.)
				 */}
				<div className="border-t border-slate-800 p-4 pb-32">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-600 bg-slate-700 font-bold text-white">
							FP
						</div>
						<div>
							<p className="text-sm font-medium text-white">Fellipe Dev</p>
							<p className="text-xs text-slate-500">Admin Master</p>
						</div>
					</div>
				</div>
			</aside>

			{/* Conteúdo principal (offset da sidebar no desktop) */}
			<main className="flex min-h-screen flex-1 flex-col md:ml-64">
				<header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
					<div className="flex flex-1 items-center gap-3">
						<button
							type="button"
							onClick={() => setMenuAberto(true)}
							aria-label="Abrir menu"
							aria-expanded={menuAberto}
							className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
						>
							<Menu size={20} />
						</button>
						<BuscaGlobal />
					</div>
					<div className="flex items-center gap-4">
						<SinoNotificacoes />
					</div>
				</header>

				{/* pb-24 no mobile: espaço pra pílula "Voltar ao portfólio" não tapar conteúdo */}
				<div className="flex-1 overflow-y-auto p-6 pb-24 md:p-8">{children}</div>
			</main>
		</div>
	);
}
