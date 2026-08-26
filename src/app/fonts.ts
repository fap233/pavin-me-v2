import { Caveat, Inter } from "next/font/google";

/**
 * Fontes do site, num módulo só: os dois root layouts ((en) e (main-pt))
 * precisam das mesmas instâncias, e next/font exige chamada no escopo do módulo.
 */
export const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

export const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-caveat",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const fontClassName = `${inter.variable} ${caveat.variable}`;
