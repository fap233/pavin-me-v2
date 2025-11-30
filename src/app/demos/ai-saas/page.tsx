"use client";

import { Bot, Zap, Shield, ChevronRight, CheckCircle } from "lucide-react";

export default function AiSaasPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-purple-500 selection:text-white">
			{/* Navbar */}
			<nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
						<Bot className="text-purple-500" />
						<span>
							NEXUS<span className="text-purple-500">AI</span>
						</span>
					</div>
					<div className="hidden md:flex gap-8 text-sm text-slate-400">
						<a href="#" className="hover:text-white transition-colors">
							Features
						</a>
						<a href="#" className="hover:text-white transition-colors">
							Pricing
						</a>
						<a href="#" className="hover:text-white transition-colors">
							Docs
						</a>
					</div>
					<button className="bg-white text-slate-950 px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors">
						Early Access
					</button>
				</div>
			</nav>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-6 relative overflow-hidden">
				{/* Glow Effects */}
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-6">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						NEXUS V2.0 is now live
					</div>

					<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
						Automate your reality with <br />
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							Neural Intelligence
						</span>
					</h1>

					<p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
						Stop wasting time on manual tasks. Deploy autonomous agents that
						learn, adapt, and execute workflows 10x faster than humans.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group">
							Start Free Trial
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</button>
						<button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all">
							View Demo
						</button>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20 px-6 bg-slate-900/50">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								icon: <Zap size={24} />,
								title: "Instant Processing",
								desc: "Real-time data analysis with sub-millisecond latency.",
							},
							{
								icon: <Shield size={24} />,
								title: "Enterprise Security",
								desc: "Bank-grade encryption for all your neural pathways.",
							},
							{
								icon: <Bot size={24} />,
								title: "Autonomous Agents",
								desc: "Deploy agents that work 24/7 without supervision.",
							},
						].map((feature, i) => (
							<div
								key={i}
								className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group"
							>
								<div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-slate-400 leading-relaxed">{feature.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats / Social Proof */}
			<section className="py-20 px-6 border-y border-white/5">
				<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-6">
							Trusted by the innovators
						</h2>
						<div className="space-y-4">
							{[
								"99.9% Uptime Guarantee",
								"24/7 Priority Support",
								"GDPR & CCPA Compliant",
							].map((item, i) => (
								<div key={i} className="flex items-center gap-3 text-slate-300">
									<CheckCircle size={20} className="text-purple-500" />
									{item}
								</div>
							))}
						</div>
					</div>
					<div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10">
						<div className="flex gap-4 items-end h-40">
							<div className="w-1/4 bg-purple-500/20 h-[40%] rounded-t-lg relative group">
								<div className="absolute inset-x-0 bottom-0 top-0 bg-purple-500/40 rounded-t-lg group-hover:h-full transition-all duration-500 h-0"></div>
							</div>
							<div className="w-1/4 bg-purple-500/20 h-[70%] rounded-t-lg relative">
								<div className="absolute inset-x-0 bottom-0 h-[60%] bg-purple-500 rounded-t-lg animate-pulse"></div>
							</div>
							<div className="w-1/4 bg-purple-500/20 h-[50%] rounded-t-lg"></div>
							<div className="w-1/4 bg-purple-500/20 h-[85%] rounded-t-lg relative">
								<div className="absolute top-2 right-2 text-xs font-bold text-white">
									+240%
								</div>
							</div>
						</div>
						<p className="mt-4 text-sm text-slate-400 text-center font-mono">
							LIVE PERFORMANCE METRICS
						</p>
					</div>
				</div>
			</section>

			<footer className="py-8 text-center text-slate-500 text-sm">
				<p>© 2024 Nexus AI Inc. All rights reserved.</p>
			</footer>
		</div>
	);
}
