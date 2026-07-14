"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { getProperty } from "../_data/properties";
import {
	BTN_SOLIDO,
	CAMPO,
	CAMPO_ERRO,
	Confirmacao,
	Erro,
	EYEBROW,
	LABEL,
	LINK_CTA,
	PageHeader,
	cx,
} from "../_components/ui";

const ASSUNTOS = [
	{ value: "comprar", label: "Comprar um imóvel" },
	{ value: "vender", label: "Vender um imóvel" },
	{ value: "alugar", label: "Locação" },
	{ value: "private-office", label: "Private Office" },
	{ value: "outro", label: "Outro assunto" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Erros = Partial<Record<"nome" | "email" | "telefone" | "mensagem", string>>;

export function ContatoClient() {
	const searchParams = useSearchParams();

	// Os CTAs do site chegam aqui com contexto: /contato?assunto=comprar&imovel=slug
	const assuntoParam = searchParams.get("assunto");
	const assuntoInicial =
		ASSUNTOS.find((a) => a.value === assuntoParam)?.value ?? "comprar";
	const imovel = getProperty(searchParams.get("imovel") ?? "");

	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [telefone, setTelefone] = useState("");
	const [assunto, setAssunto] = useState(assuntoInicial);
	const [mensagem, setMensagem] = useState(
		imovel ? `Tenho interesse no ${imovel.titulo} (${imovel.bairro}).` : "",
	);
	const [erros, setErros] = useState<Erros>({});
	const [enviado, setEnviado] = useState(false);

	function enviar(e: React.FormEvent) {
		e.preventDefault();
		const novos: Erros = {};

		if (nome.trim().length < 3) novos.nome = "Informe seu nome completo";
		if (!EMAIL_RE.test(email.trim())) novos.email = "Informe um e-mail válido";
		if (telefone.replace(/\D/g, "").length < 10)
			novos.telefone = "Informe um telefone com DDD";
		if (mensagem.trim().length < 10)
			novos.mensagem = "Conte um pouco mais (mínimo de 10 caracteres)";

		setErros(novos);
		if (Object.keys(novos).length > 0) return;

		setEnviado(true);
	}

	/** Some com o erro do campo assim que o usuário começa a corrigi-lo. */
	function limpar(campo: keyof Erros) {
		setErros((atual) => {
			if (!atual[campo]) return atual;
			const novo = { ...atual };
			delete novo[campo];
			return novo;
		});
	}

	return (
		<main>
			<PageHeader
				eyebrow="Contato"
				titulo={
					<>
						Uma conversa
						<br />
						reservada.
					</>
				}
				texto="Conte o que procura — ou o que pretende vender. Respondemos em até um dia útil, sempre pela pessoa que vai te acompanhar do início ao fim."
			/>

			<section className="px-8 pb-32 max-w-[1800px] mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-16 lg:gap-32">
				<div>
					{enviado ? (
						<Confirmacao
							titulo="Mensagem recebida."
							acao={
								<Link href="/demos/luxury/colecao" className={LINK_CTA}>
									Voltar à coleção
								</Link>
							}
						>
							Obrigado, {nome.trim().split(" ")[0]}. Um consultor da Aurum
							responde para <span className="text-stone-900">{email.trim()}</span>{" "}
							em até um dia útil.
						</Confirmacao>
					) : (
						<form onSubmit={enviar} noValidate>
							<div className="grid sm:grid-cols-2 gap-8 mb-8">
								<div>
									<label htmlFor="c-nome" className={LABEL}>
										Nome completo
									</label>
									<input
										id="c-nome"
										type="text"
										value={nome}
										onChange={(e) => {
											setNome(e.target.value);
											limpar("nome");
										}}
										placeholder="Seu nome"
										className={erros.nome ? CAMPO_ERRO : CAMPO}
									/>
									<Erro>{erros.nome}</Erro>
								</div>

								<div>
									<label htmlFor="c-email" className={LABEL}>
										E-mail
									</label>
									<input
										id="c-email"
										type="email"
										value={email}
										onChange={(e) => {
											setEmail(e.target.value);
											limpar("email");
										}}
										placeholder="seu@email.com"
										className={erros.email ? CAMPO_ERRO : CAMPO}
									/>
									<Erro>{erros.email}</Erro>
								</div>
							</div>

							<div className="grid sm:grid-cols-2 gap-8 mb-8">
								<div>
									<label htmlFor="c-telefone" className={LABEL}>
										Telefone
									</label>
									<input
										id="c-telefone"
										type="tel"
										value={telefone}
										onChange={(e) => {
											setTelefone(e.target.value);
											limpar("telefone");
										}}
										placeholder="(11) 90000-0000"
										className={erros.telefone ? CAMPO_ERRO : CAMPO}
									/>
									<Erro>{erros.telefone}</Erro>
								</div>

								<div>
									<label htmlFor="c-assunto" className={LABEL}>
										Assunto
									</label>
									<select
										id="c-assunto"
										value={assunto}
										onChange={(e) => setAssunto(e.target.value)}
										className={cx(CAMPO, "cursor-pointer")}
									>
										{ASSUNTOS.map((a) => (
											<option key={a.value} value={a.value}>
												{a.label}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="mb-12">
								<label htmlFor="c-mensagem" className={LABEL}>
									Mensagem
								</label>
								<textarea
									id="c-mensagem"
									rows={4}
									value={mensagem}
									onChange={(e) => {
										setMensagem(e.target.value);
										limpar("mensagem");
									}}
									placeholder="O que procura, em qual região, para quando."
									className={cx(
										erros.mensagem ? CAMPO_ERRO : CAMPO,
										"resize-none",
									)}
								/>
								<Erro>{erros.mensagem}</Erro>
							</div>

							<button type="submit" className={BTN_SOLIDO}>
								Enviar mensagem
							</button>
						</form>
					)}
				</div>

				<aside className="lg:pt-4">
					<h2 className={cx(EYEBROW, "mb-8")}>Escritório</h2>
					<p className="font-serif text-xl text-stone-800 leading-relaxed">
						Rua Haddock Lobo, 1626
						<br />
						Jardins — São Paulo, SP
						<br />
						01414-002
					</p>

					<h2 className={cx(EYEBROW, "mt-12 mb-8")}>Atendimento</h2>
					<p className="font-serif text-xl text-stone-800 leading-relaxed">
						+55 11 3062 0099
						<br />
						privado@aurum.com.br
					</p>
					<p className="text-stone-500 font-serif mt-4">
						Segunda a sexta, 9h às 19h. Sábados por agendamento.
					</p>

					<h2 className={cx(EYEBROW, "mt-12 mb-8")}>Discrição</h2>
					<p className="text-stone-500 font-serif leading-relaxed max-w-sm">
						Atendemos famílias, family offices e investidores que preferem não
						aparecer. Nenhuma negociação é divulgada — nem depois de fechada.
					</p>
					<Link
						href="/demos/luxury/private-office"
						className={cx(LINK_CTA, "inline-block mt-8")}
					>
						Conhecer o Private Office
					</Link>
				</aside>
			</section>
		</main>
	);
}
