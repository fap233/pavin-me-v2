/**
 * Catálogo mock da AURUM.
 *
 * Sem backend: os dados vivem aqui e todo o resto da demo (coleção, filtros,
 * página do imóvel, favoritos) é derivado deste arquivo. Preços de venda em
 * R$ 9,8 mi – R$ 58 mi; aluguel mensal para as unidades que aceitam locação.
 */

export type Tipo = "cobertura" | "mansao" | "casa" | "apartamento" | "ilha";
export type Operacao = "comprar" | "alugar";

export type Property = {
	slug: string;
	titulo: string;
	bairro: string;
	cidade: string;
	uf: string;
	tipo: Tipo;
	operacoes: Operacao[];
	/** Preço de venda em BRL. */
	preco: number;
	/** Aluguel mensal em BRL (apenas para imóveis com locação). */
	aluguel?: number;
	/** Área construída em m². */
	area: number;
	suites: number;
	banheiros: number;
	vagas: number;
	ano: number;
	/** Data de entrada na curadoria — usada no sort "mais recentes". */
	listadoEm: string;
	exclusivo?: boolean;
	resumo: string;
	descricao: string[];
	sobreOBairro: string;
	destaques: string[];
	/** IDs de foto do Unsplash. O primeiro é a capa. */
	fotos: string[];
};

export const TIPO_LABEL: Record<Tipo, string> = {
	cobertura: "Cobertura Duplex",
	mansao: "Mansão",
	casa: "Casa",
	apartamento: "Apartamento",
	ilha: "Ilha Privada",
};

export const TIPO_OPTIONS: { value: Tipo | "todos"; label: string }[] = [
	{ value: "todos", label: "Todos os tipos" },
	{ value: "cobertura", label: TIPO_LABEL.cobertura },
	{ value: "mansao", label: TIPO_LABEL.mansao },
	{ value: "casa", label: TIPO_LABEL.casa },
	{ value: "apartamento", label: TIPO_LABEL.apartamento },
	{ value: "ilha", label: TIPO_LABEL.ilha },
];

export type Faixa = { value: string; label: string; test: (v: number) => boolean };

export const FAIXAS_VENDA: Faixa[] = [
	{ value: "todas", label: "Qualquer valor", test: () => true },
	{ value: "ate-15", label: "Até R$ 15 mi", test: (v) => v < 15_000_000 },
	{
		value: "15-30",
		label: "R$ 15 mi – R$ 30 mi",
		test: (v) => v >= 15_000_000 && v < 30_000_000,
	},
	{
		value: "30-45",
		label: "R$ 30 mi – R$ 45 mi",
		test: (v) => v >= 30_000_000 && v < 45_000_000,
	},
	{ value: "45-mais", label: "Acima de R$ 45 mi", test: (v) => v >= 45_000_000 },
];

export const FAIXAS_ALUGUEL: Faixa[] = [
	{ value: "todas", label: "Qualquer valor", test: () => true },
	{ value: "ate-70", label: "Até R$ 70 mil/mês", test: (v) => v < 70_000 },
	{
		value: "70-130",
		label: "R$ 70 mil – R$ 130 mil/mês",
		test: (v) => v >= 70_000 && v < 130_000,
	},
	{ value: "130-mais", label: "Acima de R$ 130 mil/mês", test: (v) => v >= 130_000 },
];

export const ORDENS = [
	{ value: "recentes", label: "Mais recentes" },
	{ value: "preco-desc", label: "Maior preço" },
	{ value: "preco-asc", label: "Menor preço" },
	{ value: "area-desc", label: "Maior área" },
] as const;

export type Ordem = (typeof ORDENS)[number]["value"];

/* ------------------------------------------------------------------ */
/* Formatação                                                          */
/* ------------------------------------------------------------------ */

/**
 * Separador de milhar feito à mão de propósito: `toLocaleString` depende do
 * ICU e pode divergir entre o Node do build e o browser (espaço fino vs.
 * normal), o que quebraria a hidratação.
 */
