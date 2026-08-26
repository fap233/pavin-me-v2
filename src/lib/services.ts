/**
 * Serviços vendidos nas landing pages /servicos/<slug> (pt-BR, SEO).
 *
 * Todo texto visível é bilíngue ({ pt, en }): o HTML servido pelo servidor sai
 * em português (initialLanguage="pt" no layout) e o toggle do header troca o
 * corpo da página pra inglês no cliente. Metadados (metaTitle, metaDescription)
 * e JSON-LD continuam só em pt e só no servidor. Sem travessão no texto
 * visível, sem número inventado. Os fatos citados (9+ anos, 20+ projetos, SaaS
 * a 10 mil usuários pagantes, 4,92/5 em 28 avaliações) vêm da home e de
 * src/data/reviews.ts. Os cases relacionados apontam pra slugs de
 * src/lib/projects.ts.
 */

export type Bi = { pt: string; en: string };

export type ServiceFaq = { q: Bi; a: Bi };

export type ServiceStep = { title: Bi; text: Bi };

export type Service = {
	slug: string;
	/** Nome curto: cards do hub, breadcrumb, nav. */
	name: Bi;
	/** H1 da página, com a frase de busca de forma natural. */
	title: Bi;
	/** <title> completo (até 60 caracteres). Só pt, só servidor. */
	metaTitle: string;
	/** Meta description (até 155 caracteres). Só pt, só servidor. */
	metaDescription: string;
	kicker: Bi;
	/** Parágrafo de abertura logo abaixo do H1. */
	lead: Bi;
	/** Uma linha pro card do hub e pro ItemList do JSON-LD. */
	summary: Bi;
	included: Bi[];
	steps: ServiceStep[];
	technologies: string[];
	/** Prazo típico, coerente com a tabela de preços. */
	timeline: Bi;
	price: { from: number; label: Bi };
	faq: ServiceFaq[];
	relatedCaseSlugs: string[];
	/** Par de cores do card no hub (mesma linguagem dos projetos). */
	accent: [string, string];
};

const STEP_PROPOSAL: ServiceStep = {
	title: { pt: "Proposta em até 1 dia", en: "Proposal within 1 day" },
	text: {
		pt: "Você me conta o que precisa pelo formulário no fim da página. Em até um dia útil, recebe uma proposta com escopo, prazo e valor fechados.",
		en: "You tell me what you need through the form at the bottom of the page. Within one business day, you receive a proposal with scope, timeline and price locked in.",
	},
};

const STEP_CALL: ServiceStep = {
	title: { pt: "Call de 15 minutos", en: "15-minute call" },
	text: {
		pt: "Alinhamos os detalhes por vídeo, tiro as dúvidas técnicas e a gente fecha o escopo por escrito antes de qualquer linha de código.",
		en: "We go over the details on a video call, I answer the technical questions and we lock the scope in writing before a single line of code.",
	},
};

const STEP_DELIVERY: ServiceStep = {
	title: { pt: "Entrega e ajustes", en: "Delivery and adjustments" },
	text: {
		pt: "Publicação em produção, treinamento pra sua equipe e ajustes finos logo após a entrega, que já fazem parte do combinado.",
		en: "Release to production, training for your team and fine-tuning right after delivery, all part of the agreement.",
	},
};

function steps(development: Bi): ServiceStep[] {
	return [
		STEP_PROPOSAL,
		STEP_CALL,
		{
			title: {
				pt: "Desenvolvimento com acompanhamento",
				en: "Development you can follow",
			},
			text: development,
		},
		STEP_DELIVERY,
	];
}

