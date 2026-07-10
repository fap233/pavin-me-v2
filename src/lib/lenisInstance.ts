import type Lenis from "lenis";

/**
 * Shared handle on the page's Lenis instance so overlays can freeze inertial
 * scrolling while they are open. `null` whenever smooth scrolling is off
 * (reduced motion), in which case callers should fall back to overflow-hidden.
 */
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
	instance = next;
}

export function stopLenis() {
	instance?.stop();
}

export function startLenis() {
	instance?.start();
}
