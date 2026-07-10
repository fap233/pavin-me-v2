/** hsl → [r, g, b] (0-255). Canvas gradients need numeric rgb for alpha templating. */
export function hslToRgb(
	h: number,
	s: number,
	l: number,
): [number, number, number] {
	const hue = ((h % 360) + 360) % 360;
	const sat = s / 100;
	const lig = l / 100;

	const c = (1 - Math.abs(2 * lig - 1)) * sat;
	const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
	const m = lig - c / 2;

	let r = 0;
	let g = 0;
	let b = 0;
	if (hue < 60) [r, g, b] = [c, x, 0];
	else if (hue < 120) [r, g, b] = [x, c, 0];
	else if (hue < 180) [r, g, b] = [0, c, x];
	else if (hue < 240) [r, g, b] = [0, x, c];
	else if (hue < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];

	return [
		Math.round((r + m) * 255),
		Math.round((g + m) * 255),
		Math.round((b + m) * 255),
	];
}
