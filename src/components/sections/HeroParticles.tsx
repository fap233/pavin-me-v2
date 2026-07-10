"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Particle = {
	/** Scattered galaxy home (offset from cloud centre). */
	sx: number;
	sy: number;
	/** Target point inside the letterforms (offset from name centre). */
	tx: number;
	ty: number;
	/** Pointer-scatter displacement + velocity (springs back). */
	dx: number;
	dy: number;
	vx: number;
	vy: number;
	orbit: number;
	orbitR: number;
	orbitSpeed: number;
	size: number;
	color: string;
	twinkle: number;
	/** Ambient dust never joins the name — it keeps the galaxy alive around it. */
	ambient: boolean;
};

const gauss = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** Pointer distance (px) at which the galaxy fully aligns into the name. */
const FORM_RADIUS = 460;
/** How long the one-off intro assembly stays before the galaxy takes over. */
const INTRO_HOLD_MS = 2600;

/**
 * The name itself, made of particles (dobre.agency-inspired, kept light).
 * On load the dust flies in from a wide galaxy and assembles into the
 * letterforms of "Fellipe Pavin" (sampled from an offscreen canvas). The
 * assembled name shimmers gently; the pointer blows local holes in it and
 * the particles spring back — the DOM text stays invisible underneath for
 * accessibility and SEO.
 */
