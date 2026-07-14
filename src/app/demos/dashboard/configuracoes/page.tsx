"use client";

import {
	Bell,
	Check,
	CreditCard,
	Loader2,
	Lock,
	RotateCcw,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cx } from "../_lib/cx";
import { brl, dataCurta } from "../_lib/format";

const CHAVE_STORAGE = "adminui:configuracoes";

interface Configuracoes {
	nome: string;
	email: string;
	empresa: string;
	cargo: string;
	bio: string;
	fuso: string;
	idioma: string;
	notifPedidos: boolean;
	notifPagamentos: boolean;
	notifResumo: boolean;
	notifMarketing: boolean;
	frequencia: string;
	doisFatores: boolean;
	alertaLogin: boolean;
	sessaoExpira: string;
	plano: string;
	cnpj: string;
	emailCobranca: string;
}

const PADRAO: Configuracoes = {
	nome: "Fellipe Pavin",
	email: "fellipe@adminui.com.br",
	empresa: "AdminUI Comércio de Equipamentos LTDA",
	cargo: "Admin Master",
	bio: "Responsável pela operação de vendas e pelo atendimento aos clientes corporativos.",
	fuso: "America/Sao_Paulo",
	idioma: "pt-BR",
	notifPedidos: true,
	notifPagamentos: true,
	notifResumo: false,
	notifMarketing: false,
	frequencia: "imediata",
	doisFatores: true,
	alertaLogin: true,
	sessaoExpira: "30",
	plano: "profissional",
	cnpj: "42.318.907/0001-55",
	emailCobranca: "financeiro@adminui.com.br",
};

const ABAS = [
	{ chave: "perfil", rotulo: "Perfil", icone: User },
	{ chave: "notificacoes", rotulo: "Notificações", icone: Bell },
	{ chave: "seguranca", rotulo: "Segurança", icone: Lock },
	{ chave: "faturamento", rotulo: "Faturamento", icone: CreditCard },
] as const;

type ChaveAba = (typeof ABAS)[number]["chave"];

const PLANOS = [
	{ chave: "essencial", nome: "Essencial", preco: 149, itens: "Até 3 usuários" },
	{
		chave: "profissional",
		nome: "Profissional",
		preco: 349,
		itens: "Até 15 usuários + relatórios",
	},
	{
		chave: "enterprise",
		nome: "Enterprise",
		preco: 899,
		itens: "Usuários ilimitados + SLA",
	},
];

const FATURAS = [
	{ id: "FAT-2026-07", data: "2026-07-01", valor: 349, status: "Paga" },
	{ id: "FAT-2026-06", data: "2026-06-01", valor: 349, status: "Paga" },
	{ id: "FAT-2026-05", data: "2026-05-01", valor: 149, status: "Paga" },
];

