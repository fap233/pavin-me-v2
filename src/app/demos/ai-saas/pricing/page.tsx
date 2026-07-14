"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ChevronDown, ChevronRight, Minus } from "lucide-react";
import { BASE } from "../_components/site";

type Cycle = "monthly" | "annual";

const ANNUAL_DISCOUNT = 0.2; // 20% off quando pago no anual

const TIERS = [
	{
		id: "starter",
		name: "Starter",
		monthly: 29,
		tagline: "For solo builders shipping their first agent.",
		highlight: false,
		perks: [
			"1 workspace, 3 agents",
			"50k tokens / month included",
			"nexus-1-turbo model",
			"Community support",
			"7-day run history",
		],
	},
	{
		id: "pro",
		name: "Pro",
		monthly: 99,
		tagline: "For teams running agents in production.",
		highlight: true,
		perks: [
			"5 workspaces, unlimited agents",
			"1M tokens / month included",
			"All models, including nexus-1-pro",
			"Priority support (4h SLA)",
			"90-day run history + traces",
			"Custom tools & webhooks",
		],
	},
	{
		id: "enterprise",
		name: "Enterprise",
		monthly: 499,
		tagline: "For orgs with compliance and scale needs.",
		highlight: false,
		perks: [
			"Unlimited workspaces",
			"Volume token pricing",
			"Dedicated capacity + private region",
			"24/7 support, 30-min SLA",
			"SSO/SAML, audit logs, SOC 2 report",
			"Named solutions engineer",
		],
	},
];

const COMPARISON: { label: string; values: (string | boolean)[] }[] = [
	{ label: "Included tokens / month", values: ["50k", "1M", "Custom"] },
	{ label: "Requests per minute", values: ["60", "600", "Custom"] },
	{ label: "Concurrent runs", values: ["3", "25", "Unlimited"] },
	{ label: "Streaming API", values: [true, true, true] },
	{ label: "Custom tools & webhooks", values: [false, true, true] },
	{ label: "Run traces & replay", values: [false, true, true] },
	{ label: "SSO / SAML", values: [false, false, true] },
	{ label: "Audit logs", values: [false, false, true] },
	{ label: "Private region", values: [false, false, true] },
	{ label: "Support", values: ["Community", "4h SLA", "30-min SLA"] },
];

const FAQ = [
	{
		q: "What counts as a token?",
		a: "Roughly four characters of English text. Both the prompt you send and the completion the model returns are billed. The Playground shows the exact count for every run, so you can size your bill before writing a line of code.",
	},
	{
		q: "What happens when I hit my included tokens?",
		a: "Nothing breaks. Overage is billed at $0.60 per 100k tokens on Starter and $0.40 on Pro. You can also set a hard cap in the workspace settings and the API will return a 429 instead of charging you.",
	},
	{
		q: "Can I switch plans mid-cycle?",
		a: "Yes. Upgrades take effect immediately and we prorate the difference. Downgrades apply at the end of the current billing period, so you keep the higher limits until then.",
	},
	{
		q: "Is there a free trial?",
		a: "Every new workspace starts with 5,000 free tokens and full access to nexus-1-pro for 14 days. No credit card required to sign up.",
	},
	{
		q: "Do you train on my data?",
		a: "Never. Prompts and completions are encrypted at rest, retained only for the run-history window of your plan, and are never used to train models. Enterprise workspaces can set retention to zero.",
	},
];

function formatPrice(monthly: number, cycle: Cycle) {
	const value = cycle === "annual" ? monthly * (1 - ANNUAL_DISCOUNT) : monthly;
	return Math.round(value);
}

