import React from "react";

const portfolioData = {
	name: "Fellipe Pavin",
};

const Footer = () => (
	<footer className="py-8 border-t bg-secondary/10">
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
			<p>
				Under development | {new Date().getFullYear()} © {portfolioData.name}
			</p>
			<p className="mt-1">Minimalist Design Inpired by shadcn/ui</p>
		</div>
	</footer>
);

export default Footer;
