/**
 * Dados mock da demo IRON FORGE (academia).
 *
 * Tudo aqui é fictício e vive no client — a demo não tem backend. As páginas
 * (planos, matrícula, programas, treinadores, unidades) leem daqui pra que
 * preço, treinador e horário batam entre si em qualquer rota.
 */

export type PlanId = "iron-basic" | "iron-pro" | "personal";

export type Plan = {
	id: PlanId;
	name: string;
	tagline: string;
	/** Preço cheio no plano mensal, em BRL. */
	monthly: number;
	popular?: boolean;
	features: string[];
	/** Itens exibidos riscados/apagados no card. */
	missing?: string[];
};

export const PLANS: Plan[] = [
	{
		id: "iron-basic",
		name: "Iron Basic",
		tagline: "Pra quem está começando a forjar",
		monthly: 89,
		features: [
			"Acesso horário limitado",
			"Área de musculação",
			"Avaliação física inicial",
		],
		missing: ["Aulas em grupo"],
	},
	{
		id: "iron-pro",
		name: "Iron Pro",
		tagline: "O plano da comunidade que não falha",
		monthly: 149,
		popular: true,
		features: [
			"Acesso 24h irrestrito",
			"Aulas de Crossfit",
			"Direito a 1 convidado",
			"App de Treino Exclusivo",
		],
	},
	{
		id: "personal",
		name: "Personal",
		tagline: "Ferro puro, com quem entende do ofício",
		monthly: 299,
		features: [
			"Tudo do plano Pro",
			"4h Personal Trainer / mês",
			"Nutricionista mensal",
			"Acesso a todas as unidades",
		],
	},
];

export type BillingCycle = "mensal" | "anual";

/** Anual = 2 meses grátis (paga 10, leva 12). */
export const ANNUAL_MONTHS_CHARGED = 10;

export function planById(id: string | null | undefined): Plan | undefined {
	return PLANS.find((p) => p.id === id);
}

/** Valor cobrado por mês no ciclo escolhido (anual dilui os 10x em 12 meses). */
export function monthlyPrice(plan: Plan, cycle: BillingCycle): number {
	if (cycle === "anual") {
		return (plan.monthly * ANNUAL_MONTHS_CHARGED) / 12;
	}
	return plan.monthly;
}

/** Total desembolsado no ciclo (1 mês ou 12 meses). */
export function cycleTotal(plan: Plan, cycle: BillingCycle): number {
	return cycle === "anual"
		? plan.monthly * ANNUAL_MONTHS_CHARGED
		: plan.monthly;
}

/** Economia em BRL ao fechar 12 meses. */
export function annualSavings(plan: Plan): number {
	return plan.monthly * (12 - ANNUAL_MONTHS_CHARGED);
}

const BRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

const BRL_CENTS = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export function brl(value: number, cents = false): string {
	return cents ? BRL_CENTS.format(value) : BRL.format(Math.round(value));
}

/* ------------------------------------------------------------------ */
/* Comparativo de planos                                               */
/* ------------------------------------------------------------------ */

export type ComparisonRow = {
	label: string;
	values: Record<PlanId, boolean | string>;
};

