import { Suspense } from "react";
import { ContatoClient } from "./contato-client";

export default function ContatoPage() {
	return (
		<Suspense fallback={<div className="min-h-screen" />}>
			<ContatoClient />
		</Suspense>
	);
}
