/**
 * Peças visuais compartilhadas da demo IRON FORGE.
 *
 * O identidade da demo é brutalista: preto/neutral-950, amarelo-500, tudo em
 * `font-black italic uppercase` e botões cortados no `-skew-x-12` (com o texto
 * desenviesado de volta num span interno). Concentrar isso aqui evita que cada
 * página reinvente o botão e o header — e mantém as 7 rotas parecendo desenhadas
 * pela mesma pessoa, no mesmo dia.
 */
import Link from "next/link";
import type { ReactNode } from "react";

type SkewVariant = "solid" | "outline" | "ghost";

const SKEW_BASE =
	"inline-block font-black uppercase italic tracking-wider -skew-x-12 transition-all disabled:opacity-40 disabled:cursor-not-allowed";

const SKEW_VARIANTS: Record<SkewVariant, string> = {
	solid: "bg-yellow-500 text-black hover:bg-white",
	outline:
		"border-2 border-white text-white hover:bg-white hover:text-black",
	ghost:
		"border-2 border-neutral-700 text-neutral-400 hover:border-white hover:text-white",
};

const SKEW_SIZES = {
	sm: "px-6 py-2 text-sm",
	md: "px-8 py-3 text-base",
	lg: "px-10 py-4 text-xl",
} as const;

type SkewSize = keyof typeof SKEW_SIZES;

function skewClass(variant: SkewVariant, size: SkewSize, className?: string) {
	return [
		SKEW_BASE,
		SKEW_VARIANTS[variant],
		SKEW_SIZES[size],
		className ?? "",
	].join(" ");
}

export function SkewLink({
	href,
	children,
	variant = "solid",
	size = "md",
	className,
}: {
	href: string;
	children: ReactNode;
	variant?: SkewVariant;
	size?: SkewSize;
	className?: string;
}) {
	return (
		<Link href={href} className={`${skewClass(variant, size, className)} group`}>
			<span className="skew-x-12 flex items-center justify-center gap-2">
				{children}
			</span>
		</Link>
	);
}

export function SkewButton({
	children,
	variant = "solid",
	size = "md",
	className,
	type = "button",
	onClick,
	disabled,
}: {
	children: ReactNode;
	variant?: SkewVariant;
	size?: SkewSize;
	className?: string;
	type?: "button" | "submit";
	onClick?: () => void;
	disabled?: boolean;
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${skewClass(variant, size, className)} group`}
		>
			<span className="skew-x-12 flex items-center justify-center gap-2">
				{children}
			</span>
		</button>
	);
}

/** Título de seção + a barrinha amarela enviesada que a home já usava. */
export function SectionHeading({
	title,
	subtitle,
	align = "center",
}: {
	title: ReactNode;
	subtitle?: ReactNode;
	align?: "center" | "left";
}) {
	const isCenter = align === "center";
	return (
		<div className={`mb-16 ${isCenter ? "text-center" : "text-left"}`}>
			<h2 className="text-4xl md:text-5xl font-black italic uppercase text-white mb-4 tracking-tighter">
				{title}
			</h2>
			<div
				className={`w-24 h-2 bg-yellow-500 -skew-x-12 ${isCenter ? "mx-auto" : ""}`}
			/>
			{subtitle ? (
				<p
					className={`mt-6 text-neutral-400 font-medium max-w-2xl ${
						isCenter ? "mx-auto" : ""
					}`}
				>
					{subtitle}
				</p>
			) : null}
		</div>
	);
}

/**
 * Topo das páginas internas. Compensa a navbar fixa (h-20) com pt-32 e repete
 * a foto em grayscale + overlay do hero da home, só que mais baixa.
 */
export function PageHero({
	eyebrow,
	title,
	description,
	photo,
	children,
}: {
	eyebrow: string;
	title: ReactNode;
	description?: ReactNode;
	photo?: string;
	children?: ReactNode;
}) {
	return (
		<section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 px-6">
			{photo ? (
				<div className="absolute inset-0 z-0">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={photo}
						alt=""
						aria-hidden="true"
						className="w-full h-full object-cover opacity-25 grayscale"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
				</div>
			) : null}
			<div className="relative z-10 max-w-7xl mx-auto">
				<div className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs mb-4">
					{eyebrow}
				</div>
				<h1 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter mb-6">
					{title}
				</h1>
				{description ? (
					<p className="text-lg text-neutral-300 max-w-2xl font-medium">
						{description}
					</p>
				) : null}
				{children}
			</div>
		</section>
	);
}

/** Barrinhas de intensidade (1–5) no idioma da casa: quadrado, sem raio. */
export function IntensityBar({ value }: { value: number }) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((i) => (
				<div
					key={i}
					className={`h-3 w-6 -skew-x-12 ${
						i <= value ? "bg-yellow-500" : "bg-neutral-700"
					}`}
				/>
			))}
		</div>
	);
}
