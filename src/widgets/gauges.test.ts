import { assertEquals } from "@std/assert";
import { type Gauge, gauges } from "./gauges.ts";
import { ansiLength } from "../utils/ansi.ts";

Deno.test("Display one gauge where current = min", () => {
  const width = 40;
  const gauge: Gauge = ["Test Gauge", 0, 100, 0];
  const output: string = gauges([gauge], width);
  const expected = "Test Gauge 0 [ 0                   ] 100";
  assertEquals(output.length, width);
  assertEquals(output, expected);
});

Deno.test("Display one gauge halfway", () => {
  const width = 40;
  const gauge: Gauge = ["Test Gauge", 0, 100, 50];
  const output: string = gauges([gauge], width);
  assertEquals(ansiLength(output), width);
  const expected = "Test Gauge 0 [\x1b[7m           \x1b[0m 50       ] 100";
  assertEquals(output, expected);
});

Deno.test("Display one gauge at maximum", () => {
  const width = 40;
  const gauge: Gauge = ["Test Gauge", 0, 100, 100];
  const output: string = gauges([gauge], width);
  assertEquals(ansiLength(output), width);
  const expected = "Test Gauge 0 [\x1b[7m                 100 \x1b[0m] 100";
  assertEquals(output, expected);
});

Deno.test("Display one gauge over maximum", () => {
  const width = 40;
  const gauge: Gauge = ["Test Gauge", 0, 100, 150];
  const output: string = gauges([gauge], width);
  assertEquals(ansiLength(output), width);
  const expected = "Test Gauge 0 [\x1b[7m                 150 \x1b[0m] 100";
  assertEquals(output, expected);
});

Deno.test("Min>=max", () => {
  const width = 40;
  const gauge: Gauge = ["Test Gauge", 100, 100, 100];
  const output: string = gauges([gauge], width);
  assertEquals(ansiLength(output), width);
  const expected = "Test Gauge 100 [\x1b[7m               100 \x1b[0m] 100";
  assertEquals(output, expected);
});

Deno.test("Display multiple gauges", () => {
  const width = 50;
  const gaugesData: Gauge[] = [
    ["Foo", 0, 100, 100],
    ["Bar", 20, 50, 35],
    ["Longer Gauge Title", 0, 200, 50],
  ];
  const output: string[] = gauges(gaugesData, width).split("\n");
  const expected = [
    "Foo                 0 [\x1b[7m                  100 \x1b[0m] 100",
    "Bar                20 [\x1b[7m           \x1b[0m 35        ]  50",
    "Longer Gauge Title  0 [\x1b[7m      \x1b[0m 50             ] 200",
  ];
  assertEquals(output, expected);
});
