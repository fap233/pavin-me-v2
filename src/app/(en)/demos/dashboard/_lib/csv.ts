/**
 * Geração de CSV 100% no cliente: monta um Blob, cria um object URL, dispara o
 * download e revoga a URL em seguida (senão o blob fica preso na memória da aba).
 */

function escaparCelula(valor: string | number): string {
	const texto = String(valor);
	if (/[";\n]/.test(texto)) return `"${texto.replace(/"/g, '""')}"`;
	return texto;
}

export function baixarCSV(
	nomeArquivo: string,
	cabecalho: string[],
	linhas: Array<Array<string | number>>,
): void {
	// ";" e BOM: é o que o Excel em pt-BR abre sem quebrar acento nem coluna.
	const conteudo = [cabecalho, ...linhas]
		.map((linha) => linha.map(escaparCelula).join(";"))
		.join("\r\n");

	const blob = new Blob([`﻿${conteudo}`], {
		type: "text/csv;charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = nomeArquivo;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	// revoga depois do tick pra não cancelar o download em navegadores lentos
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Valor numérico no formato que o Excel pt-BR entende (vírgula decimal). */
export function csvValor(valor: number): string {
	return valor.toFixed(2).replace(".", ",");
}
