import { assertEquals } from "@std/assert";
import { ansiLength, ansiTrunk } from "./ansi.ts";

// Testcases for ansiLength function

Deno.test("Get length of ansi string", () => {
  assertEquals(ansiLength("Hello, World!"), 13);
  assertEquals(ansiLength("\u001b[31mHello, 🤓!\u001b[39m"), 10);
});

// Testcases for ansiTrunk function

Deno.test("Truncate string to desired length", () => {
  assertEquals(ansiTrunk("Hello, World!", 10), "Hello, Wor");
  assertEquals(
    ansiTrunk("\u001b[31mHello, 🤓!\u001b[39m", 9),
    "\u001b[31mHello, 🤓\u001b[39m",
  );
});

Deno.test("Extend string to desired length", () => {
  assertEquals(ansiTrunk("Hello", 10), "Hello     ");
  assertEquals(
    ansiTrunk("\u001b[31mHello 🤓\u001b[39m", 9),
    "\u001b[31mHello 🤓\u001b[39m ",
  );
});
