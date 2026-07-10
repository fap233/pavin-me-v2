"use client";

import React from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { SiteBackground } from "@/components/SiteBackground";
import { TransitionVeilProvider } from "@/components/TransitionVeil";
import { PaintProvider } from "@/contexts/PaintContext";

// Componente interno para aplicar a classe no div wrapper
function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { isDarkMode } = useTheme();
	return (
		<div
			className={cn(
				"relative min-h-screen bg-background",
				isDarkMode ? "dark" : "",
			)}
		>
			<PaintProvider>
				<TransitionVeilProvider>
					<SiteBackground />
					{children}
				</TransitionVeilProvider>
			</PaintProvider>
		</div>
	);
}

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<ThemeWrapper>{children}</ThemeWrapper>
		</ThemeProvider>
	);
}
