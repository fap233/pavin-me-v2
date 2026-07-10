"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Dust = {
	x: number;
	y: number;
	z: number; // depth 0..1 — drives size, alpha and parallax
	drift: number; // horizontal sway phase
	speed: number; // upward drift
};

type Blob = {
	hue: [number, number, number];
	cx: number; // 0..1 of width
	cy: number; // 0..1 of height
	r: number; // 0..1 of min dimension
	ax: number; // sway amplitude x (px)
	ay: number;
	phase: number;
	drift: number;
};

const BRAND: [number, number, number][] = [
	[99, 102, 241], // indigo
	[168, 85, 247], // purple
	[236, 72, 153], // pink
];

/**
 * A fixed, full-viewport canvas that gives the flat background depth and life:
 * soft drifting brand-colour washes plus a slow dust field that parallaxes with
 * scroll. Sits behind all content (pointer-events: none). Honours reduced
 * motion (one static frame) and pauses when the tab is hidden.
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
		let blobs: Blob[] = [];
		let raf = 0;
		let running = true;
		let scrollY = window.scrollY;

		// Light specks on dark, faint ink specks on light.
		const dustColor = isDarkMode ? "210, 205, 255" : "80, 70, 130";
		const dustAlpha = isDarkMode ? 0.55 : 0.38;
		const blobAlpha = isDarkMode ? 0.13 : 0.1;

		// Occasional shooting star streaking across the sky.
		let meteor: {
			x: number;
			y: number;
			vx: number;
			vy: number;
			life: number;
		} | null = null;
		let nextMeteorAt = performance.now() + 4000 + Math.random() * 5000;

		const build = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			canvas.style.width = `${width}px`;
			canvas.style.height = `${height}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const count = Math.round(
				Math.min(Math.max((width * height) / 9500, 70), 210),
			);
			dust = Array.from({ length: count }, (_, i) => ({
				x: Math.random() * width,
				y: Math.random() * height,
				z: 0.25 + ((i * 97) % 100) / 133,
				drift: Math.random() * Math.PI * 2,
				speed: 0.1 + Math.random() * 0.24,
			}));

			blobs = [
				{ hue: BRAND[0], cx: 0.18, cy: 0.22, r: 0.6, ax: 150, ay: 100, phase: 0, drift: 0.12 },
				{ hue: BRAND[1], cx: 0.82, cy: 0.5, r: 0.65, ax: 180, ay: 120, phase: 2.1, drift: 0.1 },
				{ hue: BRAND[2], cx: 0.45, cy: 0.85, r: 0.55, ax: 140, ay: 95, phase: 4.2, drift: 0.14 },
			];
		};

		const draw = (time: number) => {
			ctx.clearRect(0, 0, width, height);
			const minDim = Math.min(width, height);

			// Soft colour washes — give the flat background depth and movement.
			ctx.globalCompositeOperation = "lighter";
			for (const b of blobs) {
				const t = time * 0.0001;
				const x = b.cx * width + Math.cos(t * b.drift * 60 + b.phase) * b.ax;
				const y =
					b.cy * height +
					Math.sin(t * b.drift * 60 + b.phase) * b.ay -
					scrollY * 0.02;
				const radius = b.r * minDim;
				const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
				const [r, gr, bl] = b.hue;
				g.addColorStop(0, `rgba(${r}, ${gr}, ${bl}, ${blobAlpha})`);
				g.addColorStop(1, `rgba(${r}, ${gr}, ${bl}, 0)`);
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();
			}

			// Starfield — dust specks parallaxed by scroll, wrapping seamlessly,
			// the brightest of them twinkling for a deep-space feel.
			ctx.globalCompositeOperation = "source-over";
			for (const p of dust) {
				const parallax = (scrollY * (0.05 + p.z * 0.25)) % (height + 40);
				let y = p.y - parallax;
				y = ((y % (height + 40)) + (height + 40)) % (height + 40) - 20;
				const x = p.x + Math.sin(time * 0.0004 + p.drift) * (6 + p.z * 10);
				const radius = 0.4 + p.z * 1.6;
				const twinkle = 0.7 + 0.3 * Math.sin(time * 0.002 * p.speed * 12 + p.drift);
				const alpha = dustAlpha * (0.35 + p.z * 0.65) * twinkle;
				ctx.fillStyle = `rgba(${dustColor}, ${alpha.toFixed(3)})`;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, Math.PI * 2);
				ctx.fill();

				// A soft glow around the nearest, brightest stars.
				if (p.z > 0.82) {
					const gg = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
					gg.addColorStop(0, `rgba(${dustColor}, ${(alpha * 0.5).toFixed(3)})`);
					gg.addColorStop(1, `rgba(${dustColor}, 0)`);
					ctx.fillStyle = gg;
					ctx.beginPath();
					ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
					ctx.fill();
				}
			}

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
