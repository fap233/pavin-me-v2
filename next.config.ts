import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			// Host canônico é o apex (pavin.me). O www respondia 200 com o mesmo
			// conteúdo e o Google indexou a versão www: 308 permanente pro apex,
			// preservando o caminho. Na Vercel isso também pode ser feito no
			// domínio; aqui fica versionado com o site.
			{
				source: "/:path*",
				has: [{ type: "host", value: "www.pavin.me" }],
				destination: "https://pavin.me/:path*",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
