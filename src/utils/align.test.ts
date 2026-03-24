import { assertEquals } from "@std/assert";
import { alignNumbers } from "./align.ts";

Deno.test("Empty array", () => {
  const result = alignNumbers([]);
  assertEquals(result, []);
});

Deno.test("Single number", () => {
  const result = alignNumbers([1]);
  assertEquals(result, ["1"]);
});

Deno.test("Multiple numbers", () => {
  const result = alignNumbers([1, 23, 456]);
  assertEquals(result, ["  1", " 23", "456"]);
});

Deno.test("Negative numbers", () => {
  const result = alignNumbers([-1, -23, -456]);
  assertEquals(result, ["  -1", " -23", "-456"]);
});

Deno.test("Mixed positive and negative numbers", () => {
  const result = alignNumbers([-1, 23, -456, 7]);
  assertEquals(result, ["  -1", "  23", "-456", "   7"]);
});

Deno.test("Floating point numbers", () => {
  const result = alignNumbers([1.2, 34.56, 7.8901]);
  assertEquals(result, [" 1.2000", "34.5600", " 7.8901"]);
});
