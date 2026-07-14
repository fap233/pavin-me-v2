"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	Bot,
	Check,
	Copy,
	Play,
	RotateCcw,
	Sparkles,
	Square,
	User,
} from "lucide-react";
import { BASE } from "../_components/site";

/* ------------------------------------------------------------------ *
 * Playground da demo Nexus AI.
 *
 * Não existe backend: a resposta é canned e o "streaming" é um setInterval
 * cuspindo token a token (typewriter). O intervalo é guardado numa ref e
 * limpo no Stop e no unmount — sem vazamento se o cliente sair no meio.
 * ------------------------------------------------------------------ */

type Model = {
	id: string;
	name: string;
	blurb: string;
	speed: number; // ms por token no typewriter
	price: number; // USD por 1k tokens
};

const MODELS: Model[] = [
	{
		id: "nexus-1-turbo",
		name: "Nexus-1 Turbo",
		blurb: "Fastest. Great for classification and extraction.",
		speed: 16,
		price: 0.4,
	},
	{
		id: "nexus-1-pro",
		name: "Nexus-1 Pro",
		blurb: "Best reasoning. Handles multi-step tool use.",
		speed: 28,
		price: 3.0,
	},
	{
		id: "nexus-code",
		name: "Nexus-Code",
		blurb: "Tuned for SQL, TypeScript, and shell.",
		speed: 20,
		price: 1.2,
	},
];

type Example = {
	label: string;
	prompt: string;
	match: string;
	response: string;
};

const EXAMPLES: Example[] = [
	{
		label: "Triage a support ticket",
		match: "ticket",
		prompt:
			"Triage this ticket and draft a reply:\n\n\"Third time this week the export job dies at 80%. We're on the Pro plan and this is blocking our month-end close.\"",
		response: `TRIAGE
------
Severity:  P1 — recurring failure, blocks a financial deadline
Category:  Exports / job runner
Sentiment: Frustrated (3rd occurrence, escalation likely)
Churn risk: HIGH (Pro plan, 14 months tenure, 2 prior P1s)

ROOT CAUSE (probable)
Export jobs that die around 80% almost always hit the 120s worker
timeout on the CSV serialization step. The account has 4.2M rows in
the events table — well past the streaming threshold.

DRAFT REPLY
-----------
Hi Dana,

You are right to escalate — three failures in one week is not the
experience you pay for, and I am sorry it landed on your month-end
close.

The job is timing out while serializing your events table, which has
grown past the point where we buffer the whole export in memory. Two
things are happening now:

1. I moved your workspace to the streaming exporter, which writes
   incrementally instead of buffering. Your next export will not hit
   the timeout.
2. I queued a manual export of the current month and will send you the
   file within the hour, so your close is not blocked while we verify.

I will follow up tomorrow to confirm the next scheduled run completed
cleanly.

— Ana, Nexus Support

SUGGESTED ACTIONS
- Escalate to #exports-oncall (owner: platform)
- Flag account for CSM check-in before renewal (Mar 12)`,
	},
	{
		label: "Write a SQL query",
		match: "sql",
		prompt:
			"Write a SQL query that returns weekly active users for the last 8 weeks, with week-over-week growth.",
		response: `WITH weekly AS (
  SELECT
    date_trunc('week', occurred_at) AS week,
    count(DISTINCT user_id)         AS active_users
  FROM events
  WHERE occurred_at >= now() - interval '8 weeks'
  GROUP BY 1
)
SELECT
  week,
  active_users,
  lag(active_users) OVER (ORDER BY week) AS prev_week,
  round(
    100.0 * (active_users - lag(active_users) OVER (ORDER BY week))
    / nullif(lag(active_users) OVER (ORDER BY week), 0)
  , 1) AS wow_growth_pct
FROM weekly
ORDER BY week;

NOTES
- date_trunc('week', ...) starts weeks on Monday in Postgres.
- nullif(..., 0) guards the first week, where lag() is NULL and the
  division would otherwise blow up.
- If events is large, add an index on (occurred_at, user_id); the
  count(DISTINCT) is the expensive part, not the scan.`,
	},
	{
		label: "Extract JSON from an invoice",
		match: "invoice",
		prompt:
			"Extract structured JSON from this invoice line:\n\n\"INV-4471 — Orbital Systems Ltd — 3x Enterprise seat (Nov 2024) — $1,497.00 — due 2024-12-15 — PO 88231\"",
		response: `{
  "invoice_number": "INV-4471",
  "customer": {
    "name": "Orbital Systems Ltd",
    "purchase_order": "88231"
  },
  "line_items": [
    {
      "description": "Enterprise seat",
      "period": "2024-11",
      "quantity": 3,
      "unit_price_usd": 499.00,
      "amount_usd": 1497.00
    }
  ],
  "total_usd": 1497.00,
  "currency": "USD",
  "due_date": "2024-12-15",
  "status": "open"
}

Confidence: 0.97. The unit price was derived (1497 / 3), not stated
explicitly on the line — everything else is verbatim from the source.`,
	},
	{
		label: "Explain the run in plain English",
		match: "explain",
		prompt:
			"Explain what an autonomous agent run is to a non-technical stakeholder, in under 120 words.",
		response: `Think of an agent run as one errand you hand to a very fast assistant.

You describe the goal — "find every invoice that is 30 days overdue
and draft the follow-up email" — and give the assistant access to the
tools it needs: your billing database, your email templates.

It then works the errand on its own. It decides which tool to open
first, reads what comes back, adjusts, and repeats until the goal is
met or it hits a limit you set. You get the finished work plus a full
trace of every step it took, so nothing is a black box.

You are not writing instructions for each step. You are describing the
outcome, and paying only for the tokens the errand actually consumed.`,
	},
];

