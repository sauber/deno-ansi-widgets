import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { Gauges } from "./gauges.ts";

Deno.test("Gauges instance", () => {
  const g = new Gauges([
    ["Pos", 0, 100, 50],
    ["Neg", -10, 10, -5],
  ]);
  assertInstanceOf(g, Gauges);
});

Deno.test("Gauges dimensions", () => {
  const g = new Gauges([
    ["Pos", 0, 100, 50],
    ["Neg", -10, 10, -5],
  ]);
  assertEquals(g.height, 2);
  assert(!g.canSetHeight);
  assert(g.canSetWidth);
  assertEquals(g.width, 24);
  assertEquals(g.lines.length, 2);
});

