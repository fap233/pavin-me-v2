"use client";

import React from "react";
import { Button } from "../ui/button";
import { Moon, Sun, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
	const { language, setLanguage } = useLanguage();

	const navItems = [
		{ name: language === "en" ? "About" : "Sobre", href: "#about" },
		{ name: language === "en" ? "Projects" : "Projetos", href: "#projects" },
		{ name: language === "en" ? "Contact" : "Contato", href: "#contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm transition-colors duration-500">
			<div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<a
					href="#hero"
					className="text-xl font-bold tracking-tight transition-colors hover:text-primary"
				>
					Pavin<span className="text-primary">.dev</span>
				</a>

				<nav className="hidden items-center space-x-6 md:flex">
					{navItems.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							{item.name}
						</a>
					))}
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
