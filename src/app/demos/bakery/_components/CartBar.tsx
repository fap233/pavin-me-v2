"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { useCart } from "./CartProvider";
import { formatBRL } from "./data";

/**
 * Barra flutuante do pedido.
 *
 * Fica embaixo à DIREITA: o canto inferior esquerdo é da pílula "Voltar ao
 * portfólio" (z-100, injetada pelo layout do lab) e não pode ser coberto.
 * Some quando o carrinho está vazio e quando você já está no /pedido.
 */
export function CartBar() {
	const { count, subtotal, hydrated } = useCart();

	if (!hydrated || count === 0) return null;

	return (
		<Link
			href="/demos/bakery/pedido"
			className="farine-pop group fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-sm bg-stone-900 px-5 py-3 font-sans text-sm text-[#FDF8F5] shadow-[0_16px_40px_-12px_rgba(28,25,23,0.55)] transition-colors hover:bg-orange-800"
		>
			<span className="relative">
				<ShoppingBag size={18} />
				<span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-700 px-1 text-[10px] font-bold group-hover:bg-stone-900">
					{count}
				</span>
			</span>
			<span className="hidden sm:inline text-stone-300 group-hover:text-orange-100">
				Ver pedido
			</span>
			<span className="font-bold tracking-wide">{formatBRL(subtotal)}</span>
			<ArrowRight
				size={16}
				className="transition-transform group-hover:translate-x-1"
			/>
		</Link>
	);
}
