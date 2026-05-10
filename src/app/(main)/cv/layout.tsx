import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "CV / Resume",
	description:
		"Fellipe Pavin — Software Engineer. 9+ years of production experience. Full-cycle ownership across Go, TypeScript, Node.js and React/Next.js. Founded a multi-tenant SaaS scaled to 10,000+ paying users. Open to remote and contract roles worldwide.",
	alternates: {
		canonical: "https://pavin.me/cv",
	},
	openGraph: {
		title: "CV · Fellipe Pavin",
		description:
			"Software Engineer · 9+ years · Full-cycle ownership · Go, TypeScript, Node.js, React. Open to remote and contract roles worldwide.",
		url: "https://pavin.me/cv",
		type: "profile",
	},
	twitter: {
		card: "summary_large_image",
		title: "CV · Fellipe Pavin",
		description:
			"Software Engineer · 9+ years · Open to remote and contract roles worldwide.",
	},
};

export default function CvLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
