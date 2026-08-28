import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// SEM redirect de host aqui. Em 28/08/2026 o redirect www -> pavin.me no
	// codigo fez LOOP com a Vercel, que tem www.pavin.me como dominio primario
	// (ela responde 307 pavin.me -> www). A canonicalizacao de host fica na
	// Vercel (Settings > Domains): deixar pavin.me como primario e www
	// redirecionando pra ele, pra bater com os <link rel="canonical">.
};

export default nextConfig;
