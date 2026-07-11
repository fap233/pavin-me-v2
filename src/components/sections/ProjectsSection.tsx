"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Maximize2 } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { ProjectDetailOverlay } from "./ProjectDetailOverlay";
import { projects, type Project } from "@/lib/projects";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "@/lib/useInView";

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

/**
 * Turns vertical scroll into horizontal travel across the project track while
 * the section is pinned. Returns `false` on touch/narrow viewports and when
 * motion is reduced — callers should render a plain vertical grid instead.
 */
function useHorizontalTrack(
	sectionRef: React.RefObject<HTMLElement | null>,
	trackRef: React.RefObject<HTMLDivElement | null>,
	progressRef: React.RefObject<HTMLSpanElement | null>,
	onActiveChange: (index: number) => void,
) {
	const [enabled, setEnabled] = useState(false);
	const [sectionHeight, setSectionHeight] = useState<number>(0);
	const activeRef = useRef(0);

	useEffect(() => {
		// The pinned track runs on every viewport (slot width adapts via CSS);
		// only reduced motion falls back to the vertical grid.
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
		const sync = () => setEnabled(!reduced.matches);

		sync();
		reduced.addEventListener("change", sync);
		return () => {
			reduced.removeEventListener("change", sync);
		};
	}, []);

	useEffect(() => {
		const section = sectionRef.current;
		const track = trackRef.current;
		if (!enabled || !section || !track) {
			setSectionHeight(0);
			if (track) track.style.transform = "";
			return;
		}

		let distance = 0;
		let frame = 0;

		const measure = () => {
			distance = Math.max(track.scrollWidth - window.innerWidth, 0);
			setSectionHeight(distance + window.innerHeight);
		};

		const render = () => {
			frame = 0;
			const travel = section.offsetHeight - window.innerHeight;
			if (travel <= 0) return;

			const progress = clamp(-section.getBoundingClientRect().top / travel, 0, 1);
			const x = progress * distance;
			track.style.transform = `translate3d(${-x}px, 0, 0)`;

			if (progressRef.current) {
				progressRef.current.style.transform = `scaleX(${progress || 0.02})`;
			}

			const centerX = x + window.innerWidth / 2;
			let nearest = 0;
			let nearestDistance = Infinity;
			Array.from(track.children).forEach((child, index) => {
				const card = child as HTMLElement;
				const cardCenter = card.offsetLeft + card.offsetWidth / 2;
				const delta = Math.abs(cardCenter - centerX);
				if (delta < nearestDistance) {
					nearestDistance = delta;
					nearest = index;
				}
			});

			if (nearest !== activeRef.current) {
				activeRef.current = nearest;
				onActiveChange(nearest);
			}
		};

		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(render);
		};

		measure();
		render();

		const observer = new ResizeObserver(() => {
			measure();
			schedule();
		});
		observer.observe(track);

		const onResize = () => {
			measure();
			schedule();
		};
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", onResize);

		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", onResize);
			if (frame) cancelAnimationFrame(frame);
		};
	}, [enabled, sectionRef, trackRef, progressRef, onActiveChange]);

	return { enabled, sectionHeight };
}

