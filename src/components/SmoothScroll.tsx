"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/lenisInstance";

/**
 * Inertial scrolling (Lenis) + anchor links routed through it.
 * Disabled entirely when the user asks for reduced motion, so the page
 * falls back to the browser's native scroll.
 */
export function SmoothScroll() {
	useEffect(() => {
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (reduced.matches) return;

		const lenis = new Lenis({
			duration: 1.15,
			easing: (t: number) => 1 - Math.pow(1 - t, 3),
			touchMultiplier: 1.6,
		});
		setLenis(lenis);

		let frame = requestAnimationFrame(function raf(time) {
			lenis.raf(time);
			frame = requestAnimationFrame(raf);
		});

		const onAnchorClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
			const href = anchor?.getAttribute("href");
			if (!href || href === "#") return;

			const target = document.querySelector(href);
			if (!target) return;

			event.preventDefault();
			lenis.scrollTo(target as HTMLElement, { offset: -80 });
		};

		document.addEventListener("click", onAnchorClick);

		return () => {
			document.removeEventListener("click", onAnchorClick);
			cancelAnimationFrame(frame);
			setLenis(null);
			lenis.destroy();
		};
	}, []);

	return null;
}
