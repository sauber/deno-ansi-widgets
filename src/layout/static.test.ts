import { assertEquals, assertInstanceOf } from "@std/assert";
import { Static } from "./static.ts";

Deno.test("Instance", () => {
  const staticBlock = new Static("Hello, world!", 20, 5);
  assertInstanceOf(staticBlock, Static);
});

Deno.test("Get dimensions", () => {
  const staticBlock = new Static("Hello, world!", 20, 5);
  assertEquals(staticBlock.width, 20);
  assertEquals(staticBlock.height, 5);
});

Deno.test("Cannot change dimensions", () => {
  const staticBlock = new Static("Hello, world!", 20, 5);
  assertEquals(staticBlock.setWidth(10), 20);
  assertEquals(staticBlock.setHeight(10), 5);
  assertEquals(staticBlock.width, 20);
  assertEquals(staticBlock.height, 5);
});
