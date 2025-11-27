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
			badge: "Em busca de Estágio/Júnior",
			title: "Estudante de Análise e Desenvolvimento de Sistemas",
			subtitle:
				"Foco em C# (.NET), Java e React. Busco minha primeira oportunidade formal para aplicar conhecimentos práticos em times ágeis.",
			cta: "Ver Projetos",
			secondaryCta: "Entrar em Contato",
		},
		about: {
			title: "Sobre Mim",
			description:
				"Sou estudante de ADS em transição de carreira. Diferente de um iniciante comum, trago uma maturidade prática de quem já desenvolveu e manteve sistemas web de forma autônoma por anos. Meu foco agora é a formalização acadêmica e o ingresso em um time de engenharia estruturado. Tenho facilidade com lógica, banco de dados e infraestrutura, e estou estudando a fundo o ecossistema .NET e Java.",
			stats: [
				{ label: "Semestre", value: "3º" },
				{ label: "Foco", value: "Backend" },
				{ label: "Disponibilidade", value: "Imediata" },
			],
		},
		projects: {
			title: "Projetos Acadêmicos & Pessoais",
			subtitle:
				"Projetos desenvolvidos para fixar conceitos de Arquitetura de Software, APIs REST e Full Stack.",
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
