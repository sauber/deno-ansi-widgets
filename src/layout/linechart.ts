import { scale } from "../utils/scale.ts";
import { linechart } from "../widgets/linechart.ts";
import { Block } from "./block.ts";

/** Display an array of numbers as a line chart in a block */
export class LineChart extends Block {
  // Desired width
  private _width: number;

  constructor(private line: number[], public override height: number) {
    super();
    // Guess width of yaxis labels
    const labelWidth = Math.max(
      ...scale(Math.min(...line), Math.max(...line), line.length).map((n) =>
        n.toString().length
      ),
    );
    const axisWidth = 1; // for the y-axis line
    this._width = labelWidth + axisWidth + line.length - 1;
  }

  public override get width(): number {
    return this._width;
  }

  public override setWidth(width: number): number {
    return this._width = width;
  }

  public override setHeight(height: number): number {
    return this.height = height;
  }

  public override toString(): string {
    return linechart(this.line, this.height, this.width).split("\n").join("\n");
  }

  public get lines(): string[] {
    return this.toString().split("\n");
  }

  public override update(line: number[]): void {
    this.line = line;
  }
}
