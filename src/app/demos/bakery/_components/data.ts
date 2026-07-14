/**
 * Dados mock da Farine (demo de padaria).
 *
 * Fonte única de verdade do cardápio e das lojas — a home, o /cardapio, o
 * /pedido e o /locais leem daqui, então preço e nome nunca divergem entre as
 * páginas. Nada aqui bate em rede: é tudo estático, client-side.
 */

export const CATEGORIES = ["Pães", "Doces", "Café", "Sanduíches"] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
	id: string;
	name: string;
	desc: string;
	/** Em reais. Guardado como número pra conta do carrinho fechar. */
	price: number;
	category: Category;
	img: string;
	/** Selo opcional exibido sobre a foto (ex.: "Mais pedido"). */
	tag?: string;
};

const u = (id: string, w = 600) =>
	`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PRODUCTS: Product[] = [
	// — Pães —
	{
		id: "sourdough-classico",
		name: "Sourdough Clássico",
		desc: "Fermentação natural de 48 horas. Casca escura, miolo alveolado e leve acidez.",
		price: 28,
		category: "Pães",
		// A foto original da demo (photo-1585476263060...) saiu do ar no Unsplash
		// e o card ficava quebrado. Trocada por um sourdough que responde 200.
		img: u("photo-1589367920969-ab8e050bbb04"),
		tag: "Mais pedido",
	},
	{
		id: "baguete-rustica",
		name: "Baguete Rústica",
		desc: "Massa de longa fermentação, assada no forno de lastro. Sai às 07h e às 16h.",
		price: 16,
		category: "Pães",
		img: u("photo-1568254183919-78a4f43a2877"),
	},
	{
		id: "pao-nozes-passas",
		name: "Pão de Nozes e Passas",
		desc: "Levain integral com nozes do Chile e passas escuras hidratadas em vinho.",
		price: 34,
		category: "Pães",
		img: u("photo-1534620808146-d33bb39128b2"),
	},
	{
		id: "focaccia-alecrim",
		name: "Focaccia de Alecrim",
		desc: "Azeite extravirgem, flor de sal e alecrim fresco da horta do Ceagesp.",
		price: 22,
		category: "Pães",
		img: u("photo-1549931319-a545dcf3bc73"),
	},
	{
		id: "pao-forma-integral",
		name: "Pão de Forma Integral",
		desc: "Farinha orgânica moída na pedra. Vai inteiro ou fatiado, você escolhe na loja.",
		price: 24,
		category: "Pães",
		img: u("photo-1509440159596-0249088772ff"),
	},

	// — Doces —
	{
		id: "croissant",
		name: "Croissant",
		desc: "Vinte e sete camadas de manteiga francesa. Folhado por três dias.",
		price: 12,
		category: "Doces",
		img: u("photo-1555507036-ab1f4038808a"),
		tag: "Clássico",
	},
	{
		id: "cinnamon-roll",
		name: "Cinnamon Roll",
		desc: "Canela do Ceilão, cobertura de cream cheese. Servido morno até acabar.",
		price: 16,
		category: "Doces",
		img: u("photo-1509365465985-25d11c17e812"),
	},
	{
		id: "pain-au-chocolat",
		name: "Pain au Chocolat",
		desc: "Duas barras de chocolate 62% dentro do nosso folhado de manteiga.",
		price: 14,
		category: "Doces",
		img: u("photo-1486427944299-d1955d23e34d"),
	},
	{
		id: "tarte-limao",
		name: "Tarte de Limão Siciliano",
		desc: "Massa sablée, creme cítrico e merengue maçaricado na hora.",
		price: 18,
		category: "Doces",
		img: u("photo-1517433670267-08bbd4be890f"),
	},
	{
		id: "cookie-chocolate",
		name: "Cookie de Chocolate 70%",
		desc: "Massa maturada 72h, flor de sal por cima. Casquinha fora, macio dentro.",
		price: 11,
		category: "Doces",
		img: u("photo-1499636136210-6f4ee915583e"),
	},

	// — Café —
	{
		id: "cafe-latte",
		name: "Café Latte",
		desc: "Espresso duplo e leite vaporizado. Arte na xícara por conta da casa.",
		price: 14,
		category: "Café",
		img: u("photo-1461023058943-07fcbe16d735"),
		tag: "Favorito",
	},
	{
		id: "espresso-duplo",
		name: "Espresso Duplo",
		desc: "Microlote do Sul de Minas, torra média. Notas de caramelo e castanha.",
		price: 9,
		category: "Café",
		img: u("photo-1572442388796-11668a67e53d"),
	},
	{
		id: "cappuccino",
		name: "Cappuccino",
		desc: "Sem canela, sem chocolate, sem desculpa. Só café e leite bem feitos.",
		price: 15,
		category: "Café",
		img: u("photo-1534778101976-62847782c213"),
	},
	{
		id: "coado-v60",
		name: "Coado V60",
		desc: "Grão do dia em método filtrado. Pergunte ao barista qual está na moagem.",
		price: 13,
		category: "Café",
		img: u("photo-1495474472287-4d71bcdd2085"),
	},
	{
		id: "chocolate-quente",
		name: "Chocolate Quente",
		desc: "Chocolate belga derretido no leite integral. Denso de verdade.",
		price: 16,
		category: "Café",
		img: u("photo-1517578239113-b03992dcdd25"),
	},

	// — Sanduíches —
	{
		id: "presunto-cru-brie",
		name: "Presunto Cru & Brie",
		desc: "Na baguete rústica, com rúcula e geleia de damasco da casa.",
		price: 32,
		category: "Sanduíches",
		img: u("photo-1528735602780-2552fd46c7af"),
		tag: "Mais pedido",
	},
	{
		id: "ovos-mexidos-sourdough",
		name: "Ovos Mexidos no Sourdough",
		desc: "Ovos caipiras cremosos sobre torrada de levain, cebolinha e pimenta-do-reino.",
		price: 26,
		category: "Sanduíches",
		img: u("photo-1525351484163-7529414344d8"),
	},
	{
		id: "vegetariano-abobrinha",
		name: "Vegetariano de Abobrinha",
		desc: "Abobrinha grelhada, ricota temperada e tomate confitado no pão integral.",
		price: 28,
		category: "Sanduíches",
		img: u("photo-1481070555726-e2fe8357725c"),
	},
	{
		id: "croque-monsieur",
		name: "Croque Monsieur",
		desc: "Presunto, gruyère e molho béchamel gratinado. Vai de garfo e faca.",
		price: 30,
		category: "Sanduíches",
		img: u("photo-1550507992-eb63ffee0847"),
	},
];

export function productById(id: string): Product | undefined {
	return PRODUCTS.find((p) => p.id === id);
}

/** Os 4 destaques da home — os mesmos itens da versão estática do site. */
export const HIGHLIGHT_IDS = [
	"croissant",
	"sourdough-classico",
	"cafe-latte",
	"cinnamon-roll",
] as const;

export type Unit = {
	id: string;
	name: string;
	neighborhood: string;
	address: string;
	phone: string;
	hours: { days: string; time: string }[];
	note: string;
	/** Posição do pin no mapa estilizado (%, relativo ao container). */
	pin: { top: number; left: number };
};

export const UNITS: Unit[] = [
	{
		id: "pinheiros",
		name: "Farine Pinheiros",
		neighborhood: "Pinheiros",
		address: "Rua dos Pinheiros, 1234",
		phone: "(11) 3061-2210",
		hours: [
			{ days: "Seg — Sex", time: "07h às 19h" },
			{ days: "Sáb — Dom", time: "08h às 16h" },
		],
		note: "A casa original. É aqui que o levain nasceu, em 2018.",
		pin: { top: 58, left: 27 },
	},
	{
		id: "vila-madalena",
		name: "Farine Vila Madalena",
		neighborhood: "Vila Madalena",
		address: "Rua Harmonia, 587",
		phone: "(11) 3812-4477",
		hours: [
			{ days: "Seg — Sex", time: "07h30 às 20h" },
			{ days: "Sáb — Dom", time: "08h às 17h" },
		],
		note: "Salão com mesa comunal de 6 metros e forno à vista.",
		pin: { top: 30, left: 44 },
	},
	{
		id: "jardins",
		name: "Farine Jardins",
		neighborhood: "Jardins",
		address: "Alameda Lorena, 940",
		phone: "(11) 3086-9931",
		hours: [
			{ days: "Seg — Sáb", time: "07h às 20h" },
			{ days: "Domingo", time: "08h às 15h" },
		],
		note: "Balcão de café e vitrine de folhados. Sem mesas, só banquetas.",
		pin: { top: 66, left: 71 },
	},
];

export function unitById(id: string | null): Unit | undefined {
	if (!id) return undefined;
	return UNITS.find((unit) => unit.id === id);
}

export const DELIVERY_FEE = 9.9;
export const FREE_DELIVERY_FROM = 80;

/**
 * Formata em BRL na mão em vez de Intl.NumberFormat: o resultado é idêntico no
 * servidor e no cliente, sem depender do ICU do Node — zero risco de mismatch
 * de hidratação num preço.
 */
export function formatBRL(value: number): string {
	const [reais, centavos] = value.toFixed(2).split(".");
	const comMilhar = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	return `R$ ${comMilhar},${centavos}`;
}
