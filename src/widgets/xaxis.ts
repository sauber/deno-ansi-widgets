import { scale } from "../utils/scale.ts";
import { TextLine } from "./textline.ts";

/** Generate line with numbers from min to max spread out over length
 * Example output:
 * 0────5────10────15────20
 *
 * @param min Lowest number on scale
 * @param max Highest number on scale
 * @param length Length of the line in characters
 * @param separator Single char between numbers
 * @returns Combined string of line with numbers
 */
export function xaxis(
  min: number,
  max: number,
  length: number,
  separator: string = "─",
): string {
  // A string to hold the final line
  let line: TextLine = TextLine.width(length, separator);

  // Line too short for min and max
  if (length < String(min).length + String(max).length + 1) {
    return line.toString();
  }

  // Estimate number of labels that can fit
  const maxLabelWidth = Math.max(String(min).length, String(max).length);
  const estimatedLabels = Math.floor(length / (maxLabelWidth + 1));

  // Reduce count of labels until confirmed that they fit
  let numLabels = estimatedLabels;
  while (numLabels > 2) {
    const numbers = scale(min, max, numLabels);
    console.log({ numbers });
    const numberWidth = numbers
      .map((n) => String(n).length)
      .reduce((a, b) => a + b, 0);
    const separatorsWidth = (numLabels - 1) * separator.length;
    if (numberWidth + separatorsWidth < length) break;
    numLabels--;
  }

  // x axis numeric labels
  const xLabels: number[] = scale(min, max, numLabels);

  // Add min and max labels at the ends
  line = line.left(String(min));
  line = line.right(String(max));
  console.log({ line: line.toString() });

  // Amount chars available for intermediate labels
  const offset = String(min).length;
  const availableLength = length - String(min).length - String(max).length;
  const spacing = availableLength / (numLabels - 1);
  console.log({ length, offset, availableLength, spacing });

  for (let i = 1; i < xLabels.length - 1; i++) {
    const label = xLabels[i];
    const position = Math.floor(offset + i * spacing);
    console.log({ label, position, string: String(label) });
    line = line.at(position, String(label));
  }

  // Plot the numeric labels onto line
  // xLabels.forEach((label) => {
  //   const ratio = (label - min) / (max - min);
  //   const position = Math.min(
  //     length - 1,
  //     Math.max(0, Math.round(ratio * (length - 1))),
  //   );
  //   console.log({ label, ratio, position, string: String(label) });
  //   line = line.at(position, String(label));
  // });

  return line.toString();
}
