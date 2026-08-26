"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { DOCS_BASE, DOC_SECTIONS, type DocSection } from "./docs-data";

/**
 * Sidebar da documentação: índice + busca que filtra de verdade.
 *
 * O filtro casa título, descrição e keywords de cada artigo (e o nome da
 * seção), e some com seções que ficaram vazias — em vez do teatro comum de
 * mostrar um input de busca que não faz nada.
 */
export default function DocsSidebar() {
	const pathname = usePathname();
	const [query, setQuery] = useState("");

	const filtered: DocSection[] = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return DOC_SECTIONS;

		return DOC_SECTIONS.map((section) => {
			const sectionHit = section.title.toLowerCase().includes(q);
			const pages = section.pages.filter(
				(page) =>
					sectionHit ||
					page.title.toLowerCase().includes(q) ||
					page.description.toLowerCase().includes(q) ||
					page.keywords.some((k) => k.includes(q)),
			);
			return { ...section, pages };
		}).filter((section) => section.pages.length > 0);
	}, [query]);

	const total = filtered.reduce((acc, s) => acc + s.pages.length, 0);

	return (
		<div className="lg:sticky lg:top-24 lg:self-start">
			<div className="relative mb-6">
				<Search
					size={16}
					className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
				/>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search the docs…"
					aria-label="Search the docs"
					className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-purple-500/60"
				/>
				{query && (
					<button
						type="button"
						onClick={() => setQuery("")}
						aria-label="Clear search"
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
					>
						<X size={14} />
					</button>
				)}
			</div>

			{query && (
				<p className="text-xs font-mono text-slate-500 mb-4">
					{total} {total === 1 ? "RESULT" : "RESULTS"}
				</p>
			)}

			{filtered.length === 0 ? (
				<p className="text-sm text-slate-400 leading-relaxed">
					Nothing matches{" "}
					<span className="text-white">&ldquo;{query}&rdquo;</span>. Try
					&ldquo;streaming&rdquo;, &ldquo;api key&rdquo; or &ldquo;429&rdquo;.
				</p>
			) : (
				<nav className="space-y-6">
					{filtered.map((section) => (
						<div key={section.title}>
							<h2 className="text-xs font-mono text-slate-500 mb-3">
								{section.title.toUpperCase()}
							</h2>
							<ul className="space-y-1 border-l border-white/10">
								{section.pages.map((page) => {
									const href = `${DOCS_BASE}/${page.slug}`;
									const active = pathname === href;
									return (
										<li key={page.slug}>
											<Link
												href={href}
												aria-current={active ? "page" : undefined}
												className={`block -ml-px border-l pl-4 py-1.5 text-sm transition-colors ${
													active
														? "border-purple-500 text-white font-medium"
														: "border-transparent text-slate-400 hover:text-white hover:border-purple-500/40"
												}`}
											>
												{page.title}
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					))}
				</nav>
			)}
		</div>
	);
}
