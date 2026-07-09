"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Reveals an element the first time it enters the viewport.
 *
 * Uses a callback ref rather than a stable ref object: sections that swap
 * layouts (e.g. the projects grid becoming a horizontal track) remount their
 * nodes, and an observer bound to the discarded node would never fire.
 */
export function useInView<T extends Element>(threshold = 0.15) {
	const [node, setNode] = useState<T | null>(null);
	const [inView, setInView] = useState(false);

	const ref = useCallback((element: T | null) => setNode(element), []);

	useEffect(() => {
		if (inView || !node) return;

		if (typeof IntersectionObserver === "undefined") {
			setInView(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setInView(true);
					observer.disconnect();
				}
			},
			{ threshold },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [node, threshold, inView]);

	return { ref, inView };
}
