import Link from "next/link";
import { Flame, Instagram, Youtube, MapPin } from "lucide-react";
import { PROGRAMS, UNITS } from "../_data/gym";

/**
 * Rodapé compartilhado. O `pb-28` existe pra não deixar a pílula fixa
 * "Voltar ao portfólio" (canto inferior esquerdo, z-100) cobrir texto útil.
 */
export default function GymFooter() {
	return (
		<footer className="bg-black border-t-4 border-yellow-500 px-6 pt-16 pb-28">
			<div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-4">
				<div className="md:col-span-1">
					<div className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-2 mb-4">
						<Flame className="text-yellow-500 fill-yellow-500" />
						IRON<span className="text-yellow-500">FORGE</span>
					</div>
					<p className="text-neutral-500 text-sm font-medium leading-relaxed">
						Alta intensidade. Equipamentos de elite. Uma comunidade que não
						aceita falhas.
					</p>
					<div className="flex gap-3 mt-6">
						<span className="w-10 h-10 -skew-x-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-yellow-500 hover:border-yellow-500 transition-colors cursor-pointer">
							<Instagram size={18} className="skew-x-12" />
						</span>
						<span className="w-10 h-10 -skew-x-12 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 hover:text-yellow-500 hover:border-yellow-500 transition-colors cursor-pointer">
							<Youtube size={18} className="skew-x-12" />
						</span>
					</div>
				</div>

				<div>
					<h3 className="font-black italic uppercase text-white mb-4 tracking-tighter">
						Programas
					</h3>
					<ul className="space-y-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
						{PROGRAMS.map((p) => (
							<li key={p.slug}>
								<Link
									href={`/demos/gym/programas/${p.slug}`}
									className="hover:text-yellow-500 transition-colors"
								>
									{p.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className="font-black italic uppercase text-white mb-4 tracking-tighter">
						A Academia
					</h3>
					<ul className="space-y-2 text-sm font-bold uppercase tracking-widest text-neutral-500">
						<li>
							<Link
								href="/demos/gym/planos"
								className="hover:text-yellow-500 transition-colors"
							>
								Planos
							</Link>
						</li>
						<li>
							<Link
								href="/demos/gym/treinadores"
								className="hover:text-yellow-500 transition-colors"
							>
								Treinadores
							</Link>
						</li>
						<li>
							<Link
								href="/demos/gym/unidades"
								className="hover:text-yellow-500 transition-colors"
							>
								Unidades
							</Link>
						</li>
						<li>
							<Link
								href="/demos/gym/matricula"
								className="hover:text-yellow-500 transition-colors"
							>
								Matricule-se
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h3 className="font-black italic uppercase text-white mb-4 tracking-tighter">
						Unidades
					</h3>
					<ul className="space-y-4 text-sm text-neutral-500 font-medium">
						{UNITS.map((u) => (
							<li key={u.id} className="flex gap-2">
								<MapPin size={16} className="text-yellow-500 shrink-0 mt-0.5" />
								<span>
									<Link
										href="/demos/gym/unidades"
										className="text-neutral-300 font-bold hover:text-yellow-500 transition-colors"
									>
										{u.name.replace("Iron Forge — ", "")}
									</Link>
									<br />
									{u.phone}
								</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-2 justify-between text-xs font-bold uppercase tracking-widest text-neutral-600">
				<span>© 2026 Iron Forge Academia — CNPJ 41.882.309/0001-14</span>
				<span>Demo fictícia — projeto de portfólio</span>
			</div>
		</footer>
	);
}
