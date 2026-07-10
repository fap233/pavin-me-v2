"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

/** Default brand hue — matches the shipped indigo→purple→pink identity. */
export const DEFAULT_HUE = 300;

const STORAGE_KEY = "paint-hue";

/**
 * The visitor can repaint the site (fredbergwitz.com-style hue slider in the
 * footer). The chosen hue lives in `--paint-h` on <html>, which every brand
 * colour derives from in CSS; canvases (universe background, hero particles)
 * read it from this context instead.
 */
const PaintContext = createContext<
	| {
			hue: number;
			setHue: (h: number) => void;
			reset: () => void;
			isDefault: boolean;
	  }
	| undefined
>(undefined);

export function usePaint() {
	const ctx = useContext(PaintContext);
	if (!ctx) throw new Error("usePaint must be used within PaintProvider");
	return ctx;
}

export function PaintProvider({ children }: { children: ReactNode }) {
	const [hue, setHueState] = useState(DEFAULT_HUE);

	const apply = useCallback((h: number) => {
		setHueState(h);
		document.documentElement.style.setProperty("--paint-h", String(h));
	}, []);

	// Rehydrate the visitor's chosen paint on load.
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved !== null && Number.isFinite(Number(saved))) {
			apply(Number(saved));
		}
	}, [apply]);

	const setHue = useCallback(
		(h: number) => {
			apply(h);
			localStorage.setItem(STORAGE_KEY, String(h));
		},
		[apply],
	);

	const reset = useCallback(() => {
		apply(DEFAULT_HUE);
		localStorage.removeItem(STORAGE_KEY);
	}, [apply]);

	return (
		<PaintContext.Provider
			value={{ hue, setHue, reset, isDefault: hue === DEFAULT_HUE }}
		>
			{children}
		</PaintContext.Provider>
	);
}