export const COMPARISON: ComparisonRow[] = [
	{
		label: "Acesso à musculação",
		values: {
			"iron-basic": "06h – 16h",
			"iron-pro": "24 horas",
			personal: "24 horas",
		},
	},
	{
		label: "Aulas em grupo",
		values: { "iron-basic": false, "iron-pro": true, personal: true },
	},
	{
		label: "Crossfit / Box",
		values: { "iron-basic": false, "iron-pro": true, personal: true },
	},
	{
		label: "Avaliação física",
		values: {
			"iron-basic": "1x na entrada",
			"iron-pro": "Trimestral",
			personal: "Mensal",
		},
	},
	{
		label: "Personal trainer",
		values: {
			"iron-basic": false,
			"iron-pro": "Avulso (R$ 90/h)",
			personal: "4h inclusas / mês",
		},
	},
	{
		label: "Nutricionista",
		values: { "iron-basic": false, "iron-pro": false, personal: true },
	},
	{
		label: "Convidados",
		values: { "iron-basic": false, "iron-pro": "1 por mês", personal: "4 por mês" },
	},
	{
		label: "App de treino",
		values: { "iron-basic": false, "iron-pro": true, personal: true },
	},
	{
		label: "Unidades liberadas",
		values: {
			"iron-basic": "Unidade matriz",
			"iron-pro": "2 unidades",
			personal: "Todas",
		},
	},
	{
		label: "Fidelidade",
		values: {
			"iron-basic": "Sem fidelidade",
			"iron-pro": "Sem fidelidade",
			personal: "Sem fidelidade",
		},
	},
];

/* ------------------------------------------------------------------ */
/* Treinadores                                                         */
/* ------------------------------------------------------------------ */

export type Coach = {
	id: string;
	name: string;
	role: string;
	specialty: string;
	bio: string;
	credentials: string[];
	years: number;
	photo: string;
};

export const COACHES: Coach[] = [
	{
		id: "rafael-drumond",
		name: "Rafael Drumond",
		role: "Head Coach — Crossfit",
		specialty: "Crossfit",
		bio: "Ex-atleta de levantamento olímpico, comanda o box desde 2016. Odeia repetição malfeita mais do que odeia segunda-feira.",
		credentials: [
			"CREF 018345-G/SP",
			"CrossFit Level 3 Trainer (CF-L3)",
			"Especialista em Levantamento Olímpico",
		],
		years: 11,
		photo:
			"https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80",
	},
	{
		id: "camila-arruda",
		name: "Camila Arruda",
		role: "Coach — Musculação & Hipertrofia",
		specialty: "Musculação",
		bio: "Montou a periodização de mais de 400 alunos. Se você quer ganhar massa, ela vai te fazer comer e dormir direito primeiro.",
		credentials: [
			"CREF 027119-G/SP",
			"Mestre em Fisiologia do Exercício — USP",
			"Certificação NSCA-CSCS",
		],
		years: 9,
		photo:
			"https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80",
	},
	{
		id: "diego-sampaio",
		name: "Diego Sampaio",
		role: "Coach — Boxe & Muay Thai",
		specialty: "Boxe",
		bio: "18 lutas profissionais, 15 vitórias. Ensina que o soco começa no pé — e que ninguém sobe no ringue sem antes suar no saco.",
		credentials: [
			"CREF 031884-G/SP",
			"Faixa-preta Muay Thai (Kru)",
			"Técnico credenciado CBBoxe",
		],
		years: 14,
		photo:
			"https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?auto=format&fit=crop&w=600&q=80",
	},
	{
		id: "juliana-menezes",
		name: "Juliana Menezes",
		role: "Coach — Cardio & Condicionamento",
		specialty: "Cardio",
		bio: "Maratonista com 6 provas oficiais no currículo. Especialista em transformar fôlego curto em VO2 máx de atleta.",
		credentials: [
			"CREF 022067-G/SP",
			"Pós em Treinamento de Endurance",
			"Certificação Spinning® Master",
		],
		years: 8,
		photo:
			"https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
	},
	{
		id: "marcos-tavares",
		name: "Marcos Tavares",
		role: "Personal Trainer Sênior",
		specialty: "Personal",
		bio: "Atende executivos às 5h da manhã há uma década. Reabilitação, postura e força — nessa ordem.",
		credentials: [
			"CREF 014522-G/SP",
			"Especialista em Treinamento Funcional",
			"Certificação FMS Nível 2",
		],
		years: 16,
		photo:
			"https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
	},
	{
		id: "beatriz-nakamura",
		name: "Beatriz Nakamura",
		role: "Coach — Mobilidade & Prevenção",
		specialty: "Mobilidade",
		bio: "Cuida do que ninguém quer treinar: ombro, quadril e tornozelo. Quem passa por ela levanta mais e se machuca menos.",
		credentials: [
			"CREF 029744-G/SP",
			"Fisioterapeuta CREFITO-3 / 178220-F",
			"Certificação Animal Flow L2",
		],
		years: 7,
		photo:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
	},
];