export default function PricingPage() {
	const [cycle, setCycle] = useState<Cycle>("monthly");
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	return (
		<>
			{/* Hero */}
			<section className="pt-32 pb-12 px-6 relative overflow-hidden">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-6">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						Save 20% with annual billing
					</div>

					<h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
						Pricing that scales{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							with your agents
						</span>
					</h1>
					<p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
						Start free. Pay only when your agents go to work. No seat licenses,
						no hidden inference markup.
					</p>

					{/* Toggle */}
					<div
						role="group"
						aria-label="Billing cycle"
						className="inline-flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10"
					>
						{(["monthly", "annual"] as Cycle[]).map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setCycle(c)}
								aria-pressed={cycle === c}
								className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
									cycle === c
										? "bg-purple-600 text-white"
										: "text-slate-400 hover:text-white"
								}`}
							>
								{c === "monthly" ? "Monthly" : "Annual"}
								{c === "annual" && (
									<span
										className={`ml-2 text-xs ${
											cycle === "annual" ? "text-purple-200" : "text-purple-400"
										}`}
									>
										−20%
									</span>
								)}
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Tiers */}
			<section className="pb-20 px-6">
				<div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
					{TIERS.map((tier) => (
						<div
							key={tier.id}
							className={`relative p-6 rounded-2xl border transition-colors ${
								tier.highlight
									? "bg-gradient-to-b from-purple-600/15 to-white/5 border-purple-500/40"
									: "bg-white/5 border-white/5 hover:border-purple-500/30"
							}`}
						>
							{tier.highlight && (
								<span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-600 text-white">
									Most popular
								</span>
							)}

							<h2 className="text-xl font-semibold mb-1">{tier.name}</h2>
							<p className="text-sm text-slate-400 mb-6 min-h-[40px]">
								{tier.tagline}
							</p>

							<div className="flex items-end gap-1 mb-1">
								<span className="text-4xl font-bold tracking-tight">
									${formatPrice(tier.monthly, cycle)}
								</span>
								<span className="text-slate-400 mb-1 text-sm">/ month</span>
							</div>
							<p className="text-xs text-slate-500 font-mono mb-6 h-4">
								{cycle === "annual"
									? `BILLED $${formatPrice(tier.monthly, cycle) * 12} YEARLY`
									: "BILLED MONTHLY"}
							</p>

							<Link
								href={`${BASE}/signup`}
								className={`block text-center px-6 py-3 rounded-lg font-medium transition-all mb-6 ${
									tier.highlight
										? "bg-purple-600 hover:bg-purple-700 text-white"
										: "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
								}`}
							>
								{tier.id === "enterprise" ? "Talk to sales" : "Start free trial"}
							</Link>

							<ul className="space-y-3">
								{tier.perks.map((perk) => (
									<li
										key={perk}
										className="flex items-start gap-3 text-sm text-slate-300"
									>
										<Check
											size={16}
											className="text-purple-500 mt-0.5 shrink-0"
										/>
										{perk}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</section>

			{/* Comparison table */}
			<section
				id="compare"
				className="py-20 px-6 bg-slate-900/50 border-y border-white/5 scroll-mt-24"
			>
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl font-bold tracking-tight mb-2 text-center">
						Compare every plan
					</h2>
					<p className="text-slate-400 text-center mb-10">
						Prices shown for {cycle === "annual" ? "annual" : "monthly"} billing.
					</p>

					<div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
						<table className="w-full text-sm min-w-[640px]">
							<thead>
								<tr className="border-b border-white/10">
									<th className="text-left font-medium text-slate-400 px-6 py-4">
										Feature
									</th>
									{TIERS.map((t) => (
										<th key={t.id} className="px-6 py-4 text-left">
											<span
												className={
													t.highlight ? "text-purple-300" : "text-white"
												}
											>
												{t.name}
											</span>
											<span className="block text-xs font-normal text-slate-500 font-mono">
												${formatPrice(t.monthly, cycle)}/MO
											</span>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{COMPARISON.map((row) => (
									<tr
										key={row.label}
										className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
									>
										<td className="px-6 py-4 text-slate-300">{row.label}</td>
										{row.values.map((v, i) => (
											<td key={i} className="px-6 py-4">
												{v === true ? (
													<Check size={16} className="text-purple-500" />
												) : v === false ? (
													<Minus size={16} className="text-slate-600" />
												) : (
													<span className="text-slate-300">{v}</span>
												)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section id="faq" className="py-20 px-6 scroll-mt-24">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
						Frequently asked questions
					</h2>

					<div className="space-y-3">
						{FAQ.map((item, i) => {
							const open = openFaq === i;
							return (
								<div
									key={item.q}
									className={`rounded-2xl border transition-colors ${
										open
											? "bg-white/5 border-purple-500/30"
											: "bg-white/5 border-white/5 hover:border-purple-500/20"
									}`}
								>
									<button
										type="button"
										onClick={() => setOpenFaq(open ? null : i)}
										aria-expanded={open}
										className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
									>
										<span className="font-medium">{item.q}</span>
										<ChevronDown
											size={18}
											className={`shrink-0 text-purple-400 transition-transform duration-300 ${
												open ? "rotate-180" : ""
											}`}
										/>
									</button>
									<div
										className={`grid transition-all duration-300 ease-out ${
											open
												? "grid-rows-[1fr] opacity-100"
												: "grid-rows-[0fr] opacity-0"
										}`}
									>
										<div className="overflow-hidden">
											<p className="px-6 pb-5 text-slate-400 leading-relaxed">
												{item.a}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className="mt-12 text-center">
						<p className="text-slate-400 mb-4">Still deciding?</p>
						<Link
							href={`${BASE}/playground`}
							className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all group"
						>
							Try the models for free
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
