import React from "react";
import { Inter, Caveat } from "next/font/google";
import "./globals.css";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Providers from "@/components/providers";
import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-caveat",
	display: "swap",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://pavin.me"),
	title: {
		default: "Fellipe Pavin · Software Engineer (Go, React, Node.js)",
		template: "%s · Fellipe Pavin",
	},
	description:
		"Software Engineer with 9+ years of production experience. Founded a multi-tenant SaaS scaled to 10,000+ paying users. Full-cycle ownership across Go, TypeScript, Node.js and React/Next.js. Open to remote and contract roles worldwide.",
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
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		alternateLocale: "pt_BR",
		url: "https://pavin.me",
		title: "Fellipe Pavin · Software Engineer (Go, React, Node.js)",
		description:
			"9+ years building production SaaS at scale. Founded a multi-tenant SaaS to 10,000+ paying users. Open to remote and contract roles worldwide.",
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
		<html
			lang="en"
			suppressHydrationWarning
			className={`${inter.variable} ${caveat.variable}`}
		>
			<body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
				<GoogleAnalytics />
				<SpeedInsights />

				<LanguageProvider>
					<Providers>{children}</Providers>
				</LanguageProvider>
			</body>
		</html>
	);
}