export function HeroParticles({
	anchorRef,
}: {
	anchorRef: React.RefObject<HTMLElement | null>;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { isDarkMode } = useTheme();

	useEffect(() => {
		const canvas = canvasRef.current;
		const section = canvas?.parentElement;
		if (!canvas || !section) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const finePointer = window.matchMedia("(hover: hover)").matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		let width = 0;
		let height = 0;
		let cx = 0;
		let cy = 0;
		let particles: Particle[] = [];
		let raf = 0;
		let running = false;
		let visible = true;
		let form = 0; // eased 0 (scattered) .. 1 (assembled into the name)
		const assembleAt = performance.now() + 500; // fly-in starts shortly after paint
		const pointer = { x: -9999, y: -9999 };

		const palette = isDarkMode
			? [
					"rgba(226, 223, 255, A)",
					"rgba(129, 140, 248, A)",
					"rgba(192, 132, 252, A)",
					"rgba(244, 114, 182, A)",
				]
			: [
					"rgba(76, 70, 120, A)",
					"rgba(99, 102, 241, A)",
					"rgba(147, 51, 234, A)",
					"rgba(219, 39, 119, A)",
				];
		const baseAlpha = isDarkMode ? 0.65 : 0.45;

		/** Sample points inside the rendered name so particles can assemble it. */
		const sampleName = (anchor: HTMLElement): { x: number; y: number }[] => {
			const rect = anchor.getBoundingClientRect();
			const style = getComputedStyle(anchor);
			const text = (anchor.textContent ?? "").trim();
			if (!text || rect.width < 10) return [];

			const off = document.createElement("canvas");
			const scale = 0.5; // sample at half resolution — plenty for dots
			off.width = Math.ceil(rect.width * scale);
			off.height = Math.ceil(rect.height * scale);
			const octx = off.getContext("2d");
			if (!octx) return [];

			const fontSize = parseFloat(style.fontSize) * scale;
			octx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
			octx.textAlign = "center";
			octx.textBaseline = "middle";
			octx.fillStyle = "#fff";
			octx.fillText(text, off.width / 2, off.height / 2);

			const data = octx.getImageData(0, 0, off.width, off.height).data;
			const points: { x: number; y: number }[] = [];
			const step = 2; // grid step in offscreen px
			for (let y = 0; y < off.height; y += step) {
				for (let x = 0; x < off.width; x += step) {
					if (data[(y * off.width + x) * 4 + 3] > 128) {
						points.push({
							x: (x / scale) - rect.width / 2,
							y: (y / scale) - rect.height / 2,
						});
					}
				}
			}
			return points;
		};

		const build = () => {
			const rect = section.getBoundingClientRect();
			width = rect.width;
			height = rect.height;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const anchor = anchorRef.current;
			const a = anchor?.getBoundingClientRect();
			cx = a ? a.left + a.width / 2 - rect.left : width / 2;
			cy = a ? a.top + a.height / 2 - rect.top : height * 0.42;

			const targets = anchor ? sampleName(anchor) : [];

			// Wide galaxy for the fly-in — noticeably broader on desktop.
			const spreadX = Math.min(width * 0.46, 760);
			const spreadY = Math.min(height * 0.5, 380);

			// Enough dots to draw every sampled point of the letterforms, plus a
			// band of ambient dust that never converges — so the space around
			// the assembled name still reads as a living galaxy.
			const formedCount = reduced
				? Math.min(targets.length, 900)
				: Math.max(600, Math.min(targets.length, finePointer ? 1600 : 900));
			const ambientCount = reduced ? 80 : 260;

			const make = (i: number, ambient: boolean): Particle => {
				const color = palette[Math.floor(Math.random() * palette.length)];
				const t = targets.length
					? targets[i % targets.length]
					: { x: gauss() * 220, y: gauss() * 60 };
				return {
					sx: gauss() * spreadX * (ambient ? 2.4 : 2),
					sy: gauss() * spreadY * (ambient ? 2.4 : 2),
					tx: t.x + (Math.random() - 0.5) * 3,
					ty: t.y + (Math.random() - 0.5) * 3,
					dx: 0,
					dy: 0,
					vx: 0,
					vy: 0,
					orbit: Math.random() * Math.PI * 2,
					orbitR: ambient ? 8 + Math.random() * 26 : 3 + Math.random() * 12,
					orbitSpeed:
						(0.0002 + Math.random() * 0.0006) * (Math.random() < 0.5 ? -1 : 1),
					size: ambient ? 0.4 + Math.random() * 1.1 : 0.5 + Math.random() * 1.3,
					color,
					twinkle: Math.random() * Math.PI * 2,
					ambient,
				};
			};

			particles = [
				...Array.from({ length: formedCount }, (_, i) => make(i, false)),
				...Array.from({ length: ambientCount }, (_, i) => make(i, true)),
			];
		};

		const draw = (time: number) => {
			ctx.clearRect(0, 0, width, height);

			// Intro: assemble once so the visitor reads the name. After that the
			// milky way takes over — scattered while the pointer is far, aligning
			// into the letterforms as it approaches the centre.
			let target: number;
			if (!finePointer) {
				target = 0.72 + 0.24 * Math.sin(time * 0.00045);
			} else if (time < assembleAt + INTRO_HOLD_MS) {
				target = time < assembleAt ? 0 : 1;
			} else {
				const dist = Math.hypot(pointer.x - cx, pointer.y - cy);
				target = smoothstep(1 - Math.min(dist / FORM_RADIUS, 1));
			}
			// Aligning is quicker than dissolving — magnetic, not laggy.
			form += (target - form) * (target > form ? 0.08 : 0.04);

			for (const p of particles) {
				p.orbit += p.orbitSpeed * 16;
				// Ambient dust ignores the assembly entirely; for the rest, orbit
				// sway fades as the particle locks into its letterform slot.
				const pForm = p.ambient ? 0 : form;
				const sway = 1 - pForm * 0.85;
				const scatterX = cx + p.sx + Math.cos(p.orbit) * p.orbitR * sway * 3;
				const scatterY = cy + p.sy + Math.sin(p.orbit) * p.orbitR * sway * 2;
				const formedX = cx + p.tx + Math.cos(p.orbit) * (1 - pForm) * 4;
				const formedY = cy + p.ty + Math.sin(p.orbit) * (1 - pForm) * 4;

				const f = smoothstep(pForm);
				let x = scatterX + (formedX - scatterX) * f;
				let y = scatterY + (formedY - scatterY) * f;

				// Pointer bubble: stirs the loose dust, but yields as the name
				// assembles — otherwise the cursor punches a hole right through
				// the letters you came to read. Ambient dust is always stirred.
				const bubble = p.ambient ? 1 : 1 - form * 0.92;
				const R = 95 * bubble;
				if (finePointer && bubble > 0.12) {
					const px = x - pointer.x;
					const py = y - pointer.y;
					const dist2 = px * px + py * py;
					if (dist2 < R * R && dist2 > 0.01) {
						const dist = Math.sqrt(dist2);
						const force = ((R - dist) / R) * 2.2 * bubble;
						p.vx += (px / dist) * force;
						p.vy += (py / dist) * force;
					}
				}

				p.vx += -p.dx * 0.014;
				p.vy += -p.dy * 0.014;
				p.vx *= 0.88;
				p.vy *= 0.88;
				p.dx += p.vx;
				p.dy += p.vy;
				x += p.dx;
				y += p.dy;

				const tw = 0.72 + 0.28 * Math.sin(time * 0.0016 + p.twinkle);
				// Slightly brighter once assembled — the name "ignites".
				const alpha = baseAlpha * tw * (0.75 + 0.45 * f);
				ctx.fillStyle = p.color.replace("A", alpha.toFixed(3));
				ctx.beginPath();
				ctx.arc(x, y, p.size, 0, Math.PI * 2);
				ctx.fill();
			}
		};

		const step = (time: number) => {
			draw(time);
			if (running) raf = requestAnimationFrame(step);
		};

		const start = () => {
			if (running || reduced || !visible || document.hidden) return;
			running = true;
			raf = requestAnimationFrame(step);
		};
		const stop = () => {
			running = false;
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		};

		const onPointerMove = (event: PointerEvent) => {
			const rect = section.getBoundingClientRect();
			pointer.x = event.clientX - rect.left;
			pointer.y = event.clientY - rect.top;
		};
		const onPointerLeave = () => {
			pointer.x = -9999;
			pointer.y = -9999;
		};
		const onResize = () => {
			build();
			draw(performance.now());
		};
		const onVisibility = () => (document.hidden ? stop() : start());

		// Wait for webfonts so the sampled letterforms match the real name.
		build();
		draw(0);
		document.fonts?.ready.then(() => {
			build();
			draw(performance.now());
		});

		const observer = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible) start();
				else stop();
			},
			{ rootMargin: "10% 0px" },
		);
		observer.observe(section);

		if (finePointer && !reduced) {
			window.addEventListener("pointermove", onPointerMove, { passive: true });
			section.addEventListener("pointerleave", onPointerLeave);
		}
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			stop();
			observer.disconnect();
			window.removeEventListener("pointermove", onPointerMove);
			section.removeEventListener("pointerleave", onPointerLeave);
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [isDarkMode, anchorRef]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-0"
		/>
	);
}
