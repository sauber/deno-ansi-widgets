import { Block } from "./block.ts";

// Output cached as [full string, split into lines]
type Cached = [string, string[]];

/** Wrapper around a function which generates a block of text */
export abstract class Wrapper extends Block {
  // Cache of output from callback
  protected _output: Cached | undefined;

  constructor(protected callback: () => string) {
    super();
  }

  /** Evaluation and cache inner content */
  protected get output(): Cached {
    if (this._output) return this._output;
    const result: string = this.callback();
    return this._output = [result, result.split("\n")];
  }

  /** Deduct with from longest line of output */
  public override get width(): number {
    const [_, lines] = this.output;
    return Math.max(...lines.map((l) => l.length));
  }

  /** Height is number of lines of output */
  public override get height(): number {
    const [_, lines] = this.output;
    return lines.length;
  }

  /** String representation of the output */
  public override toString(): string {
    return this.output[0];
  }

  /** Lines of output */
  public override get lines(): string[] {
    return this.output[1];
  }

  /** Define new callback */
  public override update(callback: () => string): void {
    this.callback = callback;
    this._output = undefined;
  }
}
