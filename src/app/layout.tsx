import React from "react";
import "./globals.css";

import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import Providers from "@/components/providers";
import { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
	title: "Pavin.me - Fullstack Developer",
	description:
		"Personal Fellipe Pavin portfolio, a Fullstack Developer specialized in React, Node.js, and cloud technologies.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
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
