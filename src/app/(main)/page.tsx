"use client";

import { AboutSection } from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { FrontendPreviews } from "@/components/sections/FrontendPreviews";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import React from "react";

export default function Home() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<ProjectsSection />
			<FrontendPreviews />
			<ContactSection />
		</>
	);
}
