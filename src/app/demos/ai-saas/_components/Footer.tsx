"use client";

import Link from "next/link";
import { Bot, Check } from "lucide-react";
import { useState } from "react";
import { BASE } from "./site";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
	{
		title: "Product",
		links: [
			{ label: "Features", href: `${BASE}/features` },
			{ label: "Playground", href: `${BASE}/playground` },
			{ label: "Pricing", href: `${BASE}/pricing` },
		],
	},
	{
		title: "Developers",
		links: [
			{ label: "Quickstart", href: `${BASE}/docs/quickstart` },
			{ label: "API Reference", href: `${BASE}/docs/api-reference` },
			{ label: "SDKs", href: `${BASE}/docs/sdks` },
			{ label: "Rate limits", href: `${BASE}/docs/rate-limits` },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "Early Access", href: `${BASE}/signup` },
			{ label: "Enterprise plan", href: `${BASE}/pricing#compare` },
			{ label: "FAQ", href: `${BASE}/pricing#faq` },
		],
	},
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export default function Footer() {
	const [email, setEmail] = useState("");
	const [state, setState] = useState<"idle" | "error" | "done">("idle");

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!EMAIL_RE.test(email.trim())) {
			setState("error");
			return;
		}
		setState("done");
	}

	return (
		<footer className="border-t border-white/5 bg-slate-950">
			<div className="max-w-7xl mx-auto px-6 py-14">
				<div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
					<div>
						<div className="flex items-center gap-2 font-bold text-xl tracking-tighter mb-4">
							<Bot className="text-purple-500" />
							<span>
								NEXUS<span className="text-purple-500">AI</span>
							</span>
						</div>
						<p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
							Autonomous agents that learn, adapt, and execute your workflows —
							10x faster than humans.
						</p>

						{state === "done" ? (
							<p className="flex items-center gap-2 text-sm text-purple-300">
								<Check size={16} className="text-purple-500" />
								You are on the list. We will email you soon.
							</p>
						) : (
							<form onSubmit={submit} className="max-w-xs">
								<div className="flex gap-2">
									<input
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (state === "error") setState("idle");
										}}
										placeholder="you@company.com"
										aria-label="Email for product updates"
										aria-invalid={state === "error"}
										className={`flex-1 min-w-0 bg-white/5 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-purple-500/60 ${
											state === "error"
												? "border-pink-500/60"
												: "border-white/10"
										}`}
									/>
									<button
										type="submit"
										className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
									>
										Notify me
									</button>
								</div>
								{state === "error" && (
									<p className="mt-2 text-xs text-pink-400">
										Enter a valid email address.
									</p>
								)}
							</form>
						)}
					</div>

					{COLUMNS.map((col) => (
						<div key={col.title}>
							<h3 className="text-sm font-semibold mb-4 text-white">
								{col.title}
							</h3>
							<ul className="space-y-3 text-sm text-slate-400">
								{col.links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="hover:text-white transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
					<p>© 2024 Nexus AI Inc. All rights reserved.</p>
					<span className="inline-flex items-center gap-2 font-mono text-xs">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						ALL SYSTEMS OPERATIONAL
					</span>
				</div>
			</div>
		</footer>
	);
}
