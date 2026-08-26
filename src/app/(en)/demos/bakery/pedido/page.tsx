"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
	ArrowRight,
	Bike,
	Check,
	Clock,
	Loader2,
	Minus,
	Plus,
	ShoppingBag,
	Store,
	Trash2,
} from "lucide-react";

import { AddButton } from "../_components/AddButton";
import { ProductImage } from "../_components/ProductImage";
import { useCart, type CartLine } from "../_components/CartProvider";
import {
	FREE_DELIVERY_FROM,
	PRODUCTS,
	UNITS,
	formatBRL,
	unitById,
} from "../_components/data";

/**
 * /pedido — carrinho + checkout.
 *
 * Sem backend: o "envio" é um setTimeout que troca o estado da tela. O que é
 * real aqui é a validação (nome, telefone com DDD, endereço só quando é
 * entrega) e a conta — subtotal, taxa e total saem do carrinho de verdade.
 */

type FormErrors = Partial<Record<"nome" | "telefone" | "endereco", string>>;

type Confirmation = {
	orderId: string;
	eta: string;
	lines: CartLine[];
	total: number;
	fulfillment: "entrega" | "retirada";
	where: string;
	nome: string;
};

/** (11) 91234-5678 — máscara aplicada enquanto digita. */
function maskPhone(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 11);
	if (digits.length <= 2) return digits;
	if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
	if (digits.length <= 10) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
	}
	return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function PedidoPage() {
	const {
		lines,
		hydrated,
		count,
		subtotal,
		deliveryFee,
		total,
		fulfillment,
		pickupUnitId,
		inc,
		dec,
		remove,
		clear,
		setFulfillment,
		setPickupUnit,
	} = useCart();

	const [nome, setNome] = useState("");
	const [telefone, setTelefone] = useState("");
	const [endereco, setEndereco] = useState("");
	const [errors, setErrors] = useState<FormErrors>({});
	const [sending, setSending] = useState(false);
	const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

	const selectedUnit = unitById(pickupUnitId) ?? UNITS[0];

	function validate(): FormErrors {
		const next: FormErrors = {};

		if (nome.trim().length < 3) {
			next.nome = "Digite seu nome completo (mínimo 3 letras).";
		}

		const digits = telefone.replace(/\D/g, "");
		if (digits.length < 10 || digits.length > 11) {
			next.telefone = "Telefone com DDD, ex.: (11) 91234-5678.";
		}

		if (fulfillment === "entrega") {
			if (endereco.trim().length < 8) {
				next.endereco = "Endereço completo, com rua e bairro.";
			} else if (!/\d/.test(endereco)) {
				next.endereco = "Faltou o número do endereço.";
			}
		}

		return next;
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (lines.length === 0 || sending) return;

		const found = validate();
		setErrors(found);
		if (Object.keys(found).length > 0) {
			// Foca o primeiro campo com erro — checkout que não guia o usuário
			// de volta ao problema é checkout abandonado.
			const first = document.querySelector<HTMLInputElement>(
				`[data-field="${Object.keys(found)[0]}"]`,
			);
			first?.focus();
			return;
		}

		setSending(true);

		// Simula o round-trip do pedido. Numa implementação real, aqui entraria
		// o POST — a UI já está preparada pro estado de espera.
		setTimeout(() => {
			const orderId = `FRN-${Math.floor(1000 + Math.random() * 9000)}`;
			setConfirmation({
				orderId,
				eta:
					fulfillment === "entrega"
						? "40 a 55 minutos"
						: "pronto para retirada em 20 minutos",
				lines,
				total,
				fulfillment,
				where:
					fulfillment === "entrega"
						? endereco.trim()
						: `${selectedUnit.name} (${selectedUnit.address})`,
				nome: nome.trim().split(" ")[0],
			});
			setSending(false);
			clear();
			window.scrollTo({ top: 0, behavior: "smooth" });
		}, 900);
	}

	// ── Confirmação ───────────────────────────────────────────────────────────
	if (confirmation) {
		return (
			<section className="pt-36 pb-24 px-6 min-h-screen">
				<div className="max-w-2xl mx-auto text-center farine-rise">
					<div className="w-20 h-20 rounded-full bg-orange-700 text-[#FDF8F5] flex items-center justify-center mx-auto mb-8">
						<Check size={36} strokeWidth={2.5} />
					</div>

					<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
						Pedido {confirmation.orderId}
					</span>
					<h1 className="text-5xl md:text-6xl text-stone-900 mt-4 leading-[1.1]">
						Obrigado, {confirmation.nome}. <br />
						<span className="italic text-stone-500">Já estamos embalando.</span>
					</h1>

					<div className="mt-10 bg-[#F3EFEA] border border-stone-200 p-8 text-left font-sans">
						<div className="flex items-center gap-3 text-stone-800 pb-6 border-b border-stone-200">
							<Clock size={18} className="text-orange-700" />
							<span className="text-sm">
								{confirmation.fulfillment === "entrega"
									? "Chega em "
									: "Fica "}
								<strong className="text-stone-900">{confirmation.eta}</strong>
							</span>
						</div>

						<div className="py-6 border-b border-stone-200 space-y-3">
							{confirmation.lines.map((line) => (
								<div
									key={line.id}
									className="flex justify-between text-sm text-stone-600"
								>
									<span>
										{line.qty}× {line.name}
									</span>
									<span>{formatBRL(line.price * line.qty)}</span>
								</div>
							))}
						</div>

						<div className="pt-6 space-y-3">
							<div className="flex justify-between items-baseline">
								<span className="text-xs uppercase tracking-widest text-stone-500">
									Total pago
								</span>
								<span className="font-serif text-2xl text-stone-900">
									{formatBRL(confirmation.total)}
								</span>
							</div>
							<p className="text-xs text-stone-500 leading-relaxed pt-2">
								{confirmation.fulfillment === "entrega"
									? "Entregar em: "
									: "Retirar em: "}
								{confirmation.where}
							</p>
						</div>
					</div>

					<p className="font-sans text-xs text-stone-400 mt-6">
						Demo: nenhum pedido foi realmente enviado.
					</p>

					<div className="flex flex-wrap gap-4 justify-center mt-10">
						<Link
							href="/demos/bakery/cardapio"
							className="bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors flex items-center gap-2 group"
						>
							Fazer outro pedido
							<ArrowRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href="/demos/bakery"
							className="border border-stone-300 text-stone-700 px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:border-orange-700 hover:text-orange-700 transition-colors"
						>
							Voltar ao início
						</Link>
					</div>
				</div>
			</section>
		);
	}

	// ── Carregando o carrinho do storage ──────────────────────────────────────
	if (!hydrated) {
		return (
			<section className="pt-36 pb-24 px-6 min-h-screen">
				<div className="max-w-6xl mx-auto flex items-center gap-3 text-stone-400 font-sans text-sm">
					<Loader2 size={16} className="animate-spin" />
					Carregando seu pedido…
				</div>
			</section>
		);
	}

	// ── Carrinho vazio ────────────────────────────────────────────────────────
	if (count === 0) {
		const suggestions = PRODUCTS.filter((product) => product.tag).slice(0, 3);

		return (
			<section className="pt-36 pb-24 px-6 min-h-screen">
				<div className="max-w-3xl mx-auto text-center">
					<div className="w-20 h-20 rounded-full border border-stone-300 text-stone-400 flex items-center justify-center mx-auto mb-8">
						<ShoppingBag size={30} />
					</div>
					<h1 className="text-5xl md:text-6xl text-stone-900 leading-[1.1]">
						Seu pedido está <br />
						<span className="italic text-stone-500">vazio por enquanto.</span>
					</h1>
					<p className="font-sans text-stone-600 leading-relaxed mt-6 max-w-md mx-auto">
						A fornada das 07h já saiu. Comece por um destes, ou veja o cardápio
						inteiro.
					</p>

					<div className="grid sm:grid-cols-3 gap-6 mt-12 text-left">
						{suggestions.map((product) => (
							<div key={product.id} className="group">
								<div className="overflow-hidden rounded-t-[4rem] bg-stone-200 mb-4">
									<ProductImage
										src={product.img}
										alt={product.name}
										className="w-full h-52"
									/>
								</div>
								<div className="flex justify-between items-baseline mb-4">
									<h2 className="text-lg text-stone-900">{product.name}</h2>
									<span className="font-sans font-bold text-orange-700 text-sm">
										{formatBRL(product.price)}
									</span>
								</div>
								<AddButton
									product={product}
									variant="outline"
									className="w-full"
								/>
							</div>
						))}
					</div>

					<Link
						href="/demos/bakery/cardapio"
						className="inline-flex items-center gap-2 mt-12 bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm font-sans uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors group"
					>
						Ver cardápio completo
						<ArrowRight
							size={16}
							className="group-hover:translate-x-1 transition-transform"
						/>
					</Link>
				</div>
			</section>
		);
	}

	// ── Carrinho + checkout ───────────────────────────────────────────────────
	const faltaParaFrenteGratis = FREE_DELIVERY_FROM - subtotal;

	return (
		<section className="pt-36 pb-24 px-6">
			<div className="max-w-6xl mx-auto">
				<span className="font-sans text-orange-700 font-bold tracking-widest text-xs uppercase">
					Seu pedido: {count} {count === 1 ? "item" : "itens"}
				</span>
				<h1 className="text-5xl md:text-6xl text-stone-900 mt-4 mb-14 leading-[1.1]">
					Quase no <span className="italic text-stone-500">forno.</span>
				</h1>

				<div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
					{/* Linhas do carrinho */}
					<div>
						<ul className="border-t border-stone-200">
							{lines.map((line) => (
								<li
									key={line.id}
									className="group flex gap-5 py-6 border-b border-stone-200 items-center"
								>
									<div className="w-24 h-24 shrink-0 overflow-hidden rounded-t-[2rem] bg-stone-200">
										<ProductImage
											src={line.img}
											alt={line.name}
											className="w-full h-full"
										/>
									</div>

									<div className="flex-1 min-w-0">
										<h2 className="text-xl text-stone-900 truncate">
											{line.name}
										</h2>
										<p className="font-sans text-sm text-stone-500 mt-1">
											{formatBRL(line.price)} a unidade
										</p>
									</div>

									<div className="flex items-center border border-stone-300 rounded-sm shrink-0">
										<button
											type="button"
											onClick={() => dec(line.id)}
											aria-label={`Diminuir ${line.name}`}
											className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-orange-700 hover:bg-stone-100 transition-colors cursor-pointer"
										>
											<Minus size={14} />
										</button>
										<span className="w-9 text-center font-sans text-sm font-bold text-stone-900 tabular-nums">
											{line.qty}
										</span>
										<button
											type="button"
											onClick={() => inc(line.id)}
											aria-label={`Aumentar ${line.name}`}
											className="w-9 h-9 flex items-center justify-center text-stone-600 hover:text-orange-700 hover:bg-stone-100 transition-colors cursor-pointer"
										>
											<Plus size={14} />
										</button>
									</div>

									<div className="w-24 text-right shrink-0 hidden sm:block">
										<span className="font-sans font-bold text-orange-700 tabular-nums">
											{formatBRL(line.price * line.qty)}
										</span>
									</div>

									<button
										type="button"
										onClick={() => remove(line.id)}
										aria-label={`Remover ${line.name} do pedido`}
										className="w-9 h-9 shrink-0 flex items-center justify-center text-stone-300 hover:text-orange-700 transition-colors cursor-pointer"
									>
										<Trash2 size={16} />
									</button>
								</li>
							))}
						</ul>

						<div className="flex flex-wrap gap-6 items-center justify-between mt-6 font-sans text-sm">
							<Link
								href="/demos/bakery/cardapio"
								className="text-stone-600 hover:text-orange-700 transition-colors border-b border-stone-300 hover:border-orange-700 pb-0.5"
							>
								+ Adicionar mais itens
							</Link>
							<button
								type="button"
								onClick={clear}
								className="text-stone-400 hover:text-orange-700 transition-colors cursor-pointer"
							>
								Esvaziar pedido
							</button>
						</div>
					</div>

					{/* Checkout */}
					<form
						onSubmit={handleSubmit}
						noValidate
						className="bg-[#F3EFEA] border border-stone-200 p-8 font-sans space-y-8 lg:sticky lg:top-28"
					>
						{/* Entrega x retirada */}
						<div>
							<h2 className="font-serif text-2xl text-stone-900 mb-5">
								Como você quer receber?
							</h2>
							<div className="grid grid-cols-2 gap-3">
								{(
									[
										{ key: "entrega", label: "Entrega", icon: Bike },
										{ key: "retirada", label: "Retirar na loja", icon: Store },
									] as const
								).map((option) => {
									const active = fulfillment === option.key;
									const Icon = option.icon;
									return (
										<button
											key={option.key}
											type="button"
											onClick={() => setFulfillment(option.key)}
											aria-pressed={active}
											className={`flex flex-col items-center gap-2 rounded-sm border px-4 py-4 text-xs uppercase tracking-widest transition-colors cursor-pointer ${
												active
													? "border-orange-700 bg-orange-700 text-[#FDF8F5]"
													: "border-stone-300 bg-[#FDF8F5] text-stone-600 hover:border-orange-700 hover:text-orange-700"
											}`}
										>
											<Icon size={18} />
											{option.label}
										</button>
									);
								})}
							</div>

							{fulfillment === "retirada" && (
								<div className="mt-4 farine-rise">
									<label
										htmlFor="unidade"
										className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
									>
										Unidade
									</label>
									<select
										id="unidade"
										value={selectedUnit.id}
										onChange={(event) => setPickupUnit(event.target.value)}
										className="w-full bg-[#FDF8F5] border border-stone-300 rounded-sm px-4 py-3 text-sm text-stone-800 focus:border-orange-700 focus:outline-none transition-colors cursor-pointer"
									>
										{UNITS.map((unit) => (
											<option key={unit.id} value={unit.id}>
												{unit.name} ({unit.address})
											</option>
										))}
									</select>
								</div>
							)}
						</div>

						{/* Dados */}
						<div className="space-y-4 border-t border-stone-200 pt-8">
							<h2 className="font-serif text-2xl text-stone-900">Seus dados</h2>

							<Field
								id="nome"
								label="Nome"
								placeholder="Helena Ravazi"
								value={nome}
								onChange={setNome}
								error={errors.nome}
								autoComplete="name"
							/>

							<Field
								id="telefone"
								label="Telefone"
								placeholder="(11) 91234-5678"
								value={telefone}
								onChange={(value) => setTelefone(maskPhone(value))}
								error={errors.telefone}
								inputMode="tel"
								autoComplete="tel"
							/>

							{fulfillment === "entrega" && (
								<div className="farine-rise">
									<Field
										id="endereco"
										label="Endereço"
										placeholder="Rua Harmonia, 587, Vila Madalena"
										value={endereco}
										onChange={setEndereco}
										error={errors.endereco}
										autoComplete="street-address"
									/>
								</div>
							)}
						</div>

						{/* Totais */}
						<div className="border-t border-stone-200 pt-8 space-y-3 text-sm">
							<div className="flex justify-between text-stone-600">
								<span>Subtotal</span>
								<span className="tabular-nums">{formatBRL(subtotal)}</span>
							</div>
							<div className="flex justify-between text-stone-600">
								<span>
									{fulfillment === "entrega" ? "Taxa de entrega" : "Retirada"}
								</span>
								<span className="tabular-nums">
									{deliveryFee > 0 ? (
										formatBRL(deliveryFee)
									) : (
										<em className="not-italic text-orange-700 font-bold">
											Grátis
										</em>
									)}
								</span>
							</div>

							{fulfillment === "entrega" && faltaParaFrenteGratis > 0 && (
								<p className="text-xs text-stone-500 leading-relaxed bg-[#FDF8F5] border border-stone-200 p-3 rounded-sm">
									Faltam{" "}
									<strong className="text-orange-700">
										{formatBRL(faltaParaFrenteGratis)}
									</strong>{" "}
									para a entrega sair de graça.
								</p>
							)}

							<div className="flex justify-between items-baseline pt-3 border-t border-stone-200">
								<span className="text-xs uppercase tracking-widest text-stone-500">
									Total
								</span>
								<span className="font-serif text-3xl text-stone-900 tabular-nums">
									{formatBRL(total)}
								</span>
							</div>
						</div>

						<button
							type="submit"
							disabled={sending}
							className="w-full bg-stone-900 text-[#FDF8F5] px-8 py-4 rounded-sm uppercase text-sm tracking-widest hover:bg-orange-800 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait cursor-pointer"
						>
							{sending ? (
								<>
									<Loader2 size={16} className="animate-spin" />
									Enviando…
								</>
							) : (
								<>
									Confirmar pedido
									<ArrowRight
										size={16}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</>
							)}
						</button>

						<p className="text-xs text-stone-400 text-center leading-relaxed">
							Pagamento na entrega ou na retirada. Demo: nada é cobrado.
						</p>
					</form>
				</div>
			</div>
		</section>
	);
}

function Field({
	id,
	label,
	placeholder,
	value,
	onChange,
	error,
	inputMode,
	autoComplete,
}: {
	id: "nome" | "telefone" | "endereco";
	label: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	inputMode?: "tel" | "text";
	autoComplete?: string;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="block text-xs uppercase tracking-widest text-stone-500 mb-2"
			>
				{label}
			</label>
			<input
				id={id}
				data-field={id}
				type="text"
				inputMode={inputMode}
				autoComplete={autoComplete}
				placeholder={placeholder}
				value={value}
				onChange={(event) => onChange(event.target.value)}
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${id}-erro` : undefined}
				className={`w-full bg-[#FDF8F5] border rounded-sm px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none transition-colors ${
					error
						? "border-orange-700"
						: "border-stone-300 focus:border-orange-700"
				}`}
			/>
			{error && (
				<p id={`${id}-erro`} className="text-xs text-orange-700 mt-2">
					{error}
				</p>
			)}
		</div>
	);
}
