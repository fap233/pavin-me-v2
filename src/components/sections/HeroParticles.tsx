"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { usePaint } from "@/contexts/PaintContext";
import { hslToRgb } from "@/lib/color";

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
	ci: number; // palette index (so a hue change recolours in place)
	rgb: string; // cached "rgb(r, g, b)" — alpha applied via globalAlpha
	twinkle: number;
	/** Ambient dust never joins the name — it keeps the galaxy alive around it. */
	ambient: boolean;
	/** Fast per-particle jitter phase/rate for the "held by force" tremor. */
	jphase: number;
	jrate: number;
};

const gauss = () => (Math.random() + Math.random() + Math.random()) / 3 - 0.5;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

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
	const { hue } = usePaint();
	// hue read live so the footer paint slider recolours in place instead of
	// tearing down and re-sampling the name (getImageData) on every drag tick.
	const hueRef = useRef(hue);
	const recolorRef = useRef<((h: number) => void) | null>(null);

	useEffect(() => {
		hueRef.current = hue;
		recolorRef.current?.(hue);
	}, [hue]);

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
		let formRadius = 380; // formation zone = the hero's drafting circle
		const assembleAt = performance.now() + 500; // fly-in starts shortly after paint
		const pointer = { x: -9999, y: -9999 };

		// Neutral dust + the three paintable brand hues (footer slider), in the
		// light tints (dark theme) / ink tints (light theme) of the originals.
		// Palette as solid "rgb(r, g, b)" strings — alpha is applied per particle
		// via ctx.globalAlpha in draw(), so no rgba string is built each frame.
		const rgb = (h: number, s: number, l: number) => {
			const [r, g, b] = hslToRgb(h, s, l);
			return `rgb(${r}, ${g}, ${b})`;
		};
		const buildPalette = (h: number): string[] =>
			isDarkMode
				? ["rgb(226, 223, 255)", rgb(h - 66, 89, 74), rgb(h - 29, 95, 75), rgb(h + 29, 86, 70)]
				: ["rgb(76, 70, 120)", rgb(h - 61, 84, 67), rgb(h - 29, 74, 56), rgb(h + 33, 70, 51)];
		let palette = buildPalette(hueRef.current);
		const baseAlpha = isDarkMode ? 0.65 : 0.45;

		/** Sample points inside the rendered name so particles can assemble it. */
		const sampleName = (anchor: HTMLElement): { x: number; y: number }[] => {
			const rect = anchor.getBoundingClientRect();
			const style = getComputedStyle(anchor);
			const text = (anchor.textContent ?? "").trim();
			if (!text || rect.width < 10) return [];

			const off = document.createElement("canvas");
			const scale = 0.92; // near-full res + step 1 = very fine points -> crisp letters
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
			for (let y = 0; y < off.height; y += 1) {
				for (let x = 0; x < off.width; x += 1) {
					if (data[(y * off.width + x) * 4 + 3] > 128) {
						points.push({
							x: x / scale - rect.width / 2,
							y: y / scale - rect.height / 2,
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

			// Match the hero's drafting circle: min(78vw, 760px) diameter.
			formRadius = Math.min(width * 0.39, 380) * 1.08;

			const targets = anchor ? sampleName(anchor) : [];

			// Wide galaxy for the fly-in — noticeably broader on desktop.
			const spreadX = Math.min(width * 0.46, 760);
			const spreadY = Math.min(height * 0.5, 380);

			// Enough dots to draw every sampled point of the letterforms, plus a
			// band of ambient dust that never converges — so the space around
			// the assembled name still reads as a living galaxy. Denser on
			// phones so the smaller particles still read as solid letters.
			// Letterforms read solid well below the old 5200 cap; ~2200 is the
			// point of diminishing return and roughly halves the per-frame work.
			const formedCap = width < 640 ? 2600 : finePointer ? 2200 : 2000;
			const formedCount = reduced
				? Math.min(targets.length, 2200)
				: Math.max(1200, Math.min(targets.length, formedCap));
			const ambientCount = reduced ? 80 : 260;

			// Small particles + high density = crisp, solid letters that never
			// smear (finer still on phones).
			const nameSize = width < 640 ? 0.5 : 0.68;
			const make = (i: number, ambient: boolean, count: number): Particle => {
				const ci = Math.floor(Math.random() * palette.length);
				// Spread particles across ALL sampled points (stride), so the
				// whole name fills evenly instead of only the top rows.
				const t =
					!ambient && targets.length
						? targets[Math.floor((i * targets.length) / count)]
						: { x: gauss() * 220, y: gauss() * 60 };
				return {
					sx: gauss() * spreadX * (ambient ? 2.4 : 2),
					sy: gauss() * spreadY * (ambient ? 2.4 : 2),
					tx: t.x + (Math.random() - 0.5) * 2,
					ty: t.y + (Math.random() - 0.5) * 2,
					dx: 0,
					dy: 0,
					vx: 0,
					vy: 0,
					orbit: Math.random() * Math.PI * 2,
					orbitR: ambient ? 8 + Math.random() * 26 : 3 + Math.random() * 12,
					orbitSpeed:
						(0.0002 + Math.random() * 0.0006) * (Math.random() < 0.5 ? -1 : 1),
					size: ambient
						? 0.4 + Math.random() * 1.1
						: 0.35 + Math.random() * nameSize,
					ci,
					rgb: palette[ci],
					twinkle: Math.random() * Math.PI * 2,
					ambient,
					jphase: Math.random() * Math.PI * 2,
					jrate: 0.006 + Math.random() * 0.012,
				};
			};

			particles = [
				...Array.from({ length: formedCount }, (_, i) =>
					make(i, false, formedCount),
				),
				...Array.from({ length: ambientCount }, (_, i) =>
					make(i, true, ambientCount),
				),
			];
		};

		// Recolour particles in place when the paint hue changes — no rebuild,
		// no name re-sampling; the running loop picks up the new rgb next frame.
		recolorRef.current = (h: number) => {
			palette = buildPalette(h);
			for (const p of particles) p.rgb = palette[p.ci];
		};

		const draw = (time: number) => {
			ctx.clearRect(0, 0, width, height);

			// Intro: assemble once so the visitor reads the name. After that the
			// drafting circle is the formation zone — the galaxy is scattered
			// outside it, starts assembling the moment the pointer enters, and
			// snaps fully together (and densest) at the centre.
			let target: number;
			if (!finePointer) {
				target = 0.72 + 0.24 * Math.sin(time * 0.00045);
			} else if (time < assembleAt + INTRO_HOLD_MS) {
				target = time < assembleAt ? 0 : 1;
			} else {
				const dist = Math.hypot(pointer.x - cx, pointer.y - cy);
				const prox = 1 - Math.min(dist / formRadius, 1); // 0 at circle edge, 1 at centre
				// Crossing into the circle already shows a clearly-formed name;
				// it then tightens and densifies toward the centre.
				const pointerTarget = prox <= 0 ? 0 : 0.5 + 0.5 * smoothstep(prox);

				// Auto-assembly: every ~9s the galaxy pulls itself into the name
				// and releases, so an idle visitor (or one who never grasps the
				// interaction) still gets to read it. The pointer overrides it.
				// The plateau must reach a full 1: the scatter offsets span
				// hundreds of px, so even a 10% residue smears the letters.
				const P = 9000;
				const ph = ((time - assembleAt) % P) / P;
				let pulse = 0;
				if (ph < 0.14) pulse = smoothstep(ph / 0.14);
				else if (ph < 0.4) pulse = 1;
				else if (ph < 0.56) pulse = 1 - smoothstep((ph - 0.4) / 0.16);

				target = Math.max(pointerTarget, pulse);
			}
			// Aligning is quicker than dissolving — magnetic, not laggy.
			form += (target - form) * (target > form ? 0.08 : 0.04);
			// The easing is asymptotic; snap the last sliver so a fully-formed
			// name is exactly formed rather than 99% formed.
			if (target >= 1 && form > 0.995) form = 1;

			for (const p of particles) {
				p.orbit += p.orbitSpeed * 16;
				// Ambient dust ignores the assembly entirely; for the rest, orbit
				// sway fades as the particle locks into its letterform slot.
				const pForm = p.ambient ? 0 : form;
				const sway = 1 - pForm * 0.85;
				const scatterX = cx + p.sx + Math.cos(p.orbit) * p.orbitR * sway * 3;
				const scatterY = cy + p.sy + Math.sin(p.orbit) * p.orbitR * sway * 2;
				// Residual orbit shrinks hard as it forms, so the centred name
				// packs tight; a fast micro-tremor stays even when fully formed —
				// electrons held to their spot by force, never quite at rest.
				const tremor = 0.6 + 0.5 * pForm;
				const jx = Math.sin(time * p.jrate + p.jphase) * tremor;
				const jy = Math.cos(time * p.jrate * 1.3 + p.jphase) * tremor;
				const formedX = cx + p.tx + Math.cos(p.orbit) * (1 - pForm) * 2 + jx;
				const formedY = cy + p.ty + Math.sin(p.orbit) * (1 - pForm) * 2 + jy;

				const f = smoothstep(pForm);
				// Position uses a sharper curve than brightness: the scatter
				// offsets are hundreds of px wide, so the last few percent of
				// `f` still carry enough displacement to blur the glyphs.
				const fPos = smoothstep(f);
				let x = scatterX + (formedX - scatterX) * fPos;
				let y = scatterY + (formedY - scatterY) * fPos;

				// Only the ambient dust drifts with the cursor — the letters of the
				// name are never disturbed, so the name always stays readable.
				if (finePointer && p.ambient) {
					const px = x - pointer.x;
					const py = y - pointer.y;
					const dist2 = px * px + py * py;
					const R = 120;
					if (dist2 < R * R && dist2 > 0.01) {
						const dist = Math.sqrt(dist2);
						const force = ((R - dist) / R) * 1.8;
						p.vx += (px / dist) * force;
						p.vy += (py / dist) * force;
					}
					p.vx += -p.dx * 0.014;
					p.vy += -p.dy * 0.014;
					p.vx *= 0.88;
					p.vy *= 0.88;
					p.dx += p.vx;
					p.dy += p.vy;
					x += p.dx;
					y += p.dy;
				}

				const tw = 0.72 + 0.28 * Math.sin(time * 0.0016 + p.twinkle);
				// The name ignites as it forms — much brighter and a touch larger
				// near full assembly, so the centre reads dense and solid.
				const alpha = baseAlpha * tw * (p.ambient ? 0.85 : 0.5 + 0.85 * f);
				ctx.globalAlpha = Math.min(alpha, 1);
				ctx.fillStyle = p.rgb;
				ctx.beginPath();
				ctx.arc(x, y, p.size * (1 + 0.25 * f), 0, Math.PI * 2);
				ctx.fill();
			}
			ctx.globalAlpha = 1;
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
			recolorRef.current = null;
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
