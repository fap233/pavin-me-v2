"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus } from "lucide-react";

import { useCart } from "./CartProvider";
import type { Product } from "./data";

/**
 * Botão "Adicionar" com confirmação inline.
 *
 * O feedback é local (não um toast global) de propósito: o cliente clica em
 * quatro cards seguidos e vê cada um confirmar no lugar, sem uma pilha de
 * notificações cobrindo a tela — e sem competir com a pílula fixa do portfólio.
 */
export function AddButton({
	product,
	variant = "solid",
	label = "Adicionar",
	className = "",
}: {
	product: Product;
	variant?: "solid" | "outline";
	label?: string;
	className?: string;
}) {
	const { add, qtyOf, hydrated } = useCart();
	const [justAdded, setJustAdded] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	const qty = hydrated ? qtyOf(product.id) : 0;

	function handleAdd() {
		add(product, 1);
		setJustAdded(true);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setJustAdded(false), 1600);
	}

	const base =
		"font-sans text-xs uppercase tracking-widest rounded-sm px-5 py-3 flex items-center justify-center gap-2 transition-colors duration-300 active:scale-[0.98] cursor-pointer";

	const skin = justAdded
		? "bg-orange-700 text-[#FDF8F5]"
		: variant === "solid"
			? "bg-stone-900 text-[#FDF8F5] hover:bg-orange-800"
			: "border border-stone-300 text-stone-700 hover:border-orange-700 hover:text-orange-700";

	return (
		<button
			type="button"
			onClick={handleAdd}
			aria-label={`Adicionar ${product.name} ao pedido`}
			className={`${base} ${skin} ${className}`}
		>
			{justAdded ? (
				<>
					<Check size={14} strokeWidth={3} />
					Adicionado
				</>
			) : (
				<>
					<Plus size={14} strokeWidth={3} />
					{label}
					{qty > 0 && (
						<span
							className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
								variant === "solid"
									? "bg-[#FDF8F5]/20 text-[#FDF8F5]"
									: "bg-orange-700/10 text-orange-800"
							}`}
						>
							{qty}
						</span>
					)}
				</>
			)}
		</button>
	);
}
