"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BASE, NAV_LINKS as LINKS } from "./site";

function isActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	// fecha o menu mobile sempre que a rota muda (senão ele fica aberto por cima
	// da página nova depois do clique)
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
			<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
				<Link
					href={BASE}
					className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white"
				>
					<Bot className="text-purple-500" />
					<span>
						NEXUS<span className="text-purple-500">AI</span>
					</span>
				</Link>

				<div className="hidden md:flex gap-8 text-sm text-slate-400">
					{LINKS.map((link) => {
						const active = isActive(pathname, link.href);
						return (
							<Link
								key={link.href}
								href={link.href}
								aria-current={active ? "page" : undefined}
								className={`relative transition-colors ${
									active ? "text-white" : "hover:text-white"
								}`}
							>
								{link.label}
								{active && (
									<span className="absolute -bottom-1.5 left-0 right-0 h-px bg-gradient-to-r from-purple-400 to-pink-600" />
								)}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-3">
					<Link
						href={`${BASE}/signup`}
						className="hidden sm:inline-flex bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors"
					>
						Early Access
					</Link>
					<button
						type="button"
						onClick={() => setOpen((v) => !v)}
						aria-expanded={open}
						aria-label={open ? "Close menu" : "Open menu"}
						className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
					>
						{open ? <X size={20} /> : <Menu size={20} />}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			{open && (
				<div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-md px-6 py-4">
					<div className="flex flex-col">
						{LINKS.map((link) => {
							const active = isActive(pathname, link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									aria-current={active ? "page" : undefined}
									className={`py-3 text-sm border-b border-white/5 transition-colors ${
										active
											? "text-white font-medium"
											: "text-slate-400 hover:text-white"
									}`}
								>
									{link.label}
								</Link>
							);
						})}
						<Link
							href={`${BASE}/signup`}
							className="mt-4 bg-white text-slate-950 px-4 py-2.5 rounded-full text-sm font-medium text-center hover:bg-slate-200 transition-colors"
						>
							Early Access
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
