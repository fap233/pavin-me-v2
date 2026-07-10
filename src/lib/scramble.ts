/**
 * Matrix-style text scramble: after the language swap, every visible text
 * node cycles through random glyphs and locks into the real string left to
 * right — as if the page were being live-translated.
 *
 * Pure DOM effect: React has already rendered the target-language text; we
 * only repaint textContent frames and always finish on the exact final
 * string, so there is nothing for reconciliation to fight over.
 */

const GLYPHS =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@+*<>/\\{}[]=~^?!";

const SKIP_TAGS = new Set([
	"SCRIPT",
	"STYLE",
	"NOSCRIPT",
	"TEXTAREA",
	"INPUT",
	"SELECT",
	"CANVAS",
	"svg",
]);

type Entry = {
	node: Text;
	final: string;
	/** Per-node speed jitter so the page doesn't resolve in lockstep. */
	speed: number;
	delay: number;
};

let activeRun = 0;

function collectTextNodes(limit: number): Entry[] {
	const entries: Entry[] = [];
	const viewH = window.innerHeight;
	const margin = viewH; // include one viewport above/below

	const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			const text = node.textContent ?? "";
			// Long paragraphs (About bio, CV summary) must scramble too — only
			// skip the truly huge to keep a frame cheap.
			if (!text.trim() || text.length > 1600) return NodeFilter.FILTER_REJECT;

			const parent = node.parentElement;
			if (!parent) return NodeFilter.FILTER_REJECT;
			if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
			if (parent.closest(".veil, [data-no-scramble]"))
				return NodeFilter.FILTER_REJECT;
			if (parent.offsetParent === null && getComputedStyle(parent).position !== "fixed")
				return NodeFilter.FILTER_REJECT;

			const rect = parent.getBoundingClientRect();
			if (rect.bottom < -margin || rect.top > viewH + margin)
				return NodeFilter.FILTER_REJECT;

			return NodeFilter.FILTER_ACCEPT;
		},
	});

	while (entries.length < limit) {
		const node = walker.nextNode() as Text | null;
		if (!node) break;
		entries.push({
			node,
			final: node.textContent ?? "",
			speed: 0.75 + Math.random() * 0.6,
			delay: Math.random() * 140,
		});
	}
	return entries;
}

function randomGlyph(original: string): string {
	if (original === " " || original === "\n" || original === "\t") return original;
	return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

/** Run the scramble over the current DOM. Safe to call after a state swap. */
export function scrambleDocument(duration = 720) {
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

	const run = ++activeRun;
	const entries = collectTextNodes(600);
	if (!entries.length) return;

	const start = performance.now();

	const frame = (now: number) => {
		// A newer run (rapid double-switch) owns the DOM now — restore & stop.
		if (run !== activeRun) {
			for (const e of entries) e.node.textContent = e.final;
			return;
		}

		let allDone = true;

		for (const e of entries) {
			const p = Math.min(
				Math.max((now - start - e.delay) / (duration * e.speed), 0),
				1,
			);
			const L = e.final.length;
			const locked = Math.floor(p * L);

			if (locked >= L) {
				if (e.node.textContent !== e.final) e.node.textContent = e.final;
				continue;
			}

			allDone = false;
			let out = e.final.slice(0, locked);
			// Only ~60% of the tail churns each frame — reads as decoding, not noise.
			for (let i = locked; i < L; i++) {
				const ch = e.final[i];
				out += Math.random() < 0.6 ? randomGlyph(ch) : ch;
			}
			e.node.textContent = out;
		}

		if (!allDone) requestAnimationFrame(frame);
	};

	requestAnimationFrame(frame);
}
