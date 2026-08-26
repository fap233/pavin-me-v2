import React from "react";
import "../globals.css";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Providers from "@/components/providers";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { fontClassName } from "../fonts";

// ROOT layout da árvore em inglês (route group (en): home, cv, demos, admin,
// cliente, projetos). A árvore em português tem o próprio root em (main-pt),
// com <html lang="pt-BR"> saindo do servidor. Fontes compartilhadas em fonts.ts.

export const metadata: Metadata = {
	metadataBase: new URL("https://pavin.me"),
	title: {
		default: "Fellipe Pavin · Software Engineer (TypeScript, React, Node.js)",
		template: "%s · Fellipe Pavin",
	},
	description:
		"Full Stack Software Engineer with 9+ years of production experience. Founded a multi-tenant SaaS scaled to 10,000+ paying users at 99.9% uptime. 20+ B2B projects delivered across TypeScript, React/Next.js, Node.js, .NET and PostgreSQL. Open to remote and contract roles worldwide.",
	keywords: [
		"Software Engineer",
		"Full Stack Developer",
		"Full Stack Engineer",
		"Backend Engineer",
		"Go",
		"Golang",
		"TypeScript",
		"Node.js",
		"React",
		"Next.js",
		"PostgreSQL",
		"Docker",
		"SaaS",
		"Multi-tenant SaaS",
		"Full Cycle Engineer",
		"Remote Software Engineer",
		"Contract Software Engineer",
		"LATAM Software Engineer",
		"Brazil",
		"Fortaleza",
		"Fellipe Pavin",
		"pavin.me",
	],
	authors: [{ name: "Fellipe Pavin", url: "https://pavin.me" }],
	creator: "Fellipe Pavin",
	publisher: "Fellipe Pavin",
	alternates: {
		canonical: "https://pavin.me",
		// Home em inglês (raiz) e em português (/pt) apontam uma pra outra.
		languages: {
			en: "https://pavin.me",
			"pt-BR": "https://pavin.me/pt",
			"x-default": "https://pavin.me",
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		alternateLocale: "pt_BR",
		url: "https://pavin.me",
		title: "Fellipe Pavin · Software Engineer (TypeScript, React, Node.js)",
		description:
			"9+ years building production software at scale. Founded a multi-tenant SaaS to 10,000+ paying users. 20+ B2B projects delivered. Open to remote and contract roles worldwide.",
		siteName: "pavin.me",
	},
	twitter: {
		card: "summary_large_image",
		title: "Fellipe Pavin · Software Engineer",
		description:
			"9+ years building production SaaS at scale. Open to remote and contract roles worldwide.",
		creator: "@pavinfellipe",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className={fontClassName}>
			<body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
				<SiteJsonLd />
				<GoogleAnalytics />
				<SpeedInsights />
				<SmoothScroll />

				<LanguageProvider>
					<Providers>{children}</Providers>
				</LanguageProvider>
			</body>
		</html>
	);
}
