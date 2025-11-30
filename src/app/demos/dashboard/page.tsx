"use client";

import {
	LayoutDashboard,
	Users,
	ShoppingBag,
	Settings,
	Bell,
	Search,
	Menu,
	ArrowUp,
	ArrowDown,
	MoreVertical,
	DollarSign,
	Activity,
	CreditCard,
} from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
			{/* Sidebar Lateral */}
			<aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col h-full fixed left-0 top-0 z-10">
				<div className="h-16 flex items-center px-6 border-b border-slate-800">
					<div className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
						<div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
							<Activity className="text-white" size={18} />
						</div>
						ADMIN<span className="text-indigo-400">UI</span>
					</div>
				</div>

				<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
					<p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">
						Principal
					</p>
					<a
						href="#"
						className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-400 rounded-lg border border-indigo-500/10 font-medium"
					>
						<LayoutDashboard size={20} /> Dashboard
					</a>
					<a
						href="#"
						className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
					>
						<Users size={20} /> Clientes
					</a>
					<a
						href="#"
						className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
					>
						<ShoppingBag size={20} /> Pedidos
					</a>

					<p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-8">
						Sistema
					</p>
					<a
						href="#"
						className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
					>
						<Settings size={20} /> Configurações
					</a>
				</nav>

				<div className="p-4 border-t border-slate-800">
					<div className="flex items-center gap-3">
						{/* Avatar placeholder */}
						<div className="w-10 h-10 rounded-full border-2 border-slate-600 bg-slate-700 flex items-center justify-center text-white font-bold">
							FP
						</div>
						<div>
							<p className="text-sm font-medium text-white">Fellipe Dev</p>
							<p className="text-xs text-slate-500">Admin Master</p>
						</div>
					</div>
				</div>
			</aside>

			{/* Conteúdo Principal (Offset da Sidebar) */}
			<main className="flex-1 flex flex-col md:ml-64 min-h-screen">
				{/* Topbar */}
				<header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
					<div className="flex items-center gap-4">
						<button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
							<Menu size={20} />
						</button>
						<div className="relative hidden sm:block">
							<Search
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								size={18}
							/>
							<input
								type="text"
								placeholder="Buscar dados..."
								className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 bg-slate-50"
							/>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
							<Bell size={20} />
							<span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
						</button>
					</div>
				</header>

				{/* Scrollable Content */}
				<div className="flex-1 p-6 md:p-8 overflow-y-auto">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
						<div>
							<h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
							<p className="text-slate-500">
								Bem-vindo de volta! Aqui está o resumo de hoje.
							</p>
						</div>
						<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
							Download Relatório
						</button>
					</div>

					{/* Cards Stats */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{[
							{
								title: "Receita Total",
								value: "R$ 54.230",
								trend: "+12.5%",
								positive: true,
								icon: DollarSign,
								color: "bg-green-100 text-green-600",
							},
							{
								title: "Usuários Ativos",
								value: "2.450",
								trend: "+5.2%",
								positive: true,
								icon: Users,
								color: "bg-blue-100 text-blue-600",
							},
							{
								title: "Novos Pedidos",
								value: "345",
								trend: "-2.4%",
								positive: false,
								icon: ShoppingBag,
								color: "bg-orange-100 text-orange-600",
							},
							{
								title: "Ticket Médio",
								value: "R$ 145",
								trend: "+3.1%",
								positive: true,
								icon: CreditCard,
								color: "bg-purple-100 text-purple-600",
							},
						].map((stat, i) => (
							<div
								key={i}
								className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
							>
								<div className="flex justify-between items-start mb-4">
									<div className={`p-3 rounded-lg ${stat.color}`}>
										<stat.icon size={20} />
									</div>
									<span
										className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
									>
										{stat.positive ? (
											<ArrowUp size={12} className="mr-1" />
										) : (
											<ArrowDown size={12} className="mr-1" />
										)}
										{stat.trend}
									</span>
								</div>
								<h3 className="text-slate-500 text-sm font-medium">
									{stat.title}
								</h3>
								<p className="text-2xl font-bold text-slate-800 mt-1">
									{stat.value}
								</p>
							</div>
						))}
					</div>

					<div className="grid lg:grid-cols-3 gap-8">
						{/* Chart Area (Simulado com CSS) */}
						<div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
							<div className="flex justify-between items-center mb-8">
								<h3 className="font-bold text-slate-800">Receita Mensal</h3>
								<select className="text-sm border-none bg-slate-50 rounded-md px-2 py-1 text-slate-500 cursor-pointer outline-none">
									<option>Últimos 6 meses</option>
									<option>Este ano</option>
								</select>
							</div>

							<div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
								{[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map(
									(height, i) => (
										<div
											key={i}
											className="w-full bg-indigo-50 rounded-t-lg relative group h-full flex items-end"
										>
											<div
												className="w-full bg-indigo-500 rounded-t-md hover:bg-indigo-600 transition-all duration-500 relative"
												style={{ height: `${height}%` }}
											>
												{/* Tooltip on Hover */}
												<div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
													R$ {height}k
												</div>
											</div>
										</div>
									),
								)}
							</div>
							<div className="flex justify-between mt-4 text-xs text-slate-400 uppercase font-medium">
								<span>Jan</span>
								<span>Fev</span>
								<span>Mar</span>
								<span>Abr</span>
								<span>Mai</span>
								<span>Jun</span>
								<span>Jul</span>
								<span>Ago</span>
								<span>Set</span>
								<span>Out</span>
								<span>Nov</span>
								<span>Dez</span>
							</div>
						</div>

						{/* Recent Activity List */}
						<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
							<h3 className="font-bold text-slate-800 mb-6">
								Atividade Recente
							</h3>
							<div className="space-y-6">
								{[
									{
										user: "Ana Silva",
										action: "Novo pedido #1234",
										time: "2 min atrás",
										color: "bg-pink-500",
									},
									{
										user: "Carlos Oliveira",
										action: "Assinatura renovada",
										time: "15 min atrás",
										color: "bg-blue-500",
									},
									{
										user: "Marcos Tech",
										action: "Ticket de suporte",
										time: "1 hora atrás",
										color: "bg-green-500",
									},
									{
										user: "Julia Dev",
										action: "Novo usuário",
										time: "3 horas atrás",
										color: "bg-yellow-500",
									},
									{
										user: "Roberto S.",
										action: "Pagamento falhou",
										time: "5 horas atrás",
										color: "bg-red-500",
									},
								].map((item, i) => (
									<div key={i} className="flex items-center gap-4">
										<div
											className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-xs`}
										>
											{item.user.charAt(0)}
										</div>
										<div className="flex-1">
											<p className="text-sm font-medium text-slate-800">
												{item.user}
											</p>
											<p className="text-xs text-slate-500">{item.action}</p>
										</div>
										<span className="text-xs text-slate-400 whitespace-nowrap">
											{item.time}
										</span>
									</div>
								))}
							</div>
							<button className="w-full mt-8 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
								Ver todo histórico
							</button>
						</div>
					</div>

					{/* Table Section */}
					<div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
						<div className="p-6 border-b border-slate-200 flex justify-between items-center">
							<h3 className="font-bold text-slate-800">Últimos Pedidos</h3>
							<button className="text-slate-400 hover:text-slate-600">
								<MoreVertical size={20} />
							</button>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm text-slate-600">
								<thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500">
									<tr>
										<th className="px-6 py-4">ID do Pedido</th>
										<th className="px-6 py-4">Cliente</th>
										<th className="px-6 py-4">Status</th>
										<th className="px-6 py-4">Valor</th>
										<th className="px-6 py-4">Data</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{[
										{
											id: "#ORD-001",
											client: "Google Inc.",
											status: "Concluído",
											value: "R$ 4.500",
											date: "24 Nov, 2024",
											statusColor: "bg-green-100 text-green-700",
										},
										{
											id: "#ORD-002",
											client: "Amazon AWS",
											status: "Pendente",
											value: "R$ 1.200",
											date: "23 Nov, 2024",
											statusColor: "bg-yellow-100 text-yellow-700",
										},
										{
											id: "#ORD-003",
											client: "Meta Ads",
											status: "Cancelado",
											value: "R$ 890",
											date: "22 Nov, 2024",
											statusColor: "bg-red-100 text-red-700",
										},
										{
											id: "#ORD-004",
											client: "Spotify",
											status: "Concluído",
											value: "R$ 2.300",
											date: "21 Nov, 2024",
											statusColor: "bg-green-100 text-green-700",
										},
									].map((row, i) => (
										<tr key={i} className="hover:bg-slate-50 transition-colors">
											<td className="px-6 py-4 font-medium text-slate-900">
												{row.id}
											</td>
											<td className="px-6 py-4">{row.client}</td>
											<td className="px-6 py-4">
												<span
													className={`px-3 py-1 rounded-full text-xs font-bold ${row.statusColor}`}
												>
													{row.status}
												</span>
											</td>
											<td className="px-6 py-4">{row.value}</td>
											<td className="px-6 py-4">{row.date}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
