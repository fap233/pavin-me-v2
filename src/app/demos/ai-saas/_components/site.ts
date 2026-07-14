/**
 * Constantes compartilhadas da demo Nexus AI.
 *
 * Mora num módulo neutro (sem "use client") de propósito: server components
 * não podem importar valores de um módulo client — o import viraria uma client
 * reference e estourar em runtime ao interpolar a string.
 */

export const BASE = "/demos/ai-saas";

export const NAV_LINKS = [
	{ href: `${BASE}/features`, label: "Features" },
	{ href: `${BASE}/pricing`, label: "Pricing" },
	{ href: `${BASE}/docs`, label: "Docs" },
	{ href: `${BASE}/playground`, label: "Playground" },
];
