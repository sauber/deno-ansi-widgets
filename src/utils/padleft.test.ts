import { assertEquals } from "@std/assert";
import { padleft } from "./padleft.ts";

Deno.test("Empty array", () => {
  const result = padleft([]);
  assertEquals(result, []);
});

Deno.test("Single number", () => {
  const result = padleft([1]);
  assertEquals(result, ["1"]);
});

Deno.test("Multiple numbers", () => {
  const result = padleft([1, 23, 456]);
  assertEquals(result, ["  1", " 23", "456"]);
});

Deno.test("Custom padding character", () => {
  const result = padleft([1, 23, 456], "0");
  assertEquals(result, ["001", "023", "456"]);
});

Deno.test("Negative numbers", () => {
  const result = padleft([-1, -23, -456]);
  assertEquals(result, ["  -1", " -23", "-456"]);
});

Deno.test("Mixed positive and negative numbers", () => {
  const result = padleft([-1, 23, -456, 7]);
  assertEquals(result, ["  -1", "  23", "-456", "   7"]);
});

Deno.test("Floating point numbers", () => {
  const result = padleft([1.2, 34.56, 7.8901]);
  assertEquals(result, ["   1.2", " 34.56", "7.8901"]);
});
