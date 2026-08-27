import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Info, TriangleAlert } from "lucide-react";
import CodeBlock from "../../_components/CodeBlock";
import OnThisPage from "../../_components/OnThisPage";
import {
	DOCS_BASE,
	DOC_PAGES,
	getDocNeighbors,
	getDocPage,
	headingsOf,
	type Block,
} from "../../_components/docs-data";

export function generateStaticParams() {
	return DOC_PAGES.map((page) => ({ slug: page.slug }));
}

function renderBlock(block: Block, i: number) {
	switch (block.kind) {
		case "h2":
			return (
				<h2
					key={i}
					id={block.id}
					className="text-2xl font-bold tracking-tight mt-12 mb-4 scroll-mt-28"
				>
					{block.text}
				</h2>
			);

		case "p":
			return (
				<p key={i} className="text-slate-400 leading-relaxed mb-4">
					{block.text}
				</p>
			);

		case "code":
			return <CodeBlock key={i} lang={block.lang} code={block.code} />;

		case "list":
			return (
				<ul key={i} className="space-y-2 mb-4">
					{block.items.map((item) => (
						<li
							key={item}
							className="flex items-start gap-3 text-slate-400 leading-relaxed"
						>
							<ChevronRight
								size={16}
								className="text-purple-500 mt-1 shrink-0"
							/>
							{item}
						</li>
					))}
				</ul>
			);

		case "callout":
			return (
				<div
					key={i}
					className={`my-6 p-5 rounded-2xl border flex gap-4 ${
						block.tone === "warn"
							? "bg-pink-600/10 border-pink-500/30"
							: "bg-purple-600/10 border-purple-500/30"
					}`}
				>
					<span
						className={
							block.tone === "warn" ? "text-pink-400" : "text-purple-400"
						}
					>
						{block.tone === "warn" ? (
							<TriangleAlert size={18} />
						) : (
							<Info size={18} />
						)}
					</span>
					<div>
						<p className="font-medium mb-1 text-white">{block.title}</p>
						<p className="text-sm text-slate-400 leading-relaxed">
							{block.text}
						</p>
					</div>
				</div>
			);

		case "table":
			return (
				<div
					key={i}
					className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/5"
				>
					<table className="w-full text-sm min-w-[520px]">
						<thead>
							<tr className="border-b border-white/10">
								{block.head.map((h) => (
									<th
										key={h}
										className="text-left font-medium text-slate-400 px-5 py-3"
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{block.rows.map((row, r) => (
								<tr
									key={r}
									className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
								>
									{row.map((cell, c) => (
										<td
											key={c}
											className={`px-5 py-3 ${
												c === 0
													? "font-mono text-purple-300 whitespace-nowrap"
													: "text-slate-400"
											}`}
										>
											{cell}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			);
	}
}

export default async function DocArticlePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const page = getDocPage(slug);
	if (!page) notFound();

	const headings = headingsOf(page);
	const { prev, next } = getDocNeighbors(slug);

	return (
		<div className="grid xl:grid-cols-[1fr_200px] gap-10 min-w-0">
			<article className="min-w-0">
				<header className="pb-6 border-b border-white/5 mb-6">
					<h1 className="text-3xl font-bold tracking-tight mb-2">
						{page.title}
					</h1>
					<p className="text-slate-400">{page.description}</p>
				</header>

				{page.blocks.map(renderBlock)}

				{/* Prev / next */}
				<nav className="mt-16 pt-6 border-t border-white/5 grid sm:grid-cols-2 gap-4">
					{prev ? (
						<Link
							href={`${DOCS_BASE}/${prev.slug}`}
							className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors"
						>
							<span className="flex items-center gap-1 text-xs font-mono text-slate-500 mb-1">
								<ChevronLeft
									size={12}
									className="group-hover:-translate-x-1 transition-transform"
								/>
								PREVIOUS
							</span>
							<span className="font-medium">{prev.title}</span>
						</Link>
					) : (
						<span />
					)}

					{next && (
						<Link
							href={`${DOCS_BASE}/${next.slug}`}
							className="group p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors sm:text-right"
						>
							<span className="flex items-center gap-1 sm:justify-end text-xs font-mono text-slate-500 mb-1">
								NEXT
								<ChevronRight
									size={12}
									className="group-hover:translate-x-1 transition-transform"
								/>
							</span>
							<span className="font-medium">{next.title}</span>
						</Link>
					)}
				</nav>
			</article>

			<aside className="hidden xl:block">
				<OnThisPage headings={headings} />
			</aside>
		</div>
	);
}
