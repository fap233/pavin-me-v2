import React from "react";
import "../globals.css";

import Providers from "@/components/providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { fontClassName } from "../fonts";

/**
 * Terceiro root layout: páginas em português SEM o chrome do site (sem Header
 * e Footer), como o /cliente, mas com <html lang="pt-BR"> vindo do servidor.
 * Hoje só serve o /portal-exemplo. Sem analytics, de propósito: é uma página de
 * demonstração e não precisa de rastreio.
 */
export default function PortalPtLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className={fontClassName}>
			<body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
				<LanguageProvider initialLanguage="pt">
					<Providers>{children}</Providers>
				</LanguageProvider>
			</body>
		</html>
	);
}
