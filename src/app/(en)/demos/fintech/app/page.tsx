"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
	ArrowDownLeft,
	ArrowUpRight,
	Building2,
	Check,
	Copy,
	CreditCard,
	Eye,
	EyeOff,
	Loader2,
	PieChart,
	Search,
	Send,
	ShoppingBag,
	Sparkles,
	TrendingUp,
	Utensils,
	Wallet,
	X,
	Zap,
} from "lucide-react";
import {
	ACCOUNT,
	FT,
	SEED_TXS,
	brl,
	brlNumber,
	btnGhostSm,
	btnPrimary,
	cx,
	errText,
	field,
	label as labelCls,
	maskMoney,
	parseMoney,
	type Tx,
	type TxKind,
} from "../_components/lumina";

type Filter = "tudo" | "entradas" | "saidas";

const KIND_ICON: Record<TxKind, React.ComponentType<{ size?: number }>> = {
	pix: Zap,
	cartao: CreditCard,
	salario: Building2,
	alimentacao: Utensils,
	transporte: TrendingUp,
	assinatura: Sparkles,
	compras: ShoppingBag,
	investimento: PieChart,
};

export default function AppPage() {
	const [txs, setTxs] = useState<Tx[]>(SEED_TXS);
	const [balance, setBalance] = useState(ACCOUNT.balance);
	const [filter, setFilter] = useState<Filter>("tudo");
	const [query, setQuery] = useState("");
	const [hidden, setHidden] = useState(false);
	const [modal, setModal] = useState<null | "pix" | "deposito">(null);

	const visible = useMemo(() => {
		const q = query.trim().toLowerCase();
		return txs.filter((t) => {
			if (filter === "entradas" && t.amount <= 0) return false;
			if (filter === "saidas" && t.amount >= 0) return false;
			if (!q) return true;
			return (
				t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
			);
		});
	}, [txs, filter, query]);

	// Recalculam sozinhos quando um Pix entra na lista.
	const { entradas, saidas } = useMemo(() => {
		let entradas = 0;
		let saidas = 0;
		for (const t of txs) {
			if (t.amount > 0) entradas += t.amount;
			else saidas += Math.abs(t.amount);
		}
		return { entradas, saidas };
	}, [txs]);

	function addTx(tx: Tx, delta: number) {
		setTxs((list) => [tx, ...list]);
		setBalance((b) => b + delta);
	}

	return (
		<>
			<section className="pt-28 pb-20 px-6">
				<div className="max-w-7xl mx-auto">
					{/* Saudação */}
					<div className="flex flex-wrap items-end justify-between gap-4 mb-8">
						<div>
							<p className="text-sm text-slate-500">Segunda, 13 de julho</p>
							<h1 className="text-3xl font-bold tracking-tight text-slate-900">
								Olá, {ACCOUNT.holder.split(" ")[0]}.
							</h1>
						</div>
						<div className="flex gap-3">
							<Link href={`${FT}/cartoes`} className={btnGhostSm}>
								<CreditCard size={15} /> Meus cartões
							</Link>
							<Link href={`${FT}/planos`} className={btnGhostSm}>
								<Sparkles size={15} /> Meu plano
							</Link>
						</div>
					</div>

					<div className="grid lg:grid-cols-3 gap-6">
						{/* Saldo */}
						<div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 border border-slate-700/50">
							<div className="absolute right-0 top-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]" />

							<div className="relative z-10">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-sm text-slate-400">
										<Wallet size={15} />
										Saldo em conta
									</div>
									<button
										type="button"
										onClick={() => setHidden((v) => !v)}
										aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"}
										className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
									>
										{hidden ? <EyeOff size={16} /> : <Eye size={16} />}
									</button>
								</div>

								<div className="mt-4 flex items-end gap-2">
									<span className="text-sm font-medium text-slate-400 mb-2">
										R$
									</span>
									<span
										className={cx(
											"text-5xl font-bold tracking-tight tabular-nums transition-all",
											hidden && "blur-md select-none",
										)}
									>
										{brlNumber(balance)}
									</span>
								</div>

								<p className="mt-2 text-xs text-slate-400 font-mono">
									Ag. {ACCOUNT.agencia} · C/C {ACCOUNT.conta} · CPF{" "}
									{ACCOUNT.cpf}
								</p>

								<div className="mt-8 flex flex-wrap gap-3">
									<button
										type="button"
										onClick={() => setModal("pix")}
										className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30"
									>
										<Zap size={16} /> Enviar Pix
									</button>
									<button
										type="button"
										onClick={() => setModal("deposito")}
										className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all border border-white/10"
									>
										<ArrowDownLeft size={16} /> Depositar
									</button>
								</div>
							</div>
						</div>

						{/* Resumo do mês */}
						<div className="grid gap-6">
							<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6">
								<div className="flex items-center gap-3">
									<div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
										<ArrowDownLeft size={20} />
									</div>
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
											Entradas do mês
										</p>
										<p className="text-xl font-bold text-slate-900 tabular-nums truncate">
											{brl(entradas)}
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-[2rem] bg-white border border-slate-100 shadow-sm p-6">
								<div className="flex items-center gap-3">
									<div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
										<ArrowUpRight size={20} />
									</div>
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
											Saídas do mês
										</p>
										<p className="text-xl font-bold text-slate-900 tabular-nums truncate">
											{brl(saidas)}
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-[2rem] bg-slate-50 border border-slate-100 p-6">
								<div className="flex items-center gap-3">
									<div className="w-11 h-11 rounded-xl bg-white shadow-sm text-blue-600 flex items-center justify-center">
										<PieChart size={20} />
									</div>
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
											Cofre · 110% CDI
										</p>
										<p className="text-xl font-bold text-slate-900 tabular-nums truncate">
											{brl(ACCOUNT.invested)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Extrato */}
					<div className="mt-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden">
						<div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
							<div>
								<h2 className="text-xl font-bold text-slate-900">Extrato</h2>
								<p className="text-sm text-slate-500 mt-0.5">
									{visible.length}{" "}
									{visible.length === 1 ? "lançamento" : "lançamentos"}
									{filter !== "tudo" && ` · ${filter}`}
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-3">
								{/* Busca */}
								<div className="relative">
									<Search
										size={16}
										className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
									/>
									<input
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										placeholder="Buscar lançamento…"
										aria-label="Buscar no extrato"
										className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
									/>
								</div>

								{/* Filtro */}
								<div
									role="tablist"
									aria-label="Filtrar lançamentos"
									className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-200"
								>
									{(["tudo", "entradas", "saidas"] as const).map((f) => (
										<button
											key={f}
											role="tab"
											aria-selected={filter === f}
											onClick={() => setFilter(f)}
											className={cx(
												"px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
												filter === f
													? "bg-white text-blue-600 shadow-sm"
													: "text-slate-500 hover:text-slate-900",
											)}
										>
											{f === "saidas" ? "saídas" : f}
										</button>
									))}
								</div>
							</div>
						</div>

						{visible.length === 0 ? (
							<div className="py-20 text-center">
								<div className="w-14 h-14 mx-auto rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
									<Search size={22} />
								</div>
								<p className="mt-4 font-semibold text-slate-900">
									Nenhum lançamento encontrado
								</p>
								<p className="mt-1 text-sm text-slate-500">
									Tente outro termo ou limpe o filtro.
								</p>
								<button
									type="button"
									onClick={() => {
										setQuery("");
										setFilter("tudo");
									}}
									className={cx(btnGhostSm, "mt-6")}
								>
									Limpar filtros
								</button>
							</div>
						) : (
							<ul className="divide-y divide-slate-100">
								{visible.map((tx) => {
									const Icon = KIND_ICON[tx.kind];
									const income = tx.amount > 0;
									return (
										<li
											key={tx.id}
											className="flex items-center gap-4 px-6 sm:px-8 py-4 hover:bg-slate-50/70 transition-colors"
										>
											<div
												className={cx(
													"w-11 h-11 shrink-0 rounded-xl flex items-center justify-center",
													income
														? "bg-green-50 text-green-600"
														: "bg-slate-100 text-slate-500",
												)}
											>
												<Icon size={19} />
											</div>

											<div className="flex-1 min-w-0">
												<p className="font-semibold text-slate-900 truncate">
													{tx.title}
												</p>
												<p className="text-xs text-slate-500 truncate">
													{tx.subtitle}
												</p>
											</div>

											<div className="text-right shrink-0">
												<p
													className={cx(
														"font-bold tabular-nums",
														income ? "text-green-600" : "text-slate-900",
													)}
												>
													{income ? "+ " : "- "}
													{brl(Math.abs(tx.amount))}
												</p>
												<p className="text-xs text-slate-400 font-mono">
													{tx.date}
												</p>
											</div>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</section>

			{modal === "pix" && (
				<PixModal
					balance={balance}
					onClose={() => setModal(null)}
					onSend={(valor, chave) => {
						addTx(
							{
								id: `pix-${Date.now()}`,
								title: `Pix enviado · ${chave}`,
								subtitle: `Chave: ${chave}`,
								amount: -valor,
								date: "13/07",
								kind: "pix",
							},
							-valor,
						);
					}}
				/>
			)}

			{modal === "deposito" && (
				<DepositoModal
					onClose={() => setModal(null)}
					onDeposit={(valor) => {
						addTx(
							{
								id: `dep-${Date.now()}`,
								title: "Pix recebido · Depósito",
								subtitle: `Chave: ${ACCOUNT.pixKey}`,
								amount: valor,
								date: "13/07",
								kind: "pix",
							},
							valor,
						);
					}}
				/>
			)}
		</>
	);
}

/* ------------------------------------------------------------------ *
 * Modal base — z-[60]: acima da navbar (z-50), abaixo da pílula
 * "Voltar ao portfólio" do layout pai (z-100).
 * ------------------------------------------------------------------ */

function Modal({
	title,
	subtitle,
	onClose,
	children,
}: {
	title: string;
	subtitle: string;
	onClose: () => void;
	children: React.ReactNode;
}) {
	return (
		<div
			className="fixed inset-0 z-[60] flex items-center justify-center p-4 lumina-fade-in"
			role="dialog"
			aria-modal="true"
			aria-label={title}
		>
			<div
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative w-full max-w-md bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-8 lumina-fade-up">
				<div className="flex items-start justify-between gap-4 mb-6">
					<div>
						<h2 className="text-xl font-bold text-slate-900">{title}</h2>
						<p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Fechar"
						className="shrink-0 w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center"
					>
						<X size={18} />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}

/* ---------------------------- Pix ---------------------------- */

function PixModal({
	balance,
	onClose,
	onSend,
}: {
	balance: number;
	onClose: () => void;
	onSend: (valor: number, chave: string) => void;
}) {
	const [valor, setValor] = useState("");
	const [chave, setChave] = useState("");
	const [errors, setErrors] = useState<{ valor?: string; chave?: string }>({});
	const [sending, setSending] = useState(false);
	const [sent, setSent] = useState<{ valor: number; chave: string } | null>(
		null,
	);

	function submit(e: React.FormEvent) {
		e.preventDefault();

		const amount = parseMoney(valor);
		const next: { valor?: string; chave?: string } = {};

		if (amount <= 0) next.valor = "Informe um valor maior que zero.";
		else if (amount > balance)
			next.valor = `Saldo insuficiente. Disponível: ${brl(balance)}.`;

		if (chave.trim().length < 5)
			next.chave = "Informe uma chave Pix válida (CPF, e-mail ou telefone).";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		setSending(true);
		window.setTimeout(() => {
			onSend(amount, chave.trim());
			setSending(false);
			setSent({ valor: amount, chave: chave.trim() });
		}, 800);
	}

	if (sent) {
		return (
			<Modal
				title="Pix enviado"
				subtitle="O comprovante já está no seu extrato."
				onClose={onClose}
			>
				<div className="text-center py-2 lumina-fade-up">
					<div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
						<Check size={30} strokeWidth={3} />
					</div>
					<p className="mt-6 text-3xl font-bold text-slate-900 tabular-nums">
						{brl(sent.valor)}
					</p>
					<p className="mt-1 text-sm text-slate-500">
						enviados para{" "}
						<span className="font-semibold text-slate-700">{sent.chave}</span>
					</p>

					<div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-left text-xs text-slate-500 space-y-1.5">
						<div className="flex justify-between">
							<span>Novo saldo</span>
							<span className="font-mono font-semibold text-slate-900">
								{brl(balance - sent.valor)}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Autenticação</span>
							<span className="font-mono">E7A4-90C2-11FB</span>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						className={cx(btnPrimary, "mt-8 w-full")}
					>
						Concluir
					</button>
				</div>
			</Modal>
		);
	}

	return (
		<Modal
			title="Enviar Pix"
			subtitle={`Disponível: ${brl(balance)}`}
			onClose={onClose}
		>
			<form onSubmit={submit} noValidate className="space-y-5">
				<div>
					<label htmlFor="pix-valor" className={labelCls}>
						Valor
					</label>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
							R$
						</span>
						<input
							id="pix-valor"
							inputMode="numeric"
							autoFocus
							value={valor}
							onChange={(e) => {
								setValor(maskMoney(e.target.value));
								if (errors.valor) setErrors((x) => ({ ...x, valor: undefined }));
							}}
							placeholder="0,00"
							aria-invalid={!!errors.valor}
							className={cx(
								field(!!errors.valor),
								"pl-12 font-mono text-lg tabular-nums",
							)}
						/>
					</div>
					{errors.valor && <p className={errText}>{errors.valor}</p>}

					<div className="mt-3 flex gap-2">
						{[50, 100, 250].map((v) => (
							<button
								key={v}
								type="button"
								onClick={() => {
									setValor(maskMoney(String(v * 100)));
									setErrors((x) => ({ ...x, valor: undefined }));
								}}
								className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-colors"
							>
								{brl(v)}
							</button>
						))}
					</div>
				</div>

				<div>
					<label htmlFor="pix-chave" className={labelCls}>
						Chave Pix do destinatário
					</label>
					<input
						id="pix-chave"
						value={chave}
						onChange={(e) => {
							setChave(e.target.value);
							if (errors.chave) setErrors((x) => ({ ...x, chave: undefined }));
						}}
						placeholder="CPF, e-mail, telefone ou chave aleatória"
						aria-invalid={!!errors.chave}
						className={field(!!errors.chave)}
					/>
					{errors.chave && <p className={errText}>{errors.chave}</p>}
				</div>

				<button
					type="submit"
					disabled={sending}
					className={cx(btnPrimary, "w-full")}
				>
					{sending ? (
						<>
							<Loader2 size={18} className="animate-spin" /> Enviando…
						</>
					) : (
						<>
							<Send size={17} /> Enviar Pix
						</>
					)}
				</button>
			</form>
		</Modal>
	);
}

/* -------------------------- Depósito -------------------------- */

function DepositoModal({
	onClose,
	onDeposit,
}: {
	onClose: () => void;
	onDeposit: (valor: number) => void;
}) {
	const [valor, setValor] = useState("");
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [done, setDone] = useState(false);

	async function copyKey() {
		try {
			await navigator.clipboard.writeText(ACCOUNT.pixKey);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard indisponível — segue o baile.
		}
	}

	function submit(e: React.FormEvent) {
		e.preventDefault();
		const amount = parseMoney(valor);
		if (amount <= 0) {
			setError("Informe um valor maior que zero.");
			return;
		}
		onDeposit(amount);
		setDone(true);
		window.setTimeout(onClose, 1200);
	}

	return (
		<Modal
			title="Depositar via Pix"
			subtitle="Use sua chave ou simule um recebimento."
			onClose={onClose}
		>
			{done ? (
				<div className="text-center py-6 lumina-fade-up">
					<div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
						<Check size={30} strokeWidth={3} />
					</div>
					<p className="mt-6 font-bold text-slate-900 text-lg">
						Depósito confirmado
					</p>
					<p className="text-sm text-slate-500 mt-1">
						{brl(parseMoney(valor))} caíram na conta.
					</p>
				</div>
			) : (
				<>
					<div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-between gap-3 mb-6">
						<div className="min-w-0">
							<p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
								Sua chave Pix
							</p>
							<p className="font-mono text-sm text-slate-900 truncate">
								{ACCOUNT.pixKey}
							</p>
						</div>
						<button
							type="button"
							onClick={copyKey}
							aria-label="Copiar chave Pix"
							className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center justify-center"
						>
							{copied ? <Check size={16} /> : <Copy size={16} />}
						</button>
					</div>

					<form onSubmit={submit} noValidate className="space-y-5">
						<div>
							<label htmlFor="dep-valor" className={labelCls}>
								Simular recebimento
							</label>
							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold pointer-events-none">
									R$
								</span>
								<input
									id="dep-valor"
									inputMode="numeric"
									value={valor}
									onChange={(e) => {
										setValor(maskMoney(e.target.value));
										if (error) setError("");
									}}
									placeholder="0,00"
									aria-invalid={!!error}
									className={cx(
										field(!!error),
										"pl-12 font-mono text-lg tabular-nums",
									)}
								/>
							</div>
							{error && <p className={errText}>{error}</p>}
						</div>

						<button type="submit" className={cx(btnPrimary, "w-full")}>
							<ArrowDownLeft size={17} /> Confirmar depósito
						</button>
					</form>
				</>
			)}
		</Modal>
	);
}
