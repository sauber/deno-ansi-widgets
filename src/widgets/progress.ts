/** Display a progress bar
 * @param value The current value of the progress
 * @param max The maximum value of the progress
 * @param ms The elapsed time in milliseconds
 * @param width The width of the progress bar in characters
 * @returns A string representing the progress bar
 */
export function progress(
  value: number,
  max: number,
  ms: number,
  width: number,
): string {
  // Current and maximum value
  const ratio: string = [value, max].join("/");

  // Number of ms until completion
  const completion: number = value === 0
    ? Infinity
    : (ms / value) * (max - value);

  // Render ETA as a string.
  // If completion is Infinity, show ∞.
  // If completion is < 100000, show as seconds
  // Otherwise show eta absolute time as hh::mm
  let eta: string;
  if (completion === Infinity) eta = "∞";
  else if (completion < 100000) eta = (completion / 1000).toFixed(1) + "s";
  else {
    const future = new Date(Date.now() + completion);
    const hours = future.getHours().toString().padStart(2, "0");
    const minutes = future.getMinutes().toString().padStart(2, "0");
    eta = `${hours}:${minutes}`;
  }

  // Render bar
  const barWidth = width - ratio.length - eta.length - "[]  ".length;
  const percent = Math.min(1, value / max);
  const complete = Math.round(percent * barWidth);
  const incomplete = barWidth - complete;
  const bar = "█".repeat(complete) + "░".repeat(incomplete);

  // Combine all the parts
  return `[${bar}] ${ratio} ${eta}`;
}
