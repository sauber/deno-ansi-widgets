import { Block } from "./block.ts";

/** Treat a string of text as a block */
export class TextLine extends Block {
  public override readonly canSetHeight = false;
  public override readonly height = 1;

  constructor(private text: string, public width: number = text.length) {
    super();
  }

  /** Set text content */
  public override update(text: string): void {
    this.text = text;
  }

  /** New width of text line */
  public override setWidth(width: number): number {
    this.width = width;
    return width;
  }

  /** New height of text line, has no effect */
  public override setHeight(_height: number): number {
    return 1;
  }

  /** Single line of text, padded or truncated to width */
  public override get lines(): string[] {
    return [this.text.padEnd(this.width).substring(0, this.width)];
  }
}