export function coachById(id: string): Coach | undefined {
	return COACHES.find((c) => c.id === id);
}

/* ------------------------------------------------------------------ */
/* Programas / modalidades                                             */
/* ------------------------------------------------------------------ */

export type ClassSlot = {
	/** "Seg", "Ter", ... */
	day: string;
	time: string;
	label: string;
	spots: number;
	taken: number;
};

export type Program = {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	intensity: 1 | 2 | 3 | 4 | 5;
	duration: string;
	calories: string;
	level: string;
	coachId: string;
	photo: string;
	highlights: string[];
	schedule: ClassSlot[];
};

export const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

export const PROGRAMS: Program[] = [
	{
		slug: "crossfit",
		name: "Crossfit",
		tagline: "O WOD não negocia",
		description:
			"Treino funcional de alta intensidade que mistura levantamento olímpico, ginástica e condicionamento metabólico. Cada aula tem um WOD diferente, cronometrado e escalável — do iniciante ao competidor. Você entra pelo aquecimento, passa pela técnica e termina no chão.",
		intensity: 5,
		duration: "60 min",
		calories: "600–850 kcal",
		level: "Todos os níveis (escalável)",
		coachId: "rafael-drumond",
		photo:
			"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
		highlights: [
			"WOD novo todos os dias, escrito no quadro às 5h",
			"Levantamento olímpico com barra e técnica supervisionada",
			"Ranking interno mensal do box",
			"Turmas com no máximo 14 atletas",
		],
		schedule: [
			{ day: "Seg", time: "06:00", label: "WOD Metcon", spots: 14, taken: 9 },
			{ day: "Seg", time: "19:00", label: "WOD Strength", spots: 14, taken: 14 },
			{ day: "Ter", time: "07:00", label: "Olímpico", spots: 12, taken: 5 },
			{ day: "Ter", time: "20:00", label: "WOD Metcon", spots: 14, taken: 11 },
			{ day: "Qua", time: "06:00", label: "WOD Hero", spots: 14, taken: 7 },
			{ day: "Qua", time: "19:00", label: "Ginástica", spots: 12, taken: 12 },
			{ day: "Qui", time: "07:00", label: "WOD Strength", spots: 14, taken: 4 },
			{ day: "Qui", time: "20:00", label: "Olímpico", spots: 12, taken: 8 },
			{ day: "Sex", time: "06:00", label: "WOD Metcon", spots: 14, taken: 10 },
			{ day: "Sex", time: "19:00", label: "Team WOD", spots: 16, taken: 6 },
			{ day: "Sáb", time: "09:00", label: "Open Box", spots: 20, taken: 12 },
		],
	},
	{
		slug: "musculacao",
		name: "Musculação",
		tagline: "Ferro, série e progressão",
		description:
			"Área de peso livre com 50+ equipamentos, plataformas de agachamento e rack de barras. O treino é periodizado pelo coach a partir da sua avaliação física e revisado a cada ciclo — nada de ficha genérica colada na parede desde 2019.",
		intensity: 3,
		duration: "45–75 min",
		calories: "350–500 kcal",
		level: "Iniciante a avançado",
		coachId: "camila-arruda",
		photo:
			"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
		highlights: [
			"Periodização individual revisada a cada 8 semanas",
			"6 racks de agachamento e 4 plataformas de levantamento",
			"Acompanhamento de carga pelo app IRON FORGE",
			"Halteres até 60 kg",
		],
		schedule: [
			{ day: "Seg", time: "07:00", label: "Push (peito/tríceps)", spots: 10, taken: 6 },
			{ day: "Seg", time: "18:00", label: "Técnica de Agachamento", spots: 8, taken: 8 },
			{ day: "Ter", time: "07:00", label: "Pull (costas/bíceps)", spots: 10, taken: 3 },
			{ day: "Ter", time: "19:00", label: "Legs Day", spots: 10, taken: 9 },
			{ day: "Qua", time: "07:00", label: "Push (ombro)", spots: 10, taken: 5 },
			{ day: "Qua", time: "18:00", label: "Técnica de Levantamento Terra", spots: 8, taken: 7 },
			{ day: "Qui", time: "07:00", label: "Pull (dorsais)", spots: 10, taken: 2 },
			{ day: "Qui", time: "19:00", label: "Legs Day", spots: 10, taken: 10 },
			{ day: "Sex", time: "07:00", label: "Full Body", spots: 12, taken: 4 },
			{ day: "Sex", time: "18:00", label: "Hipertrofia Avançada", spots: 8, taken: 6 },
			{ day: "Sáb", time: "10:00", label: "Full Body", spots: 12, taken: 5 },
		],
	},
	{
		slug: "cardio",
		name: "Cardio",
		tagline: "Fôlego é músculo",
		description:
			"Do HIIT de 25 minutos ao treino longo de esteira e bike. Trabalhamos zonas de frequência cardíaca com monitor no peito, projetadas no telão da sala — você vê exatamente em que zona está e por quanto tempo aguentou nela.",
		intensity: 4,
		duration: "25–50 min",
		calories: "400–700 kcal",
		level: "Todos os níveis",
		coachId: "juliana-menezes",
		photo:
			"https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=1200&q=80",
		highlights: [
			"Zonas de FC projetadas ao vivo no telão da sala",
			"20 esteiras, 12 bikes e 6 remos Concept2",
			"HIIT de 25 min no horário do almoço",
			"Teste de VO2 máx a cada trimestre",
		],
		schedule: [
			{ day: "Seg", time: "06:30", label: "HIIT 25", spots: 18, taken: 12 },
			{ day: "Seg", time: "12:00", label: "Express Lunch", spots: 18, taken: 18 },
			{ day: "Ter", time: "06:30", label: "Bike Indoor", spots: 12, taken: 4 },
			{ day: "Ter", time: "19:30", label: "HIIT 25", spots: 18, taken: 15 },
			{ day: "Qua", time: "12:00", label: "Express Lunch", spots: 18, taken: 9 },
			{ day: "Qua", time: "20:00", label: "Remo & Core", spots: 12, taken: 6 },
			{ day: "Qui", time: "06:30", label: "Endurance 50", spots: 16, taken: 7 },
			{ day: "Qui", time: "19:30", label: "Bike Indoor", spots: 12, taken: 12 },
			{ day: "Sex", time: "12:00", label: "HIIT 25", spots: 18, taken: 13 },
			{ day: "Sáb", time: "08:00", label: "Corrida na Marginal", spots: 25, taken: 11 },
		],
	},
	{
		slug: "boxe",
		name: "Boxe",
		tagline: "Aprenda a bater. E a não apanhar.",
		description:
			"Técnica de golpe, footwork, sacos pesados e sparring controlado (opcional, só com liberação do coach). Não é aula de 'boxe fitness' com música alta: você vai aprender guarda, jab e esquiva como um lutador aprende.",
		intensity: 4,
		duration: "60 min",
		calories: "500–750 kcal",
		level: "Iniciante a competidor",
		coachId: "diego-sampaio",
		photo:
			"https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
		highlights: [
			"Ringue oficial de 6x6 m e 10 sacos pesados",
			"Sparring supervisionado às sextas (com liberação)",
			"Bandagem e luva de aluguel inclusas no plano Pro",
			"Turma feminina exclusiva às quartas",
		],
		schedule: [
			{ day: "Seg", time: "07:30", label: "Fundamentos", spots: 16, taken: 8 },
			{ day: "Seg", time: "20:00", label: "Sacos & Combinações", spots: 16, taken: 14 },
			{ day: "Ter", time: "20:00", label: "Footwork", spots: 14, taken: 6 },
			{ day: "Qua", time: "07:30", label: "Fundamentos", spots: 16, taken: 5 },
			{ day: "Qua", time: "19:00", label: "Turma Feminina", spots: 16, taken: 16 },
			{ day: "Qui", time: "20:00", label: "Sacos & Combinações", spots: 16, taken: 10 },
			{ day: "Sex", time: "19:00", label: "Sparring Controlado", spots: 10, taken: 7 },
			{ day: "Sáb", time: "11:00", label: "Open Ring", spots: 20, taken: 9 },
		],
	},
];

