import { assertEquals } from "@std/assert";
import { progress } from "./progress.ts";

Deno.test("Start of progress", () => {
  const bar = progress(0, 100, 0, 20);
  assertEquals(bar.length, 20);
  const expected = "[░░░░░░░░░░] 0/100 ∞";
  assertEquals(bar, expected);
});

Deno.test("Halfway progress", () => {
  const bar = progress(50, 100, 10000, 20);
  const expected = "[███░░] 50/100 10.0s";
  assertEquals(bar, expected);
});

Deno.test("Completed progress", () => {
  const bar = progress(100, 100, 20000, 20);
  const expected = "[█████] 100/100 0.0s";
  assertEquals(bar, expected);
});

Deno.test("Over-complete progress", () => {
  const bar = progress(150, 100, 0, 20);
  const expected = "[█████] 150/100 0.0s";
  assertEquals(bar, expected);
});

Deno.test("Long running progress", () => {
  // Simulate a long running task that will complete in over an hour
  const oneHourMs = 3600 * 1000;
  const time: string = new Date(Date.now() + oneHourMs).toTimeString().slice(
    0,
    5,
  );
  const bar = progress(50, 100, oneHourMs, 20);
  const expected = `[███░░] 50/100 ${time}`;
  assertEquals(bar, expected);
});
