"use client";

import React, { useCallback, useEffect, useState } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const useTheme = () => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		if (typeof window !== "undefined") {
			const savedTheme = localStorage.getItem("theme");
			if (savedTheme === "dark") return true;
			if (savedTheme === "light") return false;
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return true;
	});

	useEffect(() => {
		const root = window.document.documentElement;
		if (isDarkMode) {
			root.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			root.classList.remove("dark");
			localStorage.setItem("theme", "light");
		}
	}, [isDarkMode]);

	const toggleDarkMode = useCallback(() => {
		setIsDarkMode((prev) => !prev);
	}, []);

	return { isDarkMode, toggleDarkMode };
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isDarkMode, toggleDarkMode } = useTheme();

	return (
		<html lang="en" className={cn("min-h-screen", isDarkMode ? "dark" : "")}>
			<body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-500">
				<Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
