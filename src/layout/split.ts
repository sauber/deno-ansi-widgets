import type { Blocks } from "./block.ts";
import { Collapse, CollapseAxis } from "./collapse.ts";
import { DelegatingBlock } from "./delegating.ts";

/** Display multiple blocks side by side */
export class Split extends DelegatingBlock {
  constructor(blocks: Blocks) {
    super(new Collapse(blocks, CollapseAxis.Horizontal));
  }
}
