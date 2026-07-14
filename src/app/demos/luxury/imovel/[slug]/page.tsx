import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROPERTIES, getProperty, precoBRL } from "../../_data/properties";
import { ImovelClient } from "./imovel-client";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
	return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const imovel = getProperty(slug);
	if (!imovel) return { title: "Imóvel não encontrado · Aurum" };

	return {
		title: `${imovel.titulo} · Aurum`,
		description: `${imovel.bairro}, ${imovel.cidade} — ${precoBRL(imovel.preco)}. ${imovel.resumo}`,
	};
}

export default async function ImovelPage({ params }: Props) {
	const { slug } = await params;
	const imovel = getProperty(slug);
	if (!imovel) notFound();

	return <ImovelClient imovel={imovel} />;
}
