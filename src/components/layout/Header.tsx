import React from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

interface HeaderProps {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
	const navItems = [
		{ name: "About", href: "#about" },
		{ name: "Projects", href: "#projects" },
		{ name: "Contact", href: "#contact" },
	];

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
			<div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<a
					href="#hero"
					className="text-xl tracking-tight transition-colors hover:text-primary"
				>
					Pavin
					<span className="text-primary">.dev</span>
				</a>
				<nav className="hidden items-center space-x-4 md:flex">
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
				<div className="flex items-center space-x-2">
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
		</header>
	);
};

export default Header;
