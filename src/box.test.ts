import { assertEquals } from "@std/assert";
import { Box } from "./box.ts";

Deno.test("Instance", () => {
  const box = new Box(0, 0);
  assertEquals(box.width, 0);
  assertEquals(box.height, 0);
  assertEquals(box.toString(), "");
});

Deno.test("Content", () => {
  const box = new Box(2, 2);
  assertEquals(box.width, 2);
  assertEquals(box.height, 2);
  assertEquals(box.toString(), "  \n  ");
});
