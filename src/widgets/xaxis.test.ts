import { assertEquals } from "@std/assert";
import { XAxis } from "./xaxis.ts";

Deno.test("Empty line", () => {
  const axis = new XAxis(0, 10, 0);
  assertEquals(axis.toString(), "");
});

Deno.test("Single character line", () => {
  const axis = new XAxis(0, 10, 1);
  assertEquals(axis.toString(), "─");
});

Deno.test("Min and max line", () => {
  const axis = new XAxis(0, 10, 4);
  assertEquals(axis.toString(), "0─10");
});

Deno.test("Basic line", () => {
  const axis = new XAxis(0, 20, 17);
  assertEquals(axis.toString(), "0───5──10──15──20");
});

Deno.test("Labels and positions", () => {
  const axis = new XAxis(0, 20, 17);
  assertEquals(axis.labels, [0, 5, 10, 15, 20]);
  assertEquals(axis.positions, [0, 5, 8, 12, 15]);
});
