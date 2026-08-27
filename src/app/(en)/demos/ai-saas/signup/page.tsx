"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { BASE } from "../_components/site";

const PLANS = [
	{ id: "starter", name: "Starter", price: "$29/mo" },
	{ id: "pro", name: "Pro", price: "$99/mo" },
	{ id: "enterprise", name: "Enterprise", price: "Custom" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const FREE_MAIL = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

type Errors = { email?: string; password?: string; company?: string };

function validate(values: {
	email: string;
	password: string;
	company: string;
}): Errors {
	const errors: Errors = {};

	const email = values.email.trim();
	if (!email) errors.email = "Work email is required.";
	else if (!EMAIL_RE.test(email)) errors.email = "That does not look like a valid email.";
	else if (FREE_MAIL.includes(email.split("@")[1]?.toLowerCase()))
		errors.email = "Use your work email — free inboxes cannot open a workspace.";

	if (!values.password) errors.password = "Password is required.";
	else if (values.password.length < 8)
		errors.password = "At least 8 characters.";
	else if (!/[0-9]/.test(values.password))
		errors.password = "Add at least one number.";

	if (!values.company.trim()) errors.company = "Company is required.";
	else if (values.company.trim().length < 2)
		errors.company = "That is a bit short for a company name.";

	return errors;
}

function strengthOf(password: string) {
	let score = 0;
	if (password.length >= 8) score++;
	if (password.length >= 12) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;
	return score; // 0..4
}

const STRENGTH_LABEL = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "") || "workspace";

export default function SignupPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [company, setCompany] = useState("");
	const [plan, setPlan] = useState("pro");
	const [showPass, setShowPass] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});
	const [state, setState] = useState<"idle" | "submitting" | "done">("idle");

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// não deixa o setTimeout do "provisionamento" cair depois do unmount
	useEffect(
		() => () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		},
		[],
	);

	const strength = strengthOf(password);

	function blur(field: string) {
		setTouched((t) => ({ ...t, [field]: true }));
		setErrors(validate({ email, password, company }));
	}

	function submit(e: React.FormEvent) {
		e.preventDefault();
		const found = validate({ email, password, company });
		setErrors(found);
		setTouched({ email: true, password: true, company: true });
		if (Object.keys(found).length > 0) return;

		setState("submitting");
		timeoutRef.current = setTimeout(() => setState("done"), 1100);
	}

	const errorFor = (field: keyof Errors) =>
		touched[field] ? errors[field] : undefined;

	const fieldClass = (field: keyof Errors) =>
		`w-full bg-white/5 border rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-purple-500/60 ${
			errorFor(field) ? "border-pink-500/60" : "border-white/10"
		}`;

	if (state === "done") {
		return (
			<section className="pt-32 pb-24 px-6 relative overflow-hidden min-h-screen">
				<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

				<div className="max-w-lg mx-auto text-center">
					<div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center mx-auto mb-6">
						<Check size={28} className="text-purple-400" />
					</div>

					<h1 className="text-4xl font-bold tracking-tight mb-4">
						Your workspace is{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							live
						</span>
					</h1>
					<p className="text-slate-400 mb-8">
						We sent a confirmation link to{" "}
						<span className="text-white">{email}</span>. Your 14-day{" "}
						{PLANS.find((p) => p.id === plan)?.name} trial started just now — no
						card charged.
					</p>

					<div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-left mb-8">
						<p className="text-xs font-mono text-slate-500 mb-2">
							WORKSPACE PROVISIONED
						</p>
						<pre className="font-mono text-[13px] leading-relaxed text-slate-300 whitespace-pre-wrap break-words">
							{`workspace : ${slugify(company)}\nregion    : us-east-1\nplan      : ${plan}\napi_key   : sk_live_${slugify(company).slice(0, 6)}••••••••••••\ncredits   : 5,000 tokens`}
						</pre>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							href={`${BASE}/playground`}
							className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group"
						>
							Open the playground
							<ChevronRight
								size={16}
								className="group-hover:translate-x-1 transition-transform"
							/>
						</Link>
						<Link
							href={`${BASE}/docs/quickstart`}
							className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
						>
							Read the quickstart
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="pt-32 pb-24 px-6 relative overflow-hidden">
			<div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -z-10" />

			<div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
				{/* Pitch */}
				<div>
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-300 mb-6">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						Early access · 412 teams on the waitlist
					</div>

					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
						Start your{" "}
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
							free trial
						</span>
					</h1>
					<p className="text-slate-400 mb-8 leading-relaxed">
						14 days of full Pro access, 5,000 tokens on the house, and no credit
						card. Cancel with one click and keep whatever you built.
					</p>

					<ul className="space-y-4">
						{[
							"Workspace provisioned in under 10 seconds",
							"Every model unlocked during the trial",
							"We never train on your prompts or completions",
						].map((item) => (
							<li key={item} className="flex items-center gap-3 text-slate-300">
								<Check size={20} className="text-purple-500 shrink-0" />
								{item}
							</li>
						))}
					</ul>
				</div>

				{/* Form */}
				<form
					onSubmit={submit}
					noValidate
					className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10"
				>
					<div className="space-y-5">
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium mb-2 text-slate-300"
							>
								Work email
							</label>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onBlur={() => blur("email")}
								placeholder="you@company.com"
								aria-invalid={!!errorFor("email")}
								className={fieldClass("email")}
							/>
							{errorFor("email") && (
								<p className="mt-2 text-xs text-pink-400">{errorFor("email")}</p>
							)}
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2 text-slate-300"
							>
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPass ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onBlur={() => blur("password")}
									placeholder="At least 8 characters and a number"
									aria-invalid={!!errorFor("password")}
									className={`${fieldClass("password")} pr-11`}
								/>
								<button
									type="button"
									onClick={() => setShowPass((v) => !v)}
									aria-label={showPass ? "Hide password" : "Show password"}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
								>
									{showPass ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>

							{password && (
								<div className="mt-2">
									<div className="flex gap-1">
										{[0, 1, 2, 3].map((i) => (
											<span
												key={i}
												className={`h-1 flex-1 rounded-full transition-colors ${
													i < strength
														? strength <= 1
															? "bg-pink-500"
															: strength === 2
																? "bg-purple-500/60"
																: "bg-gradient-to-r from-purple-500 to-pink-500"
														: "bg-white/10"
												}`}
											/>
										))}
									</div>
									<p className="mt-1.5 text-xs text-slate-500 font-mono">
										{STRENGTH_LABEL[strength]}
									</p>
								</div>
							)}

							{errorFor("password") && (
								<p className="mt-2 text-xs text-pink-400">
									{errorFor("password")}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor="company"
								className="block text-sm font-medium mb-2 text-slate-300"
							>
								Company
							</label>
							<input
								id="company"
								type="text"
								value={company}
								onChange={(e) => setCompany(e.target.value)}
								onBlur={() => blur("company")}
								placeholder="Orbital Systems"
								aria-invalid={!!errorFor("company")}
								className={fieldClass("company")}
							/>
							{errorFor("company") ? (
								<p className="mt-2 text-xs text-pink-400">
									{errorFor("company")}
								</p>
							) : (
								company.trim() && (
									<p className="mt-2 text-xs text-slate-500 font-mono">
										WORKSPACE: {slugify(company)}
									</p>
								)
							)}
						</div>

						<div>
							<span className="block text-sm font-medium mb-2 text-slate-300">
								Plan
							</span>
							<div className="grid grid-cols-3 gap-2">
								{PLANS.map((p) => (
									<button
										key={p.id}
										type="button"
										onClick={() => setPlan(p.id)}
										aria-pressed={plan === p.id}
										className={`p-3 rounded-xl border text-left transition-colors ${
											plan === p.id
												? "bg-purple-600/15 border-purple-500/40"
												: "bg-slate-900/50 border-white/5 hover:border-purple-500/30"
										}`}
									>
										<span className="block text-sm font-medium">{p.name}</span>
										<span className="block text-[11px] font-mono text-slate-500">
											{p.price}
										</span>
									</button>
								))}
							</div>
							<p className="mt-2 text-xs text-slate-500">
								Not sure?{" "}
								<Link
									href={`${BASE}/pricing`}
									className="text-purple-400 hover:text-purple-300 transition-colors"
								>
									Compare the plans
								</Link>
								.
							</p>
						</div>

						<button
							type="submit"
							disabled={state === "submitting"}
							className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-wait"
						>
							{state === "submitting" ? (
								<>
									<Loader2 size={16} className="animate-spin" />
									Provisioning workspace…
								</>
							) : (
								<>
									Create workspace
									<ChevronRight
										size={16}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</>
							)}
						</button>

						<p className="text-xs text-slate-500 text-center leading-relaxed">
							No credit card required. By creating a workspace you agree to the
							Nexus terms — this is a UI demo, so nothing is actually sent
							anywhere.
						</p>
					</div>
				</form>
			</div>
		</section>
	);
}
