import { assertEquals, assertInstanceOf, assertThrows } from "@std/assert";
import { YAxis } from "./yaxis.ts";

Deno.test("Instance", () => {
  const axis = new YAxis(0, 100, 10);
  assertInstanceOf(axis, YAxis);
});

Deno.test("1 step", () => {
  assertThrows( () => new YAxis(0, 100, 1));
});

Deno.test("2 steps", () => {
  const axis = new YAxis(0, 100, 2);
  assertEquals(axis.lines, ["  0├", "100├"]);
});

Deno.test("3 steps", () => {
  const axis = new YAxis(0, 100, 3);
  assertEquals(axis.lines, ["  0├", " 50├", "100├"]);
});

Deno.test("Negative numbers", () => {
  const axis = new YAxis(-100, 0, 3);
  assertEquals(axis.lines, ["-100├", " -50├", "   0├"]);
});

Deno.test("Tight range of numbers", () => {
  const axis = new YAxis(0.974, 0.986, 3);
  assertEquals(axis.lines, [" 0.97├", " 0.98├", " 0.99├"]);
});
