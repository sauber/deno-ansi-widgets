import { assertEquals } from "@std/assert";
import { yaxis } from "./yaxis.ts";

Deno.test("Empty", () => {
  const chart = yaxis(0, 0, 0);
  assertEquals(chart, "");
});

Deno.test("Single line", () => {
  const chart = yaxis(0, 10, 1);
  assertEquals(chart, "0┤");
});

Deno.test("Multiple lines", () => {
  const chart = yaxis(0, 10, 5);
  const lines = chart.split("\n");
  assertEquals(lines, [
    "20┤",
    "15┤",
    "10┤",
    " 5┤",
    " 0┤",
  ]);
});

Deno.test("Custom separator", () => {
  const chart = yaxis(0, 10, 5, "x");
  const lines = chart.split("\n");
  assertEquals(lines, [
    "20x",
    "15x",
    "10x",
    " 5x",
    " 0x",
  ]);
});

Deno.test("Negative numbers", () => {
  const chart = yaxis(-10, 0, 5);
  const lines = chart.split("\n");
  assertEquals(lines, [
    " 10┤",
    "  5┤",
    "  0┤",
    " -5┤",
    "-10┤",
  ]);
});

Deno.test("Float numbers", () => {
  const chart = yaxis(-0.5, 1.5, 5);
  const lines = chart.split("\n");
  assertEquals(lines, [
    " 1.5┤",
    "   1┤",
    " 0.5┤",
    "   0┤",
    "-0.5┤",
  ]);
});
