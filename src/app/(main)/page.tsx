"use client";

import { AboutSection } from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { CurrentWorkSection } from "@/components/sections/CurrentWorkSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FrontendPreviews } from "@/components/sections/FrontendPreviews";
import { HeroSection } from "@/components/sections/HeroSection";
import { LeadFormSection } from "@/components/sections/LeadFormSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import React from "react";

export default function Home() {
	return (
		<div className="select-none">
			<HeroSection />
			<AboutSection />
			{/* Projetos atuais (anonimizado) logo após o "sobre" — some quando não há
			    obra rodando. */}
			<CurrentWorkSection />
			{/* Prova social perto do topo: avaliações reais. */}
			<ReviewsSection />
			<ProjectsSection />
			<FrontendPreviews />
			{/* Quebra de objeção -> o pedido -> o contato direto (e-mail/redes). */}
			<FaqSection />
			<LeadFormSection />
			<ContactSection />
		</div>
	);
}
