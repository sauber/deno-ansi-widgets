import { assertEquals } from "@std/assert";
import { scale } from "./scale.ts";

// Testcases for scale function
Deno.test("scale positive integers", () => {
  const min = 0;
  const max = 10;
  const count = 5;
  const expected = [0, 5, 10, 15, 20];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});

Deno.test("scale negative integers", () => {
  const min = -11;
  const max = 0;
  const count = 5;
  const expected = [-15, -10, -5, 0, 5];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});

Deno.test("scale mixed negative and positive integers", () => {
  const min = -1;
  const max = 14;
  const count = 4;
  const expected = [-10, 0, 10, 20];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});


Deno.test("scale large integers", () => {
  const min = -1000000;
  const max = 1000000;
  const count = 5;
  const expected = [-1000000, -500000, 0, 500000, 1000000];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});

Deno.test("scale small floating point numbers", () => {
  const min = 0.1;
  const max = 1.0;
  const count = 7;
  const expected = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});

Deno.test("scale floats within a tight range", () => {
  const min = 0.974;
  const max = 0.986;
  const count = 5;
  const expected = [0.97, 0.975, 0.98, 0.985, 0.99  ];
  const actual = scale(min, max, count);
  assertEquals(actual, expected);
});
