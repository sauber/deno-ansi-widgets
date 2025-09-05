import { assertEquals } from "@std/assert";
import { TextLine } from "./textline.ts";

Deno.test("TextLine can be created with text", () => {
  const line = new TextLine("Hello, World!");
  assertEquals(line.width, 13);
  assertEquals(line.height, 1);
  assertEquals(line.toString(), "Hello, World!");
});

Deno.test("TextLine can be stretched horizontally", () => {
  const line = new TextLine("Hello");
  const expectedWidth = 10;
  const actualWidth: number = line.setWidth(10);
  assertEquals(actualWidth, expectedWidth);
  assertEquals(line.width, actualWidth);
  assertEquals(line.height, 1);
  assertEquals(line.toString(), "Hello     ");
}); 

Deno.test("TextLine cannot be stretched vertically", () => {
  const line = new TextLine("Hello");
  const expectedHeight = 1;
  const actualHeight: number = line.setHeight(5);
  assertEquals(actualHeight, expectedHeight);
  assertEquals(line.width, 5);
  assertEquals(line.toString(), "Hello");
});

