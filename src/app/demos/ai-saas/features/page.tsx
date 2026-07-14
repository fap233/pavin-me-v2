"use client";

import Link from "next/link";
import { useState } from "react";
import {
	Activity,
	Bot,
	ChevronRight,
	Cpu,
	GitBranch,
	Plug,
	Shield,
	Terminal,
	Zap,
} from "lucide-react";
import { BASE } from "../_components/site";

const TABS = [
	{
		id: "runtime",
		label: "Agent runtime",
		title: "Agents that plan, call tools, and settle",
		desc: "Describe the outcome, attach the tools, and the runtime handles the loop: plan, call, observe, adjust. Every step is recorded, so a run is never a black box you have to trust.",
		bullets: [
			"Automatic tool selection with typed arguments",
			"Loop guards: max steps, max tokens, wall-clock budget",
			"Deterministic replay of any historical run",
		],
		code: 'const run = await nexus.agents.run({\n  model: "nexus-1-pro",\n  input: "Refund order 8821 if it shipped late.",\n  tools: [lookupOrder, issueRefund],\n  max_steps: 6,\n});\n\nrun.steps.forEach((s) => console.log(s.tool, s.latency_ms));',
	},
	{
		id: "streaming",
		label: "Streaming",
		title: "First token in under 300 ms",
		desc: "Server-sent events push every delta the moment it exists. Cancel mid-flight and you are billed only for what was produced — the same behaviour the playground's Stop button demonstrates.",
		bullets: [
			"SSE deltas, tool-call events, usage summary on close",
			"Backpressure-safe async iterator in every SDK",
			"AbortSignal support end to end",
		],
		code: 'const stream = await nexus.agents.stream({\n  model: "nexus-1-turbo",\n  input: prompt,\n});\n\nfor await (const event of stream) {\n  if (event.type === "token") ui.append(event.delta);\n}',
	},
	{
		id: "observability",
		label: "Observability",
		title: "Every run, traced to the token",
		desc: "Latency per step, tokens per step, the exact arguments each tool received. When an agent goes sideways at 3am, the trace tells you which call poisoned the context.",
		bullets: [
			"p50/p95/p99 latency per model and per tool",
			"Token and cost attribution by workspace and by agent",
			"Alerting webhooks on error rate and budget burn",
		],
		code: 'const trace = await nexus.runs.trace("run_8f2c1ad9");\n\ntrace.steps\n  .filter((s) => s.latency_ms > 800)\n  .forEach((s) => report(s.tool, s.arguments, s.output));',
	},
	{
		id: "governance",
		label: "Governance",
		title: "Ship agents your security team signs off on",
		desc: "Scoped keys, per-workspace budgets, zero-retention mode, and an audit log that records who changed which tool and when. SOC 2 Type II and GDPR/CCPA out of the box.",
		bullets: [
			"SSO/SAML, SCIM provisioning, role-based access",
			"Hard spend caps that return 429 instead of a surprise bill",
			"Zero data retention available on Enterprise",
		],
		code: 'await nexus.workspaces.update("ws_prod", {\n  retention: "zero",\n  monthly_budget_usd: 2_500,\n  on_budget_exceeded: "reject",\n});',
	},
];

const GRID = [
	{
		id: "agents",
		icon: <Bot size={24} />,
		title: "Autonomous Agents",
		desc: "Deploy agents that work 24/7 without supervision, with hard budgets and step limits you control.",
	},
	{
		id: "latency",
		icon: <Zap size={24} />,
		title: "Instant Processing",
		desc: "Real-time data analysis with sub-millisecond routing and a 241 ms median first token.",
	},
	{
		id: "security",
		icon: <Shield size={24} />,
		title: "Enterprise Security",
		desc: "Bank-grade encryption for all your neural pathways. SOC 2 Type II, GDPR and CCPA compliant.",
	},
	{
		id: "tools",
		icon: <Plug size={24} />,
		title: "Custom Tools",
		desc: "Expose any HTTP endpoint as a typed tool. The agent decides when to call it — you decide what it may touch.",
	},
	{
		id: "traces",
		icon: <Activity size={24} />,
		title: "Run Traces",
		desc: "Replay any run step by step. See the arguments, the outputs, the latency, and the exact token bill.",
	},
	{
		id: "sdks",
		icon: <Terminal size={24} />,
		title: "First-class SDKs",
		desc: "TypeScript, Python and Go clients generated from the OpenAPI spec, so they never drift from the API.",
	},
	{
		id: "versioning",
		icon: <GitBranch size={24} />,
		title: "Prompt Versioning",
		desc: "Promote prompts through staging like code. Roll back a bad revision without a deploy.",
	},
	{
		id: "models",
		icon: <Cpu size={24} />,
		title: "Model Routing",
		desc: "Route cheap tasks to Turbo and hard ones to Pro automatically, based on a complexity score.",
	},
];

