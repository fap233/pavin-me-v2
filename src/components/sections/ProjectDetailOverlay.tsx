"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Github, X } from "lucide-react";
import type { Project } from "@/lib/projects";
import { projectDetails } from "@/lib/projectDetails";
import { startLenis, stopLenis } from "@/lib/lenisInstance";

/**
 * Expanded technical read-out for a project — an Apple-style window that
 * grows out of the card and floats over the page. Everything shown here is
 * grounded in the project's real repository/delivery evidence.
 */
export function ProjectDetailOverlay({
	project,
	language,
	onClose,
}: {
	project: Project;
	language: "en" | "pt";
	onClose: () => void;
}) {
	const closeRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const isEN = language === "en";
	const detail = projectDetails[project.slug];
	const href = project.liveUrl ?? project.githubUrl;

	// Portal to <body>: the projects section is a pinned, overflow-hidden,
	// transformed subtree — a fixed child there would be clipped.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	// Freeze the page behind the window, and hand focus to the dialog.
	useEffect(() => {
		const previouslyFocused = document.activeElement as HTMLElement | null;
		stopLenis();
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.stopPropagation();
				onClose();
				return;
			}
			if (event.key !== "Tab") return;

			// Simple focus trap: cycle within the dialog.
			const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
				'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
			);
			if (!focusables?.length) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = prevOverflow;
			startLenis();
			previouslyFocused?.focus?.();
		};
	}, [onClose]);

	if (!mounted) return null;

	return createPortal(
		<div
			className="detail-overlay fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto overscroll-contain p-4 md:p-8"
			role="dialog"
			aria-modal="true"
			aria-label={project.title}
			/* Lenis calls preventDefault on wheel while stopped, which would
			   kill this container's native scrolling too. It checks this
			   attribute before that, so the dialog keeps its own scroll. */
			data-lenis-prevent
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div aria-hidden="true" className="detail-scrim fixed inset-0 backdrop-blur-sm" />

			<div
				ref={panelRef}
				className="detail-panel relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border backdrop-blur-2xl"
				style={
					{
						"--accent-from": project.accent[0],
						"--accent-to": project.accent[1],
					} as React.CSSProperties
				}
			>
				<span aria-hidden="true" className="detail-rule" />

				{/* Title bar */}
				<header className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b bg-transparent px-6 py-4 md:px-8">
					<div className="min-w-0">
						<p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
							{project.category[language]}
							<span className="mx-2 text-muted-foreground/40">·</span>
							{project.year}
						</p>
						<h2 className="detail-title mt-1 truncate text-2xl font-bold tracking-tight md:text-3xl">
							{project.title}
						</h2>
					</div>
					<button
						ref={closeRef}
						onClick={onClose}
						aria-label={isEN ? "Close" : "Fechar"}
						className="shrink-0 rounded-full border border-border/70 p-2 text-muted-foreground transition hover:border-border hover:text-foreground"
					>
						<X className="h-4 w-4" />
					</button>
				</header>

				<div className="space-y-8 px-6 pb-8 pt-6 md:px-8">
					{project.imageUrl && (
						<div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-secondary/30">
							<Image
								src={project.imageUrl}
								alt={project.title}
								fill
								sizes="(max-width: 768px) 100vw, 900px"
								className="object-cover"
							/>
						</div>
					)}

					{/* Role + timeline */}
					{detail && (
						<dl className="grid gap-4 sm:grid-cols-2">
							<Meta label={isEN ? "Role" : "Papel"} value={detail.role[language]} />
							<Meta
								label={isEN ? "Timeline" : "Período"}
								value={detail.timeline[language]}
							/>
						</dl>
					)}

					<p className="text-base leading-relaxed text-foreground/90">
						{detail ? detail.summary[language] : project.description[language]}
					</p>

					<p className="detail-metric text-sm font-medium leading-relaxed">
						{project.metric[language]}
					</p>

					{detail && (
						<>
							<Section title={isEN ? "Architecture & decisions" : "Arquitetura & decisões"}>
								<ul className="space-y-3">
									{detail.architecture[language].map((item) => (
										<li key={item} className="detail-bullet text-sm leading-relaxed text-muted-foreground">
											{item}
										</li>
									))}
								</ul>
							</Section>

							{detail.challenges.length > 0 && (
								<Section title={isEN ? "Hard problems" : "Problemas difíceis"}>
									<div className="space-y-5">
										{detail.challenges.map((c) => (
											<div key={c.problem.en} className="detail-challenge">
												<p className="text-sm font-semibold text-foreground">
													{c.problem[language]}
												</p>
												<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
													{c.solution[language]}
												</p>
											</div>
										))}
									</div>
								</Section>
							)}

							<Section title={isEN ? "Outcomes" : "Resultados"}>
								<ul className="space-y-2">
									{detail.results[language].map((item) => (
										<li
											key={item}
											className="detail-result flex gap-3 text-sm leading-relaxed text-foreground/90"
										>
											<span aria-hidden="true" className="detail-tick" />
											{item}
										</li>
									))}
								</ul>
							</Section>

							<Section title={isEN ? "Stack" : "Stack"}>
								<div className="grid gap-4 sm:grid-cols-2">
									{detail.stack.map((group) => (
										<div key={group.label.en}>
											<p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
												{group.label[language]}
											</p>
											<div className="mt-2 flex flex-wrap gap-1.5">
												{group.items.map((item) => (
													<span
														key={item}
														className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
													>
														{item}
													</span>
												))}
											</div>
										</div>
									))}
								</div>
							</Section>
						</>
					)}

					{!detail && (
						<div className="flex flex-wrap gap-1.5">
							{project.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{href && (
						<div className="border-t pt-6">
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="hero-btn hero-btn-fill w-full sm:w-auto"
							>
								<span className="relative z-10 inline-flex items-center gap-2 text-sm">
									{project.githubUrl && !project.liveUrl ? (
										<>
											<Github className="h-4 w-4" />
											{isEN ? "View source" : "Ver código"}
										</>
									) : (
										<>
											{isEN ? "Open live project" : "Abrir projeto"}
											<ArrowUpRight className="hero-btn-arrow h-4 w-4" />
										</>
									)}
								</span>
							</a>
						</div>
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
}

function Meta({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
			<dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-foreground/90">{value}</dd>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section>
			<h3 className="detail-section-title mb-3 font-mono text-[11px] uppercase tracking-[0.22em]">
				{title}
			</h3>
			{children}
		</section>
	);
}
