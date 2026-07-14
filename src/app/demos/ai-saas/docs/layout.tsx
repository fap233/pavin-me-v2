import DocsSidebar from "../_components/DocsSidebar";

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="pt-28 pb-20 px-6 relative overflow-hidden min-h-screen">
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

			<div className="max-w-7xl mx-auto">
				<div className="mb-10">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-4">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						API v2 · updated today
					</div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						Docu<span className="text-purple-500">mentation</span>
					</h1>
				</div>

				<div className="grid lg:grid-cols-[220px_1fr] gap-10">
					<DocsSidebar />
					{children}
				</div>
			</div>
		</section>
	);
}
