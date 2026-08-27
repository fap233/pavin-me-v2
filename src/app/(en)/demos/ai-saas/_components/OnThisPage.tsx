"use client";

import { useEffect, useState } from "react";

/**
 * Lista "On this page".
 *
 * Os links são âncoras nativas (#id) porque o layout raiz do site já roteia
 * clique em a[href^="#"] pro Lenis, com offset pra não passar por baixo da nav
 * fixa. Aqui só cuidamos do highlight da seção visível, via IntersectionObserver.
 */
export default function OnThisPage({
	headings,
}: {
	headings: { id: string; text: string }[];
}) {
	const [active, setActive] = useState(headings[0]?.id ?? "");

	useEffect(() => {
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActive(visible[0].target.id);
			},
			{ rootMargin: "-96px 0px -65% 0px", threshold: 0 },
		);

		const nodes = headings
			.map((h) => document.getElementById(h.id))
			.filter((n): n is HTMLElement => n !== null);

		nodes.forEach((n) => observer.observe(n));
		return () => observer.disconnect();
	}, [headings]);

	if (headings.length === 0) return null;

	return (
		<nav aria-label="On this page" className="lg:sticky lg:top-24">
			<h2 className="text-xs font-mono text-slate-500 mb-3">ON THIS PAGE</h2>
			<ul className="space-y-1 border-l border-white/10">
				{headings.map((h) => (
					<li key={h.id}>
						<a
							href={`#${h.id}`}
							className={`block -ml-px border-l pl-4 py-1.5 text-sm transition-colors ${
								active === h.id
									? "border-purple-500 text-white"
									: "border-transparent text-slate-400 hover:text-white hover:border-purple-500/40"
							}`}
						>
							{h.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