export default function ConfiguracoesPage() {
	const [aba, setAba] = useState<ChaveAba>("perfil");
	const [config, setConfig] = useState<Configuracoes>(PADRAO);
	const [salvo, setSalvo] = useState<Configuracoes>(PADRAO);
	const [salvando, setSalvando] = useState(false);
	const [confirmacao, setConfirmacao] = useState(false);

	// localStorage só depois da hidratação — no servidor ele não existe
	useEffect(() => {
		try {
			const bruto = window.localStorage.getItem(CHAVE_STORAGE);
			if (bruto) {
				const guardado = { ...PADRAO, ...JSON.parse(bruto) } as Configuracoes;
				setConfig(guardado);
				setSalvo(guardado);
			}
		} catch {
			// storage bloqueado (modo privado): segue com os padrões
		}
	}, []);

	const sujo = JSON.stringify(config) !== JSON.stringify(salvo);

	const alterar = <K extends keyof Configuracoes>(
		campo: K,
		valor: Configuracoes[K],
	) => {
		setConfig((atual) => ({ ...atual, [campo]: valor }));
		setConfirmacao(false);
	};

	const salvar = () => {
		setSalvando(true);
		window.setTimeout(() => {
			try {
				window.localStorage.setItem(CHAVE_STORAGE, JSON.stringify(config));
			} catch {
				// sem storage o estado continua em memória — a demo não quebra
			}
			setSalvo(config);
			setSalvando(false);
			setConfirmacao(true);
			window.setTimeout(() => setConfirmacao(false), 3000);
		}, 600);
	};

	const descartar = () => {
		setConfig(salvo);
		setConfirmacao(false);
	};

	return (
		<>
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
				<p className="text-slate-500">
					Ajuste seu perfil, notificações, segurança e faturamento.
				</p>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
				{/* Abas */}
				<div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-4 pt-4">
					{ABAS.map((item) => (
						<button
							key={item.chave}
							type="button"
							onClick={() => setAba(item.chave)}
							aria-current={aba === item.chave ? "page" : undefined}
							className={cx(
								"flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
								aba === item.chave
									? "border-indigo-600 text-indigo-600"
									: "border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700",
							)}
						>
							<item.icone size={16} />
							{item.rotulo}
						</button>
					))}
				</div>

				<div className="p-6 md:p-8">
					{aba === "perfil" && (
						<div className="max-w-2xl space-y-6">
							<Secao
								titulo="Dados do perfil"
								descricao="Aparecem no rodapé da sidebar e nos relatórios exportados."
							>
								<div className="grid gap-4 sm:grid-cols-2">
									<Campo label="Nome completo">
										<input
											type="text"
											value={config.nome}
											onChange={(e) => alterar("nome", e.target.value)}
											className={entrada}
										/>
									</Campo>
									<Campo label="E-mail">
										<input
											type="email"
											value={config.email}
											onChange={(e) => alterar("email", e.target.value)}
											className={entrada}
										/>
									</Campo>
									<Campo label="Empresa">
										<input
											type="text"
											value={config.empresa}
											onChange={(e) => alterar("empresa", e.target.value)}
											className={entrada}
										/>
									</Campo>
									<Campo label="Cargo">
										<input
											type="text"
											value={config.cargo}
											onChange={(e) => alterar("cargo", e.target.value)}
											className={entrada}
										/>
									</Campo>
								</div>

								<Campo label="Bio">
									<textarea
										rows={3}
										value={config.bio}
										onChange={(e) => alterar("bio", e.target.value)}
										className={cx(entrada, "resize-none")}
									/>
								</Campo>

								<div className="grid gap-4 sm:grid-cols-2">
									<Campo label="Fuso horário">
										<select
											value={config.fuso}
											onChange={(e) => alterar("fuso", e.target.value)}
											className={entrada}
										>
											<option value="America/Sao_Paulo">
												Brasília (GMT-3)
											</option>
											<option value="America/Manaus">Manaus (GMT-4)</option>
											<option value="America/Rio_Branco">
												Rio Branco (GMT-5)
											</option>
											<option value="America/Noronha">Noronha (GMT-2)</option>
										</select>
									</Campo>
									<Campo label="Idioma">
										<select
											value={config.idioma}
											onChange={(e) => alterar("idioma", e.target.value)}
											className={entrada}
										>
											<option value="pt-BR">Português (Brasil)</option>
											<option value="en-US">English (US)</option>
											<option value="es-ES">Español</option>
										</select>
									</Campo>
								</div>
							</Secao>
						</div>
					)}

					{aba === "notificacoes" && (
						<div className="max-w-2xl space-y-6">
							<Secao
								titulo="Alertas por e-mail"
								descricao="Escolha o que chega na sua caixa de entrada."
							>
								<Toggle
									ligado={config.notifPedidos}
									aoMudar={(v) => alterar("notifPedidos", v)}
									titulo="Novos pedidos"
									descricao="Avisar sempre que um pedido for criado"
								/>
								<Toggle
									ligado={config.notifPagamentos}
									aoMudar={(v) => alterar("notifPagamentos", v)}
									titulo="Falhas de pagamento"
									descricao="Alertar quando um pagamento for recusado"
								/>
								<Toggle
									ligado={config.notifResumo}
									aoMudar={(v) => alterar("notifResumo", v)}
									titulo="Resumo semanal"
									descricao="Receber um consolidado toda segunda-feira"
								/>
								<Toggle
									ligado={config.notifMarketing}
									aoMudar={(v) => alterar("notifMarketing", v)}
									titulo="Novidades do produto"
									descricao="Lançamentos e dicas de uso da plataforma"
								/>
							</Secao>

							<Secao
								titulo="Frequência"
								descricao="Com que rapidez os alertas são disparados."
							>
								<Campo label="Envio dos alertas">
									<select
										value={config.frequencia}
										onChange={(e) => alterar("frequencia", e.target.value)}
										className={cx(entrada, "max-w-sm")}
									>
										<option value="imediata">Imediata</option>
										<option value="hora">Agrupada por hora</option>
										<option value="dia">Resumo diário</option>
									</select>
								</Campo>
							</Secao>
						</div>
					)}

					{aba === "seguranca" && (
						<div className="max-w-2xl space-y-6">
							<Secao
								titulo="Acesso da conta"
								descricao="Proteções aplicadas a todos os administradores."
							>
								<Toggle
									ligado={config.doisFatores}
									aoMudar={(v) => alterar("doisFatores", v)}
									titulo="Autenticação em dois fatores"
									descricao="Exigir código do app autenticador no login"
								/>
								<Toggle
									ligado={config.alertaLogin}
									aoMudar={(v) => alterar("alertaLogin", v)}
									titulo="Alerta de novo dispositivo"
									descricao="Avisar por e-mail em login de aparelho desconhecido"
								/>

								<Campo label="Encerrar sessão inativa após">
									<select
										value={config.sessaoExpira}
										onChange={(e) => alterar("sessaoExpira", e.target.value)}
										className={cx(entrada, "max-w-sm")}
									>
										<option value="15">15 minutos</option>
										<option value="30">30 minutos</option>
										<option value="60">1 hora</option>
										<option value="480">8 horas</option>
									</select>
								</Campo>
							</Secao>

							<Secao
								titulo="Alterar senha"
								descricao="A nova senha precisa ter no mínimo 8 caracteres."
							>
								<div className="grid gap-4 sm:grid-cols-2">
									<Campo label="Senha atual">
										<input
											type="password"
											placeholder="••••••••"
											className={entrada}
										/>
									</Campo>
									<Campo label="Nova senha">
										<input
											type="password"
											placeholder="••••••••"
											className={entrada}
										/>
									</Campo>
								</div>
								<p className="text-xs text-slate-400">
									Demonstração: os campos de senha não enviam nada a lugar
									nenhum.
								</p>
							</Secao>
						</div>
					)}

					{aba === "faturamento" && (
						<div className="max-w-3xl space-y-6">
							<Secao
								titulo="Plano"
								descricao="Cobrança mensal, cancelamento a qualquer momento."
							>
								<div className="grid gap-3 sm:grid-cols-3">
									{PLANOS.map((plano) => {
										const ativo = config.plano === plano.chave;
										return (
											<button
												key={plano.chave}
												type="button"
												onClick={() => alterar("plano", plano.chave)}
												aria-pressed={ativo}
												className={cx(
													"rounded-xl border p-4 text-left transition-all",
													ativo
														? "border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500"
														: "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
												)}
											>
												<div className="flex items-center justify-between">
													<span className="font-bold text-slate-800">
														{plano.nome}
													</span>
													{ativo && (
														<span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600">
															<Check
																size={12}
																className="text-white"
																strokeWidth={3}
															/>
														</span>
													)}
												</div>
												<p className="mt-1 text-lg font-bold text-slate-800">
													{brl(plano.preco)}
													<span className="text-xs font-medium text-slate-400">
														/mês
													</span>
												</p>
												<p className="mt-1 text-xs text-slate-500">
													{plano.itens}
												</p>
											</button>
										);
									})}
								</div>
							</Secao>

							<Secao
								titulo="Dados de cobrança"
								descricao="Usados na emissão da nota fiscal."
							>
								<div className="grid gap-4 sm:grid-cols-2">
									<Campo label="CNPJ">
										<input
											type="text"
											value={config.cnpj}
											onChange={(e) => alterar("cnpj", e.target.value)}
											className={entrada}
										/>
									</Campo>
									<Campo label="E-mail de cobrança">
										<input
											type="email"
											value={config.emailCobranca}
											onChange={(e) => alterar("emailCobranca", e.target.value)}
											className={entrada}
										/>
									</Campo>
								</div>
							</Secao>

							<Secao titulo="Faturas" descricao="Últimos três meses.">
								<ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
									{FATURAS.map((fatura) => (
										<li
											key={fatura.id}
											className="flex items-center justify-between gap-4 p-3"
										>
											<div>
												<p className="text-sm font-medium text-slate-800">
													{fatura.id}
												</p>
												<p className="text-xs text-slate-500">
													{dataCurta(fatura.data)}
												</p>
											</div>
											<div className="flex items-center gap-3">
												<span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
													{fatura.status}
												</span>
												<span className="text-sm font-medium text-slate-800">
													{brl(fatura.valor)}
												</span>
											</div>
										</li>
									))}
								</ul>
							</Secao>
						</div>
					)}
				</div>

				{/* Barra de ação: só fica viva quando há mudança de fato */}
				<div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center">
					<p className="text-sm text-slate-500">
						{confirmacao ? (
							<span className="inline-flex items-center gap-1.5 font-medium text-green-600">
								<Check size={16} /> Configurações salvas com sucesso
							</span>
						) : sujo ? (
							<span className="inline-flex items-center gap-1.5 font-medium text-amber-600">
								<span className="h-2 w-2 rounded-full bg-amber-500" />
								Você tem alterações não salvas
							</span>
						) : (
							"Tudo salvo. As preferências ficam guardadas neste navegador."
						)}
					</p>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={descartar}
							disabled={!sujo || salvando}
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<RotateCcw size={14} /> Descartar
						</button>
						<button
							type="button"
							onClick={salvar}
							disabled={!sujo || salvando}
							className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
						>
							{salvando ? (
								<>
									<Loader2 size={14} className="animate-spin" /> Salvando
								</>
							) : (
								"Salvar"
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

const entrada =
	"w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500";

function Secao({
	titulo,
	descricao,
	children,
}: {
	titulo: string;
	descricao: string;
	children: React.ReactNode;
}) {
	return (
		<section className="space-y-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
			<div>
				<h2 className="font-bold text-slate-800">{titulo}</h2>
				<p className="text-sm text-slate-500">{descricao}</p>
			</div>
			{children}
		</section>
	);
}

function Campo({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<label className="block">
			<span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
				{label}
			</span>
			{children}
		</label>
	);
}

function Toggle({
	ligado,
	aoMudar,
	titulo,
	descricao,
}: {
	ligado: boolean;
	aoMudar: (valor: boolean) => void;
	titulo: string;
	descricao: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
			<div className="min-w-0">
				<p className="text-sm font-medium text-slate-800">{titulo}</p>
				<p className="text-xs text-slate-500">{descricao}</p>
			</div>
			<button
				type="button"
				role="switch"
				aria-checked={ligado}
				aria-label={titulo}
				onClick={() => aoMudar(!ligado)}
				className={cx(
					"relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
					ligado ? "bg-indigo-600" : "bg-slate-200",
				)}
			>
				<span
					className={cx(
						"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
						ligado ? "translate-x-[22px]" : "translate-x-[2px]",
					)}
				/>
			</button>
		</div>
	);
}
