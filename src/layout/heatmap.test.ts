import { assertEquals } from "@std/assert";
import { Heatmap } from "./heatmap.ts";

Deno.test("Instance", () => {
  const h = new Heatmap([], 0, 0);
  assertEquals(h.width, 0);
  assertEquals(h.height, 0);
  assertEquals(h.toString(), "");
});

Deno.test("Content", () => {
  const h = new Heatmap([], 2, 2);
  assertEquals(h.width, 2);
  assertEquals(h.height, 2);
  assertEquals(h.toString(), "  \n  ");
});
