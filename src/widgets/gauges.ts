/** Gauge properties: [title, min, max, current] */
export type Gauge = [string, number, number, number];

/** Display a list of gauges
 * Each gauges has a label, a minimum value, a maximum value, and a current value.
 * Title are left aligned, min and max are right aligned.
 * If current value is low, display current value after the bar
 * If current value is high, display current value inside the bar
 * Example output of two gauges
 * Foo  0 [██ 10               ] 100`
 * Bar 20 [█████████████████50█]  50`
 * @param gauges An array of gauges to display
 * @param width The width of the progress bars in characters
 * @returns A string representing the list of gauges
 */
export function gauges(gauges: Gauge[], width: number): string {
  // Determine the longest title
  const titleWidth = Math.max(...gauges.map(([title]) => title.length));

  // Determine the longest min width
  const minWidth = Math.max(
    ...gauges.map(([, min]) => min.toString().length),
  );

  // Determine the longest max width
  const maxWidth = Math.max(
    ...gauges.map(([, , max]) => max.toString().length),
  );

  // Determine the width of the bar
  const barWidth = width - titleWidth - minWidth - maxWidth - "  [] ".length;

  // Render each gauge
  return gauges.map(([title, min, max, current]) => {
    // Calculate the percentage of the bar to fill
    const percent = (current - min) / (max - min);
    const fill = Math.round(Math.max(0, Math.min(1, percent)) * barWidth);
    const empty = barWidth - fill;

    // Render the bar
    const bar = `${"█".repeat(fill)}${"░".repeat(empty)}`;

    // Overlay the current value on the bar
    const currentStr = `${current}`;
    const annotated = (currentStr.length < empty)
      ? `${bar.slice(0, fill)}${currentStr}${
        bar.slice(fill + currentStr.length)
      }`
      : `${bar.slice(0, fill - currentStr.length - 1)}${currentStr}${
        bar.slice(fill - 1)
      }`;

    // Render the min and max values as right adjusted strings
    const minStr = min.toString().padStart(minWidth);
    const maxStr = max.toString().padStart(maxWidth);

    // Combine all the parts
    return `${title.padEnd(titleWidth)} ${minStr} [${annotated}] ${maxStr}`;
  }).join("\n");
}
