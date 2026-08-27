import React from "react";
import type { Metadata } from "next";
import "../globals.css";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Providers from "@/components/providers";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { fontClassName } from "../fonts";

/**
 * ROOT layout das páginas em português (/pt, /servicos, /cases). É um segundo
 * root layout (route group (main-pt)), irmão do (en): mesma casca (fontes,
 * providers, analytics, JSON-LD), mas o <html lang="pt-BR"> sai do SERVIDOR e
 * o Header/Footer/formulário renderizam em português desde o primeiro byte.
 * Navegar entre uma árvore e outra faz reload completo (esperado no Next).
 */
export const metadata: Metadata = {
	metadataBase: new URL("https://pavin.me"),
	title: {
		default: "Fellipe Pavin · Desenvolvedor Full Stack (sites, sistemas, automação)",
		template: "%s · Fellipe Pavin",
	},
	description:
		"Desenvolvedor de software full stack com 9+ anos de experiência. Criação de sites e lojas virtuais, automação com n8n e WhatsApp, sistemas e SaaS sob medida e aplicativos. Atendimento remoto para todo o Brasil.",
	authors: [{ name: "Fellipe Pavin", url: "https://pavin.me" }],
	creator: "Fellipe Pavin",
	publisher: "Fellipe Pavin",
	openGraph: {
		type: "website",
		locale: "pt_BR",
		alternateLocale: "en_US",
		siteName: "pavin.me",
	},
	twitter: {
		card: "summary_large_image",
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

export default function MainPtLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className={fontClassName}>
			<body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
				<SiteJsonLd />
				<GoogleAnalytics />
				<SpeedInsights />
				<SmoothScroll />

				<LanguageProvider initialLanguage="pt">
					<Providers>
						<Header />
						<main>{children}</main>
						<Footer />
					</Providers>
				</LanguageProvider>
			</body>
		</html>
	);
}
