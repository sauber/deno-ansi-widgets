import { assertEquals } from "@std/assert";
import { YAxis } from "./yaxis.ts";

Deno.test("Empty", () => {
  const yaxis = new YAxis(0, 0, 0);
  const chart = yaxis.lines();
  assertEquals(chart, []);
});

Deno.test("Single line", () => {
  const yaxis = new YAxis(0, 10, 1);
  const chart = yaxis.lines();
  assertEquals(chart, ["0┤"]);
});

Deno.test("Multiple lines", () => {
  const yaxis = new YAxis(0, 10, 5);
  const chart = yaxis.lines();
  assertEquals(chart, [
    "20┤",
    "15┤",
    "10┤",
    " 5┤",
    " 0┤",
  ]);
});

Deno.test("Custom separator", () => {
  const yaxis = new YAxis(0, 10, 5, "x");
  const chart = yaxis.lines();
  assertEquals(chart, [
    "20x",
    "15x",
    "10x",
    " 5x",
    " 0x",
  ]);
});

Deno.test("Negative numbers", () => {
  const yaxis = new YAxis(-10, 0, 5);
  const chart = yaxis.lines();
  assertEquals(chart, [
    " 10┤",
    "  5┤",
    "  0┤",
    " -5┤",
    "-10┤",
  ]);
});

Deno.test("Float numbers", () => {
  const yaxis = new YAxis(-0.5, 1.5, 5);
  const chart = yaxis.lines();
  assertEquals(chart, [
    " 1.5┤",
    "   1┤",
    " 0.5┤",
    "   0┤",
    "-0.5┤",
  ]);
});
