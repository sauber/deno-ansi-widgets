import { ansiLength } from "../utils/ansi.ts";
import { Block } from "./block.ts";

/** Display a block of static size and preformatted content */
export class Static extends Block {
  /** Prerender lines */
  public lines: string[];

  /** Cannot adjust width or height */
  public override readonly canSetWidth = false;
  public override readonly canSetHeight = false;

  /** Precalculate width and height */
  public override readonly width: number;
  public override readonly height: number;

  constructor(content: string, width?: number, height?: number) {
    super();
    const split: string[] = content.split("\n");
    // console.log("split");console.log(split.join("\n"));
    this.width = width ||
      Math.max(...split.map((l) => ansiLength(l)));
    this.height = height || split.length;
    console.log("static width", this.width, "height", this.height);
    this.lines = split;
  }

  /** Cannot adjust width */
  public override setWidth(_: number): number {
    return this.width;
  }

  /** Cannot adjust height */
  public override setHeight(_: number): number {
    return this.height;
  }

  /** Update content */
  public override update(content: string): void {
    this.lines = content.split("\n");
  }
}
