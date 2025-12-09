import { scale } from "../utils/scale.ts";
import { TextLine } from "./textline.ts";

export class XAxis {
  // private line: TextLine;
  // public fittedNomLabels: { text: string; position: number }[] = [];
  public readonly labels: number[];
  public readonly positions: number[];

  constructor(
    min: number,
    max: number,
    private readonly length: number,
    private readonly separator: string = "─",
  ) {
    this.labels = XAxis.makeLabels(min, max, length, separator);
    this.positions = XAxis.calcPositions(this.labels, length);

    // TODO: Move below code to toString() function
    // this.line = TextLine.width(length, separator);

    // this.line = this.line.left(String(min));
    // this.fittedNomLabels.push({ text: String(min), position: 0 });

    // this.line = this.line.right(String(max));

    // const offset = String(min).length;

    // for (let i = 1; i < xLabels.length - 1; i++) {
    //   const label = xLabels[i];
    //   const position = offset + i * spacing;
    //   this.line = this.line.at(position, String(label));
    //   this.fittedNomLabels.push({
    //     text: String(label),
    //     position: Math.round(position),
    //   });
    // }

    // this.fittedNomLabels.push({
    //   text: String(max),
    //   position: length - String(max).length,
    // });
    // this.fittedNomLabels.sort((a, b) => a.position - b.position);
  }

  /** Generate the numeric labels to fit within the given length */
  private static makeLabels(
    min: number,
    max: number,
    length: number,
    separator: string,
  ): number[] {
    // Confirm if at least min and max can fit
    if (length < String(min).length + String(max).length + 1) {
      return [];
    }

    // Estimate a starting number of labels
    const maxLabelWidth = Math.max(String(min).length, String(max).length);
    const estimatedLabels = Math.floor(length / (maxLabelWidth + 1));
    let numLabels = estimatedLabels;

    // Reduce number of labels until they fit
    let numbers: number[] = [];
    while (numLabels > 2) {
      const tryNumbers = scale(min, max, numLabels);
      const numberWidth = tryNumbers
        .map((n) => String(n).length)
        .reduce((a, b) => a + b, 0);
      const separatorsWidth = (numLabels - 1) * separator.length;
      if (numberWidth + separatorsWidth < length) break;
      numLabels--;
      numbers = tryNumbers;
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

    const positions: number[] = [0];
    const numLabels = labels.length;
    if (numLabels === 0) return positions;

    for (let i = 0; i < numLabels; i++) {
      const position = offset + i * spacing;
      positions.push(position);
    }
    positions.push(length - 1);
    return positions;
  }

  /** Plot labels onto a line with separator chars inbetween */
  private makeLine(): TextLine {
    const labels: number[] = this.labels;
    const pos: number[] = this.positions;

    let line = TextLine.width(this.length, this.separator);

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
