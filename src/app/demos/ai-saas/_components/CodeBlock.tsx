"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CodeBlock({
	lang,
	code,
}: {
	lang: string;
	code: string;
}) {
	const [copied, setCopied] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(
		() => () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		},
		[],
	);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(() => setCopied(false), 1600);
		} catch {
			/* clipboard indisponível (http, permissão) — não quebra a página */
		}
	}

	return (
		<div className="my-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden">
			<div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
				<span className="text-[11px] font-mono text-slate-500">
					{lang.toUpperCase()}
				</span>
				<button
					type="button"
					onClick={copy}
					className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
				>
					{copied ? <Check size={12} /> : <Copy size={12} />}
					{copied ? "COPIED" : "COPY"}
				</button>
			</div>
			<pre className="p-5 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-slate-300">
				{code}
			</pre>
		</div>
	);
}
