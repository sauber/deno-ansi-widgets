import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { Progress } from "./progress.ts";

Deno.test("Progress instance", () => {
  const p = new Progress("Test", 100, 20);
  assertInstanceOf(p, Progress);

});

Deno.test("Progress dimensions", () => {
  const p = new Progress("Test", 100, 20);
  assert(p instanceof Progress);
  assertEquals(p.height, 1);
  assertEquals(p.canSetHeight, false);
  assertEquals(p.width, 20);
});

Deno.test("Progress rendering", () => {
  const width = 20;
  const max = 100;
  const current = 30;
  const label = "Test";
  const p = new Progress(label, 100, width);
  p.update(current);
  const output = p.toString();
  assertEquals(output.length, width);
  assert(output.startsWith(label + " ["));
  assert(output.includes("░]"));
  assert(output.includes(current + "/" + max));
});
