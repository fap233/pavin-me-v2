"use client";

// "Vamos conversar" — o formulário que converte visitante em pedido de projeto.
// O submit NÃO fala com o Supabase direto: vai pro Route Handler /api/contato,
// que valida o token do Turnstile com a SECRET (server-side) e só então insere
// o lead em contact_requests. A SECRET nunca chega ao browser.

import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Turnstile, type TurnstileHandle } from "@/components/Turnstile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Status = "idle" | "sending" | "success" | "error";

export function LeadFormSection() {
	const { t } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.12);

	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [tipo, setTipo] = useState("");
	const [mensagem, setMensagem] = useState("");
	const [token, setToken] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [errorMsg, setErrorMsg] = useState("");
	const turnstileRef = useRef<TurnstileHandle>(null);

	function resetForm() {
		setNome("");
		setEmail("");
		setTipo("");
		setMensagem("");
		setToken("");
		turnstileRef.current?.reset();
	}

	async function submit(e: React.FormEvent) {
		e.preventDefault();
		setErrorMsg("");

		if (
			!nome.trim() ||
			!EMAIL_RE.test(email.trim()) ||
			!mensagem.trim()
		) {
			setStatus("error");
			setErrorMsg(t.leadForm.errorFields);
			return;
		}
		if (!token) {
			setStatus("error");
			setErrorMsg(t.leadForm.errorCaptcha);
			return;
		}

		setStatus("sending");
		try {
			const res = await fetch("/api/contato", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					nome: nome.trim(),
					email: email.trim(),
					tipo: tipo || null,
					mensagem: mensagem.trim(),
					token,
				}),
			});
			if (!res.ok) {
				// Token é de uso único: gaste-o e peça outro pra a próxima tentativa.
				setToken("");
				turnstileRef.current?.reset();
				const body = (await res.json().catch(() => null)) as {
					error?: string;
				} | null;
				setStatus("error");
				setErrorMsg(body?.error || t.leadForm.errorGeneric);
				return;
			}
			setStatus("success");
			resetForm();
		} catch {
			setToken("");
			turnstileRef.current?.reset();
			setStatus("error");
			setErrorMsg(t.leadForm.errorGeneric);
		}
	}

	const busy = status === "sending";

	const inputCls =
		"w-full rounded-lg border border-border/70 bg-background/60 px-3.5 py-2.5 text-sm outline-none backdrop-blur transition focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25";
	const labelCls =
		"font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground";

	return (
		<section
			id="vamos-conversar"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 md:py-28 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
				<div className="in-view-anim in-view-anim-1 mx-auto max-w-xl text-center">
					<p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
						{t.leadForm.kicker}
					</p>
					<h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
						{t.leadForm.title}
					</h2>
					<p className="mt-4 text-muted-foreground">{t.leadForm.subtitle}</p>
				</div>

				<div className="in-view-anim in-view-anim-2 relative isolate mt-10 overflow-hidden rounded-2xl border bg-card/70 p-6 shadow-[0_30px_80px_-32px_rgb(0_0_0/0.55)] backdrop-blur-xl sm:p-8">
					<span
						aria-hidden="true"
						className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
					/>

					{status === "success" ? (
						<div className="flex flex-col items-center gap-4 py-8 text-center">
							<CheckCircle2 className="h-12 w-12 text-emerald-500" />
							<div className="space-y-1.5">
								<p className="text-xl font-bold">{t.leadForm.successTitle}</p>
								<p className="max-w-sm text-sm text-muted-foreground">
									{t.leadForm.successBody}
								</p>
							</div>
							<button
								type="button"
								onClick={() => setStatus("idle")}
								className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
							>
								{t.leadForm.sendAnother}
							</button>
						</div>
					) : (
						<form onSubmit={submit} className="space-y-4" noValidate>
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block space-y-1.5">
									<span className={labelCls}>{t.leadForm.nameLabel}</span>
									<input
										type="text"
										value={nome}
										onChange={(e) => setNome(e.target.value)}
										placeholder={t.leadForm.namePlaceholder}
										autoComplete="name"
										className={inputCls}
									/>
								</label>
								<label className="block space-y-1.5">
									<span className={labelCls}>{t.leadForm.emailLabel}</span>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder={t.leadForm.emailPlaceholder}
										autoComplete="email"
										className={inputCls}
									/>
								</label>
							</div>

							<label className="block space-y-1.5">
								<span className={labelCls}>{t.leadForm.typeLabel}</span>
								<select
									value={tipo}
									onChange={(e) => setTipo(e.target.value)}
									className={inputCls}
								>
									<option value="">{t.leadForm.typePlaceholder}</option>
									{t.leadForm.typeOptions.map((opt) => (
										<option key={opt} value={opt}>
											{opt}
										</option>
									))}
								</select>
							</label>

							<label className="block space-y-1.5">
								<span className={labelCls}>{t.leadForm.messageLabel}</span>
								<textarea
									value={mensagem}
									onChange={(e) => setMensagem(e.target.value)}
									placeholder={t.leadForm.messagePlaceholder}
									rows={4}
									className={`${inputCls} resize-none`}
								/>
							</label>

							<Turnstile
								ref={turnstileRef}
								onVerify={setToken}
								className="min-h-[70px]"
							/>

							<button
								type="submit"
								disabled={busy}
								className="hero-btn hero-btn-fill w-full disabled:pointer-events-none disabled:opacity-60"
							>
								<span className="relative z-10 inline-flex items-center gap-2 text-sm font-semibold">
									{busy ? t.leadForm.sending : t.leadForm.submit}
									{!busy && <ArrowRight className="hero-btn-arrow h-4 w-4" />}
								</span>
							</button>

							{status === "error" && errorMsg && (
								<p
									role="alert"
									className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
								>
									{errorMsg}
								</p>
							)}
						</form>
					)}
				</div>
			</div>
		</section>
	);
}
