import { redirect } from "next/navigation";
import { DOCS_BASE, DOC_PAGES } from "../_components/docs-data";

// /docs sozinho não tem conteúdo próprio: cai direto no primeiro artigo
// (Quickstart), que é o que o leitor quer nos primeiros 3 segundos.
export default function DocsIndexPage() {
	redirect(`${DOCS_BASE}/${DOC_PAGES[0].slug}`);
}
