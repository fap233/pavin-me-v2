"use client";

import { cn } from "@/lib/utils";
import React, { useCallback, useEffect, useState } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

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

export default function Providers({ children }: { children: React.ReactNode }) {
	const { isDarkMode, toggleDarkMode } = useTheme();

	return (
		<div className={cn("min-h-screen", isDarkMode ? "dark" : "")}>
			<Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
			<main>{children}</main>
			<Footer />
		</div>
	);
}