const FALLBACK = `Here is how I would approach that.

1. Restate the goal. You want a concrete, verifiable outcome — not a
   vague summary — so the first move is to pin down what "done" looks
   like.
2. Gather only what is needed. An agent that pulls every row of your
   database burns tokens and adds noise; scope the retrieval to the
   window that answers the question.
3. Execute in small steps, checking after each one. Every tool call
   returns evidence, and evidence is what keeps the run from drifting.
4. Return a structured result, not prose, when a machine will read it.

Try one of the example prompts on the left to see a full run with tool
calls and a structured response — or keep going here and I will follow
your lead.`;

function pickResponse(prompt: string): string {
	const p = prompt.toLowerCase();
	const hit = EXAMPLES.find(
		(e) => p.includes(e.match) || p.includes(e.label.toLowerCase()),
	);
	return hit ? hit.response : FALLBACK;
}

// aproximação boba mas honesta: ~4 chars por token
const countTokens = (text: string) => Math.max(1, Math.ceil(text.length / 4));

type Message = {
	role: "user" | "assistant";
	content: string;
	model?: string;
	done?: boolean;
};

export default function PlaygroundPage() {
	const [prompt, setPrompt] = useState("");
	const [modelId, setModelId] = useState(MODELS[1].id);
	const [temperature, setTemperature] = useState(0.3);
	const [maxTokens, setMaxTokens] = useState(1024);
	const [messages, setMessages] = useState<Message[]>([]);
	const [status, setStatus] = useState<"idle" | "thinking" | "streaming">(
		"idle",
	);
	const [ttft, setTtft] = useState<number | null>(null);
	const [elapsed, setElapsed] = useState(0);
	const [outTokens, setOutTokens] = useState(0);
	const [copied, setCopied] = useState(false);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const transcriptRef = useRef<HTMLDivElement | null>(null);

	const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
	const running = status !== "idle";
	const promptTokens = prompt.trim() ? countTokens(prompt) : 0;
	const cost = ((promptTokens + outTokens) / 1000) * model.price;

	function stopTimers() {
		if (intervalRef.current) clearInterval(intervalRef.current);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		intervalRef.current = null;
		timeoutRef.current = null;
	}

	// não vaza o interval se o cliente sair da página no meio do stream
	useEffect(() => stopTimers, []);

	// mantém o transcript colado no fim enquanto escreve
	useEffect(() => {
		const el = transcriptRef.current;
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, status]);

	function run() {
		const text = prompt.trim();
		if (!text || running) return;

		stopTimers();
		setCopied(false);
		setOutTokens(0);
		setTtft(null);
		setElapsed(0);
		setStatus("thinking");
		setMessages((prev) => [
			...prev,
			{ role: "user", content: text },
			{ role: "assistant", content: "", model: model.name },
		]);

		const started = performance.now();
		const response = pickResponse(text);
		// temperatura alta = modelo "pensa" um tico mais antes do primeiro token
		const thinkMs = 280 + temperature * 520;
		// max_tokens é um teto de verdade: corta a resposta como a API faria
		const chunks = (response.match(/\S+\s*/g) ?? []).slice(0, maxTokens);

		timeoutRef.current = setTimeout(() => {
			setTtft(Math.round(performance.now() - started));
			setStatus("streaming");

			let i = 0;
			intervalRef.current = setInterval(() => {
				if (i >= chunks.length) {
					stopTimers();
					setStatus("idle");
					setMessages((prev) =>
						prev.map((m, idx) =>
							idx === prev.length - 1 ? { ...m, done: true } : m,
						),
					);
					return;
				}

				const chunk = chunks[i];
				i += 1;
				setOutTokens(i);
				setElapsed(Math.round(performance.now() - started));
				setMessages((prev) =>
					prev.map((m, idx) =>
						idx === prev.length - 1
							? { ...m, content: m.content + chunk }
							: m,
					),
				);
			}, model.speed);
		}, thinkMs);
	}

	function stop() {
		if (!running) return;
		stopTimers();
		setStatus("idle");
		setMessages((prev) =>
			prev.map((m, idx) =>
				idx === prev.length - 1
					? {
							...m,
							done: true,
							content: m.content + (m.content ? "\n\n[stopped by user]" : ""),
						}
					: m,
			),
		);
	}

	function reset() {
		stopTimers();
		setStatus("idle");
		setMessages([]);
		setPrompt("");
		setOutTokens(0);
		setTtft(null);
		setElapsed(0);
		setCopied(false);
	}

	async function copyLast() {
		const last = [...messages].reverse().find((m) => m.role === "assistant");
		if (!last?.content) return;
		try {
			await navigator.clipboard.writeText(last.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1600);
		} catch {
			/* clipboard bloqueado — segue a vida */
		}
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
			e.preventDefault();
			run();
		}
	}

	const tokensPerSec =
		elapsed > 0 && ttft !== null && elapsed > ttft
			? Math.round((outTokens / (elapsed - ttft)) * 1000)
			: 0;

	return (
		<section className="pt-28 pb-20 px-6 relative overflow-hidden min-h-screen">
			<div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-4">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
							</span>
							Sandbox · no API key needed
						</div>
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
							Play<span className="text-purple-500">ground</span>
						</h1>
						<p className="text-slate-400 mt-2 max-w-xl">
							Same models, same parameters as the API. Run a prompt, watch it
							stream, check the token bill.
						</p>
					</div>

					<div className="flex gap-2">
						<button
							type="button"
							onClick={reset}
							disabled={!messages.length && !prompt}
							className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
						>
							<RotateCcw size={14} />
							Reset
						</button>
						<button
							type="button"
							onClick={copyLast}
							disabled={!messages.some((m) => m.role === "assistant" && m.content)}
							className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
						>
							{copied ? <Check size={14} /> : <Copy size={14} />}
							{copied ? "Copied" : "Copy output"}
						</button>
					</div>
				</div>

				<div className="grid lg:grid-cols-[300px_1fr] gap-6">
					{/* Settings */}
					<aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
						<div className="p-5 rounded-2xl bg-white/5 border border-white/5">
							<h2 className="text-xs font-mono text-slate-400 mb-4">MODEL</h2>
							<div className="space-y-2">
								{MODELS.map((m) => (
									<button
										key={m.id}
										type="button"
										onClick={() => setModelId(m.id)}
										aria-pressed={modelId === m.id}
										className={`w-full text-left p-3 rounded-xl border transition-colors ${
											modelId === m.id
												? "bg-purple-600/15 border-purple-500/40"
												: "bg-slate-900/50 border-white/5 hover:border-purple-500/30"
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">{m.name}</span>
											<span className="text-[10px] font-mono text-slate-500">
												${m.price.toFixed(2)}/1K
											</span>
										</div>
										<p className="text-xs text-slate-400 mt-1 leading-snug">
											{m.blurb}
										</p>
									</button>
								))}
							</div>
						</div>

						<div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-6">
							<div>
								<div className="flex items-center justify-between mb-2">
									<label
										htmlFor="temperature"
										className="text-xs font-mono text-slate-400"
									>
										TEMPERATURE
									</label>
									<span className="text-sm font-mono text-purple-300">
										{temperature.toFixed(2)}
									</span>
								</div>
								<input
									id="temperature"
									type="range"
									min={0}
									max={1}
									step={0.05}
									value={temperature}
									onChange={(e) => setTemperature(Number(e.target.value))}
									className="w-full accent-purple-500 cursor-pointer"
								/>
								<div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
									<span>PRECISE</span>
									<span>CREATIVE</span>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between mb-2">
									<label
										htmlFor="maxtokens"
										className="text-xs font-mono text-slate-400"
									>
										MAX TOKENS
									</label>
									<span className="text-sm font-mono text-purple-300">
										{maxTokens}
									</span>
								</div>
								<input
									id="maxtokens"
									type="range"
									min={64}
									max={2048}
									step={64}
									value={maxTokens}
									onChange={(e) => setMaxTokens(Number(e.target.value))}
									className="w-full accent-purple-500 cursor-pointer"
								/>
								<p className="text-[10px] text-slate-600 mt-1 leading-snug">
									Hard ceiling — the completion is truncated here, exactly like
									the API does.
								</p>
							</div>
						</div>

						<div className="p-5 rounded-2xl bg-white/5 border border-white/5">
							<h2 className="text-xs font-mono text-slate-400 mb-3">
								EXAMPLE PROMPTS
							</h2>
							<div className="space-y-2">
								{EXAMPLES.map((ex) => (
									<button
										key={ex.label}
										type="button"
										onClick={() => setPrompt(ex.prompt)}
										className="w-full flex items-center gap-2 text-left p-3 rounded-xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 hover:bg-slate-900 transition-colors text-sm text-slate-300 group"
									>
										<Sparkles
											size={14}
											className="text-purple-400 shrink-0 group-hover:scale-110 transition-transform"
										/>
										{ex.label}
									</button>
								))}
							</div>
						</div>
					</aside>

					{/* Chat */}
					<div className="flex flex-col gap-4">
						{/* Stats bar */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							{[
								{
									label: "TTFT",
									value: ttft === null ? "—" : `${ttft}ms`,
								},
								{
									label: "LATENCY",
									value: elapsed === 0 ? "—" : `${(elapsed / 1000).toFixed(2)}s`,
								},
								{
									label: "TOKENS",
									value: `${promptTokens} in / ${outTokens} out`,
								},
								{
									label: "EST. COST",
									value: `$${cost.toFixed(4)}`,
								},
							].map((stat) => (
								<div
									key={stat.label}
									className="p-3 rounded-xl bg-white/5 border border-white/5"
								>
									<p className="text-[10px] font-mono text-slate-500">
										{stat.label}
									</p>
									<p className="text-sm font-mono text-purple-300 truncate">
										{stat.value}
									</p>
								</div>
							))}
						</div>

						{/* Transcript */}
						<div
							ref={transcriptRef}
							className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-5 h-[420px] overflow-y-auto"
						>
							{messages.length === 0 ? (
								<div className="h-full flex flex-col items-center justify-center text-center px-6">
									<div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 mb-4">
										<Bot size={24} />
									</div>
									<p className="text-slate-300 font-medium mb-1">
										The runtime is idle.
									</p>
									<p className="text-slate-500 text-sm max-w-sm">
										Write a prompt below, or pick one of the examples. Responses
										stream token by token — hit Stop whenever you have seen
										enough.
									</p>
								</div>
							) : (
								<div className="space-y-5">
									{messages.map((m, i) => (
										<div key={i} className="flex gap-3">
											<div
												className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${
													m.role === "user"
														? "bg-slate-800 text-slate-400"
														: "bg-purple-600/20 text-purple-400"
												}`}
											>
												{m.role === "user" ? (
													<User size={16} />
												) : (
													<Bot size={16} />
												)}
											</div>
											<div className="min-w-0 flex-1">
												<p className="text-xs font-mono text-slate-500 mb-1">
													{m.role === "user" ? "YOU" : m.model?.toUpperCase()}
												</p>
												<pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-slate-200">
													{m.content}
													{m.role === "assistant" &&
														!m.done &&
														status !== "idle" && (
															<span className="inline-block w-2 h-4 -mb-0.5 ml-0.5 bg-purple-400 animate-pulse" />
														)}
												</pre>
											</div>
										</div>
									))}

									{status === "thinking" && (
										<p className="flex items-center gap-2 text-xs font-mono text-slate-500 pl-11">
											<span className="relative flex h-2 w-2">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
											</span>
											PLANNING RUN…
										</p>
									)}
								</div>
							)}
						</div>

						{/* Prompt box */}
						<div className="rounded-2xl bg-white/5 border border-white/5 focus-within:border-purple-500/30 transition-colors p-4">
							<textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								onKeyDown={onKeyDown}
								rows={4}
								placeholder="Ask the agent to do something — triage a ticket, write a query, extract JSON…"
								aria-label="Prompt"
								className="w-full bg-transparent resize-none outline-none text-sm text-white placeholder:text-slate-500 leading-relaxed"
							/>
							<div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
								<p className="text-[11px] font-mono text-slate-500">
									{model.id} · temp {temperature.toFixed(2)} ·{" "}
									{tokensPerSec > 0 ? `${tokensPerSec} tok/s` : "⌘↵ to run"}
								</p>

								<div className="flex gap-2">
									{running ? (
										<button
											type="button"
											onClick={stop}
											className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
										>
											<Square size={14} className="fill-current" />
											Stop
										</button>
									) : (
										<button
											type="button"
											onClick={run}
											disabled={!prompt.trim()}
											className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
										>
											<Play size={14} className="fill-current" />
											Run
										</button>
									)}
								</div>
							</div>
						</div>

						<p className="text-xs text-slate-500 text-center">
							This is a sandbox with canned responses — no requests leave your
							browser.{" "}
							<Link
								href={`${BASE}/docs/quickstart`}
								className="text-purple-400 hover:text-purple-300 transition-colors"
							>
								Read the quickstart
							</Link>{" "}
							to run the real thing.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
