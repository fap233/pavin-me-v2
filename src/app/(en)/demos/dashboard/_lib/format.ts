/** Formatação pt-BR compartilhada pelas páginas do painel. */

const MESES_CURTOS = [
	"jan",
	"fev",
	"mar",
	"abr",
	"mai",
	"jun",
	"jul",
	"ago",
	"set",
	"out",
	"nov",
	"dez",
];

const fmtBRL = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

const fmtBRLCurto = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

/** R$ 3.499,90 */
export function brl(valor: number): string {
	return fmtBRL.format(valor);
}

/** R$ 54.230 — usado nos cards de KPI, onde centavos só poluem. */
export function brlCurto(valor: number): string {
	return fmtBRLCurto.format(Math.round(valor));
}

export function numero(valor: number): string {
	return new Intl.NumberFormat("pt-BR").format(valor);
}

/** "2026-06-14" -> "14 jun 2026" (sem passar por Date: nada de fuso horário). */
export function dataCurta(iso: string): string {
	const [ano, mes, dia] = iso.split("-");
	return `${dia} ${MESES_CURTOS[Number(mes) - 1]} ${ano}`;
}

/** "2026-06-14" -> "14/06" */
export function diaMes(iso: string): string {
	const [, mes, dia] = iso.split("-");
	return `${dia}/${mes}`;
}

export function mesCurto(indice: number): string {
	return MESES_CURTOS[indice];
}

export function percentual(valor: number): string {
	const sinal = valor > 0 ? "+" : "";
	return `${sinal}${valor.toFixed(1).replace(".", ",")}%`;
}

export function iniciais(nome: string): string {
	const partes = nome.trim().split(/\s+/);
	if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
	return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}
