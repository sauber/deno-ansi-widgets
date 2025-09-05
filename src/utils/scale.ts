/**
 * Generates a scale of numbers.
 *
 * This function creates an array of `count` numbers that are evenly spaced with "nice"
 * human-readable intervals (e.g., multiples of 1, 2, 5, 10). The scale will extend
 * to encompass the given `min` and `max` values.
 * 
 *
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @param count The desired number of points in the scale.
 * @returns An array of numbers representing the scale.
 */
export function scale(min: number, max: number, count: number): number[] {
	if (count <= 0) return [];
	if (count === 1) return [min];
	if (min >= max) return Array(count).fill(min);

	const range = max - min;
	// The minimum step required to cover the range in `count - 1` intervals
	const rawStep = range / (count - 1);

	if (rawStep === 0) return Array(count).fill(min);

	// 1. Calculate a "nice" step value (tick) that is >= rawStep
	const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
	const residual = rawStep / magnitude;

	// Find the smallest "nice" multiplier (1, 2, 5, 10) that is >= the residual
	const niceMultipliers = [1, 2, 5, 10];
	let niceMultiplier = niceMultipliers.find((m) => m >= residual) ?? 10;
	let tick = niceMultiplier * magnitude;

	// 2. Calculate a "nice" start value that is <= min
	let start = Math.floor(min / tick) * tick;

	// 3. Check if the scale covers the max value. If not, increase the tick to the next "nice" value.
	if (start + (count - 1) * tick < max) {
		const multiplierIndex = niceMultipliers.indexOf(niceMultiplier);
		// If we are at 10, the next magnitude is 10 * magnitude. Otherwise, use the next multiplier.
		if (multiplierIndex === niceMultipliers.length - 1) {
			tick = 10 * magnitude;
		} else {
			niceMultiplier = niceMultipliers[multiplierIndex + 1];
			tick = niceMultiplier * magnitude;
		}
		// Recalculate start with the new, larger tick
		start = Math.floor(min / tick) * tick;
	}

	// 4. Generate the scale points
	const result: number[] = [];
	// Handle floating point inaccuracies by fixing precision
	const precision = Math.max(0, (tick.toString().split(".")[1] || "").length);
	for (let i = 0; i < count; i++) {
		result.push(parseFloat((start + i * tick).toFixed(precision)));
	}
	return result;
}