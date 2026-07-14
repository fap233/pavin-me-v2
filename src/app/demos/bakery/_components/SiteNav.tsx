"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

import { useCart } from "./CartProvider";

/**
 * Navegação da Farine — a mesma em todas as páginas da demo (montada no layout).
 *
 * Marca a rota atual via usePathname e mostra o contador do carrinho ao vivo.
 * O contador só aparece depois de `hydrated`: o servidor renderiza carrinho
 * vazio e o número real vem do localStorage no cliente.
 */

const LINKS = [
	{ href: "/demos/bakery/cardapio", label: "MENU" },
	{ href: "/demos/bakery/historia", label: "NOSSA HISTÓRIA" },
	{ href: "/demos/bakery/locais", label: "LOCAIS" },
] as const;

export function SiteNav() {
	const pathname = usePathname();
	const { count, hydrated } = useCart();
	const [open, setOpen] = useState(false);

	// Trocou de rota, fecha o menu mobile.
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	// Menu mobile aberto trava o scroll do body.
	useEffect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = previous;
		};
	}, [open]);

	const isActive = (href: string) => pathname === href;
	const cartActive = pathname === "/demos/bakery/pedido";
	const badge = hydrated && count > 0 ? count : null;

	return (
		<nav className="fixed w-full z-50 bg-[#FDF8F5]/90 backdrop-blur-sm border-b border-stone-200">
			<div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link
					href="/demos/bakery"
					className="text-2xl font-bold tracking-widest text-stone-900 uppercase hover:text-orange-800 transition-colors"
				>
					Farine<span className="text-orange-700">.</span>
				</Link>

				<div className="hidden md:flex gap-8 font-sans text-sm tracking-wide text-stone-600 font-medium">
					{LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							aria-current={isActive(link.href) ? "page" : undefined}
							className={`relative py-1 transition-colors hover:text-orange-700 ${
								isActive(link.href) ? "text-orange-700" : ""
							}`}
						>
							{link.label}
							<span
								className={`absolute -bottom-0.5 left-0 h-px bg-orange-700 transition-all duration-300 ${
									isActive(link.href) ? "w-full" : "w-0"
								}`}
							/>
						</Link>
					))}
				</div>

				<div className="flex items-center gap-3">
					<Link
						href="/demos/bakery/pedido"
						aria-current={cartActive ? "page" : undefined}
						className={`relative px-6 py-2 rounded-sm font-sans text-sm transition-colors flex items-center gap-2 ${
							cartActive
								? "bg-orange-800 text-[#FDF8F5]"
								: "bg-stone-900 text-[#FDF8F5] hover:bg-orange-800"
						}`}
					>
						<ShoppingBag size={15} className="md:hidden" />
						<span className="hidden md:inline">PEÇA ONLINE</span>
						<span className="md:hidden">PEDIDO</span>
						{badge !== null && (
							<span
								key={badge}
								className="farine-pop absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-orange-700 text-[#FDF8F5] font-sans text-[11px] font-bold flex items-center justify-center border-2 border-[#FDF8F5]"
								aria-label={`${badge} ${badge === 1 ? "item" : "itens"} no pedido`}
							>
								{badge}
							</span>
						)}
					</Link>

					<button
						type="button"
						onClick={() => setOpen((value) => !value)}
						aria-expanded={open}
						aria-label={open ? "Fechar menu" : "Abrir menu"}
						className="md:hidden w-10 h-10 flex items-center justify-center rounded-sm border border-stone-300 text-stone-700 hover:border-orange-700 hover:text-orange-700 transition-colors cursor-pointer"
					>
						{open ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			{/* Menu mobile de verdade: abre, navega e fecha. */}
			<div
				className={`md:hidden overflow-hidden border-t border-stone-200 bg-[#FDF8F5] transition-[max-height,opacity] duration-300 ${
					open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="px-6 py-4 flex flex-col font-sans text-sm tracking-wide">
					{LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`py-3 border-b border-stone-200/70 transition-colors ${
								isActive(link.href)
									? "text-orange-700 font-semibold"
									: "text-stone-600 hover:text-orange-700"
							}`}
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/demos/bakery/pedido"
						className={`py-3 flex items-center justify-between transition-colors ${
							cartActive
								? "text-orange-700 font-semibold"
								: "text-stone-600 hover:text-orange-700"
						}`}
					>
						MEU PEDIDO
						<span className="text-orange-700 font-bold">
							{badge !== null ? `${badge}` : "0"}
						</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
