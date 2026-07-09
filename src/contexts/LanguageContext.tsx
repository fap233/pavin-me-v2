"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (typeof content)["en"] | (typeof content)["pt"];
}

export const content = {
	en: {
		nav: {
			about: "About",
			projects: "Projects",
			contact: "Contact",
			cv: "CV",
		},
		hero: {
			badge: "Open to Work (Remote)",
			title: "Software Engineer | Full Stack",
			subtitle:
				"9+ years shipping production software end-to-end — from architecture and code to deploy, monitoring and on-call. TypeScript, React/Next.js, Node.js, .NET and PostgreSQL.",
			cta: "View Projects",
			secondaryCta: "Contact Me",
			cvCta: "Download CV",
		},
		about: {
			title: "About Me",
			description:
				"I am a Full Stack Software Engineer with 9+ years of experience building and scaling web systems. I founded and scaled my own multi-tenant SaaS to 10,000+ paying recurring users at 99.9% uptime — owning product, PHP/Laravel + MySQL engineering, and Linux/Cloudflare infrastructure in production as a one-person tech team. Today I deliver software for B2B clients: marketplaces, operations SaaS, dashboards, CRM automation, AI agents and security audits — mostly in TypeScript, React/Next.js and Node.js, with production work in .NET, PHP and Python.",
			stats: [
				{ label: "Years of Exp.", value: "9+" },
				{ label: "Projects Delivered", value: "20+" },
				{ label: "Paying Users Served", value: "10k+" },
			],
		},
		projects: {
			title: "Featured Projects",
			subtitle:
				"Real-world applications in production — marketplaces, SaaS, automation and infrastructure.",
		},
		lab: {
			kicker: "// lab",
			title: "Frontend UI/UX Lab",
			subtitle:
				"A collection of high-fidelity interfaces demonstrating versatility in design and CSS mastery.",
		},
		contact: {
			kicker: "// contact",
			title: "Get in Touch",
			subtitle:
				"Open to remote roles and contract engagements. Reach out for collaborations, opportunities, or to say hello.",
		},
		footer: {
			tagline: "Crafted in Fortaleza · Available worldwide",
		},
	},
	pt: {
		nav: {
			about: "Sobre",
			projects: "Projetos",
			contact: "Contato",
			cv: "CV",
		},
		hero: {
			badge: "Aberto a Oportunidades (Remoto)",
			title: "Engenheiro de Software | Full Stack",
			subtitle:
				"9+ anos entregando software em produção ponta a ponta — da arquitetura e do código ao deploy, monitoramento e plantão. TypeScript, React/Next.js, Node.js, .NET e PostgreSQL.",
			cta: "Ver Projetos",
			secondaryCta: "Entrar em Contato",
			cvCta: "Baixar CV",
		},
		about: {
			title: "Sobre Mim",
			description:
				"Sou Engenheiro de Software Full Stack com 9+ anos de experiência desenvolvendo e escalando sistemas web. Fundei e escalei um SaaS multi-tenant próprio até 10.000+ usuários recorrentes pagantes com 99,9% de uptime — conduzindo produto, engenharia em PHP/Laravel + MySQL e infraestrutura Linux/Cloudflare em produção como time tech de uma pessoa só. Hoje entrego software para clientes B2B: marketplaces, SaaS operacionais, dashboards, automação de CRM, agentes de IA e auditorias de segurança — principalmente em TypeScript, React/Next.js e Node.js, com entregas em produção também em .NET, PHP e Python.",
			stats: [
				{ label: "Anos de Exp.", value: "9+" },
				{ label: "Projetos Entregues", value: "20+" },
				{ label: "Usuários Pagantes", value: "10k+" },
			],
		},
		projects: {
			title: "Projetos em Destaque",
			subtitle:
				"Aplicações reais em produção — marketplaces, SaaS, automação e infraestrutura.",
		},
		lab: {
			kicker: "// lab",
			title: "Laboratório UI/UX Frontend",
			subtitle:
				"Uma coleção de interfaces de alta fidelidade demonstrando versatilidade em design e domínio de CSS.",
		},
		contact: {
			kicker: "// contato",
			title: "Vamos Conversar",
			subtitle:
				"Aberto a vagas remotas e contratos. Me chama pra colaborações, oportunidades ou só pra dar um oi.",
		},
		footer: {
			tagline: "Feito em Fortaleza · Disponível pro mundo",
		},
	},
};

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("en");

	return (
		<LanguageContext.Provider
			value={{ language, setLanguage, t: content[language] }}
		>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}
