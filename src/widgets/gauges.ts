/** Gauge properties: [title, min, max, current] */
export type Gauge = [string, number, number, number];

// ANSI escape codes
const inverse = "\u001B[7m";
const reset = "\u001B[0m";

/** Render a bar of desired length
 * Examples where min=0, max=50, width=20
 * " 0                  "
 * "\u001B[7m  \u001B[0m 10               "
 * "\u001B[7m                 50 \u001B[0m"
 */
function render_bar(
  min: number,
  max: number,
  current: number,
  width: number,
): string {
  // Size of bar and empty space
  const ratio = (min >= max)
    ? 1
    : Math.max(0, Math.min(1, (current - min) / (max - min)));
  const fill: number = Math.round(ratio * width);
  const empty: number = width - fill;

  // Render value with a space before and after
  const currentStr = ` ${current} `;

  // No fill
  if (fill == 0) return currentStr + " ".repeat(empty - currentStr.length);

  // Current value fits inside the empty part
  if (empty > currentStr.length) {
    const bar = `${inverse}${" ".repeat(fill)}${reset}`;
    const pad = " ".repeat(empty - currentStr.length);
    return `${bar}${currentStr}${pad}`;
  }

  // Current value fits inside the filled part
  if (fill > currentStr.length) {
    const bar = `${inverse}${
      " ".repeat(fill - currentStr.length)
    }${currentStr}${reset}`;
    const pad = " ".repeat(empty);
    return `${bar}${pad}`;
  }

  // Current value doesn't fit nicely, just show the bar
  return `${inverse}${" ".repeat(fill)}${reset}${" ".repeat(empty)}`;
}

/** Display a list of gauges
 * Each gauges has a label, a minimum value, a maximum value, and a current value.
 * Title are left aligned, min and max are right aligned.
 * If current value is low, display current value after the bar.
 * If current value is high, display current value inside the bar.
 * Example output of two gauges
 * ```
 * Foo  0 [██ 10               ] 100`
 * Bar 20 [█████████████████50█]  50`
 * ```
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
  const decoration = "  [] ";
  const barWidth = width - titleWidth - minWidth - maxWidth - decoration.length;

  // Render each gauge
  return gauges.map(([title, min, max, current]) => {
    const bar = render_bar(min, max, current, barWidth);

    // Render the min and max values as right adjusted strings
    const minStr = min.toString().padStart(minWidth);
    const maxStr = max.toString().padStart(maxWidth);

    // Combine all the parts
    return `${title.padEnd(titleWidth)} ${minStr} [${bar}] ${maxStr}`;
  }).join("\n");
}
