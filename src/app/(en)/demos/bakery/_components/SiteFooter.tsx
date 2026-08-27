import Link from "next/link";
import { Clock, Facebook, Instagram, MapPin } from "lucide-react";

/**
 * Rodapé da Farine — montado no layout, aparece em todas as páginas da demo.
 * Server component: não tem estado, não precisa virar client.
 */

const NAV = [
	{ href: "/demos/bakery", label: "Início" },
	{ href: "/demos/bakery/cardapio", label: "Cardápio" },
	{ href: "/demos/bakery/historia", label: "Nossa História" },
	{ href: "/demos/bakery/locais", label: "Locais" },
	{ href: "/demos/bakery/pedido", label: "Peça Online" },
];

export function SiteFooter() {
	return (
		<footer className="bg-[#F3EFEA] border-t border-stone-200 py-16 px-6 font-sans">
			<div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
				<div>
					<Link
						href="/demos/bakery"
						className="inline-block text-xl font-serif font-bold tracking-widest text-stone-900 uppercase mb-6 hover:text-orange-800 transition-colors"
					>
						Farine.
					</Link>
					<p className="text-stone-600 text-sm leading-relaxed">
						Padaria artesanal focada em ingredientes reais e processos lentos.
						Feito com amor em São Paulo.
					</p>
				</div>

				<div>
					<h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">
						Navegue
					</h4>
					<ul className="space-y-3 text-stone-600 text-sm">
						{NAV.map((item) => (
							<li key={item.href}>
								<Link
									href={item.href}
									className="hover:text-orange-700 transition-colors"
								>
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">
						Contato
					</h4>
					<div className="space-y-3 text-stone-600 text-sm">
						<Link
							href="/demos/bakery/locais"
							className="flex items-center gap-3 hover:text-orange-700 transition-colors"
						>
							<MapPin size={16} /> Rua dos Pinheiros, 1234
						</Link>
						<div className="flex items-center gap-3">
							<Instagram size={16} /> @farine.padaria
						</div>
						<div className="flex items-center gap-3">
							<Facebook size={16} /> /farinepadaria
						</div>
					</div>
				</div>

				<div>
					<h4 className="font-bold text-stone-900 mb-6 uppercase text-xs tracking-widest">
						Horários
					</h4>
					<div className="space-y-2 text-stone-600 text-sm">
						<p>Seg - Sex: 07h às 19h</p>
						<p>Sáb - Dom: 08h às 16h</p>
						<p className="flex items-center gap-2 pt-2 text-orange-700">
							<Clock size={14} /> Fornadas: 07h · 11h · 16h
						</p>
					</div>
				</div>
			</div>

			<div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-stone-200/80 text-xs text-stone-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
				<span>© {new Date().getFullYear()} Farine Padaria Artesanal.</span>
				<span className="italic">
					Demo fictícia — produtos, preços e endereços são ilustrativos.
				</span>
			</div>
		</footer>
	);
}
