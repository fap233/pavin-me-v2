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
		hero: {
			badge: "Open to Work (Remote)",
			title: "Software Engineer | Full Stack",
			subtitle:
				"Ex-Founder with 6 years of experience shipping scalable SaaS products. Pivoting to Go & High-Performance Engineering.",
			cta: "View Projects",
			secondaryCta: "Contact Me",
		},
		about: {
			title: "About Me",
			description:
				"I am a Software Engineer with a unique background: I spent 6 years as a Founder & Tech Lead scaling a digital platform to over 10,000 active clients. I handled everything from product strategy and PHP/Laravel development to Linux server management. Currently, I am focused on Software Engineering within established teams, mastering Go (Golang), Node.js, and Distributed Systems.",
			stats: [
				{ label: "Years of Exp.", value: "6+" },
				{ label: "Users Served", value: "10k+" },
				{ label: "Uptime Managed", value: "99.9%" },
			],
		},
		projects: {
			title: "Featured Projects",
			subtitle:
				"Real-world applications focusing on Scalability, Clean Architecture, and Performance.",
		},
	},
	pt: {
		hero: {
			badge: "Aberto a Oportunidades (Remoto)",
			title: "Engenheiro de Software | Full Stack",
			subtitle:
				"6 anos de experiência como desenvolvedor Full Stack e 2 anos como Freelancer. Especialista em Go, React, Node.js e arquiteturas escaláveis.",
			cta: "Ver Projetos",
			secondaryCta: "Entrar em Contato",
		},
		about: {
			title: "Sobre Mim",
			description:
				"Sou Engenheiro de Software Full Stack com 6 anos de experiência desenvolvendo e escalando sistemas web, incluindo 2 anos atuando como Freelancer autônomo. Durante esse período, construí e mantive uma plataforma SaaS com mais de 10.000 clientes ativos, gerenciando desde a estratégia de produto e o desenvolvimento com PHP/Laravel e React até a administração de servidores Linux em produção. Hoje, direciono essa experiência prática para projetos com Go (Golang), Node.js, .NET e arquiteturas distribuídas, sempre com foco em Clean Architecture, performance e entrega de valor real.",
			stats: [
				{ label: "Anos de Exp.", value: "6+" },
				{ label: "Freelancer", value: "2 anos" },
				{ label: "Clientes Atendidos", value: "10k+" },
			],
		},
		projects: {
			title: "Projetos em Destaque",
			subtitle:
				"Aplicações reais com foco em Escalabilidade, Arquitetura Limpa e Alta Performance.",
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