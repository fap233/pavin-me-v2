"use client";

// Folha cliente mínima: as páginas de serviço são server components, mas a
// entrada suave (.in-view-anim) depende de um ancestral com data-in-view.
// Este wrapper observa a viewport e liga o atributo; os filhos usam as
// classes in-view-anim / in-view-anim-N normalmente.

import type { ReactNode } from "react";
import { useInView } from "@/lib/useInView";

type Props = {
	children: ReactNode;
	className?: string;
	id?: string;
	as?: "section" | "div";
	threshold?: number;
};

export function Reveal({
	children,
	className,
	id,
	as = "div",
	threshold = 0.12,
}: Props) {
	const { ref, inView } = useInView<HTMLElement>(threshold);
	const Tag = as;
	return (
		<Tag
			id={id}
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className={className}
		>
			{children}
		</Tag>
	);
}
