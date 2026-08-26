/**
 * Serviços vendidos nas landing pages /servicos/<slug> (pt-BR, SEO).
 *
 * Tudo aqui é copy comercial em português: sem traduções, sem travessão no
 * texto visível, sem número inventado. Os fatos citados (9+ anos, 20+
 * projetos, SaaS a 10 mil usuários pagantes, 4,92/5 em 28 avaliações) vêm da
 * home e de src/data/reviews.ts. Os cases relacionados apontam pra slugs de
 * src/lib/projects.ts.
 */

export type ServiceFaq = { q: string; a: string };

export type ServiceStep = { title: string; text: string };

export type Service = {
	slug: string;
	/** Nome curto: cards do hub, breadcrumb, nav. */
	name: string;
	/** H1 da página, com a frase de busca de forma natural. */
	title: string;
	/** <title> completo (até 60 caracteres). */
	metaTitle: string;
	/** Meta description (até 155 caracteres). */
	metaDescription: string;
	kicker: string;
	/** Parágrafo de abertura logo abaixo do H1. */
	lead: string;
	/** Uma linha pro card do hub e pro ItemList do JSON-LD. */
	summary: string;
	included: string[];
	steps: ServiceStep[];
	technologies: string[];
	/** Prazo típico, coerente com a tabela de preços. */
	timeline: string;
	price: { from: number; label: string };
	faq: ServiceFaq[];
	relatedCaseSlugs: string[];
	/** Par de cores do card no hub (mesma linguagem dos projetos). */
	accent: [string, string];
};

const STEP_PROPOSAL: ServiceStep = {
	title: "Proposta em até 1 dia",
	text: "Você me conta o que precisa pelo formulário no fim da página. Em até um dia útil, recebe uma proposta com escopo, prazo e valor fechados.",
};

const STEP_CALL: ServiceStep = {
	title: "Call de 15 minutos",
	text: "Alinhamos os detalhes por vídeo, tiro as dúvidas técnicas e a gente fecha o escopo por escrito antes de qualquer linha de código.",
};

const STEP_DELIVERY: ServiceStep = {
	title: "Entrega e ajustes",
	text: "Publicação em produção, treinamento pra sua equipe e ajustes finos logo após a entrega, que já fazem parte do combinado.",
};

function steps(development: string): ServiceStep[] {
	return [
		STEP_PROPOSAL,
		STEP_CALL,
		{ title: "Desenvolvimento com acompanhamento", text: development },
		STEP_DELIVERY,
	];
}

