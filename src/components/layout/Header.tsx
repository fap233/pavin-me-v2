"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Moon, Sun, Github, Linkedin, FileText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const Header = () => {
	const { language, setLanguage, t } = useLanguage();
	const { isDarkMode, toggleDarkMode } = useTheme();

	const navItems = [
		{ name: t.nav.about, href: "/#about" },
		{ name: t.nav.projects, href: "/#projects" },
		{ name: t.nav.contact, href: "/#contact" },
		{ name: t.nav.cv, href: "/cv", icon: FileText },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm transition-colors duration-500">
			<div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link
					href="/"
					className="text-xl font-bold tracking-tight transition-colors hover:text-primary group"
				>
					Pavin
					<span className="font-[family-name:var(--font-caveat)] text-primary text-2xl ml-0.5 inline-block transition-transform group-hover:rotate-[-3deg]">
						.dev
					</span>
				</Link>

				<nav className="hidden items-center space-x-6 md:flex">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isCv = item.href === "/cv";
						const className = isCv
							? "text-sm font-medium inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
							: "text-sm font-medium transition-colors hover:text-primary";
						return isCv ? (
							<Link key={item.name} href={item.href} className={className}>
								{Icon && <Icon className="h-3.5 w-3.5" />}
								{item.name}
							</Link>
						) : (
							<a key={item.name} href={item.href} className={className}>
								{item.name}
							</a>
						);
					})}
				</nav>

				<div className="flex items-center gap-4">
					<div className="flex items-center bg-secondary/50 rounded-full p-1 border border-border">
						<button
							onClick={() => setLanguage("pt")}
							className={`px-3 py-1 text-xs rounded-full transition-all ${
								language === "pt"
									? "bg-primary text-primary-foreground font-bold shadow-sm"
									: "hover:text-primary text-muted-foreground"
							}`}
						>
							PT
						</button>
						<button
							onClick={() => setLanguage("en")}
							className={`px-3 py-1 text-xs rounded-full transition-all ${
								language === "en"
									? "bg-primary text-primary-foreground font-bold shadow-sm"
									: "hover:text-primary text-muted-foreground"
							}`}
						>
							EN
						</button>
					</div>

					<div className="h-4 w-px bg-border hidden sm:block" />

					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="hidden sm:inline-flex"
						>
							<a
								href="https://github.com/fap233"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="h-5 w-5" />
							</a>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							asChild
							className="hidden sm:inline-flex"
						>
							<a
								href="https://linkedin.com/in/fellipe-pavin"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Linkedin className="h-5 w-5" />
							</a>
						</Button>

						<Button
							variant="ghost"
							size="icon"
							onClick={toggleDarkMode}
							aria-label="Toggle Dark Mode"
						>
							{isDarkMode ? (
								<Sun className="h-5 w-5" />
							) : (
								<Moon className="h-5 w-5" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
