"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

const contactData = {
	email: "fellipe306@gmail.com",
	linkedin: "https://linkedin.com/in/fellipe-pavin/",
	github: "https://github.com/fap233",
};

const socialLinks = [
	{
		href: contactData.linkedin,
		label: "LinkedIn",
		icon: <Linkedin className="h-6 w-6" />,
	},
	{
		href: contactData.github,
		label: "GitHub",
		icon: <Github className="h-6 w-6" />,
	},
	{
		href: `mailto:${contactData.email}`,
		label: "Email",
		icon: <Mail className="h-6 w-6" />,
	},
];

const ContactSection = () => {
	const { t } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.15);

	return (
		<section
			id="contact"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-20 md:py-32 bg-background border-t overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto text-center">
					<div className="space-y-3 mb-8 in-view-anim in-view-anim-1">
						<p className="text-base text-muted-foreground/80 font-[family-name:var(--font-caveat)] tracking-wide">
							{t.contact.kicker}
						</p>
						<div className="relative inline-block">
							<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
								{t.contact.title}
							</h2>
							<svg
								aria-hidden="true"
								className="absolute left-0 right-0 -bottom-2 w-full max-w-sm mx-auto pointer-events-none"
								viewBox="0 0 360 14"
								fill="none"
								preserveAspectRatio="none"
							>
								<path
									d="M5 8 Q 50 2, 95 7 T 190 7 T 285 8 T 357 5"
									stroke="url(#contact-scribble-gradient)"
									strokeWidth="2"
									strokeLinecap="round"
									fill="none"
									opacity="0.85"
								/>
								<defs>
									<linearGradient
										id="contact-scribble-gradient"
										x1="0"
										y1="0"
										x2="1"
										y2="0"
									>
										<stop offset="0%" stopColor="oklch(0.922 0 0)" />
										<stop offset="50%" stopColor="#a855f7" />
										<stop offset="100%" stopColor="#ec4899" />
									</linearGradient>
								</defs>
							</svg>
						</div>
					</div>

					<p className="text-lg md:text-xl text-muted-foreground mb-12 in-view-anim in-view-anim-2">
						{t.contact.subtitle}
					</p>

					<Card className="group relative p-8 overflow-hidden in-view-anim in-view-anim-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(168,85,247,0.3),0_0_24px_-8px_rgba(236,72,153,0.22)]">
						<span
							aria-hidden="true"
							className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
							style={{
								background:
									"linear-gradient(to right, var(--color-primary), #a855f7, #ec4899)",
								WebkitMask:
									"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
								WebkitMaskComposite: "xor",
								maskComposite: "exclude",
								padding: "1.5px",
							}}
						/>
						<div className="flex justify-center flex-wrap gap-4">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Connect via ${link.label}`}
								>
									<Button
										variant="outline"
										size="lg"
										className="h-14 sm:h-auto sm:px-6 transition-all hover:border-purple-500/60 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_-6px_rgba(236,72,153,0.35)]"
									>
										{link.icon}
										<span className="hidden sm:inline sm:ml-2">
											{link.label}
										</span>
									</Button>
								</a>
							))}
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
