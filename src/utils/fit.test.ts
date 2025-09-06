import { assertEquals } from "@std/assert";
import { fit } from "./fit.ts";

Deno.test("Fit lines to dimensions", () => {
  const lines = [
    "This line is way too long to fit",
    "Short line",
    "Another line that is also too long"
  ];
  const fitted = fit(lines, 20, 5);
  assertEquals(fitted, [
    "This line is way too",
    "Short line          ",
    "Another line that is",
    "                    ",
    "                    "
  ]);
});
