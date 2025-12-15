import { scale } from "../utils/scale.ts";
import { TextLine } from "./textline.ts";

export class XAxis {
  public readonly labels: number[];
  public readonly positions: number[];

  constructor(
    min: number,
    max: number,
    public readonly width: number,
    private readonly separator: string = "─",
  ) {
    this.labels = XAxis.makeLabels(min, max, width, separator);
    this.positions = XAxis.calcPositions(this.labels, width);
  }

  /** Generate the numeric labels to fit within the given length */
  private static makeLabels(
    min: number,
    max: number,
    length: number,
    separator: string,
  ): number[] {
    // Confirm if not even min and max can fit
    if (length < String(min).length + String(max).length + 1) {
      return [];
    }

    // Estimate a starting number of labels
    const minLabelWidth = Math.min(String(min).length, String(max).length);
    let estimatedLabels = Math.floor(length / (minLabelWidth + 1));
    let numLabels = estimatedLabels;

    // Reduce number of labels until they fit
    let numbers: number[] = scale(min, max, numLabels);
    while (--estimatedLabels >= 2) {
      const tryNumbers = scale(min, max, estimatedLabels);
      const numberWidth = tryNumbers
        .map((n) => String(n).length)
        .reduce((a, b) => a + b, 0);
      const separatorsWidth = (estimatedLabels - 1) * separator.length;
      const totalMinWidth = numberWidth + separatorsWidth;

      // If the estimated labels fit, use them
      if (totalMinWidth <= length) {
        numLabels = estimatedLabels;
        numbers = tryNumbers;
        break;
      }
    }

    return numbers;
  }

  /** Calculate positions of labels. First label is at position 0, last label is at position length-1, and remaining labels are spaced evenly in between */
  private static calcPositions(
    labels: number[],
    length: number,
  ): number[] {
    const min: number = labels[0];
    const max: number = labels[labels.length - 1];
    const offset = String(min).length;
    const availableLength = length - String(min).length - String(max).length;
    const spacing = availableLength / (labels.length - 1);

    // First position
    const positions: number[] = [0];
    const numLabels = labels.length;
    if (numLabels === 0) return positions;

    // Middle positions
    for (let i = 1; i < numLabels - 1; i++) {
      const position = offset + i * spacing;
      positions.push(position);
    }

    // Last position
    positions.push(length - 1);

    return positions;
  }

  /** Plot labels onto a line with separator chars inbetween */
  private makeLine(): TextLine {
    const labels: number[] = this.labels;
    const pos: number[] = this.positions;

    let line = TextLine.width(this.width, this.separator);
    if (labels.length < 2) {
      return line;
    }

    // First and last labels
    line = line.left(String(labels[0]));
    line = line.right(String(labels[labels.length - 1]));

    // Plot remaining labels
    for (let i = 1; i < this.labels.length - 1; i++) {
      const label = labels[i];
      const position = pos[i];
      line = line.at(position, String(label));
    }

    return line;
  }

  toString(): string {
    return this.makeLine().toString();
  }
}
