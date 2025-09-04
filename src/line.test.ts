import { assertEquals, assertInstanceOf } from "@std/assert";
import { Line } from "./line.ts";

Deno.test("Blank Instance", () => {
  const b = Line.blank(0);
  assertInstanceOf(b, Line);
});

Deno.test("Fill", () => {
  const b = Line.blank(2);
  assertEquals(b.toString(), "  ");
});

Deno.test("Fill with multichars", () => {
  const b = Line.blank(2, "abc");
  assertEquals(b.toString(), "ab");
});


Deno.test("Char", () => {
  const b = Line.blank(2, "=");
  assertEquals(b.toString(), "==");
});

Deno.test("Left", () => {
  const b = Line.blank(5).left("hi");
  assertEquals(b.toString(), "hi   ");
});

Deno.test("Right", () => {
  const b = Line.blank(5).right("hi");
  assertEquals(b.toString(), "   hi");
});

Deno.test("At", () => {
  const b = Line.blank(5).at(3, "hi");
  assertEquals(b.toString(), "  hi ");
});

Deno.test("Center", () => {
  const b = Line.blank(5).center("hi");
  assertEquals(b.toString(), " hi  ");
});