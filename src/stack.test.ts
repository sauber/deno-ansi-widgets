// Test cases for stack.ts

import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";
import { Stack } from "./stack.ts";
import { Box } from "./box.ts";
import { Line } from "./line.ts";

Deno.test("Stack can be created with no children", () => {
  const stack = new Stack([]);
  assertEquals(stack.height, 0);
  assertEquals(stack.width, 0);
});

Deno.test("Stack can be created with children", () => {
  const box1 = new Box(1, 1);
  const box2 = new Box(2, 2);
  const stack = new Stack([box1, box2]);
  assertEquals(stack.height, 3);
  assertEquals(stack.width, 2);
});

Deno.test("Stack renders children vertically", () => {
  const stack = new Stack([
    new Line("Line 1"),
    new Line("Line 2"),
  ]);
  const expected = "Line 1\nLine 2";
  assertEquals(stack.toString(), expected);
});

Deno.test("Stretch total height of children", () => {
  const stack = new Stack([
    new Box(1, 1, "x"),
    new Box(2, 2, "o"),
  ]);
  assertEquals(stack.height, 3);
  assertEquals(stack.width, 2);

  const stretched = stack.setHeight(5);
  assertEquals(stretched.height, 5);
  assertEquals(stretched.width, 2);
  assertEquals(stretched.toString(), "xx\nxx\noo\noo\noo")
});
