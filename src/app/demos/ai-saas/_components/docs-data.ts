/**
 * Conteúdo da documentação da demo Nexus AI.
 *
 * Os artigos são modelados como blocos (em vez de JSX solto) para que a página
 * consiga derivar, do mesmo dado, três coisas: o corpo do artigo, a lista
 * "On this page" (só os h2) e o índice que a busca da sidebar filtra.
 */

export type Block =
	| { kind: "h2"; id: string; text: string }
	| { kind: "p"; text: string }
	| { kind: "code"; lang: string; code: string }
	| { kind: "list"; items: string[] }
	| { kind: "callout"; tone: "info" | "warn"; title: string; text: string }
	| { kind: "table"; head: string[]; rows: string[][] };

export type DocPage = {
	slug: string;
	title: string;
	description: string;
	keywords: string[];
	blocks: Block[];
};

export type DocSection = {
	title: string;
	pages: DocPage[];
};

export const DOCS_BASE = "/demos/ai-saas/docs";

export const DOC_SECTIONS: DocSection[] = [
	{
		title: "Getting started",
		pages: [
			{
				slug: "quickstart",
				title: "Quickstart",
				description: "Run your first agent in under two minutes.",
				keywords: ["install", "npm", "first request", "hello world", "setup"],
				blocks: [
					{
						kind: "p",
						text: "Nexus is an agent runtime. You describe a task, attach tools, and the runtime plans, calls the tools, and returns a structured result. This guide takes you from an empty folder to a running agent.",
					},
					{ kind: "h2", id: "install", text: "Install the SDK" },
					{
						kind: "p",
						text: "The SDK ships as a single package with zero runtime dependencies. Node 18+ or any WinterCG-compatible runtime (Deno, Bun, Cloudflare Workers) is supported.",
					},
					{
						kind: "code",
						lang: "bash",
						code: "npm install @nexus-ai/sdk\n# or: pnpm add @nexus-ai/sdk",
					},
					{ kind: "h2", id: "first-run", text: "Your first run" },
					{
						kind: "p",
						text: "Create a client with your API key and call run(). The runtime returns as soon as the agent settles on a final answer.",
					},
					{
						kind: "code",
						lang: "ts",
						code: 'import { Nexus } from "@nexus-ai/sdk";\n\nconst nexus = new Nexus({ apiKey: process.env.NEXUS_API_KEY });\n\nconst run = await nexus.agents.run({\n  model: "nexus-1-pro",\n  input: "Summarize yesterday\'s support tickets and flag churn risk.",\n  temperature: 0.3,\n});\n\nconsole.log(run.output_text);\nconsole.log(run.usage); // { input_tokens: 84, output_tokens: 512 }',
					},
					{
						kind: "callout",
						tone: "info",
						title: "Try it without writing code",
						text: "The Playground runs the same models with the same parameters. Prototype the prompt there, then copy the settings into the SDK.",
					},
					{ kind: "h2", id: "next-steps", text: "Next steps" },
					{
						kind: "list",
						items: [
							"Authentication: create scoped keys per environment.",
							"Streaming: render tokens as they are produced.",
							"Rate limits: understand your tier's ceilings before you scale.",
						],
					},
				],
			},
			{
				slug: "authentication",
				title: "Authentication",
				description: "API keys, scopes, and rotating credentials safely.",
				keywords: ["api key", "bearer", "token", "scopes", "security", "rotate"],
				blocks: [
					{
						kind: "p",
						text: "Every request to the Nexus API is authenticated with a bearer token. Keys are scoped to a single workspace and carry an explicit permission set.",
					},
					{ kind: "h2", id: "bearer", text: "Bearer tokens" },
					{
						kind: "code",
						lang: "bash",
						code: 'curl https://api.nexus-ai.dev/v2/runs \\\n  -H "Authorization: Bearer $NEXUS_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model":"nexus-1-pro","input":"ping"}\'',
					},
					{ kind: "h2", id: "scopes", text: "Key scopes" },
					{
						kind: "p",
						text: "Grant the narrowest scope that still lets the key do its job. A key used by a browser-facing service should never carry write scopes.",
					},
					{
						kind: "table",
						head: ["Scope", "Grants", "Typical use"],
						rows: [
							["runs:write", "Start and cancel agent runs", "Backend services"],
							["runs:read", "Read run history and traces", "Dashboards"],
							["tools:write", "Register and update tools", "CI pipelines"],
							["admin", "Everything, including billing", "Owners only"],
						],
					},
					{ kind: "h2", id: "rotation", text: "Rotation" },
					{
						kind: "p",
						text: "Keys can overlap during a rotation window: create the new key, deploy it, then revoke the old one. Revocation propagates to every edge node within 30 seconds.",
					},
					{
						kind: "callout",
						tone: "warn",
						title: "Never ship keys to the browser",
						text: "A leaked key can burn your entire monthly quota in minutes. Proxy requests through your own backend, or mint short-lived session tokens with runs:write only.",
					},
				],
			},
		],
	},
	{
		title: "Core concepts",
		pages: [
			{
				slug: "streaming",
				title: "Streaming",
				description: "Render tokens as the model produces them.",
				keywords: ["sse", "server sent events", "typewriter", "chunks", "delta"],
				blocks: [
					{
						kind: "p",
						text: "Streaming turns a 6-second wait into a 300 ms one, perceptually. The API emits server-sent events, one per delta, and closes the stream with a usage summary.",
					},
					{ kind: "h2", id: "consume", text: "Consuming a stream" },
					{
						kind: "code",
						lang: "ts",
						code: 'const stream = await nexus.agents.stream({\n  model: "nexus-1-turbo",\n  input: prompt,\n});\n\nfor await (const event of stream) {\n  if (event.type === "token") process.stdout.write(event.delta);\n  if (event.type === "done") console.log("\\n", event.usage);\n}',
					},
					{ kind: "h2", id: "events", text: "Event types" },
					{
						kind: "table",
						head: ["Event", "Payload", "When"],
						rows: [
							["run.started", "run_id, model", "Immediately after the request is accepted"],
							["token", "delta", "Once per generated token"],
							["tool.call", "name, arguments", "The agent decided to invoke a tool"],
							["done", "usage, finish_reason", "The run settled or was cancelled"],
						],
					},
					{ kind: "h2", id: "cancel", text: "Cancelling" },
					{
						kind: "p",
						text: "Abort the underlying request and the run is billed only for tokens produced so far. The Playground's Stop button does exactly this.",
					},
					{
						kind: "code",
						lang: "ts",
						code: "const controller = new AbortController();\nsetTimeout(() => controller.abort(), 5_000);\n\nawait nexus.agents.stream(\n  { model: \"nexus-1-turbo\", input: prompt },\n  { signal: controller.signal },\n);",
					},
				],
			},
			{
				slug: "rate-limits",
				title: "Rate limits",
				description: "Quotas per tier, headers, and backoff strategy.",
				keywords: ["429", "quota", "throttle", "backoff", "retry", "rpm", "tpm"],
				blocks: [
					{
						kind: "p",
						text: "Limits are enforced per workspace on two axes: requests per minute (RPM) and tokens per minute (TPM). Whichever you hit first wins.",
					},
					{ kind: "h2", id: "tiers", text: "Limits by plan" },
					{
						kind: "table",
						head: ["Plan", "RPM", "TPM", "Concurrent runs"],
						rows: [
							["Starter", "60", "40,000", "3"],
							["Pro", "600", "500,000", "25"],
							["Enterprise", "Custom", "Custom", "Unlimited"],
						],
					},
					{ kind: "h2", id: "headers", text: "Response headers" },
					{
						kind: "code",
						lang: "http",
						code: "x-nexus-limit-requests: 600\nx-nexus-remaining-requests: 587\nx-nexus-reset-requests: 4.2s\nx-nexus-limit-tokens: 500000\nx-nexus-remaining-tokens: 471233",
					},
					{ kind: "h2", id: "backoff", text: "Handling 429s" },
					{
						kind: "p",
						text: "The SDK retries 429 and 5xx responses automatically with exponential backoff and full jitter, up to three attempts. If you implement your own client, respect the reset header instead of retrying immediately.",
					},
					{
						kind: "callout",
						tone: "info",
						title: "Bursts are fine",
						text: "Limits are token-bucket based with a 2x burst allowance, so a short spike will not be throttled as long as the one-minute average stays under the ceiling.",
					},
				],
			},
		],
	},
	{
		title: "Reference",
		pages: [
			{
				slug: "api-reference",
				title: "API Reference",
				description: "Endpoints, parameters, and response shapes.",
				keywords: ["endpoints", "rest", "post", "get", "parameters", "runs"],
				blocks: [
					{
						kind: "p",
						text: "The REST API is versioned in the path and served from api.nexus-ai.dev. All request and response bodies are JSON; all timestamps are RFC 3339 UTC.",
					},
					{ kind: "h2", id: "create-run", text: "POST /v2/runs" },
					{
						kind: "table",
						head: ["Parameter", "Type", "Default", "Description"],
						rows: [
							["model", "string", "—", "Model id, e.g. nexus-1-pro"],
							["input", "string | Message[]", "—", "Prompt or full conversation"],
							["temperature", "number", "0.7", "0 = deterministic, 1 = creative"],
							["max_tokens", "integer", "1024", "Hard ceiling on the completion"],
							["tools", "Tool[]", "[]", "Functions the agent may call"],
							["stream", "boolean", "false", "Emit SSE deltas instead of a single body"],
						],
					},
					{ kind: "h2", id: "response", text: "Run object" },
					{
						kind: "code",
						lang: "json",
						code: '{\n  "id": "run_8f2c1ad9",\n  "object": "run",\n  "model": "nexus-1-pro",\n  "status": "completed",\n  "output_text": "Weekly active users grew 12.4% ...",\n  "usage": { "input_tokens": 84, "output_tokens": 512, "latency_ms": 940 },\n  "created_at": "2024-11-04T17:02:11Z"\n}',
					},
					{ kind: "h2", id: "errors", text: "Errors" },
					{
						kind: "table",
						head: ["Status", "Code", "Meaning"],
						rows: [
							["400", "invalid_request", "Malformed body or unknown parameter"],
							["401", "invalid_api_key", "Missing, revoked, or mistyped key"],
							["404", "model_not_found", "The model id does not exist on your plan"],
							["429", "rate_limited", "RPM or TPM ceiling reached"],
							["503", "capacity", "Region saturated, retry with backoff"],
						],
					},
				],
			},
			{
				slug: "sdks",
				title: "SDKs",
				description: "Official clients for TypeScript, Python, and Go.",
				keywords: ["typescript", "python", "go", "client", "library", "install"],
				blocks: [
					{
						kind: "p",
						text: "Every official SDK wraps the same REST surface, adds retries with jitter, and exposes typed responses. They are generated from the OpenAPI spec, so they never drift from the API.",
					},
					{ kind: "h2", id: "typescript", text: "TypeScript" },
					{
						kind: "code",
						lang: "ts",
						code: 'import { Nexus } from "@nexus-ai/sdk";\n\nconst nexus = new Nexus({ apiKey: process.env.NEXUS_API_KEY });\nconst run = await nexus.agents.run({ model: "nexus-1-turbo", input: "ping" });',
					},
					{ kind: "h2", id: "python", text: "Python" },
					{
						kind: "code",
						lang: "python",
						code: 'from nexus import Nexus\n\nnexus = Nexus(api_key=os.environ["NEXUS_API_KEY"])\nrun = nexus.agents.run(model="nexus-1-turbo", input="ping")\nprint(run.output_text)',
					},
					{ kind: "h2", id: "go", text: "Go" },
					{
						kind: "code",
						lang: "go",
						code: 'client := nexus.New(os.Getenv("NEXUS_API_KEY"))\n\nrun, err := client.Agents.Run(ctx, nexus.RunParams{\n    Model: "nexus-1-turbo",\n    Input: "ping",\n})',
					},
					{ kind: "h2", id: "community", text: "Community clients" },
					{
						kind: "list",
						items: [
							"Ruby: nexus-rb (community maintained)",
							"Rust: nexus-rs (community maintained)",
							"Elixir: ex_nexus (community maintained)",
						],
					},
				],
			},
		],
	},
];

export const DOC_PAGES: DocPage[] = DOC_SECTIONS.flatMap((s) => s.pages);

export function getDocPage(slug: string): DocPage | undefined {
	return DOC_PAGES.find((p) => p.slug === slug);
}

export function getDocNeighbors(slug: string): {
	prev?: DocPage;
	next?: DocPage;
} {
	const i = DOC_PAGES.findIndex((p) => p.slug === slug);
	if (i === -1) return {};
	return { prev: DOC_PAGES[i - 1], next: DOC_PAGES[i + 1] };
}

export function headingsOf(page: DocPage): { id: string; text: string }[] {
	return page.blocks
		.filter((b): b is Extract<Block, { kind: "h2" }> => b.kind === "h2")
		.map((b) => ({ id: b.id, text: b.text }));
}
