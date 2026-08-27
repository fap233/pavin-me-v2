"use client";

import { Lock, Wallet } from "lucide-react";
import { cx, variantById, type CardVariantId } from "./lumina";

type Props = {
	variant: CardVariantId;
	holder: string;
	last4: string;
	cvv: string;
	exp: string;
	flipped?: boolean;
	blocked?: boolean;
	/** Vira o cartão ao clicar (usado no /cartoes). */
	onFlip?: () => void;
	className?: string;
};

/**
 * Cartão 3D da Lumina — mesma linguagem visual do mockup da home
 * (gradiente slate-900, dígitos em font-mono, cantos rounded-3xl),
 * agora com verso (CVV), variantes de cor e estado bloqueado.
 */
export default function CreditCard({
	variant,
	holder,
	last4,
	cvv,
	exp,
	flipped = false,
	blocked = false,
	onFlip,
	className,
}: Props) {
	const v = variantById(variant);
	const interactive = typeof onFlip === "function";

	const face = cx(
		"lumina-face absolute inset-0 rounded-3xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden",
		v.face,
		v.text,
	);

	return (
		<div className={cx("lumina-scene", className)}>
			<div
				className={cx(
					"lumina-card3d w-full h-full",
					flipped && "is-flipped",
					interactive && "cursor-pointer",
					blocked && "opacity-60 saturate-50",
				)}
				onClick={onFlip}
				onKeyDown={
					interactive
						? (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onFlip?.();
								}
							}
						: undefined
				}
				role={interactive ? "button" : undefined}
				tabIndex={interactive ? 0 : undefined}
				aria-label={
					interactive
						? flipped
							? "Ver frente do cartão"
							: "Ver verso do cartão"
						: undefined
				}
			>
				{/* Frente */}
				<div className={face}>
					<div className="flex justify-between items-start">
						<Wallet className="opacity-80" />
						<span className="font-mono text-lg tracking-widest opacity-50">
							LUMINA
						</span>
					</div>

					<div>
						<div className="font-mono text-xl tracking-widest mb-4 opacity-90">
							**** **** **** {last4}
						</div>
						<div className="flex justify-between items-end opacity-80">
							<div>
								<div className="text-[10px] uppercase tracking-wider mb-1">
									Titular
								</div>
								<div className="font-medium truncate max-w-[10rem]">
									{holder.toUpperCase()}
								</div>
							</div>
							<div
								className={cx(
									"w-10 h-6 rounded flex items-center justify-center",
									v.chip,
								)}
							>
								<div className="w-4 h-4 rounded-full bg-red-500 opacity-80 -mr-2" />
								<div className="w-4 h-4 rounded-full bg-yellow-500 opacity-80" />
							</div>
						</div>
					</div>

					{/* Reflexo de vidro */}
					<div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-3xl pointer-events-none" />

					{blocked && (
						<div className="absolute inset-0 rounded-3xl bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white">
							<Lock size={22} />
							<span className="text-xs font-bold tracking-widest uppercase">
								Cartão bloqueado
							</span>
						</div>
					)}
				</div>

				{/* Verso */}
				<div className={cx(face, "lumina-face-back px-0 py-8")}>
					<div className={cx("h-12 w-full", v.stripe)} />

					<div className="px-8">
						<div className="text-[10px] uppercase tracking-wider mb-2 opacity-70">
							CVV
						</div>
						<div className="flex items-center gap-3">
							<div className="flex-1 h-10 rounded-md bg-white/90 flex items-center justify-end px-3">
								<span className="font-mono text-lg tracking-widest text-slate-900">
									{cvv}
								</span>
							</div>
							<div className="text-right">
								<div className="text-[10px] uppercase tracking-wider opacity-70">
									Validade
								</div>
								<div className="font-mono tracking-widest">{exp}</div>
							</div>
						</div>
					</div>

					<div className="px-8 flex items-end justify-between">
						<p className={cx("text-[10px] leading-tight max-w-[60%]", v.subtext)}>
							Uso sujeito aos termos da conta Lumina. Não compartilhe estes
							dados.
						</p>
						<span className="font-mono text-sm tracking-widest opacity-50">
							LUMINA
						</span>
					</div>

					<div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-3xl pointer-events-none" />
				</div>
			</div>
		</div>
	);
}
