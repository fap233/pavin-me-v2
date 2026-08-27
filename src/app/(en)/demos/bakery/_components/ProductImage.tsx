"use client";

import { useState } from "react";

/**
 * Foto de produto com degradê de fallback.
 *
 * As imagens vêm do Unsplash (a demo é estática, sem CDN próprio). Se uma delas
 * cair, o card não fica com o ícone de imagem quebrada: mostra um monograma
 * serifado sobre o creme da marca, que continua parecendo parte do design.
 */
export function ProductImage({
	src,
	alt,
	className = "",
	zoom = true,
}: {
	src: string;
	alt: string;
	className?: string;
	zoom?: boolean;
}) {
	const [failed, setFailed] = useState(false);

	if (failed) {
		return (
			<div
				role="img"
				aria-label={alt}
				className={`flex items-center justify-center bg-gradient-to-br from-stone-200 via-[#EFE6DE] to-stone-300 text-stone-400 ${className}`}
			>
				<span className="font-serif text-5xl select-none">
					{alt.trim().charAt(0).toUpperCase()}
				</span>
			</div>
		);
	}

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			loading="lazy"
			onError={() => setFailed(true)}
			className={`object-cover ${
				zoom
					? "group-hover:scale-110 transition-transform duration-500"
					: ""
			} ${className}`}
		/>
	);
}
