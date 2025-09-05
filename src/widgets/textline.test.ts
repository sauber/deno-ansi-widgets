import { assertEquals, assertInstanceOf } from "@std/assert";
import { TextLine } from "./textline.ts";

Deno.test("Blank Instance", () => {
  const b = TextLine.width(0);
  assertInstanceOf(b, TextLine);
});

Deno.test("Fill", () => {
  const b = TextLine.width(2);
  assertEquals(b.toString(), "  ");
});

Deno.test("Fill with multichars", () => {
  const b = TextLine.width(2, "abc");
  assertEquals(b.toString(), "ab");
});


Deno.test("Char", () => {
  const b = TextLine.width(2, "=");
  assertEquals(b.toString(), "==");
});

Deno.test("Left", () => {
  const b = TextLine.width(5).left("hi");
  assertEquals(b.toString(), "hi   ");
});

Deno.test("Right", () => {
  const b = TextLine.width(5).right("hi");
  assertEquals(b.toString(), "   hi");
});

Deno.test("At", () => {
  const b = TextLine.width(5).at(3, "hi");
  assertEquals(b.toString(), "  hi ");
});

Deno.test("Center", () => {
  const b = TextLine.width(5).center("hi");
  assertEquals(b.toString(), " hi  ");
});