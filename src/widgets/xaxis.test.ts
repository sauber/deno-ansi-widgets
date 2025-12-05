import { assertEquals } from "@std/assert";
import { xaxis } from "./xaxis.ts";

Deno.test("Empty line", () => {
  const line = xaxis(0, 10, 0);
  assertEquals(line, "");
});

Deno.test("Single character line", () => {
  const line = xaxis(0, 10, 1);
  assertEquals(line, "─");
});

Deno.test("Min and max line", () => {
  const line = xaxis(0, 10, 4);
  assertEquals(line, "0─10");
});

Deno.test("Basic line", () => {
  const line = xaxis(0, 20, 17);
  // assertEquals(line, "0───1───2───3───4");
  assertEquals(line, "0───5──10──15──20");
});
