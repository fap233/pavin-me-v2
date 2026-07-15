/**
 * Deep technical write-ups shown when a project card is expanded.
 *
 * Everything here is grounded in what the repositories, delivery reports and
 * git history actually show — no invented endpoints or numbers. Projects with
 * thinner evidence get shorter sections rather than padded ones.
 */

type Bi = { en: string; pt: string };
type BiList = { en: string[]; pt: string[] };
type Qa = { problem: Bi; solution: Bi };

export type ProjectDetail = {
	role: Bi;
	timeline: Bi;
	summary: Bi;
	/** Architecture / engineering decisions and why they were taken. */
	architecture: BiList;
	/** Hard problems and how they were solved. */
	challenges: Qa[];
	/** Verifiable outcomes. */
	results: BiList;
	/** Grouped stack, so a reader can scan the surface area quickly. */
	stack: { label: Bi; items: string[] }[];
};

export const projectDetails: Record<string, ProjectDetail> = {
	medspace: {
		role: {
			en: "Sole engineer: architecture, implementation, security, deploy, ongoing maintenance",
			pt: "Engenheiro único: arquitetura, implementação, segurança, deploy e manutenção contínua",
		},
		timeline: { en: "Mar 2026 → present · in production", pt: "Mar 2026 → atual · em produção" },
		summary: {
			en: "A marketplace where doctors find clinics renting out consulting rooms, medical equipment and continuing-education offers. Advertisers self-serve their listings; an admin moderation queue gates what goes public; leads are handed off to WhatsApp with a pre-filled message. The MVP shipped in about four weeks and has been evolved in paid increments ever since.",
			pt: "Marketplace onde médicos encontram clínicas que anunciam salas de consultório, aparelhos e ofertas de educação médica. O anunciante gerencia os próprios anúncios; uma fila de moderação no admin controla o que vai ao ar; os leads saem para o WhatsApp com mensagem pré-preenchida. O MVP subiu em ~4 semanas e evolui em incrementos pagos desde então.",
		},
		architecture: {
			en: [
				"Next.js App Router with Server Actions for mutations and Route Handlers only where an HTTP contract is genuinely needed. No API layer written for its own sake.",
				"Prisma over PostgreSQL (Supabase) with the schema as the single source of truth; migrations gate every deploy.",
				"Auth.js v5 with bcrypt credentials; the session is the authorization boundary, and every Server Action re-checks ownership rather than trusting the client.",
				"Advertiser taxonomy modelled as a discriminated type (doctor / clinic / company / coworking / institution) so CPF-vs-CNPJ validation and the listing rules follow from the type, not from scattered ifs.",
				"Listings are never published directly: create/edit writes a pending revision, and only an admin approval flips it public. Editing an approved ad sends it back through review.",
				"Rate limiting at the edge of sensitive actions via Upstash Redis, configured fail-closed: if Redis is unreachable the request is denied, not waved through.",
				"Zod schemas shared between the form and the Server Action, so client and server validate against the same contract.",
			],
			pt: [
				"Next.js App Router com Server Actions para mutações e Route Handlers só onde há de fato um contrato HTTP. Sem camada de API criada por hábito.",
				"Prisma sobre PostgreSQL (Supabase) com o schema como fonte única da verdade; migrations barram todo deploy.",
				"Auth.js v5 com credenciais bcrypt; a sessão é a fronteira de autorização, e toda Server Action revalida a posse do recurso em vez de confiar no cliente.",
				"Tipos de anunciante modelados como união discriminada (médico / clínica / empresa / coworking / instituição), então a validação CPF-vs-CNPJ e as regras do anúncio derivam do tipo, não de ifs espalhados.",
				"Anúncio nunca é publicado direto: criar/editar grava uma revisão pendente, e só a aprovação do admin torna público. Editar um anúncio aprovado o devolve à revisão.",
				"Rate limiting nas ações sensíveis via Upstash Redis, configurado fail-closed: se o Redis cair, a requisição é negada, não liberada.",
				"Schemas Zod compartilhados entre formulário e Server Action, então cliente e servidor validam contra o mesmo contrato.",
			],
		},
		challenges: [
			{
				problem: {
					en: "I audited my own production code and found 13 vulnerabilities: one critical.",
					pt: "Auditei meu próprio código em produção e encontrei 13 vulnerabilidades: uma crítica.",
				},
				solution: {
					en: "The critical one let a listing reach the public grid without passing moderation. Three highs followed: blocking a user was a no-op, the rate limiter failed open, and the login leaked account existence through a timing oracle. All 13 were fixed and re-tested; the login path was made constant-time, the limiter fail-closed, and CSP/HSTS headers were added. The database was logically backed up before any of it shipped.",
					pt: "A crítica permitia um anúncio chegar à listagem pública sem passar pela moderação. Vieram três altas: bloquear usuário era no-op, o rate limiter falhava aberto e o login vazava existência de conta por timing oracle. Os 13 foram corrigidos e retestados; o login virou tempo constante, o limiter fail-closed, e headers CSP/HSTS entraram. O banco foi copiado logicamente antes de qualquer mudança subir.",
				},
			},
			{
				problem: {
					en: "LGPD compliance had to be real, not a cookie banner.",
					pt: "A conformidade com a LGPD tinha que ser real, não um banner de cookies.",
				},
				solution: {
					en: "Consent is captured at sign-up and versioned against the terms it accepted, so a future terms change is provable. Cookies are opt-in through Google Consent Mode v2. Users delete their own account and export their data through /api/me/export. Self-service, no ticket.",
					pt: "O consentimento é capturado no cadastro e versionado contra os termos aceitos, então uma mudança futura de termos é comprovável. Cookies são opt-in via Google Consent Mode v2. O usuário exclui a própria conta e exporta seus dados em /api/me/export. Autoatendimento, sem chamado.",
				},
			},
		],
		results: {
			en: [
				"MVP in production in ~4 weeks; 94 commits across the life of the project",
				"105 automated tests: unit, integration and Playwright E2E",
				"13 security findings found and fixed (1 critical, 3 high) in a self-initiated audit",
				"June/2026 increment: +3,335 lines, 50 files touched, 105 tests green",
				"Google Ads + Meta conversion tracking wired for the paid launch",
			],
			pt: [
				"MVP em produção em ~4 semanas; 94 commits ao longo do projeto",
				"105 testes automatizados: unitários, integração e E2E com Playwright",
				"13 achados de segurança encontrados e corrigidos (1 crítico, 3 altos) em auditoria por iniciativa própria",
				"Incremento de jun/2026: +3.335 linhas, 50 arquivos alterados, 105 testes verdes",
				"Rastreamento de conversão Google Ads + Meta instrumentado para o lançamento pago",
			],
		},
		stack: [
			{ label: { en: "Core", pt: "Núcleo" }, items: ["Next.js 16", "React 19", "TypeScript", "Server Actions"] },
			{ label: { en: "Data", pt: "Dados" }, items: ["PostgreSQL", "Prisma 7", "Supabase", "Upstash Redis"] },
			{ label: { en: "Auth & Security", pt: "Auth & Segurança" }, items: ["Auth.js v5", "bcrypt", "CSP / HSTS", "LGPD", "Rate limiting"] },
			{ label: { en: "Quality", pt: "Qualidade" }, items: ["Vitest", "Testing Library", "Playwright"] },
			{ label: { en: "Ops", pt: "Ops" }, items: ["Vercel", "GA4", "Google Ads", "Meta Pixel"] },
		],
	},

	cleanapp: {
		role: {
			en: "Sole engineer: domain modelling, implementation, testing, deployment",
			pt: "Engenheiro único: modelagem de domínio, implementação, testes e deploy",
		},
		timeline: { en: "2026 · MVP delivered in sprints", pt: "2026 · MVP entregue em sprints" },
		summary: {
			en: "Operations software for an Australian residential-cleaning business: clients, recurring jobs, a dispatch calendar, employees clocking in from the field, GST-compliant invoices and payroll. The interesting part is not the CRUD. It is the recurrence engine and the money.",
			pt: "Software operacional para uma empresa australiana de limpeza residencial: clientes, jobs recorrentes, calendário de despacho, funcionários batendo ponto em campo, faturas com GST e folha de pagamento. O interessante não é o CRUD. É a engine de recorrência e o dinheiro.",
		},
		architecture: {
			en: [
				"Money is never a float. All amounts are Decimal end to end, and GST (10%) is derived at invoice time rather than stored, so a rate change cannot silently rewrite history.",
				"Timestamps are stored in UTC and rendered in AEST. The rule is enforced at the boundary, so the recurrence engine never reasons about local time and daylight-saving cannot skew a schedule.",
				"The recurring-jobs engine materialises occurrences from a rule (e.g. every 3 weeks) rather than cloning rows, so editing the rule doesn't orphan the future.",
				"The employee app is an offline-first PWA: a cleaner in a basement with no signal still clocks in, and the event syncs when the network returns.",
				"Clock-in is geofenced (200 m radius against the job address). The check happens server-side, since a client-reported location is a suggestion, not evidence.",
				"Invoices are rendered to PDF server-side (@react-pdf/renderer) so the document is identical regardless of the device that requested it.",
			],
			pt: [
				"Dinheiro nunca é float. Todos os valores são Decimal de ponta a ponta, e o GST (10%) é derivado na emissão em vez de armazenado, então mudar a alíquota não reescreve o histórico silenciosamente.",
				"Timestamps são gravados em UTC e exibidos em AEST. A regra é aplicada na fronteira, então a engine de recorrência nunca raciocina em hora local e o horário de verão não distorce a agenda.",
				"A engine de jobs recorrentes materializa ocorrências a partir de uma regra (ex.: a cada 3 semanas) em vez de clonar linhas, então editar a regra não órfã o futuro.",
				"O app do funcionário é um PWA offline-first: o profissional num subsolo sem sinal ainda bate o ponto, e o evento sincroniza quando a rede volta.",
				"O ponto tem geofence (raio de 200 m contra o endereço do job). A verificação é no servidor, já que localização reportada pelo cliente é sugestão, não prova.",
				"Faturas são renderizadas em PDF no servidor (@react-pdf/renderer), então o documento é idêntico independente do aparelho que pediu.",
			],
		},
		challenges: [
			{
				problem: {
					en: "A cleaner's phone loses signal mid-shift. The clock-in cannot be lost.",
					pt: "O celular do profissional perde sinal no meio do turno. O ponto não pode se perder.",
				},
				solution: {
					en: "The PWA queues the clock event locally with its captured coordinates and replays it on reconnect. The geofence is evaluated server-side at replay time against the stored coordinates and timestamp, so being offline never becomes a way to bypass the check.",
					pt: "O PWA enfileira o evento de ponto localmente com as coordenadas capturadas e o reenvia ao reconectar. O geofence é avaliado no servidor, no reenvio, contra as coordenadas e o timestamp gravados. Estar offline nunca vira um jeito de furar a checagem.",
				},
			},
		],
		results: {
			en: [
				"Recurring-jobs engine, geofenced time tracking and GST invoicing shipped",
				"Offline-first employee PWA with queued clock events",
				"SMS reminders (Twilio) and payroll calculation from tracked hours",
				"CI required green before merge; Vitest + Playwright suites",
			],
			pt: [
				"Engine de jobs recorrentes, ponto com geofence e faturamento com GST entregues",
				"PWA offline-first do funcionário com eventos de ponto enfileirados",
				"Lembretes por SMS (Twilio) e cálculo de folha a partir das horas registradas",
				"CI obrigatoriamente verde antes do merge; suítes Vitest + Playwright",
			],
		},
		stack: [
			{ label: { en: "Core", pt: "Núcleo" }, items: ["Next.js 15", "React 19", "TypeScript strict"] },
			{ label: { en: "Data", pt: "Dados" }, items: ["PostgreSQL 16", "Prisma 6", "Decimal money"] },
			{ label: { en: "Field", pt: "Campo" }, items: ["PWA offline-first", "Geolocation", "Geofence 200m"] },
			{ label: { en: "Integrations", pt: "Integrações" }, items: ["Twilio SMS", "Resend", "@react-pdf/renderer"] },
			{ label: { en: "Quality", pt: "Qualidade" }, items: ["Vitest", "Playwright", "Sentry", "Docker"] },
		],
	},

	lorflux: {
		role: { en: "Sole engineer: platform, streaming pipeline, billing, admin", pt: "Engenheiro único: plataforma, pipeline de streaming, billing e admin" },
		timeline: { en: "2026 · v2.4.0 in production", pt: "2026 · v2.4.0 em produção" },
		summary: {
			en: "A vertical (9:16) entertainment platform: cinematic comics, vertical films and webtoons, with accounts, premium subscriptions and a full admin. Video is the hard part. Everything else exists to serve it.",
			pt: "Plataforma de entretenimento vertical (9:16): cinematic comics, filmes verticais e webtoons, com contas, assinaturas premium e um admin completo. Vídeo é a parte difícil. Todo o resto existe para servi-lo.",
		},
		architecture: {
			en: [
				"Uploads never block a request. The API hands the file to Bunny Stream and returns; transcoding progress arrives later through webhooks, which flip the episode to playable only when a rendition actually exists.",
				"Heavy work (transcode callbacks, batch panel processing, mail) runs on BullMQ over Redis, so a spike in uploads degrades the queue depth, not the site.",
				"Adaptive HLS delivery through Bunny's CDN: the player negotiates the rendition, the origin serves nothing but the manifest.",
				"Webtoon panels upload in batches of up to ~138 images per chapter; the batch is treated as one transactional unit so a partial upload cannot publish a broken chapter.",
				"Multi-track audio and per-language dubbing are modelled as tracks against an episode rather than as separate episodes, which keeps engagement counters honest.",
				"Ads render only for non-premium sessions; entitlement is checked server-side, never from a client claim.",
			],
			pt: [
				"Upload nunca bloqueia a requisição. A API entrega o arquivo ao Bunny Stream e retorna; o progresso da transcodificação chega depois por webhooks, que só marcam o episódio como reproduzível quando existe de fato uma renditione.",
				"Trabalho pesado (callbacks de transcodificação, processamento de painéis em lote, e-mail) roda em BullMQ sobre Redis, então um pico de uploads degrada a profundidade da fila, não o site.",
				"Entrega HLS adaptativa pelo CDN da Bunny: o player negocia a renditione e a origem só serve o manifesto.",
				"Painéis de webtoon sobem em lotes de até ~138 imagens por capítulo; o lote é tratado como unidade transacional, então um upload parcial não publica capítulo quebrado.",
				"Múltiplas trilhas de áudio e dublagens por idioma são modeladas como trilhas de um episódio, não como episódios separados, o que mantém os contadores de engajamento honestos.",
				"Anúncios só renderizam em sessões não-premium; o direito é checado no servidor, nunca por afirmação do cliente.",
			],
		},
		challenges: [
			{
				problem: {
					en: "A user hits play the second the upload finishes, but the file isn't watchable yet.",
					pt: "O usuário aperta play no segundo em que o upload termina, mas o arquivo ainda não é assistível.",
				},
				solution: {
					en: "The episode carries an explicit lifecycle instead of a boolean. It only becomes playable when Bunny's transcode webhook confirms a rendition exists. The webhook is idempotent, because a CDN will happily deliver the same callback twice.",
					pt: "O episódio carrega um ciclo de vida explícito em vez de um boolean. Ele só vira reproduzível quando o webhook de transcodificação da Bunny confirma que existe uma renditione. O webhook é idempotente, porque um CDN entrega o mesmo callback duas vezes sem cerimônia.",
				},
			},
		],
		results: {
			en: [
				"In production at lorflux.com (v2.4.0)",
				"Stripe subscriptions, JWT + OAuth accounts, PWA with push",
				"Content in PT / EN / ES / ZH with multiple audio tracks",
				"Batch panel upload up to ~138 images per chapter",
			],
			pt: [
				"Em produção em lorflux.com (v2.4.0)",
				"Assinaturas Stripe, contas com JWT + OAuth, PWA com push",
				"Conteúdo em PT / EN / ES / ZH com múltiplas trilhas de áudio",
				"Upload de painéis em lote de até ~138 imagens por capítulo",
			],
		},
		stack: [
			{ label: { en: "Frontend", pt: "Frontend" }, items: ["React 19", "Vite", "TypeScript", "Tailwind", "PWA"] },
			{ label: { en: "Backend", pt: "Backend" }, items: ["Node.js", "Express", "MongoDB", "Mongoose"] },
			{ label: { en: "Media", pt: "Mídia" }, items: ["Bunny Stream", "HLS adaptativo", "CDN"] },
			{ label: { en: "Async", pt: "Assíncrono" }, items: ["BullMQ", "Redis", "Webhooks"] },
			{ label: { en: "Money", pt: "Dinheiro" }, items: ["Stripe", "Google AdSense"] },
		],
	},

	cidadetur: {
		role: { en: "Sole engineer (refactor, redesign, staging, deploy tooling)", pt: "Engenheiro único (refatoração, redesign, homologação e tooling de deploy)" },
		timeline: { en: "Jun–Jul 2026 · delivered in 8 of 12 contracted days", pt: "Jun–Jul 2026 · entregue em 8 dos 12 dias contratados" },
		summary: {
			en: "A legacy PHP/MySQL tourism portal that had to be modernised in place: on shared hosting, with FTP as the only access, over the live production database. The constraints were the project.",
			pt: "Um portal de turismo legado em PHP/MySQL que precisava ser modernizado no lugar: em hospedagem compartilhada, com FTP como único acesso, sobre o banco de produção. As restrições eram o projeto.",
		},
		architecture: {
			en: [
				"The redesign started as a refactor: eight pages of copy-pasted markup became 23 reusable PHP components. The footer and login block alone were duplicated across all eight files.",
				"With only FTP access and no staging database, I built a read-only staging environment that runs against the real production database, guarded by an APP_READONLY flag that blocks writes and returns 403 from the admin.",
				"Deployment is a PowerShell FTP/FTPS script that uploads only changed files and refuses to run if it detects the production directory: a deliberate blast-radius limiter, because a shared host gives you no undo.",
				"A local Docker environment (PHP/Apache + MySQL 8) with seeded mock data made it possible to develop without touching the client's data at all.",
			],
			pt: [
				"O redesign começou como refatoração: oito páginas de markup copiado e colado viraram 23 componentes PHP reutilizáveis. Só o rodapé e o bloco de login estavam duplicados nos oito arquivos.",
				"Com apenas FTP e sem banco de homologação, construí um ambiente de homologação read-only rodando contra o banco real de produção, protegido por uma flag APP_READONLY que bloqueia escrita e devolve 403 no admin.",
				"O deploy é um script PowerShell FTP/FTPS que envia só os arquivos alterados e se recusa a rodar se detectar a pasta de produção: um limitador de raio de dano deliberado, porque hospedagem compartilhada não te dá desfazer.",
				"Um ambiente local em Docker (PHP/Apache + MySQL 8) com dados mock semeados permitiu desenvolver sem tocar nos dados do cliente.",
			],
		},
		challenges: [
			{
				problem: {
					en: "How do you show the client a preview when there is no staging database and you cannot risk writes to production?",
					pt: "Como mostrar um preview ao cliente sem banco de homologação e sem arriscar escrita em produção?",
				},
				solution: {
					en: "Point staging at the production database and make writing impossible rather than merely discouraged: a global read-only flag short-circuits every mutation, and the admin returns 403 outright. The client browsed real content on the new layout with zero risk to their data.",
					pt: "Apontar a homologação para o banco de produção e tornar a escrita impossível, não apenas desencorajada: uma flag global read-only curto-circuita toda mutação e o admin devolve 403 direto. O cliente navegou conteúdo real no layout novo com zero risco aos dados.",
				},
			},
		],
		results: {
			en: [
				"8 pages redesigned; 23 reusable components extracted from duplicated markup",
				"Accepted and paid in 8 days against a 12-day contract",
				"28 commits over the engagement, delivered in 5 partial milestones",
				"Mobile responsiveness, SEO, real-time search and admin fixes",
			],
			pt: [
				"8 páginas redesenhadas; 23 componentes reutilizáveis extraídos de markup duplicado",
				"Aceito e pago em 8 dias, num contrato de 12",
				"28 commits ao longo do trabalho, entregues em 5 parciais",
				"Responsividade mobile, SEO, busca em tempo real e ajustes no admin",
			],
		},
		stack: [
			{ label: { en: "Legacy", pt: "Legado" }, items: ["PHP", "MySQL 8", "Apache", ".htaccess"] },
			{ label: { en: "Frontend", pt: "Frontend" }, items: ["HTML", "CSS", "JavaScript vanilla"] },
			{ label: { en: "Tooling", pt: "Tooling" }, items: ["Docker Compose", "PowerShell FTP/FTPS", "Git"] },
		],
	},

	mercadolivre: {
		role: { en: "Sole engineer: Clean Architecture backend, Blazor frontend", pt: "Engenheiro único: backend em Clean Architecture, frontend Blazor" },
		timeline: { en: "2025 · delivered and accepted", pt: "2025 · entregue e aceito" },
		summary: {
			en: "A dashboard for Mercado Livre sellers: connect the account, sync listings, watch what competitors do to the Buy Box, and push a suggested price back through the official API.",
			pt: "Um dashboard para vendedores do Mercado Livre: conectar a conta, sincronizar anúncios, observar o que os concorrentes fazem com a Buy Box e gravar um preço sugerido de volta pela API oficial.",
		},
		architecture: {
			en: [
				"Clean Architecture with the ML API isolated behind a typed Refit client, so the marketplace's quirks never leak into the domain.",
				"OAuth 2.0 tokens refresh on a background worker before they expire, rather than reactively on a 401. The user never sees a failed sync because a token aged out.",
				"The price-suggestion algorithm has three explicit modes instead of one hidden heuristic, so the seller understands why a number was proposed before it is written back.",
				"Writes go through the official PUT endpoint; the suggestion is never applied silently: proposing and applying are separate actions.",
				"17 REST endpoints, EF Core over MySQL, migrations applied from the start.",
			],
			pt: [
				"Clean Architecture com a API do ML isolada atrás de um cliente Refit tipado, então as idiossincrasias do marketplace não vazam para o domínio.",
				"Tokens OAuth 2.0 renovam num worker em background antes de expirar, em vez de reativamente num 401. O usuário nunca vê uma sincronização falhar porque o token envelheceu.",
				"O algoritmo de sugestão de preço tem três modos explícitos em vez de uma heurística escondida, então o vendedor entende por que aquele número foi proposto antes de ser gravado.",
				"A escrita passa pelo endpoint PUT oficial; a sugestão nunca é aplicada em silêncio: propor e aplicar são ações separadas.",
				"17 endpoints REST, EF Core sobre MySQL, migrations aplicadas desde o início.",
			],
		},
		challenges: [
			{
				problem: {
					en: "A marketplace token that expires mid-sync corrupts the seller's view of their own catalogue.",
					pt: "Um token de marketplace que expira no meio da sincronização corrompe a visão que o vendedor tem do próprio catálogo.",
				},
				solution: {
					en: "Refresh proactively on a background schedule and treat the sync as resumable, so a partially synced catalogue converges instead of half-updating.",
					pt: "Renovar proativamente em agendamento de background e tratar a sincronização como retomável, para que um catálogo parcialmente sincronizado convirja em vez de ficar meio atualizado.",
				},
			},
		],
		results: {
			en: [
				"17 REST endpoints, 5 Blazor pages, zero compilation errors at handover",
				"OAuth 2.0 with automatic background token refresh",
				"3-mode price-suggestion algorithm writing back through the official API",
				"Buy Box competitor analysis with KPI dashboard",
			],
			pt: [
				"17 endpoints REST, 5 páginas Blazor, zero erros de compilação na entrega",
				"OAuth 2.0 com refresh automático de token em background",
				"Algoritmo de sugestão de preço com 3 modos gravando pela API oficial",
				"Análise de concorrência (Buy Box) com dashboard de KPIs",
			],
		},
		stack: [
			{ label: { en: "Backend", pt: "Backend" }, items: [".NET 8", "ASP.NET Core", "Clean Architecture", "Refit"] },
			{ label: { en: "Frontend", pt: "Frontend" }, items: ["Blazor WebAssembly", "MudBlazor", "Radzen Charts"] },
			{ label: { en: "Data", pt: "Dados" }, items: ["MySQL 8", "EF Core", "Docker"] },
		],
	},

	"crm-leiloes": {
		role: { en: "Sole engineer (CRM architecture, data migration, automation, robot)", pt: "Engenheiro único (arquitetura do CRM, migração de dados, automações e robô)" },
		timeline: { en: "2026 · Phase 1 in production", pt: "2026 · Fase 1 em produção" },
		summary: {
			en: "A real-estate auction agency ran on 11 Zoho modules nobody trusted. I consolidated them into 3, migrated the data, and put a daily robot in front of it that captures new auction listings and pushes flyers to WhatsApp.",
			pt: "Uma imobiliária de leilões operava sobre 11 módulos Zoho em que ninguém confiava. Consolidei em 3, migrei os dados e coloquei na frente um robô diário que captura novos imóveis em leilão e dispara flyers no WhatsApp.",
		},
		architecture: {
			en: [
				"The 11 → 3 consolidation is the whole project: Client, Property and a many-to-many Interest between them. Everything that used to be a module became a field or a relationship.",
				"The capture robot runs on AWS Lambda under a daily CRON at 07:00: no server to babysit, and the failure mode is a missed run rather than a stuck process.",
				"Flyer generation and WhatsApp delivery are an n8n pipeline, so a non-engineer can see the flow and reason about where a message stopped.",
				"Deduplication ran before migration, not after: 115 client records collapsed into 49 real clients.",
				"Six Deluge automations enforce the 10-stage pipeline, so a deal cannot skip a stage by accident.",
			],
			pt: [
				"A consolidação 11 → 3 é o projeto inteiro: Cliente, Imóvel e um Interesse N:N entre eles. Tudo que era módulo virou campo ou relacionamento.",
				"O robô de captura roda em AWS Lambda sob CRON diário às 07:00: sem servidor para cuidar, e o modo de falha é uma execução perdida, não um processo travado.",
				"Geração de flyer e envio no WhatsApp são um pipeline n8n, então alguém não-engenheiro consegue ver o fluxo e raciocinar sobre onde a mensagem parou.",
				"A deduplicação rodou antes da migração, não depois: 115 registros de cliente colapsaram em 49 clientes reais.",
				"Seis automações em Deluge sustentam o pipeline de 10 etapas, então um negócio não pula etapa por acidente.",
			],
		},
		challenges: [
			{
				problem: {
					en: "Migrating 2,051 properties into a schema that didn't exist yet, without losing a row.",
					pt: "Migrar 2.051 imóveis para um schema que ainda não existia, sem perder uma linha.",
				},
				solution: {
					en: "Migrate in Python with the mapping expressed as code and re-runnable. A corrective load re-processed 1,735 properties with zero failures once the target schema settled. Because the migration was idempotent, running it again was safe rather than terrifying.",
					pt: "Migrar em Python com o mapeamento expresso como código e reexecutável. Uma carga corretiva reprocessou 1.735 imóveis com zero falhas depois que o schema-alvo estabilizou. Porque a migração era idempotente, rodar de novo era seguro em vez de aterrorizante.",
				},
			},
			{
				problem: {
					en: "The auction sites are behind Cloudflare, which challenges the robot.",
					pt: "Os sites de leilão estão atrás do Cloudflare, que desafia o robô.",
				},
				solution: {
					en: "Mitigated for Phase 1; the durable fix is a residential proxy plus the official WhatsApp Cloud API, scoped as Phase 2 rather than bolted on under pressure.",
					pt: "Mitigado na Fase 1; a correção durável é proxy residencial mais a WhatsApp Cloud API oficial, escopada como Fase 2 em vez de improvisada sob pressão.",
				},
			},
		],
		results: {
			en: [
				"11 CRM modules consolidated into 3; 10-stage pipeline with blueprints",
				"2,051 properties and 49 deduplicated clients migrated with zero failures",
				"Daily capture robot running in production (Lambda + CRON 07:00)",
				"6 Deluge automations; client team trained and documentation handed over",
			],
			pt: [
				"11 módulos de CRM consolidados em 3; pipeline de 10 etapas com blueprints",
				"2.051 imóveis e 49 clientes deduplicados migrados com zero falhas",
				"Robô de captura diário rodando em produção (Lambda + CRON 07:00)",
				"6 automações em Deluge; equipe do cliente treinada e documentação entregue",
			],
		},
		stack: [
			{ label: { en: "CRM", pt: "CRM" }, items: ["Zoho CRM", "Deluge", "Blueprints"] },
			{ label: { en: "Automation", pt: "Automação" }, items: ["Python", "AWS Lambda", "CRON", "n8n"] },
			{ label: { en: "Delivery", pt: "Entrega" }, items: ["WhatsApp API", "Google Sheets", "hcti.io"] },
		],
	},

	security: {
		role: {
			en: "Security auditor and infrastructure engineer",
			pt: "Auditor de segurança e engenheiro de infraestrutura",
		},
		timeline: {
			en: "2026 · audit delivered; backup pipeline in production",
			pt: "2026 · laudo entregue; pipeline de backup em produção",
		},
		summary: {
			en: "Two engagements in the same discipline. First: a white/black-box audit of a multi-tenant ERP built on Supabase, where Row Level Security is the only thing standing between one tenant's data and another's. Second: a VPS that had already been ransomed once, needing backups that actually restore and a host that stops inviting attackers in.",
			pt: "Dois trabalhos na mesma disciplina. Primeiro: auditoria white/black-box de um ERP multi-tenant sobre Supabase, onde o Row Level Security é a única coisa entre os dados de um tenant e os de outro. Segundo: uma VPS que já tinha sido sequestrada uma vez, precisando de backups que de fato restauram e de um host que pare de convidar invasores.",
		},
		architecture: {
			en: [
				"The audit treated RLS as the security boundary and tested it as such: 14 tables reviewed, SECURITY DEFINER functions read line by line, JWT validated server-side, and the anon role's grants revoked.",
				"Findings were delivered as a prioritised remediation plan with ready-to-run SQL, not a PDF of scary words. Nothing was changed in the client's system; the scope was to audit, not to fix.",
				"The backup pipeline is 3-2-1 with client-side encryption: rclone crypt encrypts before anything leaves the box, so Backblaze B2 never sees plaintext and the key stays with the client.",
				"Retention is GFS (7 daily, 4 weekly, 6 monthly) with versioning, because ransomware that encrypts your primary will happily encrypt a mirror that syncs deletions.",
				"A restore is only a backup if you have done one: four end-to-end smoke tests validate MongoDB (by document count), MySQL, /etc and /var/www (bit-for-bit diff), each documented in RESTORE.md.",
			],
			pt: [
				"A auditoria tratou o RLS como a fronteira de segurança e o testou como tal: 14 tabelas revisadas, funções SECURITY DEFINER lidas linha a linha, JWT validado no servidor e os grants do papel anon revogados.",
				"Os achados foram entregues como plano de correção priorizado com SQL pronto para rodar, não um PDF de palavras assustadoras. Nada foi alterado no sistema do cliente; o escopo era auditar, não corrigir.",
				"O pipeline de backup é 3-2-1 com criptografia client-side: o rclone crypt cifra antes de qualquer coisa sair da máquina, então a Backblaze B2 nunca vê texto claro e a chave fica com o cliente.",
				"A retenção é GFS (7 diários, 4 semanais, 6 mensais) com versionamento, porque um ransomware que cifra seu primário cifra alegremente um espelho que sincroniza exclusões.",
				"Restauração só é backup se você já fez uma: quatro smoke tests ponta a ponta validam MongoDB (por contagem de documentos), MySQL, /etc e /var/www (diff bit a bit), cada um documentado no RESTORE.md.",
			],
		},
		challenges: [
			{
				problem: {
					en: "In the ERP, a tenant could rewrite the column that decides which tenant they belong to.",
					pt: "No ERP, um tenant conseguia reescrever a coluna que decide a que tenant ele pertence.",
				},
				solution: {
					en: "The profiles RLS policy allowed updating empresa_id: a tenant breakout in one UPDATE. A second finding let a manager promote themselves to global admin. Both were reported as critical with the exact policy rewrite needed, plus a recommendation to split RLS per role instead of one policy trying to serve every actor.",
					pt: "A policy de RLS de profiles permitia atualizar empresa_id: um tenant breakout em um único UPDATE. Um segundo achado permitia a um gerente se promover a admin global. Ambos foram reportados como críticos com a reescrita exata da policy, mais a recomendação de separar RLS por papel em vez de uma policy tentando servir todos os atores.",
				},
			},
			{
				problem: {
					en: "The VPS had been extorted in 2023. The client needed to know how, and that it could not happen again.",
					pt: "A VPS tinha sido extorquida em 2023. O cliente precisava saber como, e que não aconteceria de novo.",
				},
				solution: {
					en: "Forensics identified the vector: MongoDB bound to 0.0.0.0 with no authentication. Production was confirmed intact and a 4.1 GB forensic capture was preserved with SHA256. The vector was closed (Mongo bound to 127.0.0.1) and fail2ban installed. It banned 6 IPs in the first hours, against 49 intrusion attempts logged in ~12h.",
					pt: "A forense identificou o vetor: MongoDB escutando em 0.0.0.0 sem autenticação. A produção foi confirmada intacta e uma captura forense de 4,1 GB foi preservada com SHA256. O vetor foi fechado (Mongo em 127.0.0.1) e o fail2ban instalado. Baniu 6 IPs nas primeiras horas, contra 49 tentativas de invasão registradas em ~12h.",
				},
			},
		],
		results: {
			en: [
				"ERP audit: 14 RLS tables reviewed; tenant-breakout and privilege-escalation flaws found, with prioritised SQL remediation",
				"Backups: 7 MongoDB databases (~6.7 GB) and 6.15M files, encrypted client-side, at ~US$0.30/month",
				"Restores validated by 4 end-to-end tests, including a bit-for-bit diff of /var/www",
				"Ransomware vector closed; fail2ban banned 6 IPs against 49 attempts in ~12h",
			],
			pt: [
				"Auditoria do ERP: 14 tabelas com RLS revisadas; falhas de tenant-breakout e escalação de privilégio encontradas, com correção SQL priorizada",
				"Backups: 7 bancos MongoDB (~6,7 GB) e 6,15M de arquivos, cifrados no cliente, a ~US$0,30/mês",
				"Restauração validada por 4 testes ponta a ponta, incluindo diff bit a bit de /var/www",
				"Vetor do ransomware fechado; fail2ban baniu 6 IPs contra 49 tentativas em ~12h",
			],
		},
		stack: [
			{ label: { en: "Audit", pt: "Auditoria" }, items: ["Supabase RLS", "PostgreSQL", "JWT ES256", "White/black-box"] },
			{ label: { en: "Backup", pt: "Backup" }, items: ["rclone crypt", "Backblaze B2", "GFS retention", "cron"] },
			{ label: { en: "Hardening", pt: "Hardening" }, items: ["fail2ban", "MongoDB bind", "Ubuntu", "Bash"] },
		],
	},

	lastmile: {
		role: { en: "Sole engineer", pt: "Engenheiro único" },
		timeline: { en: "2025", pt: "2025" },
		summary: {
			en: "A coverage platform for internet providers: a prospect types an address, the system answers whether the ISP can actually serve it, and converts the yes into a checkout.",
			pt: "Uma plataforma de cobertura para provedores de internet: o interessado digita um endereço, o sistema responde se o provedor consegue de fato atendê-lo, e converte o sim em um checkout.",
		},
		architecture: {
			en: [
				"Coverage is a geometry problem, not a text problem: addresses are geocoded to points and tested against served polygons in PostGIS, so the answer is spatial rather than a string match on a neighbourhood name.",
				"The viability query runs against a spatial index, keeping the lookup fast enough to sit in the middle of a sign-up flow.",
			],
			pt: [
				"Cobertura é um problema de geometria, não de texto: endereços são geocodificados em pontos e testados contra polígonos atendidos no PostGIS, então a resposta é espacial em vez de comparação de string com nome de bairro.",
				"A consulta de viabilidade roda sobre índice espacial, mantendo a busca rápida o suficiente para viver no meio de um fluxo de cadastro.",
			],
		},
		challenges: [],
		results: {
			en: ["PostGIS viability search wired into a lead-to-customer checkout"],
			pt: ["Busca de viabilidade com PostGIS integrada a um checkout de conversão de lead"],
		},
		stack: [
			{ label: { en: "Core", pt: "Núcleo" }, items: ["Next.js", "TypeScript"] },
			{ label: { en: "Geo", pt: "Geo" }, items: ["PostGIS", "PostgreSQL", "Geocoding"] },
		],
	},

	veritas: {
		role: { en: "Sole engineer (technical challenge)", pt: "Engenheiro único (desafio técnico)" },
		timeline: { en: "2025 · open source", pt: "2025 · open source" },
		summary: {
			en: "A Kanban board built as a hiring challenge, used as an excuse to do the boring things properly: layered architecture, a containerised environment, and a pipeline that runs the tests.",
			pt: "Um quadro Kanban construído como desafio de contratação, usado como desculpa para fazer as coisas chatas direito: arquitetura em camadas, ambiente containerizado e um pipeline que roda os testes.",
		},
		architecture: {
			en: [
				"Go backend with handlers, services and repositories separated, so the database can be swapped without touching HTTP.",
				"Docker Compose brings up the API, the database and the frontend with one command: the setup instructions are the compose file.",
				"CI runs the test suite on every push; a red pipeline blocks the merge.",
			],
			pt: [
				"Backend em Go com handlers, services e repositories separados, então o banco pode ser trocado sem tocar no HTTP.",
				"Docker Compose sobe API, banco e frontend com um comando: as instruções de setup são o próprio compose.",
				"O CI roda a suíte de testes a cada push; pipeline vermelho barra o merge.",
			],
		},
		challenges: [],
		results: {
			en: ["Full-stack Kanban with Go concurrency, clean layering, Docker and CI/CD"],
			pt: ["Kanban full-stack com concorrência em Go, camadas limpas, Docker e CI/CD"],
		},
		stack: [
			{ label: { en: "Backend", pt: "Backend" }, items: ["Go", "PostgreSQL"] },
			{ label: { en: "Frontend", pt: "Frontend" }, items: ["React", "TypeScript"] },
			{ label: { en: "Ops", pt: "Ops" }, items: ["Docker", "CI/CD"] },
		],
	},
};