export const services: Service[] = [
	{
		slug: "criacao-de-site",
		name: "Criação de site",
		title: "Criação de site profissional para sua empresa",
		metaTitle: "Criação de site profissional | Fellipe Pavin, Fortaleza",
		metaDescription:
			"Site institucional ou landing page em WordPress/Elementor ou Next.js, com SEO técnico, formulário e hospedagem. Pronto em 4 a 10 dias. A partir de R$ 750.",
		kicker: "// criação de site",
		lead: "Site institucional ou landing page que carrega rápido, aparece no Google e transforma visita em contato. Em WordPress com Elementor, quando você quer editar sozinho, ou em Next.js, quando performance e SEO técnico são o ponto central.",
		summary:
			"Site institucional ou landing page rápida, com SEO técnico, formulário de contato e hospedagem configurada.",
		included: [
			"Layout responsivo (celular, tablet e desktop) a partir da sua identidade visual",
			"Páginas principais: home, sobre, serviços ou produtos, contato e o que mais fizer sentido pro seu negócio",
			"SEO técnico: títulos, meta descrições, sitemap, dados estruturados e Core Web Vitals no verde",
			"Formulário de contato com proteção anti-spam e envio por e-mail ou WhatsApp",
			"Domínio, hospedagem, SSL e e-mail profissional configurados",
			"Google Analytics e Search Console instalados e validados",
			"Treinamento rápido pra você editar textos e imagens sem depender de ninguém",
		],
		steps: steps(
			"O site vai ganhando forma página a página. Você acompanha cada marco pelo portal do cliente (pavin.me/cliente), vê o link de homologação e aprova ou comenta por lá.",
		),
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
		timeline: "4 a 10 dias",
		price: { from: 750, label: "a partir de R$ 750" },
		faq: [
			{
				q: "Em quanto tempo o site fica pronto?",
				a: "Uma landing page fica pronta em 4 a 5 dias; um site institucional com 5 a 8 páginas, em até 10 dias. O prazo conta a partir do envio do conteúdo (textos, logo e imagens) e fica fixado na proposta.",
			},
			{
				q: "WordPress ou Next.js: qual escolher?",
				a: "WordPress com Elementor quando você vai editar o site com frequência e quer autonomia total. Next.js quando performance, SEO técnico e integrações pesam mais. Eu explico a diferença na call e recomendo com base no seu caso, não no que dá mais trabalho.",
			},
			{
				q: "O que eu preciso enviar pra começar?",
				a: "Logo, textos (ou só os tópicos, que eu ajudo a redigir), fotos ou referências de sites que você gosta e os acessos do domínio, se já tiver. Se não tiver domínio nem hospedagem, eu configuro no seu nome.",
			},
			{
				q: "Como funciona o pagamento?",
				a: "Pagamento por etapas, com marcos definidos: uma parte na aprovação da proposta e o restante na entrega. Tudo combinado por escrito antes de começar.",
			},
			{
				q: "E a manutenção depois da entrega?",
				a: "Ajustes pequenos logo após a entrega fazem parte. Depois, você pode seguir sozinho (o site fica no seu nome, na sua hospedagem) ou contratar um plano mensal de manutenção com atualizações, backup e suporte.",
			},
			{
				q: "Você atende empresas fora de Fortaleza?",
				a: "Sim. Trabalho remoto com clientes de todo o Brasil, com reuniões por vídeo e acompanhamento pelo portal do cliente. Fortaleza é onde eu moro, não um limite.",
			},
		],
		relatedCaseSlugs: ["macroluz", "cidadetur", "lastmile"],
		accent: ["#f59e0b", "#ec4899"],
	},
	{
		slug: "loja-virtual",
		name: "Loja virtual",
		title: "Criação de loja virtual pronta para vender",
		metaTitle: "Criação de loja virtual | Nuvemshop, Shopify, WooCommerce",
		metaDescription:
			"Loja virtual em Nuvemshop, Shopify, WooCommerce ou Loja Integrada: tema, pagamento, frete e catálogo prontos. No ar em 4 a 10 dias. A partir de R$ 750.",
		kicker: "// loja virtual",
		lead: "Sua loja no ar com pagamento, frete e catálogo funcionando desde o primeiro dia. Configuro a plataforma certa pro seu tamanho (Nuvemshop, Shopify, WooCommerce ou Loja Integrada), personalizo o tema e deixo tudo pronto pra você vender.",
		summary:
			"Loja em Nuvemshop, Shopify, WooCommerce ou Loja Integrada, com pagamento, frete e catálogo configurados.",
		included: [
			"Escolha e configuração da plataforma: Nuvemshop, Shopify, WooCommerce ou Loja Integrada",
			"Personalização do tema com a sua identidade visual: home, categorias e página de produto",
			"Pagamento por Pix, cartão e boleto (Mercado Pago, Pagar.me, PagSeguro ou o gateway da plataforma)",
			"Cálculo de frete com Correios, Melhor Envio ou transportadora, com regra de frete grátis",
			"Cadastro inicial do catálogo: produtos, variações, fotos e estoque",
			"Domínio, SSL, e-mails transacionais e políticas de troca, privacidade e entrega",
			"Pixel da Meta, Google Analytics e Google Merchant configurados",
		],
		steps: steps(
			"A loja é montada em ambiente de teste com seus produtos reais. Você acompanha os marcos pelo portal do cliente, faz pedidos de teste e aprova antes de virar a chave.",
		),
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
		timeline: "4 a 10 dias",
		price: { from: 750, label: "a partir de R$ 750" },
		faq: [
			{
				q: "Qual plataforma é melhor pra minha loja?",
				a: "Depende do volume, do custo mensal que você aceita e das integrações que precisa. Nuvemshop e Loja Integrada são ótimas pra começar no Brasil; Shopify é forte em apps e escala; WooCommerce dá controle total no seu próprio servidor. Eu recomendo depois de entender o seu caso na call.",
			},
			{
				q: "Em quanto tempo a loja fica no ar?",
				a: "Com o catálogo e a identidade visual em mãos, entre 4 e 10 dias, dependendo do número de produtos e das integrações. O prazo fica fixado na proposta.",
			},
			{
				q: "Como funciona o pagamento do projeto?",
				a: "Por etapas, com marcos definidos: uma parte na aprovação e o restante na entrega da loja funcionando. Combinado por escrito antes de começar.",
			},
			{
				q: "O que eu preciso enviar?",
				a: "Logo, fotos e descrições dos produtos (ou uma planilha), tabela de preços e estoque, dados da empresa pra pagamento e frete, e os acessos do domínio, se já tiver.",
			},
			{
				q: "Já tenho uma loja e quero migrar. Dá?",
				a: "Dá. Faço migração de catálogo, clientes e pedidos entre plataformas, com redirecionamentos configurados pra não perder o posicionamento que você já tem no Google.",
			},
			{
				q: "A loja fica no meu nome?",
				a: "Sim. A conta na plataforma, o domínio e os gateways de pagamento ficam no seu CNPJ. Você tem acesso total e não depende de mim pra operar.",
			},
		],
		relatedCaseSlugs: ["mercadolivre", "lorflux", "lastmile"],
		accent: ["#22c55e", "#06b6d4"],
	},
	{
		slug: "automacao-n8n-chatbot-whatsapp",
		name: "Automação e chatbot de WhatsApp",
		title: "Automação com n8n e chatbot de WhatsApp para o seu negócio",
		metaTitle: "Automação n8n e chatbot WhatsApp com IA | Fellipe Pavin",
		metaDescription:
			"Automações em n8n, chatbot de WhatsApp com Evolution API, CRM e agentes de IA que atendem e qualificam leads. Em 7 a 15 dias. A partir de R$ 1.250.",
		kicker: "// automação",
		lead: "Fluxos em n8n que tiram o trabalho repetitivo da sua equipe e um chatbot de WhatsApp que responde, qualifica e registra o lead no CRM, com ou sem IA por trás. Tudo rodando na sua conta, na sua infraestrutura.",
		summary:
			"Fluxos em n8n, chatbot de WhatsApp com Evolution API, integração com CRM e agentes de IA.",
		included: [
			"Mapeamento do processo e desenho do fluxo antes de automatizar: o que entra, o que sai, quem aprova",
			"Automações em n8n conectando e-mail, planilhas, CRM, ERP, formulários, webhooks e APIs",
			"Chatbot de WhatsApp com Evolution API ou API oficial da Meta: menus, horários e transbordo pra atendente",
			"Agente de IA (OpenAI, Anthropic ou modelo aberto) treinado na base de conhecimento do seu negócio",
			"Integração com CRM (RD Station, Pipedrive, HubSpot, Zoho, Kommo) e notificações pra equipe",
			"Instalação do n8n na sua VPS com backup, logs e alerta de falha",
			"Documentação do fluxo e treinamento pra sua equipe ajustar sem programar",
		],
		steps: steps(
			"Cada fluxo entra em produção assim que fica pronto, então a primeira automação já trabalha enquanto as outras são construídas. Você acompanha os marcos pelo portal do cliente.",
		),
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
		timeline: "7 a 15 dias",
		price: { from: 1250, label: "a partir de R$ 1.250" },
		faq: [
			{
				q: "Quanto tempo leva pra automação ficar rodando?",
				a: "Uma automação simples fica no ar em uma semana; um chatbot com IA e integração com CRM, em até 15 dias. Em projetos maiores, entrego por marcos, então você já usa a primeira parte enquanto o resto é construído.",
			},
			{
				q: "O chatbot usa a API oficial do WhatsApp?",
				a: "Depende do seu caso. A API oficial da Meta tem custo por conversa e exige aprovação, mas é a mais estável. A Evolution API funciona com um número comum e custa menos. Eu explico os riscos de cada uma e você decide.",
			},
			{
				q: "Preciso ter um servidor?",
				a: "Não obrigatoriamente. O n8n roda numa VPS simples que eu configuro pra você, ou no plano em nuvem do próprio n8n. Em qualquer caso, fica tudo na sua conta, com acesso seu.",
			},
			{
				q: "Como funciona o pagamento?",
				a: "Por etapas, com marcos definidos: uma parte na aprovação da proposta e o restante conforme cada fluxo entra em produção. Combinado por escrito antes de começar.",
			},
			{
				q: "E se o fluxo quebrar depois?",
				a: "Todo fluxo sai com alerta de falha e log de execução. Pequenos ajustes logo após a entrega fazem parte. Pra mudanças de processo ou novas automações, você pode contratar um pacote mensal de horas.",
			},
			{
				q: "Você atende empresas fora de Fortaleza?",
				a: "Sim. O trabalho é 100% remoto e a maioria dos meus clientes está em outros estados. Reuniões por vídeo e acompanhamento pelo portal do cliente.",
			},
		],
		relatedCaseSlugs: ["crm-leiloes", "medspace", "cleanapp"],
		accent: ["#8b5cf6", "#6366f1"],
	},
	{
		slug: "sistema-sob-medida-saas",
		name: "Sistema sob medida e SaaS",
		title: "Desenvolvimento de sistema sob medida e SaaS para sua operação",
		metaTitle: "Sistema sob medida e SaaS multi-tenant | Fellipe Pavin",
		metaDescription:
			"Sistema web sob medida, SaaS multi-tenant, marketplace ou painel de gestão em Next.js e PostgreSQL. Por marcos, em 2 a 6 semanas. A partir de R$ 1.750.",
		kicker: "// sistema sob medida",
		lead: "Quando planilha e ferramenta pronta não dão mais conta, eu construo o sistema do jeito que a sua operação funciona: SaaS multi-tenant, marketplace, painel de gestão ou área do cliente. Fundei e escalei um SaaS a 10 mil usuários pagantes; sei o que quebra quando cresce.",
		summary:
			"Sistema web, SaaS multi-tenant, marketplace ou painel de gestão, do levantamento à produção.",
		included: [
			"Levantamento de requisitos e protótipo navegável antes de codar",
			"Arquitetura pensada pra crescer: multi-tenant, permissões por perfil, auditoria e logs",
			"Backend em Node.js ou .NET com PostgreSQL, API documentada e testes automatizados",
			"Frontend em React/Next.js responsivo, com painel administrativo e área do usuário",
			"Pagamentos e assinaturas (Stripe, Mercado Pago, Asaas), e-mails transacionais e notificações",
			"Deploy em produção com CI/CD, monitoramento, backup e checklist de segurança e LGPD",
			"Código-fonte no seu repositório, documentado pra qualquer time dar continuidade",
		],
		steps: steps(
			"Entrego em fases de 2 a 6 semanas, cada uma com algo utilizável no fim. Você acompanha cada marco pelo portal do cliente (pavin.me/cliente), aprova entregas e comenta em qualquer etapa.",
		),
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
		timeline: "2 a 6 semanas por fase",
		price: { from: 1750, label: "a partir de R$ 1.750" },
		faq: [
			{
				q: "Quanto tempo leva um sistema sob medida?",
				a: "Um MVP funcional sai em 2 a 6 semanas, dependendo do escopo. Sistemas maiores são divididos em fases, cada uma com entrega utilizável. O MEDSPACE, por exemplo, entrou no ar em cerca de 4 semanas e evolui em incrementos desde então.",
			},
			{
				q: "Como funciona o pagamento?",
				a: "Por etapas, com marcos definidos na proposta. Você paga por fase entregue e aprovada, não tudo de uma vez. Combinado por escrito antes da primeira linha de código.",
			},
			{
				q: "O código é meu?",
				a: "Sim. O código-fonte fica no seu repositório desde o começo, com histórico completo. Se um dia quiser trocar de desenvolvedor ou montar um time interno, está tudo lá, documentado.",
			},
			{
				q: "O que eu preciso enviar pra começar?",
				a: "Uma descrição do problema e de como o processo funciona hoje (mesmo que seja em planilha), referências de sistemas que você gosta e alguém da operação pra eu tirar dúvidas. O resto (arquitetura, código, deploy) é comigo.",
			},
			{
				q: "Como eu acompanho o desenvolvimento?",
				a: "Pelo portal do cliente (pavin.me/cliente): cada marco aparece com status, o que foi entregue e a linha do tempo inteira. Você aprova cada entrega por lá e deixa comentários em qualquer etapa.",
			},
			{
				q: "E depois que o sistema está no ar?",
				a: "Ajustes pequenos logo após a entrega fazem parte. Pra evolução contínua, existe o plano de manutenção mensal ou sprints de continuidade com escopo fechado. Sem cobrança surpresa.",
			},
		],
		relatedCaseSlugs: ["medspace", "cleanapp", "meraki", "silvalobo"],
		accent: ["#6366f1", "#ec4899"],
	},
	{
		slug: "aplicativo-mobile",
		name: "Aplicativo mobile",
		title: "Desenvolvimento de aplicativo mobile para Android e iOS",
		metaTitle: "Desenvolvimento de aplicativo mobile | Fellipe Pavin",
		metaDescription:
			"App em Flutter ou React Native com backend, painel admin e publicação na Play Store e App Store. Por marcos, em 2 a 6 semanas. A partir de R$ 1.750.",
		kicker: "// aplicativo",
		lead: "Um aplicativo em Flutter ou React Native que roda em Android e iOS a partir de um único código, com backend, painel administrativo e publicação nas lojas incluídos. Sem surpresa na hora de subir pra App Store.",
		summary:
			"App em Flutter ou React Native, com backend, painel administrativo e publicação nas lojas.",
		included: [
			"Protótipo navegável das telas antes de desenvolver",
			"App em Flutter ou React Native: um código pra Android e iOS",
			"Backend e API (Node.js ou .NET com PostgreSQL) com autenticação, notificações push e uploads",
			"Painel administrativo web pra você gerenciar conteúdo, usuários e pedidos",
			"Publicação na Google Play e na App Store: contas de desenvolvedor, ícones, capturas e revisão",
			"Login social, pagamentos in-app ou por gateway, mapas e integrações com o que você já usa",
			"Monitoramento de erros e crashes em produção",
		],
		steps: steps(
			"Você instala versões de teste no seu celular a cada marco e aprova pelo portal do cliente. A publicação nas lojas é o último marco, e eu conduzo a revisão da Apple e do Google.",
		),
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
		timeline: "2 a 6 semanas por fase",
		price: { from: 1750, label: "a partir de R$ 1.750" },
		faq: [
			{
				q: "Flutter ou React Native?",
				a: "Os dois entregam app nativo pras duas lojas com um código só. Flutter tende a ser mais consistente visualmente; React Native aproveita o ecossistema JavaScript e facilita compartilhar código com o site. Recomendo na call com base no seu time e no que o app precisa fazer.",
			},
			{
				q: "Quanto tempo leva pra publicar?",
				a: "Um MVP fica pronto em 2 a 6 semanas. A revisão da Apple costuma levar alguns dias e pode pedir ajustes; eu cuido do processo inteiro, como já fiz na publicação de apps de clientes.",
			},
			{
				q: "Preciso ter conta de desenvolvedor?",
				a: "Sim, as contas na Google Play e na Apple ficam no nome da sua empresa (as lojas cobram uma taxa própria). Eu abro e configuro as contas com você e faço o envio.",
			},
			{
				q: "Como funciona o pagamento?",
				a: "Por etapas, com marcos definidos: protótipo, primeira versão funcional, publicação. Você paga a cada marco aprovado. Combinado por escrito antes de começar.",
			},
			{
				q: "O código do app é meu?",
				a: "Sim. Repositório no seu nome desde o primeiro commit, com documentação de build e publicação. Nada fica preso comigo.",
			},
			{
				q: "Você atende fora de Fortaleza?",
				a: "Sim, o trabalho é remoto e a maior parte dos clientes está em outros estados. Reuniões por vídeo e acompanhamento pelo portal do cliente.",
			},
		],
		relatedCaseSlugs: ["cleanapp", "lorflux", "silvalobo"],
		accent: ["#06b6d4", "#6366f1"],
	},
	{
		slug: "integracao-bling-marketplaces",
		name: "Integração Bling e marketplaces",
		title: "Integração do Bling e Tiny com Mercado Livre, Shopee e Amazon",
		metaTitle: "Integração Bling e Tiny com Mercado Livre, Shopee e Amazon",
		metaDescription:
			"Integração do ERP Bling ou Tiny com Mercado Livre, Shopee e Amazon: estoque e pedidos sincronizados, APIs e dashboards em Power BI. A partir de R$ 1.250.",
		kicker: "// integrações",
		lead: "Estoque e pedidos sincronizados entre o seu ERP (Bling ou Tiny) e os marketplaces onde você vende, sem planilha no meio. E quando o dado já está fluindo, um dashboard em Power BI pra enxergar margem, ruptura e giro por canal.",
		summary:
			"ERP Bling ou Tiny sincronizado com Mercado Livre, Shopee e Amazon, APIs e dashboards em Power BI.",
		included: [
			"Diagnóstico do fluxo atual: onde o estoque diverge, onde o pedido trava, o que ainda é manual",
			"Integração via API oficial: Bling, Tiny, Mercado Livre, Shopee, Amazon, Magalu, Shopify e WooCommerce",
			"Sincronização de estoque, preço e pedidos com fila, retentativa e log de cada operação",
			"Regras de negócio: preço por canal, kit e composição, reserva de estoque, cancelamento e devolução",
			"Robôs e automações complementares em n8n ou Python pra o que a API não cobre",
			"Dashboard em Power BI ou painel web com vendas, margem e ruptura por canal",
			"Monitoramento com alerta quando uma sincronização falha",
		],
		steps: steps(
			"A integração roda primeiro em homologação, com pedidos e estoque de teste, e só vai pra produção depois que você valida. Cada canal é um marco no portal do cliente.",
		),
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
		timeline: "7 a 15 dias",
		price: { from: 1250, label: "a partir de R$ 1.250" },
		faq: [
			{
				q: "Quanto tempo leva uma integração?",
				a: "Uma integração ponto a ponto (Bling com Mercado Livre, por exemplo) fica rodando em 7 a 15 dias. Vários canais e regras de preço por marketplace entram em fases, cada uma testada em produção antes da próxima.",
			},
			{
				q: "Já uso o conector nativo do Bling. Por que precisaria de você?",
				a: "Os conectores nativos resolvem o básico. Quando você precisa de regra de preço por canal, kit, reserva de estoque, múltiplos depósitos ou um relatório que o ERP não gera, é aí que uma integração sob medida entra.",
			},
			{
				q: "O que eu preciso enviar?",
				a: "Acesso de API ao ERP e às contas dos marketplaces (eu oriento como gerar), uma descrição de como o pedido flui hoje e uma pessoa da operação pra validar os casos de exceção.",
			},
			{
				q: "Como funciona o pagamento?",
				a: "Por etapas, com marcos definidos: diagnóstico e desenho, integração em homologação, integração em produção. Combinado por escrito antes de começar.",
			},
			{
				q: "A integração roda onde?",
				a: "Numa VPS sua ou num serviço de nuvem na sua conta, com acesso que fica com você. Nada roda em infraestrutura minha.",
			},
			{
				q: "E a manutenção quando o marketplace muda a API?",
				a: "Ajustes pequenos após a entrega fazem parte. Pra acompanhar mudanças de API e evoluir regras, existe o plano mensal de manutenção com monitoramento incluído.",
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
