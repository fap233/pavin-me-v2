"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	ArrowLeft,
	ArrowUpRight,
	Check,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	ShieldCheck,
	Wand2,
} from "lucide-react";
import {
	FT,
	btnPrimary,
	cx,
	errText,
	field,
	isValidEmail,
	label as labelCls,
	pill,
} from "../_components/lumina";

type Mode = "login" | "recuperar" | "enviado";

export default function LoginPage() {
	const router = useRouter();

	const [mode, setMode] = useState<Mode>("login");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

	function submitLogin(e: React.FormEvent) {
		e.preventDefault();

		const next: { email?: string; senha?: string } = {};
		if (!isValidEmail(email)) next.email = "Informe um e-mail válido.";
		if (senha.length < 6) next.senha = "A senha precisa ter ao menos 6 caracteres.";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		// Demo: qualquer credencial entra. O delay é só pra dar peso ao clique.
		setLoading(true);
		window.setTimeout(() => router.push(`${FT}/app`), 700);
	}

	function submitRecover(e: React.FormEvent) {
		e.preventDefault();
		if (!isValidEmail(email)) {
			setErrors({ email: "Informe um e-mail válido." });
			return;
		}
		setErrors({});
		setMode("enviado");
	}

	function fillDemo() {
		setEmail("camila.ribeiro@email.com");
		setSenha("lumina2026");
		setErrors({});
	}

	return (
		<section className="pt-32 pb-24 px-6">
			<div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
				{/* Lado esquerdo — reforço de marca */}
				<div className="hidden lg:block space-y-8">
					<div className={pill}>
						<ShieldCheck size={13} />
						CONEXÃO SEGURA
					</div>
					<h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-slate-900">
						Bom te ver <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
							de novo.
						</span>
					</h1>
					<p className="text-lg text-slate-500 max-w-sm leading-relaxed">
						Seu dinheiro, seu extrato e seus cartões — tudo do jeito que você
						deixou.
					</p>

					<div className="space-y-4 pt-4">
						{[
							"Criptografia de ponta a ponta",
							"Biometria e aprovação por push",
							"Seu saldo rendendo 110% do CDI",
						].map((item) => (
							<div key={item} className="flex items-center gap-3 text-slate-600">
								<span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
									<Check size={13} strokeWidth={3} />
								</span>
								<span className="text-sm font-medium">{item}</span>
							</div>
						))}
					</div>
				</div>

				{/* Card do formulário */}
				<div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 sm:p-10 w-full">
					{mode === "login" && (
						<form onSubmit={submitLogin} noValidate className="lumina-fade-up">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-2xl font-bold text-slate-900">Entrar</h2>
									<p className="text-sm text-slate-500 mt-1">
										Acesse sua conta Lumina.
									</p>
								</div>
								<button
									type="button"
									onClick={fillDemo}
									className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-2 rounded-xl transition-colors"
								>
									<Wand2 size={13} /> Usar demo
								</button>
							</div>

							<div className="mt-8 space-y-5">
								<div>
									<label htmlFor="email" className={labelCls}>
										E-mail
									</label>
									<input
										id="email"
										type="email"
										autoComplete="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (errors.email)
												setErrors((x) => ({ ...x, email: undefined }));
										}}
										placeholder="voce@email.com"
										aria-invalid={!!errors.email}
										className={field(!!errors.email)}
									/>
									{errors.email && <p className={errText}>{errors.email}</p>}
								</div>

								<div>
									<label htmlFor="senha" className={labelCls}>
										Senha
									</label>
									<div className="relative">
										<input
											id="senha"
											type={show ? "text" : "password"}
											autoComplete="current-password"
											value={senha}
											onChange={(e) => {
												setSenha(e.target.value);
												if (errors.senha)
													setErrors((x) => ({ ...x, senha: undefined }));
											}}
											placeholder="••••••••"
											aria-invalid={!!errors.senha}
											className={cx(field(!!errors.senha), "pr-12")}
										/>
										<button
											type="button"
											onClick={() => setShow((v) => !v)}
											aria-label={show ? "Ocultar senha" : "Mostrar senha"}
											className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
										>
											{show ? <EyeOff size={17} /> : <Eye size={17} />}
										</button>
									</div>
									{errors.senha && <p className={errText}>{errors.senha}</p>}
								</div>

								<div className="flex justify-end">
									<button
										type="button"
										onClick={() => {
											setMode("recuperar");
											setErrors({});
										}}
										className="text-sm font-semibold text-blue-600 hover:text-blue-700"
									>
										Esqueci minha senha
									</button>
								</div>

								<button
									type="submit"
									disabled={loading}
									className={cx(btnPrimary, "w-full")}
								>
									{loading ? (
										<>
											<Loader2 size={18} className="animate-spin" />
											Entrando…
										</>
									) : (
										<>
											Entrar <ArrowUpRight size={18} />
										</>
									)}
								</button>

								<p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
									<Lock size={12} />
									Demo: qualquer e-mail e senha válidos entram.
								</p>
							</div>

							<div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
								Ainda não tem conta?{" "}
								<Link
									href={`${FT}/abrir-conta`}
									className="font-semibold text-blue-600 hover:text-blue-700"
								>
									Abrir conta grátis
								</Link>
							</div>
						</form>
					)}

					{mode === "recuperar" && (
						<form onSubmit={submitRecover} noValidate className="lumina-fade-up">
							<h2 className="text-2xl font-bold text-slate-900">
								Recuperar senha
							</h2>
							<p className="text-sm text-slate-500 mt-1">
								Enviamos um link de redefinição pro seu e-mail.
							</p>

							<div className="mt-8 space-y-5">
								<div>
									<label htmlFor="email-rec" className={labelCls}>
										E-mail da conta
									</label>
									<input
										id="email-rec"
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											if (errors.email)
												setErrors((x) => ({ ...x, email: undefined }));
										}}
										placeholder="voce@email.com"
										aria-invalid={!!errors.email}
										className={field(!!errors.email)}
									/>
									{errors.email && <p className={errText}>{errors.email}</p>}
								</div>

								<button type="submit" className={cx(btnPrimary, "w-full")}>
									Enviar link <ArrowUpRight size={18} />
								</button>

								<button
									type="button"
									onClick={() => {
										setMode("login");
										setErrors({});
									}}
									className="w-full inline-flex items-center justify-center gap-2 text-slate-600 font-semibold hover:text-slate-900 transition-colors"
								>
									<ArrowLeft size={16} /> Voltar ao login
								</button>
							</div>
						</form>
					)}

					{mode === "enviado" && (
						<div className="lumina-fade-up text-center py-4">
							<div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
								<Check size={28} strokeWidth={3} />
							</div>
							<h2 className="mt-6 text-2xl font-bold text-slate-900">
								Link enviado
							</h2>
							<p className="mt-2 text-slate-500 text-sm max-w-xs mx-auto">
								Se <span className="font-semibold text-slate-700">{email}</span>{" "}
								tiver uma conta Lumina, o link de redefinição chega em instantes.
							</p>
							<button
								type="button"
								onClick={() => setMode("login")}
								className={cx(btnPrimary, "mt-8 w-full")}
							>
								<ArrowLeft size={17} /> Voltar ao login
							</button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
