import { scale } from "../utils/scale.ts";

/** Generate an ascii y-Axis of range from min to max spread out on number of lines */
export class YAxis {
  public readonly labels: number[];
  public readonly width: number;

  /**
   * Create a YAxis instance
   * @param min Lowest number on scale
   * @param max Highest number on scale
   * @param lines Number of lines on scale
   * @param separator Single char at right side of numbers
   */
  constructor(
    min: number,
    max: number,
    public readonly height: number,
    private readonly separator: string = "┤",
  ) {
    this.labels = scale(min, max, this.height);
    this.width = separator.length +
      Math.max(0, ...this.labels.map((l) => String(l).length));
  }

  /** Convert numeric labels to right adjusted text labels, highest label first */
  public lines(): string[] {
    return this.labels.map((l) =>
      String(l).padStart(this.width - 1, " ") + this.separator
    ).reverse();
  }
}
