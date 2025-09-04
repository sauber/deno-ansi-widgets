import { unicodeWidth } from "@std/cli/unicode-width";
import { stripAnsiCode } from "@std/fmt/colors";
import { Block } from "./block.ts";

/** A line of chars */
export class Line extends Block {
  public width: number;
  public lines: Array<string>;
  override canSetWidth = false;

  /** Height of line (always 1) */
  public height = 1;
  
  constructor(
    private readonly line: string,
    private readonly fill: string = " ",
  ) {
    super();
    this.width = unicodeWidth(stripAnsiCode(line));
    this.lines = [line];
  }

  /** Create blank line from width size */
  static blank(width: number, fill: string = " "): Line {
    const line = fill.repeat(width).substring(0, width);
    return new Line(line);
  }

  /** Overwrite from start */
  public left(label: string): Line {
    const line = label + this.line.substring(label.length, this.line.length);
    return new Line(line);
  }

  /** Overwrite at end */
  public right(label: string): Line {
    const line = this.line.substring(0, this.line.length - label.length) +
      label;
    return new Line(line);
  }

  /** Overwrite centered at position */
  public at(position: number, label: string): Line {
    const line =
      this.line.substring(0, position - Math.floor(label.length / 2)) +
      label +
      this.line.substring(
        position + Math.ceil(label.length / 2),
        this.line.length,
      );
    return new Line(line);
  }

  /** Overwrite at middle of line */
  public center(label: string): Line {
    return this.at(this.line.length / 2, label);
  }

  /** Set width */
  public setWidth(width: number): Line {
    if (width === this.width) return this;
    return Line.blank(width, this.fill).left(this.line);
  }

  // public override get canSetWidth(): boolean {
  //   return false;
  // }

  /** Cannot set height */
  public setHeight(height: number): Line {
    if (height !== 1) {
      throw new Error("Cannot set height of line to other than 1");
    }
    return this;
  }
}
