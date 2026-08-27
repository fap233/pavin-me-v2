import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

const BASE_URL = "https://pavin.me";

/** Slugs das páginas de serviço (src/lib/services.ts). */
const SERVICE_SLUGS = [
	"criacao-de-site",
	"loja-virtual",
	"automacao-n8n-chatbot-whatsapp",
	"sistema-sob-medida-saas",
	"aplicativo-mobile",
	"integracao-bling-marketplaces",
];

const DEMO_SLUGS = ["ai-saas", "bakery", "dashboard", "fintech", "gym", "luxury"];

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	const entry = (
		path: string,
		priority: number,
		changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
		languages?: Record<string, string>,
	): MetadataRoute.Sitemap[number] => ({
		url: `${BASE_URL}${path}`,
		lastModified: now,
		changeFrequency,
		priority,
		...(languages ? { alternates: { languages } } : {}),
	});

	const homeLangs = { en: `${BASE_URL}`, "pt-BR": `${BASE_URL}/pt` };
	const cvLangs = { en: `${BASE_URL}/cv`, "pt-BR": `${BASE_URL}/pt/cv` };

	return [
		entry("", 1, "monthly", homeLangs),
		entry("/pt", 1, "monthly", homeLangs),
		entry("/cv", 0.8, "monthly", cvLangs),
		entry("/pt/cv", 0.8, "monthly", cvLangs),
		// Páginas de serviço (pt-BR): o que o cliente brasileiro procura.
		entry("/servicos", 0.9, "monthly"),
		...SERVICE_SLUGS.map((s) => entry(`/servicos/${s}`, 0.9, "monthly")),
		// Cases com URL própria (antes só existiam no overlay da home).
		entry("/cases", 0.8, "monthly"),
		...projects.map((p) => entry(`/cases/${p.slug}`, 0.7, "yearly")),
		// Laboratório de UI: páginas reais, canonical própria.
		...DEMO_SLUGS.map((d) => entry(`/demos/${d}`, 0.4, "yearly")),
	];
}
