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
			services: "Services",
			cases: "Cases",
			contact: "Contact",
			cv: "CV",
		},
		hero: {
			badge: "Open to Work (Remote)",
			title: "Software Engineer | Full Stack",
			subtitle:
				"9+ years shipping production software end-to-end: from architecture and code to deploy, monitoring and on-call. TypeScript, React/Next.js, Node.js, .NET and PostgreSQL.",
			cta: "View Projects",
			secondaryCta: "Contact Me",
			cvCta: "Download CV",
		},
		about: {
			title: "About Me",
			description:
				"I am a Full Stack Software Engineer with 9+ years of experience building and scaling web systems. I founded and scaled my own multi-tenant SaaS to 10,000+ paying recurring users at 99.9% uptime (owning product, PHP/Laravel + MySQL engineering, and Linux/Cloudflare infrastructure in production as a one-person tech team). Today I deliver software for B2B clients: marketplaces, operations SaaS, dashboards, CRM automation, AI agents and security audits. Mostly in TypeScript, React/Next.js and Node.js, with production work in .NET, PHP and Python.",
			stats: [
				{ label: "Years of Exp.", value: "9+" },
				{ label: "Projects Delivered", value: "20+" },
				{ label: "Paying Users Served", value: "10k+" },
			],
		},
		projects: {
			title: "Featured Projects",
			subtitle:
				"Real-world applications in production: marketplaces, SaaS, automation and infrastructure.",
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
		reviews: {
			kicker: "// reviews",
			title: "What clients say",
			subtitle:
				"Real reviews from clients. Nothing edited, nothing staged.",
			summary: (avg: string, total: number) =>
				`${avg} average across ${total} reviews`,
			seeProfile: "See the profile",
			badgeClient: "pavin.me client",
			badge99: "verified",
		},
		currentWork: {
			kicker: "// in progress",
			title: "On the bench right now",
			subtitle:
				"An anonymized look at what's shipping this week. Proof there's live work, not just a portfolio.",
			sprint: "Steps",
			of: "of",
			linesThisWeek: "lines this week",
			activeProjects: "active projects",
			updated: "updated",
			completedKicker: "// shipped",
			completedTitle: "Recently shipped",
		},
		faq: {
			kicker: "// faq",
			title: "Before you hire",
			subtitle: "The questions people ask me before we start.",
			items: [
				{
					q: "How long does a project take?",
					a: "It depends on scope, but most projects run in 2–6 week sprints with something usable at the end of each one. You get a realistic estimate up front, and if the deadline moves, you see it in your portal, not after the fact.",
				},
				{
					q: "How do I follow the progress?",
					a: "You get a private client portal (pavin.me/cliente) that tracks every sprint in real time: what's in progress, what was delivered and the full timeline. You approve each delivery there and can leave a comment or request on any sprint.",
				},
				{
					q: "How does payment work?",
					a: "Usually split: a part to start and the rest on delivery, or per sprint on larger builds. Pix, bank transfer or invoice. We agree on it in writing before any code is written.",
				},
				{
					q: "What if I need changes after delivery?",
					a: "Small adjustments right after delivery are part of the deal. Anything bigger, we scope a follow-up sprint together. No surprise bills.",
				},
				{
					q: "What do you need from me to start?",
					a: "A clear idea of the problem, any references or existing access (repo, hosting, accounts) and someone I can ask questions to. The rest is on me: architecture, code, deploy and monitoring.",
				},
				{
					q: "What kinds of projects do you take?",
					a: "Web systems, marketplaces, operations SaaS, dashboards, CRM/automation, AI agents and security audits. Mostly TypeScript, React/Next.js and Node.js, with production work in .NET, PHP and Python too.",
				},
			],
		},
		leadForm: {
			kicker: "// let's talk",
			title: "Start a project",
			subtitle: "Tell me what you need. I usually reply within a day.",
			nameLabel: "Name",
			namePlaceholder: "Your name",
			emailLabel: "E-mail",
			emailPlaceholder: "you@company.com",
			typeLabel: "Project type",
			typePlaceholder: "Pick one…",
			typeOptions: [
				"Web system / SaaS",
				"Marketplace",
				"Dashboard / BI",
				"Automation / CRM",
				"AI agent / integration",
				"Security audit",
				"Other",
			],
			messageLabel: "Message",
			messagePlaceholder: "A couple of lines about the problem you want solved.",
			submit: "Send request",
			sending: "Sending…",
			successTitle: "Got it. Talk soon.",
			successBody:
				"Your message reached me. I'll reply by e-mail, usually within a day.",
			sendAnother: "Send another",
			errorGeneric:
				"Couldn't send your message. Try again in a moment, or e-mail me directly.",
			errorCaptcha: "Finish the security check before sending.",
			errorFields: "Fill in your name, a valid e-mail and a message.",
		},
		footer: {
			tagline: "Crafted in Fortaleza · Available worldwide",
		},
	},
	pt: {
		nav: {
			about: "Sobre",
			projects: "Projetos",
			services: "Serviços",
			cases: "Cases",
			contact: "Contato",
			cv: "CV",
		},
		hero: {
			badge: "Aberto a Oportunidades (Remoto)",
			title: "Engenheiro de Software | Full Stack",
			subtitle:
				"9+ anos entregando software em produção ponta a ponta: da arquitetura e do código ao deploy, monitoramento e plantão. TypeScript, React/Next.js, Node.js, .NET e PostgreSQL.",
			cta: "Ver Projetos",
			secondaryCta: "Entrar em Contato",
			cvCta: "Baixar CV",
		},
		about: {
			title: "Sobre Mim",
			description:
				"Sou Engenheiro de Software Full Stack com 9+ anos de experiência desenvolvendo e escalando sistemas web. Fundei e escalei um SaaS multi-tenant próprio até 10.000+ usuários recorrentes pagantes com 99,9% de uptime (conduzindo produto, engenharia em PHP/Laravel + MySQL e infraestrutura Linux/Cloudflare em produção como time tech de uma pessoa só). Hoje entrego software para clientes B2B: marketplaces, SaaS operacionais, dashboards, automação de CRM, agentes de IA e auditorias de segurança. Principalmente em TypeScript, React/Next.js e Node.js, com entregas em produção também em .NET, PHP e Python.",
			stats: [
				{ label: "Anos de Exp.", value: "9+" },
				{ label: "Projetos Entregues", value: "20+" },
				{ label: "Usuários Pagantes", value: "10k+" },
			],
		},
		projects: {
			title: "Projetos em Destaque",
			subtitle:
				"Aplicações reais em produção: marketplaces, SaaS, automação e infraestrutura.",
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
		reviews: {
			kicker: "// avaliações",
			title: "O que os clientes dizem",
			subtitle:
				"Avaliações reais de clientes. Nada editado, nada montado.",
			summary: (avg: string, total: number) =>
				`${avg} de média em ${total} avaliações`,
			seeProfile: "Ver o perfil",
			badgeClient: "cliente pavin.me",
			badge99: "verificado",
		},
		currentWork: {
			kicker: "// em andamento",
			title: "Na bancada agora",
			subtitle:
				"Um retrato anonimizado do que está saindo esta semana. Prova de obra rodando, não só portfólio.",
			sprint: "Etapas",
			of: "de",
			linesThisWeek: "linhas esta semana",
			activeProjects: "projetos ativos",
			updated: "atualizado",
			completedKicker: "// entregues",
			completedTitle: "Concluídos recentemente",
		},
		faq: {
			kicker: "// dúvidas",
			title: "Antes de contratar",
			subtitle: "As perguntas que me fazem antes de começar.",
			items: [
				{
					q: "Quanto tempo leva um projeto?",
					a: "Depende do escopo, mas a maioria roda em sprints de 2 a 6 semanas, com algo utilizável ao fim de cada uma. Você recebe uma estimativa realista logo no começo, e se o prazo mudar, você vê no seu portal, não depois.",
				},
				{
					q: "Como eu acompanho o andamento?",
					a: "Você recebe um portal do cliente privado (pavin.me/cliente) que rastreia cada sprint em tempo real: o que está em andamento, o que foi entregue e a linha do tempo inteira. Você aprova cada entrega por lá e pode deixar um comentário ou pedido em qualquer sprint.",
				},
				{
					q: "Como funciona o pagamento?",
					a: "Normalmente dividido: uma parte pra começar e o restante na entrega, ou por sprint em projetos maiores. Pix, transferência ou nota fiscal. A gente combina por escrito antes de qualquer linha de código.",
				},
				{
					q: "E se eu precisar de ajustes depois da entrega?",
					a: "Ajustes pequenos logo após a entrega fazem parte. Algo maior, a gente combina uma sprint de continuidade juntos. Sem cobrança surpresa.",
				},
				{
					q: "O que você precisa de mim pra começar?",
					a: "Uma ideia clara do problema, referências ou acessos que já existam (repo, hospedagem, contas) e alguém pra eu tirar dúvidas. O resto é comigo: arquitetura, código, deploy e monitoramento.",
				},
				{
					q: "Que tipo de projeto você pega?",
					a: "Sistemas web, marketplaces, SaaS de operações, dashboards, CRM/automação, agentes de IA e auditorias de segurança. Principalmente TypeScript, React/Next.js e Node.js, com entregas em produção também em .NET, PHP e Python.",
				},
			],
		},
		leadForm: {
			kicker: "// vamos conversar",
			title: "Começar um projeto",
			subtitle: "Me conta o que você precisa. Costumo responder em até um dia.",
			nameLabel: "Nome",
			namePlaceholder: "Seu nome",
			emailLabel: "E-mail",
			emailPlaceholder: "voce@empresa.com",
			typeLabel: "Tipo de projeto",
			typePlaceholder: "Escolha uma opção…",
			typeOptions: [
				"Sistema web / SaaS",
				"Marketplace",
				"Dashboard / BI",
				"Automação / CRM",
				"Agente de IA / integração",
				"Auditoria de segurança",
				"Outro",
			],
			messageLabel: "Mensagem",
			messagePlaceholder: "Umas linhas sobre o problema que você quer resolver.",
			submit: "Enviar pedido",
			sending: "Enviando…",
			successTitle: "Recebido. A gente se fala.",
			successBody:
				"Sua mensagem chegou aqui. Respondo por e-mail, normalmente em até um dia.",
			sendAnother: "Enviar outro",
			errorGeneric:
				"Não consegui enviar sua mensagem. Tente de novo em instantes, ou me chame direto no e-mail.",
			errorCaptcha: "Conclua a verificação de segurança antes de enviar.",
			errorFields: "Preencha o nome, um e-mail válido e a mensagem.",
		},
		footer: {
			tagline: "Feito em Fortaleza · Disponível pro mundo",
		},
	},
};

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined,
);

export function LanguageProvider({
	children,
	initialLanguage = "en",
}: {
	children: ReactNode;
	/**
	 * Idioma do primeiro render (SSR). As rotas em português (/pt, /servicos,
	 * /cases) passam "pt" pra que o HTML servido ao Google já venha em pt-BR;
	 * o toggle do header continua funcionando por cima.
	 */
	initialLanguage?: Language;
}) {
	const [language, setLanguage] = useState<Language>(initialLanguage);

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
