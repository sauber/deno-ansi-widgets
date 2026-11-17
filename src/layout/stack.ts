import type { Blocks } from "./block.ts";
import { Collapse, CollapseAxis } from "./collapse.ts";
import { DelegatingBlock } from "./delegating.ts";

/** Arrange blocks one above the other */
export class Stack extends DelegatingBlock {
  constructor(blocks: Blocks) {
    super(new Collapse(blocks, CollapseAxis.Vertical));
  }
}
