import { Block } from "./block.ts";
import { type Gauge, gauges } from "../widgets/gauges.ts";

export class Gauges extends Block {
  public override readonly height;
  public override canSetHeight: boolean = false;

  constructor(
    private readonly gauges: Gauge[],
    public width: number = [
      "L".repeat(Math.max(...gauges.map((g) => g[0].length))),
      "L".repeat(Math.max(...gauges.map((g) => g[1].toString().length))),
      "H".repeat(Math.max(...gauges.map((g) => g[2].toString().length))),
      "[██████████]",
    ].join(" ").length,
  ) {
    super();
    this.height = gauges.length;
  }

  /** New width of block */
  public setWidth(width: number): number {
    this.width = width;
    return width;
  }

  /** Cannot set height */
  public setHeight(_height: number): number {
    return this.height;
  }

  /** Override all the current values of each gauge */
  public override update(values: number[]): void {
    values.forEach((v, i) => {
      if (i < this.gauges.length) {
        const [title, min, max] = this.gauges[i];
        this.gauges[i] = [title, min, max, v];
      }
    });
  }

  /** Render gauges as string */
  public override toString(): string {
    if (!this.width) throw new Error("Width not set");
    return gauges(this.gauges, this.width);
  }

  /** Render gauges as individual lines */
  public get lines(): string[] {
    return this.toString().split("\n");
  }
}
