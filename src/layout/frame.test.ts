import { assertEquals, assertInstanceOf } from "@std/assert";
import { Box } from "./box.ts";
import { Frame } from "./frame.ts";

Deno.test("Instance", () => {
  const frameInstance = new Frame(new Box(0, 0), "");
  assertInstanceOf(frameInstance, Frame);
});

Deno.test("Frame with empty title and empty box", () => {
  const frameInstance = new Frame(new Box(0, 0), "");
  assertInstanceOf(frameInstance, Frame);
  const expected = "┌┐\n││\n└┘";
  assertEquals(frameInstance.toString(), expected);
});
