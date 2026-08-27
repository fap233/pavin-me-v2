import React from "react";

/**
 * Injeta um bloco JSON-LD (schema.org). Aceita um objeto ou uma lista de
 * objetos (vira um @graph). Escapa "<" pra não fechar a tag <script> por
 * acidente com texto do usuário.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
	const payload = Array.isArray(data)
		? { "@context": "https://schema.org", "@graph": data }
		: { "@context": "https://schema.org", ...data };
	const json = JSON.stringify(payload).replace(/</g, "\\u003c");
	return (
		<script
			type="application/ld+json"
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}

export const SITE_URL = "https://pavin.me";

/** Identidade estável do Fellipe pra referência cruzada entre páginas (@id). */
export const PERSON_ID = `${SITE_URL}/#fellipe`;
export const BUSINESS_ID = `${SITE_URL}/#negocio`;
