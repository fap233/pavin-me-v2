"use client";

// FAQ — quebra as objeções de quem vai contratar (prazo, acompanhamento pelo
// portal, pagamento, ajuste depois, o que precisa pra começar, tipos de projeto).
// Acordeão acessível: cada pergunta é um <button> (foco e Enter/Espaço nativos)
// com aria-expanded/aria-controls; a resposta é uma região rotulada pelo botão.

import { useState } from "react";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

export function FaqSection() {
	const { t } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.12);
	const [open, setOpen] = useState<Set<number>>(new Set([0]));

	const toggle = (i: number) =>
		setOpen((prev) => {
			const next = new Set(prev);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});

	return (
		<section
			id="faq"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 md:py-28 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<div className="in-view-anim in-view-anim-1 max-w-2xl">
					<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
						{t.faq.kicker}
					</p>
					<h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
						{t.faq.title}
					</h2>
					<p className="mt-4 text-muted-foreground">{t.faq.subtitle}</p>
				</div>

				<div className="in-view-anim in-view-anim-2 mt-10 space-y-3">
					{t.faq.items.map((item, i) => {
						const isOpen = open.has(i);
						const btnId = `faq-q-${i}`;
						const panelId = `faq-a-${i}`;
						return (
							<div
								key={i}
								className="overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-md transition-colors duration-300 data-[open=true]:border-[var(--brand-via)]/45"
								data-open={isOpen}
							>
								<h3 className="m-0">
									<button
										type="button"
										id={btnId}
										aria-expanded={isOpen}
										aria-controls={panelId}
										onClick={() => toggle(i)}
										className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none transition-colors hover:text-[var(--brand-via)] focus-visible:ring-2 focus-visible:ring-[var(--brand-via)]/40"
									>
										<span>{item.q}</span>
										<Plus
											aria-hidden="true"
											className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
												isOpen ? "rotate-45 text-[var(--brand-via)]" : ""
											}`}
										/>
									</button>
								</h3>

								{/* Truque grid 0fr→1fr: expande suave e mantém a resposta no DOM
								    (leitor de tela e busca acham o texto). */}
								<div
									id={panelId}
									role="region"
									aria-labelledby={btnId}
									aria-hidden={!isOpen}
									className={`grid transition-[grid-template-rows] duration-300 ease-out ${
										isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
									}`}
								>
									<div className="overflow-hidden">
										<p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
											{item.a}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
