"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	type ReactNode,
} from "react";

import { DELIVERY_FEE, FREE_DELIVERY_FROM, type Product } from "./data";

/**
 * Carrinho da Farine.
 *
 * Mora no layout da demo (não numa página), então o pedido sobrevive à
 * navegação entre /cardapio, /pedido e a home — que é justamente o que faz a
 * demo parecer um site de verdade, e não quatro páginas soltas.
 *
 * Persistência em localStorage é opcional e sempre lida dentro de useEffect:
 * no SSR o estado inicial é vazio, e `hydrated` avisa a UI quando o número
 * real chegou (evita o badge do carrinho piscar 0 → 3 e quebrar hidratação).
 */

export type CartLine = {
	id: string;
	name: string;
	price: number;
	img: string;
	qty: number;
};

export type Fulfillment = "entrega" | "retirada";

type CartState = {
	lines: CartLine[];
	fulfillment: Fulfillment;
	pickupUnitId: string | null;
	hydrated: boolean;
};

type CartAction =
	| { type: "hydrate"; payload: Partial<Omit<CartState, "hydrated">> }
	| { type: "add"; product: Product; qty: number }
	| { type: "setQty"; id: string; qty: number }
	| { type: "remove"; id: string }
	| { type: "clear" }
	| { type: "setFulfillment"; fulfillment: Fulfillment }
	| { type: "setPickupUnit"; unitId: string | null };

const MAX_QTY = 20;

const initialState: CartState = {
	lines: [],
	fulfillment: "entrega",
	pickupUnitId: null,
	hydrated: false,
};

function reducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "hydrate":
			return { ...state, ...action.payload, hydrated: true };

		case "add": {
			const existing = state.lines.find((line) => line.id === action.product.id);
			if (existing) {
				return {
					...state,
					lines: state.lines.map((line) =>
						line.id === action.product.id
							? { ...line, qty: Math.min(MAX_QTY, line.qty + action.qty) }
							: line,
					),
				};
			}
			return {
				...state,
				lines: [
					...state.lines,
					{
						id: action.product.id,
						name: action.product.name,
						price: action.product.price,
						img: action.product.img,
						qty: Math.min(MAX_QTY, action.qty),
					},
				],
			};
		}

		case "setQty": {
			// Zerar a quantidade remove a linha — é o que o cliente espera do "−".
			if (action.qty <= 0) {
				return {
					...state,
					lines: state.lines.filter((line) => line.id !== action.id),
				};
			}
			return {
				...state,
				lines: state.lines.map((line) =>
					line.id === action.id
						? { ...line, qty: Math.min(MAX_QTY, action.qty) }
						: line,
				),
			};
		}

		case "remove":
			return {
				...state,
				lines: state.lines.filter((line) => line.id !== action.id),
			};

		case "clear":
			return { ...state, lines: [] };

		case "setFulfillment":
			return { ...state, fulfillment: action.fulfillment };

		case "setPickupUnit":
			return { ...state, pickupUnitId: action.unitId };

		default:
			return state;
	}
}

type CartContextValue = {
	lines: CartLine[];
	hydrated: boolean;
	count: number;
	subtotal: number;
	deliveryFee: number;
	total: number;
	fulfillment: Fulfillment;
	pickupUnitId: string | null;
	qtyOf: (id: string) => number;
	add: (product: Product, qty?: number) => void;
	inc: (id: string) => void;
	dec: (id: string) => void;
	setQty: (id: string, qty: number) => void;
	remove: (id: string) => void;
	clear: () => void;
	setFulfillment: (fulfillment: Fulfillment) => void;
	setPickupUnit: (unitId: string | null) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "farine:cart:v1";

type PersistedCart = {
	lines?: CartLine[];
	fulfillment?: Fulfillment;
	pickupUnitId?: string | null;
};

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	// Leitura do storage só depois da montagem: no servidor não existe window,
	// e ler durante o render quebraria a hidratação.
	useEffect(() => {
		let payload: Partial<Omit<CartState, "hydrated">> = {};
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as PersistedCart;
				payload = {
					lines: Array.isArray(parsed.lines)
						? parsed.lines.filter(
								(line): line is CartLine =>
									!!line &&
									typeof line.id === "string" &&
									typeof line.price === "number" &&
									typeof line.qty === "number",
							)
						: [],
					fulfillment:
						parsed.fulfillment === "retirada" ? "retirada" : "entrega",
					pickupUnitId:
						typeof parsed.pickupUnitId === "string" ? parsed.pickupUnitId : null,
				};
			}
		} catch {
			// storage bloqueado (modo anônimo, iframe): a demo segue em memória.
		}
		dispatch({ type: "hydrate", payload });
	}, []);

	useEffect(() => {
		if (!state.hydrated) return;
		try {
			const toPersist: PersistedCart = {
				lines: state.lines,
				fulfillment: state.fulfillment,
				pickupUnitId: state.pickupUnitId,
			};
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
		} catch {
			// idem: persistir é um bônus, não um requisito.
		}
	}, [state.hydrated, state.lines, state.fulfillment, state.pickupUnitId]);

	const add = useCallback((product: Product, qty = 1) => {
		dispatch({ type: "add", product, qty });
	}, []);

	const value = useMemo<CartContextValue>(() => {
		const subtotal = state.lines.reduce(
			(acc, line) => acc + line.price * line.qty,
			0,
		);
		const deliveryFee =
			state.fulfillment === "entrega" &&
			state.lines.length > 0 &&
			subtotal < FREE_DELIVERY_FROM
				? DELIVERY_FEE
				: 0;

		return {
			lines: state.lines,
			hydrated: state.hydrated,
			count: state.lines.reduce((acc, line) => acc + line.qty, 0),
			subtotal,
			deliveryFee,
			total: subtotal + deliveryFee,
			fulfillment: state.fulfillment,
			pickupUnitId: state.pickupUnitId,
			qtyOf: (id: string) =>
				state.lines.find((line) => line.id === id)?.qty ?? 0,
			add,
			inc: (id: string) => {
				const line = state.lines.find((item) => item.id === id);
				if (line) dispatch({ type: "setQty", id, qty: line.qty + 1 });
			},
			dec: (id: string) => {
				const line = state.lines.find((item) => item.id === id);
				if (line) dispatch({ type: "setQty", id, qty: line.qty - 1 });
			},
			setQty: (id: string, qty: number) => dispatch({ type: "setQty", id, qty }),
			remove: (id: string) => dispatch({ type: "remove", id }),
			clear: () => dispatch({ type: "clear" }),
			setFulfillment: (fulfillment: Fulfillment) =>
				dispatch({ type: "setFulfillment", fulfillment }),
			setPickupUnit: (unitId: string | null) =>
				dispatch({ type: "setPickupUnit", unitId }),
		};
	}, [state, add]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart precisa estar dentro de <CartProvider>.");
	}
	return ctx;
}
