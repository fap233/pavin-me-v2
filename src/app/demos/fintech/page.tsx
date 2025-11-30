"use client";

import {
	Wallet,
	PieChart,
	ArrowUpRight,
	ShieldCheck,
	Globe,
} from "lucide-react";

export default function FintechPage() {
	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
			{/* Navbar Minimalista */}
			<nav className="fixed w-full z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<div className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
						<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
							<Wallet size={18} />
						</div>
						Lumina.
					</div>
					<div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
						<a href="#" className="hover:text-blue-600">
							Pessoal
						</a>
						<a href="#" className="hover:text-blue-600">
							Business
						</a>
						<a href="#" className="hover:text-blue-600">
							Cartões
						</a>
					</div>
					<div className="flex gap-4">
						<button className="hidden md:block text-slate-600 font-medium hover:text-slate-900">
							Login
						</button>
						<button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
							Abrir conta
						</button>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-6">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-600">
							<span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
							NOVO: Cashback em Cripto
						</div>
						<h1 className="text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
							O banco que <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
								amplia sua visão.
							</span>
						</h1>
						<p className="text-lg text-slate-500 max-w-md leading-relaxed">
							Sem taxas ocultas, sem agências lotadas. Apenas uma experiência
							financeira fluida desenhada para o seu crescimento.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2">
								Começar agora <ArrowUpRight size={18} />
							</button>
							<button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-50 transition-all">
								Ver planos
							</button>
						</div>

						<div className="pt-8 flex items-center gap-4 text-sm text-slate-500">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden`}
									>
										<img
											src={`https://i.pravatar.cc/100?img=${i + 10}`}
											alt="User"
										/>
									</div>
								))}
							</div>
							<p>Junte-se a +2 milhões de usuários</p>
						</div>
					</div>

					{/* Visual Element: Cards 3D Effect */}
					<div className="relative h-[500px] flex items-center justify-center perspective-1000">
						{/* Background Blob */}
						<div className="absolute w-[400px] h-[400px] bg-blue-200/50 rounded-full blur-3xl -z-10 animate-pulse"></div>

						{/* Card 1 (Back) */}
						<div className="absolute top-10 right-10 w-80 h-48 bg-slate-900 rounded-2xl shadow-2xl rotate-6 opacity-40 scale-90"></div>

						{/* Card 2 (Main) */}
						<div className="relative w-96 h-60 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl text-white p-8 flex flex-col justify-between transform transition-transform hover:scale-105 duration-500 border border-slate-700/50 z-20">
							<div className="flex justify-between items-start">
								<Wallet className="opacity-80" />
								<span className="font-mono text-lg tracking-widest opacity-50">
									LUMINA
								</span>
							</div>
							<div>
								<div className="font-mono text-xl tracking-widest mb-4 opacity-90">
									**** **** **** 4291
								</div>
								<div className="flex justify-between items-end opacity-80">
									<div>
										<div className="text-[10px] uppercase tracking-wider mb-1">
											Titular
										</div>
										<div className="font-medium">FELLIPE DEV</div>
									</div>
									<div className="w-10 h-6 bg-white/20 rounded flex items-center justify-center">
										<div className="w-4 h-4 rounded-full bg-red-500 opacity-80 -mr-2"></div>
										<div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80"></div>
									</div>
								</div>
							</div>
							{/* Glass reflection */}
							<div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-3xl pointer-events-none"></div>
						</div>

						{/* Floating Notification */}
						<div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-30 animate-bounce-slow">
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
								<ArrowUpRight size={20} />
							</div>
							<div>
								<p className="text-xs text-slate-500 font-medium">
									Transferência recebida
								</p>
								<p className="font-bold text-slate-900">+ R$ 1.250,00</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Bento Grid Features */}
			<section className="py-20 px-6 bg-white">
				<div className="max-w-7xl mx-auto">
					<div className="text-center max-w-2xl mx-auto mb-16">
						<h2 className="text-3xl font-bold text-slate-900 mb-4">
							Tudo o que você precisa em um app
						</h2>
						<p className="text-slate-500">
							Controle total sobre suas finanças com tecnologia de ponta e
							segurança bancária.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Feature 1 - Large */}
						<div className="md:col-span-2 bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors group overflow-hidden relative">
							<div className="relative z-10">
								<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-6">
									<PieChart />
								</div>
								<h3 className="text-2xl font-bold mb-2">
									Analytics em Tempo Real
								</h3>
								<p className="text-slate-500 max-w-sm">
									Categorização automática de gastos para você saber exatamente
									para onde seu dinheiro vai.
								</p>
							</div>
							<div className="absolute right-0 bottom-0 w-64 h-40 bg-white rounded-tl-2xl shadow-sm border-t border-l border-slate-100 p-4 translate-y-4 translate-x-4 group-hover:translate-y-2 group-hover:translate-x-2 transition-transform">
								<div className="flex items-end gap-2 h-full pb-2">
									<div className="w-1/5 bg-blue-100 h-[40%] rounded-t-md"></div>
									<div className="w-1/5 bg-blue-200 h-[70%] rounded-t-md"></div>
									<div className="w-1/5 bg-blue-600 h-[50%] rounded-t-md"></div>
									<div className="w-1/5 bg-blue-300 h-[80%] rounded-t-md"></div>
									<div className="w-1/5 bg-blue-100 h-[60%] rounded-t-md"></div>
								</div>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 mb-6">
								<ShieldCheck />
							</div>
							<h3 className="text-xl font-bold mb-2">Cofre Seguro</h3>
							<p className="text-slate-500 text-sm">
								Proteção biométrica e criptografia de ponta a ponta para seus
								investimentos.
							</p>
						</div>

						{/* Feature 3 */}
						<div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 hover:border-blue-200 transition-colors">
							<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 mb-6">
								<Globe />
							</div>
							<h3 className="text-xl font-bold mb-2">Conta Global</h3>
							<p className="text-slate-500 text-sm">
								Converta moedas instantaneamente com a menor taxa do mercado.
							</p>
						</div>

						{/* Feature 4 - Large */}
						<div className="md:col-span-2 bg-slate-900 text-white rounded-[2rem] p-8 flex items-center justify-between overflow-hidden relative">
							<div className="relative z-10 max-w-md">
								<h3 className="text-2xl font-bold mb-2">Lumina Black</h3>
								<p className="text-slate-400 mb-6">
									Acesse salas VIP em aeroportos e tenha concierge 24h.
								</p>
								<button className="text-sm font-bold border-b border-white pb-1 hover:text-blue-300 hover:border-blue-300 transition-colors">
									CONHECER BENEFÍCIOS
								</button>
							</div>
							<div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]"></div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
