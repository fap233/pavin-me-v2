"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Moon, Sun, Github, Linkedin, FileText } from "lucide-react";
import { flushSync } from "react-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { scrambleDocument } from "@/lib/scramble";

const Header = () => {
	const { language, setLanguage, t } = useLanguage();
	const { isDarkMode, toggleDarkMode } = useTheme();

	// Language: swap synchronously, then matrix-scramble the visible text so
	// the page reads as being live-translated into the chosen language.
	const switchLanguage = (lang: "pt" | "en") => {
		if (lang === language) return;
		flushSync(() => setLanguage(lang));
		scrambleDocument();
	};

	// Theme: paint the new theme over the old one — a circular wash expanding
	// from the toggle (View Transitions API; plain toggle where unsupported).
	const switchTheme = (event: React.MouseEvent) => {
		const doc = document as Document & {
			startViewTransition?: (cb: () => void) => { ready: Promise<void> };
		};
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!doc.startViewTransition || reduced) {
			toggleDarkMode();
			return;
		}

		const x = event.clientX;
		const y = event.clientY;
		const radius =
			Math.hypot(
				Math.max(x, window.innerWidth - x),
				Math.max(y, window.innerHeight - y),
			) * 1.2;

		// Irregular blot instead of a perfect circle — the new theme spreads
		// like ink soaking into paper.
		const POINTS = 26;
		const jitter = Array.from(
			{ length: POINTS },
			() => 0.8 + Math.random() * 0.45,
		);
		const blot = (scale: number) =>
			`polygon(${Array.from({ length: POINTS }, (_, i) => {
				const angle = (i / POINTS) * Math.PI * 2;
				const r = radius * scale * jitter[i];
				return `${(x + Math.cos(angle) * r).toFixed(1)}px ${(y + Math.sin(angle) * r).toFixed(1)}px`;
			}).join(",")})`;

		const transition = doc.startViewTransition(() => {
			flushSync(() => toggleDarkMode());
		});
		transition.ready.then(() => {
			document.documentElement.animate(
				{ clipPath: [blot(0.004), blot(1)] },
				{
					duration: 780,
					easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		});
	};

	// Floating pill (lemontree.studio-style): detached from the top, hides
	// when scrolling down and glides back in on the first scroll up.
	const [hidden, setHidden] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		let lastY = window.scrollY;
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				const y = window.scrollY;
				setScrolled(y > 24);
				if (Math.abs(y - lastY) > 6) {
					setHidden(y > lastY && y > 140);
					lastY = y;
				}
			});
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
		};
	}, []);

	const navItems = [
		{ name: t.nav.about, href: "/#about" },
		{ name: t.nav.services, href: "/servicos" },
		{ name: t.nav.cases, href: "/cases" },
		{ name: t.nav.contact, href: "/#contact" },
		{ name: t.nav.cv, href: "/cv", icon: FileText },
	];

	return (
		<header
			className={`fixed inset-x-0 top-3 z-50 px-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
				hidden ? "-translate-y-[130%]" : "translate-y-0"
			}`}
		>
			<div
				className={`mx-auto flex h-14 max-w-5xl items-center justify-between rounded-full border px-4 sm:px-6 backdrop-blur-md transition-all duration-500 ${
					scrolled
						? "bg-background/85 shadow-[0_10px_36px_-14px_rgb(0_0_0/0.45)] border-border"
						: "bg-background/55 border-border/60"
				}`}
			>
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
						// Links de página (/servicos, /cases, /cv) usam <Link>; âncoras da
						// home (/#about...) ficam em <a> pra rolagem suave funcionar.
						const isPage = !item.href.startsWith("/#");
						const className = isCv
							? "text-sm font-medium inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-3 py-1 transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
							: "text-sm font-medium transition-colors hover:text-primary";
						return isPage ? (
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
							onClick={() => switchLanguage("pt")}
							className={`px-3 py-1 text-xs rounded-full transition-all ${
								language === "pt"
									? "bg-primary text-primary-foreground font-bold shadow-sm"
									: "hover:text-primary text-muted-foreground"
							}`}
						>
							PT
						</button>
						<button
							onClick={() => switchLanguage("en")}
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
							onClick={(e) => switchTheme(e)}
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
