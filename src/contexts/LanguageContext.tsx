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
				"9+ years of experience as a Full Stack engineer, shipping production applications for B2B clients. Specialist in Go, React, Node.js and scalable architectures.",
			cta: "View Projects",
			secondaryCta: "Contact Me",
			cvCta: "Download CV",
		},
		about: {
			title: "About Me",
			description:
				"I am a Full Stack Software Engineer with 9+ years of experience building and scaling web systems. I built and maintained my own SaaS platform serving 10,000+ active clients — handling everything from product strategy and PHP/Laravel + React development to Linux server administration in production. Currently I direct that hands-on experience to projects with Go (Golang), Node.js, .NET and distributed systems, with a focus on Clean Architecture, performance and real business value.",
			stats: [
				{ label: "Years of Exp.", value: "9+" },
				{ label: "Projects Delivered", value: "10+" },
				{ label: "Users Served", value: "10k+" },
			],
		},
		projects: {
			title: "Featured Projects",
			subtitle:
				"Real-world applications focusing on Scalability, Clean Architecture, and Performance.",
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
				"9+ anos de experiência como Engenheiro Full Stack, entregando aplicações em produção para clientes B2B. Especialista em Go, React, Node.js e arquiteturas escaláveis.",
			cta: "Ver Projetos",
			secondaryCta: "Entrar em Contato",
			cvCta: "Baixar CV",
		},
		about: {
			title: "Sobre Mim",
			description:
				"Sou Engenheiro de Software Full Stack com 9+ anos de experiência desenvolvendo e escalando sistemas web. Construí e mantive uma plataforma SaaS própria com mais de 10.000 clientes ativos — atuando da estratégia de produto ao desenvolvimento com PHP/Laravel e React, e à administração de servidores Linux em produção. Atualmente direciono essa experiência prática para projetos com Go (Golang), Node.js, .NET e arquiteturas distribuídas, sempre com foco em Clean Architecture, performance e entrega de valor real.",
			stats: [
				{ label: "Anos de Exp.", value: "9+" },
				{ label: "Projetos Entregues", value: "10+" },
				{ label: "Usuários Servidos", value: "10k+" },
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
