"use client";

import React from "react";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
	return (
		<>
			<HeroSection />
			<AboutSection />
			<ProjectsSection />
		</>
	);
}