function milhar(n: number): string {
	return Math.round(n)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function precoBRL(n: number): string {
	return `R$ ${milhar(n)}`;
}

/** R$ 18,5 mi — para leituras rápidas (estimativas, faixas). */
export function precoCurto(n: number): string {
	if (n >= 1_000_000) {
		const mi = n / 1_000_000;
		const txt = mi >= 10 ? mi.toFixed(1) : mi.toFixed(2);
		return `R$ ${txt.replace(".", ",")} mi`;
	}
	return `R$ ${milhar(n)}`;
}

export function areaFmt(n: number): string {
	return `${milhar(n)}m²`;
}

/** Remove acentos e caixa — usado nos filtros de texto. */
export function normalizar(s: string): string {
	// NFD separa a letra do acento; filtramos o bloco de marcas combinantes
	// (U+0300–U+036F) por code point para nao depender de escapes no regex.
	return s
		.normalize("NFD")
		.split("")
		.filter((c) => {
			const cp = c.charCodeAt(0);
			return cp < 0x300 || cp > 0x36f;
		})
		.join("")
		.toLowerCase()
		.trim();
}

export function unsplash(id: string, w: number): string {
	return `https://images.unsplash.com/${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&q=80`;
}

export function endereco(p: Property): string {
	return `${p.bairro}, ${p.uf}`;
}

/* ------------------------------------------------------------------ */
/* Catálogo                                                            */
/* ------------------------------------------------------------------ */

export const PROPERTIES: Property[] = [
	{
		slug: "the-glass-house",
		titulo: "The Glass House",
		bairro: "Alto de Pinheiros",
		cidade: "São Paulo",
		uf: "SP",
		tipo: "casa",
		operacoes: ["comprar"],
		preco: 18_500_000,
		area: 850,
		suites: 4,
		banheiros: 6,
		vagas: 5,
		ano: 2021,
		listadoEm: "2026-06-28",
		exclusivo: true,
		resumo:
			"Residência de vidro e concreto aparente sobre um terreno de esquina, com jardim de Burle Marx restaurado.",
		descricao: [
			"Projetada como um pavilhão de vidro suspenso sobre um embasamento de concreto, a casa dissolve a fronteira entre interior e jardim. Os caixilhos de piso a teto correm por 24 metros de fachada e desaparecem por completo dentro da alvenaria.",
			"O pavimento social é um único plano contínuo (estar, jantar e música) articulado apenas pela lareira central de mármore travertino. No pavimento superior, quatro suítes voltadas para o miolo de quadra, sem vizinho de frente.",
			"O jardim, de traço original dos anos 70, foi recuperado por paisagista especializado e mantém as espécies nativas do desenho inicial.",
		],
		sobreOBairro:
			"Alto de Pinheiros é o bairro mais arborizado da cidade e o de menor densidade construtiva entre os nobres. Vizinho ao Parque Villa-Lobos, mantém ruas sem passagem e um perfil estritamente residencial.",
		destaques: [
			"Terreno de esquina com 1.200m²",
			"Jardim assinado, recuperado em 2021",
			"Adega climatizada para 900 rótulos",
			"Piscina raia aquecida de 22 metros",
			"Automação integral KNX",
		],
		fotos: [
			"photo-1600596542815-27b88e39e140",
			"photo-1600607687939-ce8a6c25118c",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1600210492486-724fe5c67fb0",
		],
	},
	{
		slug: "villa-toscana",
		titulo: "Villa Toscana",
		bairro: "Fazenda Boa Vista",
		cidade: "Porto Feliz",
		uf: "SP",
		tipo: "mansao",
		operacoes: ["comprar"],
		preco: 42_000_000,
		area: 2_100,
		suites: 6,
		banheiros: 8,
		vagas: 8,
		ano: 2019,
		listadoEm: "2026-06-14",
		exclusivo: true,
		resumo:
			"Villa de inspiração mediterrânea de frente para o fairway do campo Fazenda, com 2.100m² construídos.",
		descricao: [
			"Implantada no ponto mais alto do condomínio, a villa abre-se para o oitavo buraco do campo de golfe assinado por Randall Thompson. Pedra portuguesa, telha vã e madeira de demolição compõem a materialidade.",
			"O programa social se organiza em torno de um pátio interno com espelho d água e oliveiras adultas trazidas da Puglia. A ala íntima é independente, com acesso próprio e elevador.",
			"Casa de hóspedes autônoma com duas suítes, cozinha e estar. Ideal para famílias que recebem por temporadas longas.",
		],
		sobreOBairro:
			"Fazenda Boa Vista concentra o mais exigente mercado de casas de campo do país, a 100 km de São Paulo, com heliponto próprio, dois campos de golfe e spa Kayamã.",
		destaques: [
			"Vista frontal para o campo de golfe",
			"Casa de hóspedes independente",
			"Pátio interno com oliveiras adultas",
			"Spa privativo com sauna e piscina coberta",
			"Heliponto do condomínio a 4 minutos",
		],
		fotos: [
			"photo-1512917774080-9991f1c4c750",
			"photo-1600585154340-be6161a56a0c",
			"photo-1600047509807-ba8f99d2cdde",
			"photo-1600566753086-00f18fb6b3ea",
		],
	},
	{
		slug: "cobertura-vieira-souto",
		titulo: "Cobertura Vieira Souto",
		bairro: "Ipanema",
		cidade: "Rio de Janeiro",
		uf: "RJ",
		tipo: "cobertura",
		operacoes: ["comprar", "alugar"],
		preco: 36_000_000,
		aluguel: 180_000,
		area: 620,
		suites: 5,
		banheiros: 6,
		vagas: 4,
		ano: 2020,
		listadoEm: "2026-07-02",
		exclusivo: true,
		resumo:
			"Duplex de frente para o mar na Vieira Souto, com terraço de 180m² e piscina de borda infinita.",
		descricao: [
			"São 32 metros de frente para o Atlântico, do Arpoador ao Leblon, sem nenhuma obstrução. O living corrido acompanha toda a fachada e recebe o sol da tarde filtrado por brises de madeira.",
			"O piso superior é dedicado ao lazer: terraço com piscina de borda infinita, churrasqueira e pergolado, além de um lounge envidraçado que funciona nas noites de inverno.",
			"Reforma integral concluída em 2020, com projeto de interiores e mobiliário desenhado sob medida. O imóvel pode ser negociado mobiliado.",
		],
		sobreOBairro:
			"A Vieira Souto é o endereço mais valorizado do Rio de Janeiro. Frente de praia contínua, a três quadras do Jardim de Alah e a dez minutos do Leblon.",
		destaques: [
			"32 metros de frente para o mar",
			"Terraço de 180m² com piscina infinita",
			"Vista integral Arpoador–Dois Irmãos",
			"Possibilidade de negociação mobiliada",
			"Quatro vagas demarcadas em subsolo",
		],
		fotos: [
			"photo-1502005229762-cf1b2da7c5d6",
			"photo-1600607687939-ce8a6c25118c",
			"photo-1560448204-e02f11c3d0e2",
			"photo-1507525428034-b723cf961d3e",
		],
	},
	{
		slug: "penthouse-jardim-europa",
		titulo: "Penthouse Jardim Europa",
		bairro: "Jardim Europa",
		cidade: "São Paulo",
		uf: "SP",
		tipo: "cobertura",
		operacoes: ["comprar", "alugar"],
		preco: 24_900_000,
		aluguel: 120_000,
		area: 480,
		suites: 4,
		banheiros: 5,
		vagas: 4,
		ano: 2022,
		listadoEm: "2026-07-05",
		resumo:
			"Cobertura duplex em edifício de quatro unidades, com pé-direito de 4,2m no living e terraço voltado ao Parque do Povo.",
		descricao: [
			"Edifício boutique de apenas quatro unidades, uma por andar, com entrada de serviço independente e portaria discreta: o tipo de implantação que praticamente não se constrói mais nos Jardins.",
			"O living de pé-direito duplo recebe luz de leste e oeste, e o terraço gourmet abre para o verde contínuo do Parque do Povo. Cozinha Boffi, marcenaria em nogueira americana.",
			"Entregue em 2022, nunca habitada. Documentação regular e pronta para escritura imediata.",
		],
		sobreOBairro:
			"Jardim Europa é o quadrante mais estável do mercado paulistano: ruas largas, gabarito baixo e caminhada de dez minutos até o Parque Ibirapuera pela ciclovia.",
		destaques: [
			"Quatro unidades no edifício inteiro",
			"Pé-direito de 4,2m no living",
			"Cozinha Boffi e marcenaria sob medida",
			"Nunca habitada",
			"Terraço gourmet com vista para o parque",
		],
		fotos: [
			"photo-1613490493576-7fde63acd811",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1600047509807-ba8f99d2cdde",
			"photo-1600607687939-ce8a6c25118c",
		],
	},
	{
		slug: "refugio-iporanga",
		titulo: "Refúgio Iporanga",
		bairro: "Praia de Iporanga",
		cidade: "Guarujá",
		uf: "SP",
		tipo: "mansao",
		operacoes: ["comprar", "alugar"],
		preco: 28_500_000,
		aluguel: 95_000,
		area: 1_400,
		suites: 7,
		banheiros: 9,
		vagas: 6,
		ano: 2018,
		listadoEm: "2026-05-30",
		resumo:
			"Casa de costão sobre a enseada de Iporanga, com acesso privativo à praia e píer próprio.",
		descricao: [
			"Assentada no costão sul da enseada, a casa desce em três platôs até o mar. Cada platô abriga um programa: social, íntimo e lazer, todos com vista frontal para a água.",
			"O acesso à faixa de areia é privativo, por escada de pedra iluminada, e o píer particular comporta embarcação de até 42 pés.",
			"Estrutura completa para receber: sete suítes, cozinha industrial de apoio, casa de caseiro independente e gerador para autonomia total.",
		],
		sobreOBairro:
			"Iporanga é o condomínio mais fechado do litoral paulista: acesso controlado por guarita única, praia de uso exclusivo dos moradores e marina interna.",
		destaques: [
			"Acesso privativo à praia",
			"Píer próprio para embarcação de 42 pés",
			"Três platôs com vista frontal para o mar",
			"Casa de caseiro independente",
			"Gerador com autonomia total",
		],
		fotos: [
			"photo-1518780664697-55e3ad937233",
			"photo-1507525428034-b723cf961d3e",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1600585154340-be6161a56a0c",
		],
	},
	{
		slug: "ilha-dos-ventos",
		titulo: "Ilha dos Ventos",
		bairro: "Angra dos Reis",
		cidade: "Angra dos Reis",
		uf: "RJ",
		tipo: "ilha",
		operacoes: ["comprar"],
		preco: 58_000_000,
		area: 1_900,
		suites: 8,
		banheiros: 10,
		vagas: 4,
		ano: 2015,
		listadoEm: "2026-04-18",
		exclusivo: true,
		resumo:
			"Ilha privativa de 46.000m² na Baía de Ilha Grande, com casa principal, duas casas de hóspedes e marina.",
		descricao: [
			"São 46.000m² de ilha inteira, com quatro praias de areia branca e mata atlântica preservada em mais de 80% da área. A escritura é única e definitiva.",
			"A casa principal, de 1.900m², foi desenhada para desaparecer na topografia: telhados verdes, pedra local e madeira de reflorestamento. Duas casas de hóspedes autônomas completam o programa.",
			"Infraestrutura de operação independente: dessalinizador, painéis solares, gerador redundante e marina com dois berços cobertos.",
		],
		sobreOBairro:
			"A Baía de Ilha Grande reúne 365 ilhas entre Angra e Paraty. O acesso é feito por helicóptero (35 min do Rio) ou lancha a partir da marina de Angra.",
		destaques: [
			"46.000m² de ilha, escritura única",
			"Quatro praias privativas",
			"Marina com dois berços cobertos",
			"Autonomia energética e de água",
			"Heliponto homologado",
		],
		fotos: [
			"photo-1507525428034-b723cf961d3e",
			"photo-1439066615861-d1af74d74000",
			"photo-1544551763-46a013bb70d5",
			"photo-1600585154340-be6161a56a0c",
		],
	},
	{
		slug: "mansao-vila-nova",
		titulo: "Mansão Vila Nova",
		bairro: "Vila Nova Conceição",
		cidade: "São Paulo",
		uf: "SP",
		tipo: "casa",
		operacoes: ["comprar"],
		preco: 21_000_000,
		area: 720,
		suites: 5,
		banheiros: 7,
		vagas: 6,
		ano: 2017,
		listadoEm: "2026-06-05",
		resumo:
			"Casa contemporânea a duas quadras do Parque Ibirapuera, com fachada cega e pátio central.",
		descricao: [
			"Da rua, vê-se apenas um muro de concreto e uma porta de aço corten. Toda a vida da casa acontece para dentro, ao redor de um pátio central com espelho d água.",
			"O partido resolve o principal problema do bairro: privacidade absoluta em um terreno urbano de 600m², sem abrir mão de luz natural em cem por cento dos ambientes.",
			"Cinco suítes, home theater isolado acusticamente e escritório com entrada independente para receber clientes sem cruzar a área íntima.",
		],
		sobreOBairro:
			"Vila Nova Conceição tem o metro quadrado mais caro do Brasil. Baixo gabarito, comércio de bairro sofisticado e o Ibirapuera a pé.",
		destaques: [
			"Duas quadras do Parque Ibirapuera",
			"Fachada cega: privacidade total",
			"Pátio central com espelho d água",
			"Escritório com acesso independente",
			"Home theater com isolamento acústico",
		],
		fotos: [
			"photo-1600585152220-90363fe7e115",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1600607687939-ce8a6c25118c",
			"photo-1600047509807-ba8f99d2cdde",
		],
	},
	{
		slug: "villa-leblon",
		titulo: "Villa Leblon",
		bairro: "Leblon",
		cidade: "Rio de Janeiro",
		uf: "RJ",
		tipo: "casa",
		operacoes: ["comprar", "alugar"],
		preco: 16_400_000,
		aluguel: 78_000,
		area: 520,
		suites: 4,
		banheiros: 5,
		vagas: 3,
		ano: 2016,
		listadoEm: "2026-05-11",
		resumo:
			"Casa de vila no Alto Leblon, com jardim maduro e vista para o Dois Irmãos de todos os quartos.",
		descricao: [
			"Uma das últimas casas de vila do Alto Leblon, em rua sem saída e com portaria compartilhada entre apenas seis residências.",
			"O living abre para um jardim de 200m² com mangueira centenária. Todos os quartos, no pavimento superior, emolduram o Morro Dois Irmãos.",
			"Reformada em 2016 preservando as esquadrias originais em madeira de lei e o piso hidráulico do hall.",
		],
		sobreOBairro:
			"O Alto Leblon é a porção mais silenciosa do bairro, encostada no Parque Penhasco Dois Irmãos, a cinco minutos a pé da praia.",
		destaques: [
			"Vila fechada com seis residências",
			"Jardim de 200m² com mangueira centenária",
			"Vista para o Dois Irmãos de todos os quartos",
			"Esquadrias e piso hidráulico originais",
			"Cinco minutos a pé da praia",
		],
		fotos: [
			"photo-1564013799919-ab600027ffc6",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1560448204-e02f11c3d0e2",
			"photo-1600210492486-724fe5c67fb0",
		],
	},
	{
		slug: "casa-trancoso",
		titulo: "Casa Trancoso",
		bairro: "Quadrado",
		cidade: "Trancoso",
		uf: "BA",
		tipo: "casa",
		operacoes: ["comprar", "alugar"],
		preco: 14_900_000,
		aluguel: 65_000,
		area: 680,
		suites: 6,
		banheiros: 7,
		vagas: 4,
		ano: 2021,
		listadoEm: "2026-06-20",
		resumo:
			"Casa de frente para o Quadrado, com estrutura em madeira de demolição e piscina de pedra sabão.",
		descricao: [
			"Uma das poucas casas com frente direta para o gramado do Quadrado: endereço que, na prática, não entra no mercado.",
			"A construção usa madeira de demolição certificada, telha colonial recuperada e piso em cimento queimado branco. O resultado é uma casa que parece ter cem anos e foi entregue em 2021.",
			"Seis suítes distribuídas em dois blocos, separadas por um jardim de coqueiros, arranjo pensado para receber duas famílias com privacidade.",
		],
		sobreOBairro:
			"O Quadrado é o centro histórico de Trancoso: gramado, igrejinha do século XVI e as melhores mesas do litoral baiano, tudo a pé. Praia dos Nativos a dez minutos.",
		destaques: [
			"Frente direta para o Quadrado",
			"Madeira de demolição certificada",
			"Piscina revestida em pedra sabão",
			"Dois blocos independentes de suítes",
			"Aeroporto de Porto Seguro a 45 min",
		],
		fotos: [
			"photo-1570129477492-45c003edd2be",
			"photo-1600566753086-00f18fb6b3ea",
			"photo-1439066615861-d1af74d74000",
			"photo-1600047509807-ba8f99d2cdde",
		],
	},
	{
		slug: "duplex-itaim",
		titulo: "Duplex Itaim",
		bairro: "Itaim Bibi",
		cidade: "São Paulo",
		uf: "SP",
		tipo: "apartamento",
		operacoes: ["comprar", "alugar"],
		preco: 9_800_000,
		aluguel: 52_000,
		area: 340,
		suites: 3,
		banheiros: 4,
		vagas: 4,
		ano: 2023,
		listadoEm: "2026-07-08",
		resumo:
			"Duplex novo a uma quadra da Faria Lima, com home office isolado e vista livre para o skyline.",
		descricao: [
			"O apartamento urbano da coleção: 340m² em dois pavimentos, no 21º andar, com vista desimpedida para a Faria Lima e a Vila Olímpia.",
			"O pavimento inferior é social e flexível. O estar se converte em sala de jantar para 14 pessoas em minutos. O superior abriga três suítes e um home office com entrada independente pelo hall privativo.",
			"Edifício entregue em 2023, com lazer completo, concierge 24h e quatro vagas com carregador elétrico.",
		],
		sobreOBairro:
			"O Itaim concentra a maior parte dos escritórios de gestão de patrimônio do país. Caminhada de dez minutos até a Faria Lima e acesso rápido à ponte Cidade Jardim.",
		destaques: [
			"21º andar com vista livre",
			"Home office com entrada independente",
			"Quatro vagas com carregador elétrico",
			"Concierge 24h e lazer completo",
			"Uma quadra da Faria Lima",
		],
		fotos: [
			"photo-1600585154340-be6161a56a0c",
			"photo-1600607687939-ce8a6c25118c",
			"photo-1560448204-e02f11c3d0e2",
			"photo-1600566753086-00f18fb6b3ea",
		],
	},
];

export function getProperty(slug: string): Property | undefined {
	return PROPERTIES.find((p) => p.slug === slug);
}

/** Dois destaques da home. */
export const DESTAQUES_HOME = ["the-glass-house", "villa-toscana"];

export function relacionados(slug: string, n = 2): Property[] {
	const atual = getProperty(slug);
	if (!atual) return PROPERTIES.slice(0, n);
	const mesmoTipo = PROPERTIES.filter(
		(p) => p.slug !== slug && (p.tipo === atual.tipo || p.uf === atual.uf),
	);
	const resto = PROPERTIES.filter(
		(p) => p.slug !== slug && !mesmoTipo.includes(p),
	);
	return [...mesmoTipo, ...resto].slice(0, n);
}