export default function FeaturesPage() {
	const [tab, setTab] = useState(TABS[0].id);
	const active = TABS.find((t) => t.id === tab) ?? TABS[0];

	return (
		<>
			{/* Hero */}
			<section className="pt-32 pb-16 px-6 relative overflow-hidden">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-6">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						Everything in NEXUS V2.0
					</div>

					<h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
						A runtime, not a{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							chat box
						</span>
					</h1>
					<p className="text-lg text-slate-400 max-w-2xl mx-auto">
						Nexus gives your agents tools, budgets, traces and guardrails — the
						boring infrastructure that turns a clever demo into something you can
						actually put in front of customers.
					</p>
				</div>
			</section>

			{/* Tabs */}
			<section className="pb-20 px-6">
				<div className="max-w-7xl mx-auto">
					<div
						role="tablist"
						aria-label="Feature areas"
						className="flex flex-wrap gap-2 justify-center mb-8"
					>
						{TABS.map((t) => (
							<button
								key={t.id}
								role="tab"
								type="button"
								aria-selected={tab === t.id}
								onClick={() => setTab(t.id)}
								className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
									tab === t.id
										? "bg-purple-600 border-purple-500 text-white"
										: "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-purple-500/30"
								}`}
							>
								{t.label}
							</button>
						))}
					</div>

					<div className="grid md:grid-cols-2 gap-8 items-center p-6 md:p-10 rounded-2xl bg-white/5 border border-white/5">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
								{active.title}
							</h2>
							<p className="text-slate-400 leading-relaxed mb-6">
								{active.desc}
							</p>
							<ul className="space-y-3">
								{active.bullets.map((b) => (
									<li
										key={b}
										className="flex items-start gap-3 text-sm text-slate-300"
									>
										<ChevronRight
											size={16}
											className="text-purple-500 mt-0.5 shrink-0"
										/>
										{b}
									</li>
								))}
							</ul>
						</div>

						<div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 overflow-hidden">
							<div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
								<span className="w-2.5 h-2.5 rounded-full bg-pink-500/60" />
								<span className="w-2.5 h-2.5 rounded-full bg-purple-500/60" />
								<span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
								<span className="ml-2 text-[11px] font-mono text-slate-500">
									{active.id}.ts
								</span>
							</div>
							<pre className="p-5 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-slate-300">
								{active.code}
							</pre>
						</div>
					</div>
				</div>
			</section>

			{/* Grid */}
			<section className="py-20 px-6 bg-slate-900/50 border-y border-white/5">
				<div className="max-w-7xl mx-auto">
					<h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
						Built for production, not for the demo
					</h2>

					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{GRID.map((f) => (
							<div
								key={f.id}
								id={f.id}
								className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group scroll-mt-24"
							>
								<div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
									{f.icon}
								</div>
								<h3 className="text-lg font-semibold mb-2">{f.title}</h3>
								<p className="text-sm text-slate-400 leading-relaxed">
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-24 px-6 relative overflow-hidden">
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />

				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-4xl font-bold tracking-tight mb-4">
						See it run before you write any code
					</h2>
					<p className="text-slate-400 mb-8">
						The playground uses the same models, the same temperature, the same
						token accounting.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href={`${BASE}/playground`}
							className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
						>
							Open the playground
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href={`${BASE}/signup`}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
						>
							Start free trial
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
