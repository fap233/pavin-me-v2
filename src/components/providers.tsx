"use client";

import React from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

// Componente interno para aplicar a classe no div wrapper
function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { isDarkMode } = useTheme();
	return (
		<div className={cn("min-h-screen", isDarkMode ? "dark" : "")}>
			{children}
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
