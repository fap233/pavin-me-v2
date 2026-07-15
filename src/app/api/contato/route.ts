// Route Handler do formulário "Vamos conversar".
//
// Fluxo: o browser manda { nome, email, tipo, mensagem, token }. Aqui (server)
//   (1) validamos o token do Turnstile com a SECRET chamando o siteverify da
//       Cloudflare — a SECRET nunca vai pro browser;
//   (2) só então inserimos o lead em contact_requests, com a ANON key (a
//       service_role NUNCA encosta no site). A RLS da migração
//       2026-07-14c-homepage.sql libera INSERT pro anon nas 4 colunas.
//
// Um watcher do Monitor faz polling de contact_requests(where not seen) e apita
// no Telegram — este handler não fala com o Monitor (a home pública não alcança
// localhost).

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Secret de TESTE da Cloudflare (sempre passa) — fallback SÓ de DEV (NODE_ENV
// !== 'production'), pra o fluxo rodar ponta a ponta localmente. Em produção
// NUNCA caímos nela: se TURNSTILE_SECRET_KEY faltar, o endpoint recusa (fail-
// closed) — senão a verificação server-side viraria um no-op MUDO. O Fellipe
// preenche TURNSTILE_SECRET_KEY no Vercel.
const CLOUDFLARE_TEST_SECRET = "1x0000000000000000000000000000000AA";

const SITEVERIFY_URL =
	"https://challenges.cloudflare.com/turnstile/v0/siteverify";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Body = {
	nome?: unknown;
	email?: unknown;
	tipo?: unknown;
	mensagem?: unknown;
	token?: unknown;
};

function str(v: unknown): string {
	return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
	let body: Body;
	try {
		body = (await req.json()) as Body;
	} catch {
		return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
	}

	const nome = str(body.nome);
	const email = str(body.email);
	const mensagem = str(body.mensagem);
	const tipoRaw = str(body.tipo);
	const tipo = tipoRaw ? tipoRaw.slice(0, 120) : null;
	const token = str(body.token);

	// Validação server-side (não confia no client) — espelha o with-check da RLS.
	if (
		nome.length < 1 ||
		nome.length > 200 ||
		!EMAIL_RE.test(email) ||
		email.length > 320 ||
		mensagem.length < 1 ||
		mensagem.length > 5000
	) {
		return NextResponse.json(
			{ error: "Preencha o nome, um e-mail válido e a mensagem." },
			{ status: 400 },
		);
	}

	if (!token) {
		return NextResponse.json(
			{ error: "Conclua a verificação de segurança antes de enviar." },
			{ status: 400 },
		);
	}

	// --- 1. Verifica o Turnstile com a SECRET (server-side) -------------------
	// FAIL-CLOSED: em produção NUNCA caímos na test key (que aprova QUALQUER
	// token). Sem a env real, o check server-side viraria um no-op silencioso — e,
	// ao contrário do widget (que mostra "modo de teste" quando falta a SITE KEY),
	// aqui não haveria nenhum sinal visível. Env ausente em prod = recusa + log.
	const secret =
		process.env.TURNSTILE_SECRET_KEY ||
		(process.env.NODE_ENV === "production" ? "" : CLOUDFLARE_TEST_SECRET);
	if (!secret) {
		console.error(
			"[contato] TURNSTILE_SECRET_KEY ausente em produção — recusando o envio " +
				"(fail-closed). Configure a env no Vercel.",
		);
		return NextResponse.json(
			{
				error:
					"A verificação de segurança está indisponível no momento. Tente mais tarde.",
			},
			{ status: 500 },
		);
	}
	const ip =
		req.headers.get("cf-connecting-ip") ||
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		"";

	try {
		const form = new URLSearchParams();
		form.append("secret", secret);
		form.append("response", token);
		if (ip) form.append("remoteip", ip);

		const verifyRes = await fetch(SITEVERIFY_URL, {
			method: "POST",
			body: form,
		});
		const outcome = (await verifyRes.json()) as { success?: boolean };
		if (!outcome.success) {
			return NextResponse.json(
				{ error: "A verificação de segurança falhou. Tente de novo." },
				{ status: 400 },
			);
		}
	} catch {
		return NextResponse.json(
			{ error: "Não consegui validar a verificação agora. Tente de novo." },
			{ status: 502 },
		);
	}

	// --- 2. Insere o lead com a ANON key (nunca a service_role no site) -------
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anon) {
		return NextResponse.json(
			{ error: "O formulário está sem configuração de servidor." },
			{ status: 500 },
		);
	}

	const supabase = createClient(url, anon, {
		auth: { persistSession: false, autoRefreshToken: false },
	});

	const { error } = await supabase
		.from("contact_requests")
		.insert({ nome, email, tipo, mensagem });

	if (error) {
		return NextResponse.json(
			{ error: "Não consegui registrar seu pedido agora. Tente de novo." },
			{ status: 500 },
		);
	}

	return NextResponse.json({ ok: true });
}
