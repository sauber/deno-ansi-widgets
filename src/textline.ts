import { unicodeWidth } from "@std/cli/unicode-width";
import { stripAnsiCode } from "@std/fmt/colors";

/** Plot chunks of strings onto another string */
export class TextLine {
  public length: number;

  constructor(
    private readonly line: string,
    private readonly fill: string = " ",
  ) {
    this.length = unicodeWidth(stripAnsiCode(line));
  }

  /** Create line from width and filling character */
  static width(width: number, fill: string = " "): TextLine {
    const line = fill.repeat(width).substring(0, width);
    return new TextLine(line, fill);
  }

  /** Overwrite from start */
  public left(label: string): TextLine {
    const line = label + this.line.substring(label.length, this.line.length);
    return new TextLine(line, this.fill);
  }

  /** Overwrite at end */
  public right(label: string): TextLine {
    const line = this.line.substring(0, this.line.length - label.length) +
      label;
    return new TextLine(line, this.fill);
  }

  /** Overwrite centered at position */
  public at(position: number, label: string): TextLine {
    const line =
      this.line.substring(0, position - Math.floor(label.length / 2)) +
      label +
      this.line.substring(
        position + Math.ceil(label.length / 2),
        this.line.length,
      );
    return new TextLine(line, this.fill);
  }

  /** Overwrite at middle of line */
  public center(label: string): TextLine {
    return this.at(this.line.length / 2, label);
  }

  public toString(): string {
    return this.line;
  }
}
