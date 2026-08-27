"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, Menu, X } from "lucide-react";

const LINKS = [
	{ href: "/demos/gym/programas", label: "Programas" },
	{ href: "/demos/gym/planos", label: "Planos" },
	{ href: "/demos/gym/treinadores", label: "Treinadores" },
	{ href: "/demos/gym/unidades", label: "Unidades" },
];

export default function GymNav() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	// Fecha o menu mobile ao trocar de rota — senão o painel fica aberto por cima
	// da página nova depois do clique.
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<nav className="fixed w-full z-50 bg-black/90 border-b border-white/10 backdrop-blur-sm">
			<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
				<Link
					href="/demos/gym"
					className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2 shrink-0"
				>
					<Flame className="text-yellow-500 fill-yellow-500" />
					IRON<span className="text-yellow-500">FORGE</span>
				</Link>

				<div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-neutral-400">
					{LINKS.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`relative transition-colors hover:text-yellow-500 ${
								isActive(link.href) ? "text-yellow-500" : ""
							}`}
						>
							{link.label}
							{isActive(link.href) ? (
								<span className="absolute -bottom-2 left-0 h-1 w-full bg-yellow-500 -skew-x-12" />
							) : null}
						</Link>
					))}
				</div>

				<div className="flex items-center gap-4">
					<Link
						href="/demos/gym/matricula"
						className="hidden sm:inline-block bg-yellow-500 text-black px-6 py-2 font-black uppercase italic -skew-x-12 hover:bg-white transition-colors"
					>
						<span className="skew-x-12 block">Matricule-se</span>
					</Link>

					<button
						type="button"
						aria-label={open ? "Fechar menu" : "Abrir menu"}
						aria-expanded={open}
						onClick={() => setOpen((v) => !v)}
						className="md:hidden text-white hover:text-yellow-500 transition-colors"
					>
						{open ? <X size={28} /> : <Menu size={28} />}
					</button>
				</div>
			</div>

			{/* Menu mobile */}
			{open ? (
				<div className="md:hidden border-t border-white/10 bg-black">
					<div className="px-6 py-4 flex flex-col">
						{LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className={`py-4 border-b border-white/5 font-black italic uppercase text-2xl tracking-tighter transition-colors ${
									isActive(link.href)
										? "text-yellow-500"
										: "text-white hover:text-yellow-500"
								}`}
							>
								{link.label}
							</Link>
						))}
						<Link
							href="/demos/gym/matricula"
							className="mt-6 mb-2 bg-yellow-500 text-black px-6 py-4 text-center font-black uppercase italic -skew-x-12 hover:bg-white transition-colors"
						>
							<span className="skew-x-12 block">Matricule-se</span>
						</Link>
					</div>
				</div>
			) : null}
		</nav>
	);
}
