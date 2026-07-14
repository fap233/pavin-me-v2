import Link from "next/link";
import { Bot, Zap, Shield, ChevronRight, CheckCircle } from "lucide-react";
import PerformanceChart from "./_components/PerformanceChart";
import { BASE } from "./_components/site";

const FEATURES = [
	{
		icon: <Zap size={24} />,
		title: "Instant Processing",
		desc: "Real-time data analysis with sub-millisecond latency.",
		anchor: "latency",
	},
	{
		icon: <Shield size={24} />,
		title: "Enterprise Security",
		desc: "Bank-grade encryption for all your neural pathways.",
		anchor: "security",
	},
	{
		icon: <Bot size={24} />,
		title: "Autonomous Agents",
		desc: "Deploy agents that work 24/7 without supervision.",
		anchor: "agents",
	},
];

export default function AiSaasPage() {
	return (
		<>
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
						<Link
							href={`${BASE}/signup`}
							className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
						>
							Start Free Trial
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href={`${BASE}/playground`}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
						>
							View Demo
						</Link>
					</div>

					<p className="mt-6 text-xs text-slate-500 font-mono">
						NO CREDIT CARD · 5,000 FREE TOKENS · CANCEL ANYTIME
					</p>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20 px-6 bg-slate-900/50">
				<div className="max-w-7xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						{FEATURES.map((feature) => (
							<Link
								key={feature.title}
								href={`${BASE}/features#${feature.anchor}`}
								className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group block"
							>
								<div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
									{feature.icon}
								</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-slate-400 leading-relaxed">{feature.desc}</p>
								<span className="mt-4 inline-flex items-center gap-1 text-sm text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
									Learn more
									<ChevronRight size={14} />
								</span>
							</Link>
						))}
					</div>

					<div className="mt-10 text-center">
						<Link
							href={`${BASE}/features`}
							className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
						>
							See all features
							<ChevronRight size={14} />
						</Link>
					</div>
				</div>
			</section>

			{/* Stats / Social Proof */}
			<section className="py-20 px-6 border-y border-white/5">
				<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-6">Trusted by the innovators</h2>
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

						<div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-mono text-slate-600">
							{["ORBITAL", "HELIX LABS", "VANTA", "NORTHWIND", "KEPLER"].map(
								(logo) => (
									<span key={logo}>{logo}</span>
								),
							)}
						</div>
					</div>

					<PerformanceChart />
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-24 px-6 relative overflow-hidden">
				<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -z-10" />

				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
						Ship your first agent{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							tonight
						</span>
					</h2>
					<p className="text-slate-400 mb-8 max-w-xl mx-auto">
						Two minutes from install to a running agent. Test the models in the
						playground — no key, no card, no setup.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href={`${BASE}/playground`}
							className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
						>
							Open the playground
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href={`${BASE}/pricing`}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
						>
							Compare plans
						</Link>
					</div>
				</div>
			</section>
		</>
	);
}
