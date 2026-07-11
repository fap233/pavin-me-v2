"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Dust = {
	x: number;
	y: number;
	z: number; // depth 0..1 — drives size, alpha and parallax
	drift: number; // horizontal sway phase
	speed: number; // upward drift
	tint: string | null;
	glowSprite: HTMLCanvasElement | null; // pre-rendered glow (null = no glow)
};

// Pre-render a soft radial glow to an offscreen canvas ONCE per colour, so the
// hot draw loop can drawImage it instead of allocating a gradient per star per
// frame (createRadialGradient in the loop was the dominant cost).
function makeGlowSprite(rgb: string): HTMLCanvasElement {
	const S = 64;
	const c = document.createElement("canvas");
	c.width = S;
	c.height = S;
	const g = c.getContext("2d")!;
	const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
	grad.addColorStop(0, `rgba(${rgb}, 1)`);
	grad.addColorStop(1, `rgba(${rgb}, 0)`);
	g.fillStyle = grad;
	g.fillRect(0, 0, S, S);
	return c;
}

/**
 * A fixed, full-viewport canvas that gives the flat background depth and life:
 * soft drifting brand-colour washes plus a slow dust field that parallaxes with
 * scroll. Sits behind all content (pointer-events: none). Honours reduced
 * motion (one static frame) and pauses when the tab is hidden.
 *
 * Perf: star-glow sprites are built ONCE per
 * resize and reused; per-particle alpha is applied via globalAlpha instead of
 * building an rgba string each frame; the paintable hue recolours in place
 * (a ref) so dragging the footer slider never tears down the animation.
 */
export function SiteBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { isDarkMode } = useTheme();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);

		let width = 0;
		let height = 0;
		let dust: Dust[] = [];
		let raf = 0;
		let running = true;
		let scrollY = window.scrollY;

		// Light specks on dark, faint ink specks on light.
		const dustColor = isDarkMode ? "210, 205, 255" : "80, 70, 130";
		const dustAlpha = isDarkMode ? 0.55 : 0.38;

		// Glow sprites — one per distinct dust colour (base + two giant-star tints).
		const glowBase = makeGlowSprite(dustColor);
		const glowWarm = makeGlowSprite("255, 220, 190");
		const glowCool = makeGlowSprite("190, 210, 255");

		// Occasional shooting star streaking across the sky.
		let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
		let nextMeteorAt = performance.now() + 4000 + Math.random() * 5000;

		const build = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			// A via-láctea (band) e as manchas de nebulosa (blobs) eram FIXAS no
			// viewport e criavam faixas escuras entre os brilhos — lido como
			// "sombreado entre as seções". Removidas: o fundo agora é um céu de
			// estrelas UNIFORME (a poeira é distribuída por igual, sem bandas).
			// Mais estrelas pra o céu ter vida mesmo sem a nebulosa.
			const count = Math.round(Math.min(Math.max((width * height) / 5200, 140), 360));
			dust = Array.from({ length: count }, (_, i) => {
				const tint =
					Math.random() < 0.14
						? Math.random() < 0.5
							? "255, 220, 190"
							: "190, 210, 255"
						: null;
				const z = 0.25 + ((i * 97) % 100) / 133;
				// giant/tinted stars get a glow sprite; the rest never glow
				const glowSprite =
					tint === "255, 220, 190"
						? glowWarm
						: tint === "190, 210, 255"
							? glowCool
							: z > 0.82
								? glowBase
								: null;
				return {
					x: Math.random() * width,
					y: Math.random() * height,
					z,
					drift: Math.random() * Math.PI * 2,
					speed: 0.1 + Math.random() * 0.24,
					tint,
					glowSprite,
				};
			});

		};

		const draw = (time: number) => {
			ctx.clearRect(0, 0, width, height);

			// Starfield — dust specks; per-particle alpha via globalAlpha (no
			// rgba string built per frame). Glow via pre-rendered sprite.
			ctx.globalCompositeOperation = "source-over";
			for (const p of dust) {
				const parallax = (scrollY * (0.05 + p.z * 0.25)) % (height + 40);
				let y = p.y - parallax;
				y = ((y % (height + 40)) + (height + 40)) % (height + 40) - 20;
				const x = p.x + Math.sin(time * 0.0004 + p.drift) * (6 + p.z * 10);
				const radius = 0.4 + p.z * 1.6;
				const twinkle = 0.7 + 0.3 * Math.sin(time * 0.002 * p.speed * 12 + p.drift);
				const alpha = dustAlpha * (0.35 + p.z * 0.65) * twinkle;

				ctx.globalAlpha = Math.min(alpha, 1);
				ctx.fillStyle = p.tint ? `rgb(${p.tint})` : `rgb(${dustColor})`;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();

				if (p.glowSprite) {
					const gr = radius * (p.tint ? 6 : 4);
					ctx.globalAlpha = Math.min(alpha * 0.55, 1);
					ctx.drawImage(p.glowSprite, x - gr, y - gr, gr * 2, gr * 2);
				}
			}
			ctx.globalAlpha = 1;

			// A meteor every few seconds — the universe never sits still.
			if (!reduced) {
				if (!meteor && time > nextMeteorAt) {
					const fromLeft = Math.random() < 0.5;
					meteor = {
						x: fromLeft ? -40 : width + 40,
						y: Math.random() * height * 0.45,
						vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5),
						vy: 2.2 + Math.random() * 1.6,
						life: 1,
					};
				}
				if (meteor) {
					meteor.x += meteor.vx;
					meteor.y += meteor.vy;
					meteor.life -= 0.012;
					const tail = ctx.createLinearGradient(
						meteor.x,
						meteor.y,
						meteor.x - meteor.vx * 9,
						meteor.y - meteor.vy * 9,
					);
					tail.addColorStop(0, `rgba(${dustColor}, ${(0.85 * meteor.life).toFixed(3)})`);
					tail.addColorStop(1, `rgba(${dustColor}, 0)`);
					ctx.strokeStyle = tail;
					ctx.lineWidth = 1.6;
					ctx.lineCap = "round";
					ctx.beginPath();
					ctx.moveTo(meteor.x, meteor.y);
					ctx.lineTo(meteor.x - meteor.vx * 9, meteor.y - meteor.vy * 9);
					ctx.stroke();
					if (
						meteor.life <= 0 ||
						meteor.x < -80 ||
						meteor.x > width + 80 ||
						meteor.y > height + 60
					) {
						meteor = null;
						nextMeteorAt = time + 5000 + Math.random() * 9000;
					}
				}
			}
		};

		const step = (time: number) => {
			// Advance the dust independent of scroll so it lives when the page is idle.
			for (const p of dust) p.y -= p.speed;
			for (const p of dust) if (p.y < -20) p.y += height + 40;
			draw(time);
			if (running) raf = requestAnimationFrame(step);
		};

		const onScroll = () => {
			scrollY = window.scrollY;
		};
		const onResize = () => {
			build();
			draw(performance.now());
		};
		const onVisibility = () => {
			if (document.hidden) {
				running = false;
				if (raf) cancelAnimationFrame(raf);
			} else if (!reduced) {
				running = true;
				raf = requestAnimationFrame(step);
			}
		};

		build();

		if (reduced) {
			draw(0);
		} else {
			raf = requestAnimationFrame(step);
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onResize);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			running = false;
			if (raf) cancelAnimationFrame(raf);
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onResize);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [isDarkMode]);

	return (
		<canvas
			ref={canvasRef}
			aria-hidden="true"
			className="pointer-events-none fixed inset-0 -z-10"
		/>
	);
}
