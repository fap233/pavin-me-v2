"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

const contactData = {
	email: "fellipe306@gmail.com",
	linkedin: "https://linkedin.com/in/fellipe-pavin/",
	github: "https://github.com/fap233",
};

/** Live Fortaleza clock — rendered only after mount to stay hydration-safe. */
function useLocalTime() {
	const [time, setTime] = useState<string>("--:--:--");

	useEffect(() => {
		const fmt = new Intl.DateTimeFormat("pt-BR", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZone: "America/Fortaleza",
		});
		const tick = () => setTime(fmt.format(new Date()));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, []);

	return time;
}

const ContactSection = () => {
	const { t, language } = useLanguage();
	const { ref, inView } = useInView<HTMLElement>(0.15);
	const time = useLocalTime();
	const isEN = language === "en";

	const socials = [
		{ label: "LinkedIn", href: contactData.linkedin },
		{ label: "GitHub", href: contactData.github },
		{ label: isEN ? "Resume / CV" : "Currículo / CV", href: "/cv" },
	];

	return (
		<section
			id="contact"
			ref={ref}
			data-in-view={inView ? "true" : "false"}
			className="relative py-24 md:py-36 overflow-hidden"
		>
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_55%,transparent_100%)]"
			/>

			<div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				{/* Kicker */}
				<p className="in-view-anim in-view-anim-1 text-base text-muted-foreground/80 font-[family-name:var(--font-caveat)] tracking-wide">
					{t.contact.kicker}
				</p>

				{/* Editorial headline + giant e-mail CTA */}
				<h2 className="in-view-anim in-view-anim-2 mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
					{t.contact.title}
				</h2>
				<p className="in-view-anim in-view-anim-2 mt-4 max-w-xl text-lg text-muted-foreground">
					{t.contact.subtitle}
				</p>

				<a
					href={`mailto:${contactData.email}`}
					className="contact-mail in-view-anim in-view-anim-3 group mt-12 inline-flex max-w-full flex-wrap items-baseline gap-3 text-2xl font-black tracking-tight sm:text-4xl lg:text-6xl"
				>
					<span className="contact-mail-text break-all">
						{contactData.email}
					</span>
					<ArrowUpRight
						aria-hidden="true"
						className="contact-mail-arrow h-6 w-6 shrink-0 sm:h-9 sm:w-9 lg:h-12 lg:w-12"
					/>
					<span aria-hidden="true" className="contact-mail-rule" />
				</a>

				{/* Status strip + typographic socials */}
				<div className="in-view-anim in-view-anim-4 mt-16 grid gap-10 border-t pt-8 md:grid-cols-2">
					<dl className="space-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
						<div className="flex items-baseline gap-4">
							<dt className="w-28 shrink-0 text-muted-foreground/60">
								{isEN ? "Location" : "Base"}
							</dt>
							<dd>Fortaleza, BR · UTC-3</dd>
						</div>
						<div className="flex items-baseline gap-4">
							<dt className="w-28 shrink-0 text-muted-foreground/60">
								{isEN ? "Local time" : "Hora local"}
							</dt>
							<dd className="tabular-nums">{time}</dd>
						</div>
						<div className="flex items-baseline gap-4">
							<dt className="w-28 shrink-0 text-muted-foreground/60">
								Status
							</dt>
							<dd className="inline-flex items-center gap-2">
								<span className="contact-status-dot" aria-hidden="true" />
								{isEN ? "Open to work · remote" : "Aberto a oportunidades · remoto"}
							</dd>
						</div>
					</dl>

					<nav
						aria-label={isEN ? "Social links" : "Redes"}
						className="flex flex-col items-start gap-2 md:items-end"
					>
						{socials.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target={s.href.startsWith("http") ? "_blank" : undefined}
								rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
								className="contact-social group inline-flex items-center gap-2 text-xl font-semibold md:text-2xl"
							>
								<span className="contact-social-text">{s.label}</span>
								<ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
							</a>
						))}
					</nav>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