export function programBySlug(slug: string): Program | undefined {
	return PROGRAMS.find((p) => p.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Unidades                                                            */
/* ------------------------------------------------------------------ */

export type Unit = {
	id: string;
	name: string;
	city: string;
	address: string;
	phone: string;
	hours: { label: string; value: string }[];
	structure: string[];
	programs: string[];
	photo: string;
	flagship?: boolean;
};

export const UNITS: Unit[] = [
	{
		id: "vila-madalena",
		name: "Iron Forge — Vila Madalena",
		city: "São Paulo / SP",
		address: "Rua Harmonia, 1.284 — Vila Madalena, São Paulo/SP — CEP 05435-001",
		phone: "(11) 3812-4477",
		flagship: true,
		hours: [
			{ label: "Segunda a Sexta", value: "24 horas" },
			{ label: "Sábado", value: "07h – 20h" },
			{ label: "Domingo", value: "08h – 14h" },
		],
		structure: [
			"1.800 m² em dois andares",
			"Box de Crossfit com 14 estações",
			"Ringue oficial de boxe",
			"Sala de musculação com 6 racks",
			"Vestiário com sauna seca",
			"Estacionamento coberto (120 vagas)",
		],
		programs: ["crossfit", "musculacao", "cardio", "boxe"],
		photo:
			"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "moema",
		name: "Iron Forge — Moema",
		city: "São Paulo / SP",
		address: "Av. Jamaris, 590 — Moema, São Paulo/SP — CEP 04078-001",
		phone: "(11) 3045-9120",
		hours: [
			{ label: "Segunda a Sexta", value: "05h – 23h" },
			{ label: "Sábado", value: "08h – 18h" },
			{ label: "Domingo", value: "Fechado" },
		],
		structure: [
			"1.100 m² em andar único",
			"Sala de musculação com 4 racks",
			"Estúdio de cardio com 20 esteiras",
			"Sala de aulas coletivas",
			"Vestiário com armário individual",
			"Bicicletário",
		],
		programs: ["musculacao", "cardio", "boxe"],
		photo:
			"https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1200&q=80",
	},
	{
		id: "santo-andre",
		name: "Iron Forge — Santo André",
		city: "Santo André / SP",
		address: "Rua Oliveira Lima, 77 — Centro, Santo André/SP — CEP 09010-160",
		phone: "(11) 4438-2260",
		hours: [
			{ label: "Segunda a Sexta", value: "06h – 22h" },
			{ label: "Sábado", value: "08h – 16h" },
			{ label: "Domingo", value: "Fechado" },
		],
		structure: [
			"950 m² com pé-direito duplo",
			"Box de Crossfit com 10 estações",
			"Área de peso livre ampliada",
			"Sala de mobilidade e alongamento",
			"Loja de suplementos",
		],
		programs: ["crossfit", "musculacao", "cardio"],
		photo:
			"https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
	},
];

export function unitById(id: string | null | undefined): Unit | undefined {
	return UNITS.find((u) => u.id === id);
}
