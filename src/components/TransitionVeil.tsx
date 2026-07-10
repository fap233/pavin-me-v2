"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
	type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

/**
 * covering: first paint — acts as the preloader, opens once the page is ready.
 * closing:  diagonal panel sweeps in; the pending action runs at full cover.
 * opening:  panel sweeps out revealing the (new) page.
 * idle:     panel parked off-screen left, ready for the next sweep.
 */
type VeilState = "covering" | "closing" | "opening" | "idle";

const CLOSE_MS = 560;
const OPEN_MS = 680;
/** Cover hold after the action runs, letting the new state paint underneath. */
const SETTLE_MS = 220;

const VeilContext = createContext<
	{ runWithVeil: (action: () => void | Promise<void>) => void } | undefined
>(undefined);

export function useVeil() {
	const ctx = useContext(VeilContext);
	if (!ctx) throw new Error("useVeil must be used within TransitionVeilProvider");
	return ctx;
}

export function TransitionVeilProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<VeilState>("covering");
	const stateRef = useRef(state);
	stateRef.current = state;

	const reducedRef = useRef(false);
	const pendingRef = useRef<(() => void | Promise<void>) | null>(null);
	const router = useRouter();

	// Preloader: open once the page has loaded (or after a hard cap).
	useEffect(() => {
		reducedRef.current = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (reducedRef.current) {
			setState("idle");
			return;
		}

		let opened = false;
		const open = () => {
			if (opened) return;
			opened = true;
			setState("opening");
		};

		const minDelay = setTimeout(() => {
			if (document.readyState === "complete") open();
			else {
				window.addEventListener("load", open, { once: true });
			}
		}, 550);
		const cap = setTimeout(open, 2200);

		return () => {
			clearTimeout(minDelay);
			clearTimeout(cap);
			window.removeEventListener("load", open);
		};
	}, []);

	// Drive the state machine.
	useEffect(() => {
		if (state === "opening") {
			const t = setTimeout(() => setState("idle"), OPEN_MS);
			return () => clearTimeout(t);
		}
		if (state === "closing") {
			const t = setTimeout(async () => {
				try {
					await pendingRef.current?.();
				} finally {
					pendingRef.current = null;
				}
				setTimeout(() => setState("opening"), SETTLE_MS);
			}, CLOSE_MS);
			return () => clearTimeout(t);
		}
	}, [state]);

	const runWithVeil = useCallback((action: () => void | Promise<void>) => {
		// No motion (or a sweep already in flight): just do the thing.
		if (reducedRef.current || stateRef.current !== "idle") {
			void action();
			return;
		}
		pendingRef.current = action;
		setState("closing");
	}, []);

	// Internal page navigations go through the veil (anchors stay with Lenis).
	// Capture phase: Next's <Link> prevents default on bubble, so we must win
	// the race and drive the navigation ourselves.
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			)
				return;

			const anchor = (event.target as HTMLElement)?.closest?.("a[href]");
			if (!anchor || anchor.getAttribute("target") === "_blank") return;

			const href = anchor.getAttribute("href") ?? "";
			const isInternalPage =
				href.startsWith("/") && !href.startsWith("/#") && !href.includes("#");
			if (!isInternalPage || href.endsWith(".pdf")) return;
			if (href === window.location.pathname) return;

			event.preventDefault();
			runWithVeil(() => {
				router.push(href);
				window.scrollTo(0, 0);
			});
		};

		document.addEventListener("click", onClick, true);
		return () => document.removeEventListener("click", onClick, true);
	}, [router, runWithVeil]);

	return (
		<VeilContext.Provider value={{ runWithVeil }}>
			{children}
			<div
				aria-hidden="true"
				data-state={state}
				className="veil fixed inset-0 z-[100]"
			>
				<div className="veil-panel" />
				<div className="veil-brand">
					<span className="text-xl font-bold tracking-tight text-white">
						Pavin
						<span className="font-[family-name:var(--font-caveat)] text-2xl ml-0.5 text-purple-300">
							.dev
						</span>
					</span>
					<span className="veil-progress" />
				</div>
			</div>
		</VeilContext.Provider>
	);
}