export const services: Service[] = [
	{
		slug: "criacao-de-site",
		name: { pt: "Criação de site", en: "Website creation" },
		title: {
			pt: "Criação de site profissional para sua empresa",
			en: "Professional website creation for your business",
		},
		metaTitle: "Criação de site profissional | Fellipe Pavin, Fortaleza",
		metaDescription:
			"Site institucional ou landing page em WordPress/Elementor ou Next.js, com SEO técnico, formulário e hospedagem. Pronto em 4 a 10 dias. A partir de R$ 750.",
		kicker: { pt: "// criação de site", en: "// website creation" },
		lead: {
			pt: "Site institucional ou landing page que carrega rápido, aparece no Google e transforma visita em contato. Em WordPress com Elementor, quando você quer editar sozinho, ou em Next.js, quando performance e SEO técnico são o ponto central.",
			en: "A corporate website or landing page that loads fast, shows up on Google and turns visits into contacts. Built on WordPress with Elementor when you want to edit it yourself, or on Next.js when performance and technical SEO are the priority.",
		},
		summary: {
			pt: "Site institucional ou landing page rápida, com SEO técnico, formulário de contato e hospedagem configurada.",
			en: "A fast corporate website or landing page, with technical SEO, contact form and hosting configured.",
		},
		included: [
			{
				pt: "Layout responsivo (celular, tablet e desktop) a partir da sua identidade visual",
				en: "Responsive layout (mobile, tablet and desktop) based on your visual identity",
			},
			{
				pt: "Páginas principais: home, sobre, serviços ou produtos, contato e o que mais fizer sentido pro seu negócio",
				en: "Core pages: home, about, services or products, contact and whatever else makes sense for your business",
			},
			{
				pt: "SEO técnico: títulos, meta descrições, sitemap, dados estruturados e Core Web Vitals no verde",
				en: "Technical SEO: titles, meta descriptions, sitemap, structured data and Core Web Vitals in the green",
			},
			{
				pt: "Formulário de contato com proteção anti-spam e envio por e-mail ou WhatsApp",
				en: "Contact form with anti-spam protection, delivered by e-mail or WhatsApp",
			},
			{
				pt: "Domínio, hospedagem, SSL e e-mail profissional configurados",
				en: "Domain, hosting, SSL and professional e-mail set up",
			},
			{
				pt: "Google Analytics e Search Console instalados e validados",
				en: "Google Analytics and Search Console installed and verified",
			},
			{
				pt: "Treinamento rápido pra você editar textos e imagens sem depender de ninguém",
				en: "Quick training so you can edit text and images without depending on anyone",
			},
		],
		steps: steps({
			pt: "O site vai ganhando forma página a página. Você acompanha cada marco pelo portal do cliente (pavin.me/cliente), vê o link de homologação e aprova ou comenta por lá.",
			en: "The site takes shape page by page. You follow each milestone through the client portal (pavin.me/cliente), check the staging link and approve or leave comments there.",
		}),
		technologies: [
			"WordPress",
			"Elementor",
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Vercel",
			"Cloudflare",
		],
		timeline: { pt: "4 a 10 dias", en: "4 to 10 days" },
		price: {
			from: 750,
			label: { pt: "a partir de R$ 750", en: "from R$ 750" },
		},
		faq: [
			{
				q: {
					pt: "Em quanto tempo o site fica pronto?",
					en: "How long until the site is ready?",
				},
				a: {
					pt: "Uma landing page fica pronta em 4 a 5 dias; um site institucional com 5 a 8 páginas, em até 10 dias. O prazo conta a partir do envio do conteúdo (textos, logo e imagens) e fica fixado na proposta.",
					en: "A landing page is ready in 4 to 5 days; a corporate website with 5 to 8 pages, within 10 days. The clock starts when you send the content (copy, logo and images) and the deadline is fixed in the proposal.",
				},
			},
			{
				q: {
					pt: "WordPress ou Next.js: qual escolher?",
					en: "WordPress or Next.js: which one should I pick?",
				},
				a: {
					pt: "WordPress com Elementor quando você vai editar o site com frequência e quer autonomia total. Next.js quando performance, SEO técnico e integrações pesam mais. Eu explico a diferença na call e recomendo com base no seu caso, não no que dá mais trabalho.",
					en: "WordPress with Elementor when you will edit the site often and want full autonomy. Next.js when performance, technical SEO and integrations matter more. I explain the difference on the call and recommend based on your case, not on what brings in more work.",
				},
			},
			{
				q: {
					pt: "O que eu preciso enviar pra começar?",
					en: "What do I need to send to get started?",
				},
				a: {
					pt: "Logo, textos (ou só os tópicos, que eu ajudo a redigir), fotos ou referências de sites que você gosta e os acessos do domínio, se já tiver. Se não tiver domínio nem hospedagem, eu configuro no seu nome.",
					en: "Your logo, copy (or just the key points, and I help write it), photos or references of sites you like, and your domain credentials if you already have one. If you have no domain or hosting yet, I set them up in your name.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento?",
					en: "How does payment work?",
				},
				a: {
					pt: "Pagamento por etapas, com marcos definidos: uma parte na aprovação da proposta e o restante na entrega. Tudo combinado por escrito antes de começar.",
					en: "Payment in stages, with defined milestones: one part when the proposal is approved and the rest on delivery. Everything agreed in writing before we start.",
				},
			},
			{
				q: {
					pt: "E a manutenção depois da entrega?",
					en: "What about maintenance after delivery?",
				},
				a: {
					pt: "Ajustes pequenos logo após a entrega fazem parte. Depois, você pode seguir sozinho (o site fica no seu nome, na sua hospedagem) ou contratar um plano mensal de manutenção com atualizações, backup e suporte.",
					en: "Small adjustments right after delivery are included. After that, you can carry on by yourself (the site stays in your name, on your hosting) or hire a monthly maintenance plan with updates, backups and support.",
				},
			},
			{
				q: {
					pt: "Você atende empresas fora de Fortaleza?",
					en: "Do you work with companies outside Fortaleza?",
				},
				a: {
					pt: "Sim. Trabalho remoto com clientes de todo o Brasil, com reuniões por vídeo e acompanhamento pelo portal do cliente. Fortaleza é onde eu moro, não um limite.",
					en: "Yes. I work remotely with clients all over Brazil, with video meetings and progress tracking through the client portal. Fortaleza is where I live, not a boundary.",
				},
			},
		],
		relatedCaseSlugs: ["macroluz", "cidadetur", "lastmile"],
		accent: ["#f59e0b", "#ec4899"],
	},
	{
		slug: "loja-virtual",
		name: { pt: "Loja virtual", en: "Online store" },
		title: {
			pt: "Criação de loja virtual pronta para vender",
			en: "Online store creation, ready to sell",
		},
		metaTitle: "Criação de loja virtual | Nuvemshop, Shopify, WooCommerce",
		metaDescription:
			"Loja virtual em Nuvemshop, Shopify, WooCommerce ou Loja Integrada: tema, pagamento, frete e catálogo prontos. No ar em 4 a 10 dias. A partir de R$ 750.",
		kicker: { pt: "// loja virtual", en: "// online store" },
		lead: {
			pt: "Sua loja no ar com pagamento, frete e catálogo funcionando desde o primeiro dia. Configuro a plataforma certa pro seu tamanho (Nuvemshop, Shopify, WooCommerce ou Loja Integrada), personalizo o tema e deixo tudo pronto pra você vender.",
			en: "Your store live with payments, shipping and catalog working from day one. I set up the right platform for your size (Nuvemshop, Shopify, WooCommerce or Loja Integrada), customize the theme and leave everything ready for you to sell.",
		},
		summary: {
			pt: "Loja em Nuvemshop, Shopify, WooCommerce ou Loja Integrada, com pagamento, frete e catálogo configurados.",
			en: "A store on Nuvemshop, Shopify, WooCommerce or Loja Integrada, with payments, shipping and catalog configured.",
		},
		included: [
			{
				pt: "Escolha e configuração da plataforma: Nuvemshop, Shopify, WooCommerce ou Loja Integrada",
				en: "Platform choice and setup: Nuvemshop, Shopify, WooCommerce or Loja Integrada",
			},
			{
				pt: "Personalização do tema com a sua identidade visual: home, categorias e página de produto",
				en: "Theme customization with your visual identity: home, categories and product page",
			},
			{
				pt: "Pagamento por Pix, cartão e boleto (Mercado Pago, Pagar.me, PagSeguro ou o gateway da plataforma)",
				en: "Payments via Pix, card and boleto (Mercado Pago, Pagar.me, PagSeguro or the platform's own gateway)",
			},
			{
				pt: "Cálculo de frete com Correios, Melhor Envio ou transportadora, com regra de frete grátis",
				en: "Shipping calculation with Correios, Melhor Envio or a carrier, including a free-shipping rule",
			},
			{
				pt: "Cadastro inicial do catálogo: produtos, variações, fotos e estoque",
				en: "Initial catalog setup: products, variants, photos and stock",
			},
			{
				pt: "Domínio, SSL, e-mails transacionais e políticas de troca, privacidade e entrega",
				en: "Domain, SSL, transactional e-mails and return, privacy and shipping policies",
			},
			{
				pt: "Pixel da Meta, Google Analytics e Google Merchant configurados",
				en: "Meta Pixel, Google Analytics and Google Merchant configured",
			},
		],
		steps: steps({
			pt: "A loja é montada em ambiente de teste com seus produtos reais. Você acompanha os marcos pelo portal do cliente, faz pedidos de teste e aprova antes de virar a chave.",
			en: "The store is built in a test environment with your real products. You follow the milestones through the client portal, place test orders and approve before we flip the switch.",
		}),
		technologies: [
			"Nuvemshop",
			"Shopify",
			"WooCommerce",
			"Loja Integrada",
			"Mercado Pago",
			"Melhor Envio",
			"Liquid",
			"PHP",
		],
		timeline: { pt: "4 a 10 dias", en: "4 to 10 days" },
		price: {
			from: 750,
			label: { pt: "a partir de R$ 750", en: "from R$ 750" },
		},
		faq: [
			{
				q: {
					pt: "Qual plataforma é melhor pra minha loja?",
					en: "Which platform is best for my store?",
				},
				a: {
					pt: "Depende do volume, do custo mensal que você aceita e das integrações que precisa. Nuvemshop e Loja Integrada são ótimas pra começar no Brasil; Shopify é forte em apps e escala; WooCommerce dá controle total no seu próprio servidor. Eu recomendo depois de entender o seu caso na call.",
					en: "It depends on your volume, the monthly cost you are comfortable with and the integrations you need. Nuvemshop and Loja Integrada are great for starting out in Brazil; Shopify is strong on apps and scale; WooCommerce gives you full control on your own server. I make a recommendation after understanding your case on the call.",
				},
			},
			{
				q: {
					pt: "Em quanto tempo a loja fica no ar?",
					en: "How long until the store is live?",
				},
				a: {
					pt: "Com o catálogo e a identidade visual em mãos, entre 4 e 10 dias, dependendo do número de produtos e das integrações. O prazo fica fixado na proposta.",
					en: "With the catalog and visual identity in hand, between 4 and 10 days, depending on the number of products and integrations. The deadline is fixed in the proposal.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento do projeto?",
					en: "How does payment for the project work?",
				},
				a: {
					pt: "Por etapas, com marcos definidos: uma parte na aprovação e o restante na entrega da loja funcionando. Combinado por escrito antes de começar.",
					en: "In stages, with defined milestones: one part on approval and the rest when the store is delivered and working. Agreed in writing before we start.",
				},
			},
			{
				q: { pt: "O que eu preciso enviar?", en: "What do I need to send?" },
				a: {
					pt: "Logo, fotos e descrições dos produtos (ou uma planilha), tabela de preços e estoque, dados da empresa pra pagamento e frete, e os acessos do domínio, se já tiver.",
					en: "Your logo, product photos and descriptions (or a spreadsheet), price list and stock, company details for payments and shipping, and your domain credentials if you already have one.",
				},
			},
			{
				q: {
					pt: "Já tenho uma loja e quero migrar. Dá?",
					en: "I already have a store and want to migrate. Is that possible?",
				},
				a: {
					pt: "Dá. Faço migração de catálogo, clientes e pedidos entre plataformas, com redirecionamentos configurados pra não perder o posicionamento que você já tem no Google.",
					en: "Yes. I migrate catalog, customers and orders between platforms, with redirects configured so you keep the Google rankings you already have.",
				},
			},
			{
				q: {
					pt: "A loja fica no meu nome?",
					en: "Will the store be in my name?",
				},
				a: {
					pt: "Sim. A conta na plataforma, o domínio e os gateways de pagamento ficam no seu CNPJ. Você tem acesso total e não depende de mim pra operar.",
					en: "Yes. The platform account, the domain and the payment gateways are registered under your company. You have full access and do not depend on me to operate.",
				},
			},
		],
		relatedCaseSlugs: ["mercadolivre", "lorflux", "lastmile"],
		accent: ["#22c55e", "#06b6d4"],
	},
	{
		slug: "automacao-n8n-chatbot-whatsapp",
		name: {
			pt: "Automação e chatbot de WhatsApp",
			en: "Automation and WhatsApp chatbot",
		},
		title: {
			pt: "Automação com n8n e chatbot de WhatsApp para o seu negócio",
			en: "n8n automation and WhatsApp chatbot for your business",
		},
		metaTitle: "Automação n8n e chatbot WhatsApp com IA | Fellipe Pavin",
		metaDescription:
			"Automações em n8n, chatbot de WhatsApp com Evolution API, CRM e agentes de IA que atendem e qualificam leads. Em 7 a 15 dias. A partir de R$ 1.250.",
		kicker: { pt: "// automação", en: "// automation" },
		lead: {
			pt: "Fluxos em n8n que tiram o trabalho repetitivo da sua equipe e um chatbot de WhatsApp que responde, qualifica e registra o lead no CRM, com ou sem IA por trás. Tudo rodando na sua conta, na sua infraestrutura.",
			en: "n8n workflows that take the repetitive work off your team's plate and a WhatsApp chatbot that replies, qualifies and logs the lead in your CRM, with or without AI behind it. Everything running on your account, on your infrastructure.",
		},
		summary: {
			pt: "Fluxos em n8n, chatbot de WhatsApp com Evolution API, integração com CRM e agentes de IA.",
			en: "n8n workflows, WhatsApp chatbot with Evolution API, CRM integration and AI agents.",
		},
		included: [
			{
				pt: "Mapeamento do processo e desenho do fluxo antes de automatizar: o que entra, o que sai, quem aprova",
				en: "Process mapping and workflow design before automating: what comes in, what goes out, who approves",
			},
			{
				pt: "Automações em n8n conectando e-mail, planilhas, CRM, ERP, formulários, webhooks e APIs",
				en: "n8n automations connecting e-mail, spreadsheets, CRM, ERP, forms, webhooks and APIs",
			},
			{
				pt: "Chatbot de WhatsApp com Evolution API ou API oficial da Meta: menus, horários e transbordo pra atendente",
				en: "WhatsApp chatbot with Evolution API or Meta's official API: menus, business hours and handoff to a human agent",
			},
			{
				pt: "Agente de IA (OpenAI, Anthropic ou modelo aberto) treinado na base de conhecimento do seu negócio",
				en: "AI agent (OpenAI, Anthropic or an open model) trained on your business knowledge base",
			},
			{
				pt: "Integração com CRM (RD Station, Pipedrive, HubSpot, Zoho, Kommo) e notificações pra equipe",
				en: "CRM integration (RD Station, Pipedrive, HubSpot, Zoho, Kommo) and team notifications",
			},
			{
				pt: "Instalação do n8n na sua VPS com backup, logs e alerta de falha",
				en: "n8n installed on your VPS with backups, logs and failure alerts",
			},
			{
				pt: "Documentação do fluxo e treinamento pra sua equipe ajustar sem programar",
				en: "Workflow documentation and training so your team can adjust it without coding",
			},
		],
		steps: steps({
			pt: "Cada fluxo entra em produção assim que fica pronto, então a primeira automação já trabalha enquanto as outras são construídas. Você acompanha os marcos pelo portal do cliente.",
			en: "Each workflow goes to production as soon as it is ready, so the first automation is already working while the others are being built. You follow the milestones through the client portal.",
		}),
		technologies: [
			"n8n",
			"Evolution API",
			"WhatsApp Business API",
			"OpenAI",
			"Anthropic",
			"Python",
			"Node.js",
			"PostgreSQL",
			"Docker",
			"Zoho CRM",
		],
		timeline: { pt: "7 a 15 dias", en: "7 to 15 days" },
		price: {
			from: 1250,
			label: { pt: "a partir de R$ 1.250", en: "from R$ 1,250" },
		},
		faq: [
			{
				q: {
					pt: "Quanto tempo leva pra automação ficar rodando?",
					en: "How long until the automation is running?",
				},
				a: {
					pt: "Uma automação simples fica no ar em uma semana; um chatbot com IA e integração com CRM, em até 15 dias. Em projetos maiores, entrego por marcos, então você já usa a primeira parte enquanto o resto é construído.",
					en: "A simple automation is live within a week; a chatbot with AI and CRM integration, within 15 days. On larger projects I deliver by milestones, so you are already using the first part while the rest is being built.",
				},
			},
			{
				q: {
					pt: "O chatbot usa a API oficial do WhatsApp?",
					en: "Does the chatbot use the official WhatsApp API?",
				},
				a: {
					pt: "Depende do seu caso. A API oficial da Meta tem custo por conversa e exige aprovação, mas é a mais estável. A Evolution API funciona com um número comum e custa menos. Eu explico os riscos de cada uma e você decide.",
					en: "It depends on your case. Meta's official API charges per conversation and requires approval, but it is the most stable. Evolution API works with a regular number and costs less. I explain the risks of each and you decide.",
				},
			},
			{
				q: { pt: "Preciso ter um servidor?", en: "Do I need a server?" },
				a: {
					pt: "Não obrigatoriamente. O n8n roda numa VPS simples que eu configuro pra você, ou no plano em nuvem do próprio n8n. Em qualquer caso, fica tudo na sua conta, com acesso seu.",
					en: "Not necessarily. n8n runs on a simple VPS that I set up for you, or on n8n's own cloud plan. Either way, everything stays on your account, with your access.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento?",
					en: "How does payment work?",
				},
				a: {
					pt: "Por etapas, com marcos definidos: uma parte na aprovação da proposta e o restante conforme cada fluxo entra em produção. Combinado por escrito antes de começar.",
					en: "In stages, with defined milestones: one part when the proposal is approved and the rest as each workflow goes to production. Agreed in writing before we start.",
				},
			},
			{
				q: {
					pt: "E se o fluxo quebrar depois?",
					en: "What if the workflow breaks later?",
				},
				a: {
					pt: "Todo fluxo sai com alerta de falha e log de execução. Pequenos ajustes logo após a entrega fazem parte. Pra mudanças de processo ou novas automações, você pode contratar um pacote mensal de horas.",
					en: "Every workflow ships with failure alerts and execution logs. Small adjustments right after delivery are included. For process changes or new automations, you can hire a monthly package of hours.",
				},
			},
			{
				q: {
					pt: "Você atende empresas fora de Fortaleza?",
					en: "Do you work with companies outside Fortaleza?",
				},
				a: {
					pt: "Sim. O trabalho é 100% remoto e a maioria dos meus clientes está em outros estados. Reuniões por vídeo e acompanhamento pelo portal do cliente.",
					en: "Yes. The work is 100% remote and most of my clients are in other states. Video meetings and progress tracking through the client portal.",
				},
			},
		],
		relatedCaseSlugs: ["crm-leiloes", "medspace", "cleanapp"],
		accent: ["#8b5cf6", "#6366f1"],
	},
	{
		slug: "sistema-sob-medida-saas",
		name: { pt: "Sistema sob medida e SaaS", en: "Custom systems and SaaS" },
		title: {
			pt: "Desenvolvimento de sistema sob medida e SaaS para sua operação",
			en: "Custom system and SaaS development for your operation",
		},
		metaTitle: "Sistema sob medida e SaaS multi-tenant | Fellipe Pavin",
		metaDescription:
			"Sistema web sob medida, SaaS multi-tenant, marketplace ou painel de gestão em Next.js e PostgreSQL. Por marcos, em 2 a 6 semanas. A partir de R$ 1.750.",
		kicker: { pt: "// sistema sob medida", en: "// custom system" },
		lead: {
			pt: "Quando planilha e ferramenta pronta não dão mais conta, eu construo o sistema do jeito que a sua operação funciona: SaaS multi-tenant, marketplace, painel de gestão ou área do cliente. Fundei e escalei um SaaS a 10 mil usuários pagantes; sei o que quebra quando cresce.",
			en: "When spreadsheets and off-the-shelf tools no longer keep up, I build the system the way your operation actually works: multi-tenant SaaS, marketplace, management dashboard or customer area. I founded and scaled a SaaS to 10,000 paying users; I know what breaks when you grow.",
		},
		summary: {
			pt: "Sistema web, SaaS multi-tenant, marketplace ou painel de gestão, do levantamento à produção.",
			en: "Web system, multi-tenant SaaS, marketplace or management dashboard, from requirements to production.",
		},
		included: [
			{
				pt: "Levantamento de requisitos e protótipo navegável antes de codar",
				en: "Requirements gathering and a clickable prototype before coding",
			},
			{
				pt: "Arquitetura pensada pra crescer: multi-tenant, permissões por perfil, auditoria e logs",
				en: "Architecture built to grow: multi-tenant, role-based permissions, audit trail and logs",
			},
			{
				pt: "Backend em Node.js ou .NET com PostgreSQL, API documentada e testes automatizados",
				en: "Backend in Node.js or .NET with PostgreSQL, documented API and automated tests",
			},
			{
				pt: "Frontend em React/Next.js responsivo, com painel administrativo e área do usuário",
				en: "Responsive React/Next.js frontend, with admin panel and user area",
			},
			{
				pt: "Pagamentos e assinaturas (Stripe, Mercado Pago, Asaas), e-mails transacionais e notificações",
				en: "Payments and subscriptions (Stripe, Mercado Pago, Asaas), transactional e-mails and notifications",
			},
			{
				pt: "Deploy em produção com CI/CD, monitoramento, backup e checklist de segurança e LGPD",
				en: "Production deployment with CI/CD, monitoring, backups and a security and LGPD compliance checklist",
			},
			{
				pt: "Código-fonte no seu repositório, documentado pra qualquer time dar continuidade",
				en: "Source code in your repository, documented so any team can pick it up",
			},
		],
		steps: steps({
			pt: "Entrego em fases de 2 a 6 semanas, cada uma com algo utilizável no fim. Você acompanha cada marco pelo portal do cliente (pavin.me/cliente), aprova entregas e comenta em qualquer etapa.",
			en: "I deliver in phases of 2 to 6 weeks, each ending with something usable. You follow every milestone through the client portal (pavin.me/cliente), approve deliveries and leave comments at any stage.",
		}),
		technologies: [
			"Next.js",
			"React",
			"TypeScript",
			"Node.js",
			"PostgreSQL",
			"Prisma",
			".NET",
			"Go",
			"Supabase",
			"Redis",
			"Docker",
			"Vercel",
		],
		timeline: { pt: "2 a 6 semanas por fase", en: "2 to 6 weeks per phase" },
		price: {
			from: 1750,
			label: { pt: "a partir de R$ 1.750", en: "from R$ 1,750" },
		},
		faq: [
			{
				q: {
					pt: "Quanto tempo leva um sistema sob medida?",
					en: "How long does a custom system take?",
				},
				a: {
					pt: "Um MVP funcional sai em 2 a 6 semanas, dependendo do escopo. Sistemas maiores são divididos em fases, cada uma com entrega utilizável. O MEDSPACE, por exemplo, entrou no ar em cerca de 4 semanas e evolui em incrementos desde então.",
					en: "A working MVP ships in 2 to 6 weeks, depending on scope. Larger systems are split into phases, each with a usable delivery. MEDSPACE, for example, went live in about 4 weeks and has evolved in increments ever since.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento?",
					en: "How does payment work?",
				},
				a: {
					pt: "Por etapas, com marcos definidos na proposta. Você paga por fase entregue e aprovada, não tudo de uma vez. Combinado por escrito antes da primeira linha de código.",
					en: "In stages, with milestones defined in the proposal. You pay per phase delivered and approved, not all at once. Agreed in writing before the first line of code.",
				},
			},
			{
				q: { pt: "O código é meu?", en: "Do I own the code?" },
				a: {
					pt: "Sim. O código-fonte fica no seu repositório desde o começo, com histórico completo. Se um dia quiser trocar de desenvolvedor ou montar um time interno, está tudo lá, documentado.",
					en: "Yes. The source code lives in your repository from day one, with full history. If you ever want to switch developers or build an in-house team, it is all there, documented.",
				},
			},
			{
				q: {
					pt: "O que eu preciso enviar pra começar?",
					en: "What do I need to send to get started?",
				},
				a: {
					pt: "Uma descrição do problema e de como o processo funciona hoje (mesmo que seja em planilha), referências de sistemas que você gosta e alguém da operação pra eu tirar dúvidas. O resto (arquitetura, código, deploy) é comigo.",
					en: "A description of the problem and how the process works today (even if it runs on spreadsheets), references of systems you like and someone from the operation I can ask questions to. The rest (architecture, code, deployment) is on me.",
				},
			},
			{
				q: {
					pt: "Como eu acompanho o desenvolvimento?",
					en: "How do I follow the development?",
				},
				a: {
					pt: "Pelo portal do cliente (pavin.me/cliente): cada marco aparece com status, o que foi entregue e a linha do tempo inteira. Você aprova cada entrega por lá e deixa comentários em qualquer etapa.",
					en: "Through the client portal (pavin.me/cliente): every milestone shows its status, what was delivered and the full timeline. You approve each delivery there and leave comments at any stage.",
				},
			},
			{
				q: {
					pt: "E depois que o sistema está no ar?",
					en: "And after the system is live?",
				},
				a: {
					pt: "Ajustes pequenos logo após a entrega fazem parte. Pra evolução contínua, existe o plano de manutenção mensal ou sprints de continuidade com escopo fechado. Sem cobrança surpresa.",
					en: "Small adjustments right after delivery are included. For ongoing evolution, there is a monthly maintenance plan or fixed-scope follow-up sprints. No surprise bills.",
				},
			},
		],
		relatedCaseSlugs: ["medspace", "cleanapp", "meraki", "silvalobo"],
		accent: ["#6366f1", "#ec4899"],
	},
	{
		slug: "aplicativo-mobile",
		name: { pt: "Aplicativo mobile", en: "Mobile app" },
		title: {
			pt: "Desenvolvimento de aplicativo mobile para Android e iOS",
			en: "Mobile app development for Android and iOS",
		},
		metaTitle: "Desenvolvimento de aplicativo mobile | Fellipe Pavin",
		metaDescription:
			"App em Flutter ou React Native com backend, painel admin e publicação na Play Store e App Store. Por marcos, em 2 a 6 semanas. A partir de R$ 1.750.",
		kicker: { pt: "// aplicativo", en: "// mobile app" },
		lead: {
			pt: "Um aplicativo em Flutter ou React Native que roda em Android e iOS a partir de um único código, com backend, painel administrativo e publicação nas lojas incluídos. Sem surpresa na hora de subir pra App Store.",
			en: "A Flutter or React Native app that runs on Android and iOS from a single codebase, with backend, admin panel and store publishing included. No surprises when it is time to ship to the App Store.",
		},
		summary: {
			pt: "App em Flutter ou React Native, com backend, painel administrativo e publicação nas lojas.",
			en: "Flutter or React Native app, with backend, admin panel and app store publishing.",
		},
		included: [
			{
				pt: "Protótipo navegável das telas antes de desenvolver",
				en: "Clickable prototype of the screens before development",
			},
			{
				pt: "App em Flutter ou React Native: um código pra Android e iOS",
				en: "Flutter or React Native app: one codebase for Android and iOS",
			},
			{
				pt: "Backend e API (Node.js ou .NET com PostgreSQL) com autenticação, notificações push e uploads",
				en: "Backend and API (Node.js or .NET with PostgreSQL) with authentication, push notifications and uploads",
			},
			{
				pt: "Painel administrativo web pra você gerenciar conteúdo, usuários e pedidos",
				en: "Web admin panel for you to manage content, users and orders",
			},
			{
				pt: "Publicação na Google Play e na App Store: contas de desenvolvedor, ícones, capturas e revisão",
				en: "Publishing on Google Play and the App Store: developer accounts, icons, screenshots and review",
			},
			{
				pt: "Login social, pagamentos in-app ou por gateway, mapas e integrações com o que você já usa",
				en: "Social login, in-app or gateway payments, maps and integrations with what you already use",
			},
			{
				pt: "Monitoramento de erros e crashes em produção",
				en: "Error and crash monitoring in production",
			},
		],
		steps: steps({
			pt: "Você instala versões de teste no seu celular a cada marco e aprova pelo portal do cliente. A publicação nas lojas é o último marco, e eu conduzo a revisão da Apple e do Google.",
			en: "You install test builds on your phone at every milestone and approve through the client portal. Store publishing is the final milestone, and I handle the Apple and Google review process.",
		}),
		technologies: [
			"Flutter",
			"React Native",
			"Dart",
			"TypeScript",
			"Node.js",
			"PostgreSQL",
			"Firebase",
			"Supabase",
			"Expo",
			"Play Console",
			"App Store Connect",
		],
		timeline: { pt: "2 a 6 semanas por fase", en: "2 to 6 weeks per phase" },
		price: {
			from: 1750,
			label: { pt: "a partir de R$ 1.750", en: "from R$ 1,750" },
		},
		faq: [
			{
				q: { pt: "Flutter ou React Native?", en: "Flutter or React Native?" },
				a: {
					pt: "Os dois entregam app nativo pras duas lojas com um código só. Flutter tende a ser mais consistente visualmente; React Native aproveita o ecossistema JavaScript e facilita compartilhar código com o site. Recomendo na call com base no seu time e no que o app precisa fazer.",
					en: "Both deliver a native app for both stores from a single codebase. Flutter tends to be more visually consistent; React Native leverages the JavaScript ecosystem and makes it easier to share code with your website. I recommend one on the call based on your team and what the app needs to do.",
				},
			},
			{
				q: {
					pt: "Quanto tempo leva pra publicar?",
					en: "How long until it is published?",
				},
				a: {
					pt: "Um MVP fica pronto em 2 a 6 semanas. A revisão da Apple costuma levar alguns dias e pode pedir ajustes; eu cuido do processo inteiro, como já fiz na publicação de apps de clientes.",
					en: "An MVP is ready in 2 to 6 weeks. Apple's review usually takes a few days and may request changes; I handle the whole process, as I have done when publishing client apps.",
				},
			},
			{
				q: {
					pt: "Preciso ter conta de desenvolvedor?",
					en: "Do I need a developer account?",
				},
				a: {
					pt: "Sim, as contas na Google Play e na Apple ficam no nome da sua empresa (as lojas cobram uma taxa própria). Eu abro e configuro as contas com você e faço o envio.",
					en: "Yes, the Google Play and Apple accounts are registered in your company's name (the stores charge their own fee). I open and configure the accounts with you and handle the submission.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento?",
					en: "How does payment work?",
				},
				a: {
					pt: "Por etapas, com marcos definidos: protótipo, primeira versão funcional, publicação. Você paga a cada marco aprovado. Combinado por escrito antes de começar.",
					en: "In stages, with defined milestones: prototype, first working version, publishing. You pay at each approved milestone. Agreed in writing before we start.",
				},
			},
			{
				q: { pt: "O código do app é meu?", en: "Do I own the app's code?" },
				a: {
					pt: "Sim. Repositório no seu nome desde o primeiro commit, com documentação de build e publicação. Nada fica preso comigo.",
					en: "Yes. The repository is in your name from the first commit, with build and publishing documentation. Nothing stays locked with me.",
				},
			},
			{
				q: {
					pt: "Você atende fora de Fortaleza?",
					en: "Do you work with clients outside Fortaleza?",
				},
				a: {
					pt: "Sim, o trabalho é remoto e a maior parte dos clientes está em outros estados. Reuniões por vídeo e acompanhamento pelo portal do cliente.",
					en: "Yes, the work is remote and most of my clients are in other states. Video meetings and progress tracking through the client portal.",
				},
			},
		],
		relatedCaseSlugs: ["cleanapp", "lorflux", "silvalobo"],
		accent: ["#06b6d4", "#6366f1"],
	},
	{
		slug: "integracao-bling-marketplaces",
		name: {
			pt: "Integração Bling e marketplaces",
			en: "Bling and marketplace integration",
		},
		title: {
			pt: "Integração do Bling e Tiny com Mercado Livre, Shopee e Amazon",
			en: "Bling and Tiny integration with Mercado Livre, Shopee and Amazon",
		},
		metaTitle: "Integração Bling e Tiny com Mercado Livre, Shopee e Amazon",
		metaDescription:
			"Integração do ERP Bling ou Tiny com Mercado Livre, Shopee e Amazon: estoque e pedidos sincronizados, APIs e dashboards em Power BI. A partir de R$ 1.250.",
		kicker: { pt: "// integrações", en: "// integrations" },
		lead: {
			pt: "Estoque e pedidos sincronizados entre o seu ERP (Bling ou Tiny) e os marketplaces onde você vende, sem planilha no meio. E quando o dado já está fluindo, um dashboard em Power BI pra enxergar margem, ruptura e giro por canal.",
			en: "Stock and orders synchronized between your ERP (Bling or Tiny) and the marketplaces where you sell, with no spreadsheets in between. And once the data is flowing, a Power BI dashboard to see margin, stockouts and turnover per channel.",
		},
		summary: {
			pt: "ERP Bling ou Tiny sincronizado com Mercado Livre, Shopee e Amazon, APIs e dashboards em Power BI.",
			en: "Bling or Tiny ERP synchronized with Mercado Livre, Shopee and Amazon, plus APIs and Power BI dashboards.",
		},
		included: [
			{
				pt: "Diagnóstico do fluxo atual: onde o estoque diverge, onde o pedido trava, o que ainda é manual",
				en: "Diagnosis of the current flow: where stock diverges, where orders get stuck, what is still manual",
			},
			{
				pt: "Integração via API oficial: Bling, Tiny, Mercado Livre, Shopee, Amazon, Magalu, Shopify e WooCommerce",
				en: "Integration through official APIs: Bling, Tiny, Mercado Livre, Shopee, Amazon, Magalu, Shopify and WooCommerce",
			},
			{
				pt: "Sincronização de estoque, preço e pedidos com fila, retentativa e log de cada operação",
				en: "Stock, price and order synchronization with queueing, retries and a log of every operation",
			},
			{
				pt: "Regras de negócio: preço por canal, kit e composição, reserva de estoque, cancelamento e devolução",
				en: "Business rules: per-channel pricing, kits and bundles, stock reservation, cancellations and returns",
			},
			{
				pt: "Robôs e automações complementares em n8n ou Python pra o que a API não cobre",
				en: "Complementary bots and automations in n8n or Python for what the API does not cover",
			},
			{
				pt: "Dashboard em Power BI ou painel web com vendas, margem e ruptura por canal",
				en: "Power BI dashboard or web panel with sales, margin and stockouts per channel",
			},
			{
				pt: "Monitoramento com alerta quando uma sincronização falha",
				en: "Monitoring with alerts whenever a sync fails",
			},
		],
		steps: steps({
			pt: "A integração roda primeiro em homologação, com pedidos e estoque de teste, e só vai pra produção depois que você valida. Cada canal é um marco no portal do cliente.",
			en: "The integration runs in staging first, with test orders and stock, and only goes to production after you validate it. Each channel is a milestone in the client portal.",
		}),
		technologies: [
			"Bling API",
			"Tiny ERP",
			"Mercado Livre API",
			"Shopee",
			"Amazon SP-API",
			"Node.js",
			".NET",
			"Python",
			"PostgreSQL",
			"n8n",
			"Power BI",
		],
		timeline: { pt: "7 a 15 dias", en: "7 to 15 days" },
		price: {
			from: 1250,
			label: { pt: "a partir de R$ 1.250", en: "from R$ 1,250" },
		},
		faq: [
			{
				q: {
					pt: "Quanto tempo leva uma integração?",
					en: "How long does an integration take?",
				},
				a: {
					pt: "Uma integração ponto a ponto (Bling com Mercado Livre, por exemplo) fica rodando em 7 a 15 dias. Vários canais e regras de preço por marketplace entram em fases, cada uma testada em produção antes da próxima.",
					en: "A point-to-point integration (Bling with Mercado Livre, for example) is running in 7 to 15 days. Multiple channels and per-marketplace pricing rules come in phases, each tested in production before the next.",
				},
			},
			{
				q: {
					pt: "Já uso o conector nativo do Bling. Por que precisaria de você?",
					en: "I already use Bling's native connector. Why would I need you?",
				},
				a: {
					pt: "Os conectores nativos resolvem o básico. Quando você precisa de regra de preço por canal, kit, reserva de estoque, múltiplos depósitos ou um relatório que o ERP não gera, é aí que uma integração sob medida entra.",
					en: "Native connectors cover the basics. When you need per-channel pricing rules, kits, stock reservation, multiple warehouses or a report the ERP does not produce, that is where a custom integration comes in.",
				},
			},
			{
				q: { pt: "O que eu preciso enviar?", en: "What do I need to send?" },
				a: {
					pt: "Acesso de API ao ERP e às contas dos marketplaces (eu oriento como gerar), uma descrição de como o pedido flui hoje e uma pessoa da operação pra validar os casos de exceção.",
					en: "API access to the ERP and the marketplace accounts (I guide you on how to generate it), a description of how orders flow today and someone from the operation to validate the edge cases.",
				},
			},
			{
				q: {
					pt: "Como funciona o pagamento?",
					en: "How does payment work?",
				},
				a: {
					pt: "Por etapas, com marcos definidos: diagnóstico e desenho, integração em homologação, integração em produção. Combinado por escrito antes de começar.",
					en: "In stages, with defined milestones: diagnosis and design, integration in staging, integration in production. Agreed in writing before we start.",
				},
			},
			{
				q: {
					pt: "A integração roda onde?",
					en: "Where does the integration run?",
				},
				a: {
					pt: "Numa VPS sua ou num serviço de nuvem na sua conta, com acesso que fica com você. Nada roda em infraestrutura minha.",
					en: "On your own VPS or a cloud service on your account, with access that stays with you. Nothing runs on my infrastructure.",
				},
			},
			{
				q: {
					pt: "E a manutenção quando o marketplace muda a API?",
					en: "What about maintenance when a marketplace changes its API?",
				},
				a: {
					pt: "Ajustes pequenos após a entrega fazem parte. Pra acompanhar mudanças de API e evoluir regras, existe o plano mensal de manutenção com monitoramento incluído.",
					en: "Small adjustments after delivery are included. To keep up with API changes and evolve the rules, there is a monthly maintenance plan with monitoring included.",
				},
			},
		],
		relatedCaseSlugs: ["mercadolivre", "crm-leiloes", "cleanapp"],
		accent: ["#eab308", "#f97316"],
	},
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}
