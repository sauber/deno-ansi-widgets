import { scale } from "../utils/scale.ts";
import { AnsiStyle, linechart } from "../widgets/linechart.ts";
import { Block } from "./block.ts";

/** Display an array of numbers as a line chart in a block, supports multiple series and ANSI styles */
export class LineChart extends Block {
  // Desired width
  private _width: number;
  private series: number[] | number[][];
  private style?: AnsiStyle | AnsiStyle[];

  constructor(
    series: number[] | number[][],
    public override height: number,
    style?: AnsiStyle | AnsiStyle[],
  ) {
    super();
    this.series = series;
    this.style = style;

    // Determine if input is multiple series
    let seriesArray: number[][];
    const firstElement = series[0];
    if (Array.isArray(firstElement)) {
      seriesArray = series as number[][];
    } else {
      seriesArray = [series as number[]];
    }

    // Compute global min and max for y-axis labels
    const flat = seriesArray.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const dataLength = seriesArray[0].length;

    // Guess width of yaxis labels
    const labelWidth = Math.max(
      ...scale(min, max, dataLength).map((n) => n.toString().length),
    );
    const axisWidth = 1; // for the y-axis line
    this._width = labelWidth + axisWidth + dataLength - 1;
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
    return linechart(this.series, this.height, this.width, this.style);
  }

  public get lines(): string[] {
    return this.toString().split("\n");
  }

  public override update(series: number[] | number[][]): void {
    this.series = series;
  }
}