export function ProjectsSection() {
	const { language, t } = useLanguage();
	const kicker = language === "en" ? "// projects" : "// projetos";

	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const progressRef = useRef<HTMLSpanElement>(null);
	const [active, setActive] = useState(0);
	const [openSlug, setOpenSlug] = useState<string | null>(null);
	const openProject = projects.find((p) => p.slug === openSlug) ?? null;

	const onActiveChange = useCallback((index: number) => setActive(index), []);
	const { enabled, sectionHeight } = useHorizontalTrack(
		sectionRef,
		trackRef,
		progressRef,
		onActiveChange,
	);

	const { ref: headingRef, inView } = useInView<HTMLDivElement>(0.2);

	const heading = (
		<div
			ref={headingRef}
			data-in-view={inView ? "true" : "false"}
			className="max-w-2xl space-y-3"
		>
			<p className="text-base text-muted-foreground/80 font-[family-name:var(--font-caveat)] tracking-wide in-view-anim in-view-anim-1">
				{kicker}
			</p>
			<h2 className="text-3xl md:text-5xl font-bold in-view-anim in-view-anim-2">
				{t.projects.title}
			</h2>
			<p className="text-muted-foreground in-view-anim in-view-anim-3">
				{t.projects.subtitle}
			</p>
		</div>
	);

	if (!enabled) {
		return (
			<section
				id="projects"
				className="relative py-20 overflow-hidden"
			>
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_80%_at_50%_30%,#000_60%,transparent_100%)]"
				/>
				<div className="container mx-auto px-4">
					<div className="mb-12 text-center mx-auto">{heading}</div>
					<div className="grid gap-6 md:grid-cols-2">
						{projects.map((project) => (
							<ProjectCard
								key={project.slug}
								title={project.title}
								description={project.description[language]}
								tags={project.tags}
								liveUrl={project.liveUrl}
								githubUrl={project.githubUrl}
								imageUrl={project.imageUrl}
								featured={project.featured}
							/>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section
			id="projects"
			ref={sectionRef}
			className="relative"
			style={{ height: sectionHeight ? `${sectionHeight}px` : undefined }}
		>
			<div className="sticky top-0 flex h-screen flex-col overflow-hidden">
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_80%_at_50%_40%,#000_60%,transparent_100%)]"
				/>

				<div className="container mx-auto shrink-0 px-4 pt-24 pb-8">
					<div className="flex flex-wrap items-end justify-between gap-6">
						{heading}
						<div className="hidden items-baseline gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70 lg:flex">
							<span className="text-foreground/90">
								{String(active + 1).padStart(2, "0")}
							</span>
							<span>/</span>
							<span>{String(projects.length).padStart(2, "0")}</span>
							<span className="ml-4">
								{language === "en" ? "Scroll to explore →" : "Role para explorar →"}
							</span>
						</div>
					</div>
				</div>

				{/* Horizontal track — driven by the vertical scroll above */}
				<div className="flex min-h-0 flex-1 items-center">
					{/* Symmetric padding centres the first panel at the start and the
					    last panel at the end, so the focused card is always the one
					    in the viewport centre. Slot width + padding live in
					    .project-track so they adapt to phone viewports. */}
					<div
						ref={trackRef}
						className="project-track flex gap-4 md:gap-6 will-change-transform"
					>
						{projects.map((project, index) => (
							<ProjectPanel
								key={project.slug}
								project={project}
								index={index}
								active={index === active}
								language={language}
								onOpen={() => setOpenSlug(project.slug)}
							/>
						))}
					</div>
				</div>

				{openProject && (
					<ProjectDetailOverlay
						project={openProject}
						language={language}
						onClose={() => setOpenSlug(null)}
					/>
				)}

				<div className="container mx-auto shrink-0 px-4 pb-10">
					<div className="h-px w-full overflow-hidden bg-border">
						<span
							ref={progressRef}
							className="block h-px w-full origin-left bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
							style={{ transform: "scaleX(0.02)" }}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProjectPanel({
	project,
	index,
	active,
	language,
	onOpen,
}: {
	project: Project;
	index: number;
	active: boolean;
	language: "en" | "pt";
	onOpen: () => void;
}) {
	const href = project.liveUrl ?? project.githubUrl;

	return (
		<article
			data-active={active ? "true" : "false"}
			role="button"
			tabIndex={0}
			aria-label={
				language === "en"
					? `Open technical detail for ${project.title}`
					: `Abrir detalhe técnico de ${project.title}`
			}
			onClick={onOpen}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onOpen();
				}
			}}
			className="project-panel group relative flex h-[60vh] max-h-[560px] w-[var(--slot-w)] shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border backdrop-blur-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60"
			style={
				{
					"--accent-from": project.accent[0],
					"--accent-to": project.accent[1],
				} as React.CSSProperties
			}
		>
			<span aria-hidden="true" className="project-paint" />
			<span aria-hidden="true" className="project-rule" />

			<div className="relative z-10 flex h-full flex-col">
				<div className="flex items-center justify-between px-5 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
					<span>
						{String(index + 1).padStart(2, "0")} — {project.category[language]}
					</span>
					<span>{project.year}</span>
				</div>

				{project.imageUrl ? (
					<div className="relative mt-4 aspect-video w-full overflow-hidden bg-secondary/30">
						<Image
							src={project.imageUrl}
							alt={project.title}
							fill
							sizes="440px"
							className="project-image object-cover"
						/>
					</div>
				) : (
					<div className="project-plate relative mt-4 flex aspect-video w-full items-center justify-center overflow-hidden">
						<span className="px-6 text-center font-[family-name:var(--font-caveat)] text-3xl leading-tight text-foreground/70">
							{project.title}
						</span>
					</div>
				)}

				<div className="flex flex-1 flex-col gap-3 p-5">
					<h3 className="project-title text-2xl font-semibold">
						{project.title}
					</h3>
					<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
						{project.description[language]}
					</p>
					<p className="project-metric text-xs font-medium leading-relaxed">
						{project.metric[language]}
					</p>

					<div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
						{project.tags.slice(0, 4).map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
							>
								{tag}
							</span>
						))}
					</div>

					<div className="flex items-center justify-between gap-3">
						<span className="project-link inline-flex items-center gap-1.5 text-sm font-medium">
							{language === "en" ? "Technical detail" : "Detalhe técnico"}
							<Maximize2 className="h-3.5 w-3.5" />
						</span>
						{href && (
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								onClick={(e) => e.stopPropagation()}
								className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
							>
								{project.githubUrl && !project.liveUrl ? (
									<>
										<Github className="h-3.5 w-3.5" /> Code
									</>
								) : (
									<>
										{language === "en" ? "Visit" : "Visitar"}
										<ArrowUpRight className="h-3.5 w-3.5" />
									</>
								)}
							</a>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}
