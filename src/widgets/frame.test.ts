import { frame } from "./frame.ts";
import { assertEquals } from "@std/assert";

Deno.test("Frame with empty title and empty string", () => {
  const framed = frame("", "");
  const lines = framed.split("\n");
  assertEquals(lines[0], "┌┐");
  assertEquals(lines[1], "││");
  assertEquals(lines[2], "└┘");
});

Deno.test("Frame with title and empty string", () => {
  const framed = frame("", "Title");
  const lines = framed.split("\n");
  assertEquals(lines[0], "┌Title┐");
  assertEquals(lines[1], "│     │");
  assertEquals(lines[2], "└─────┘");
});

Deno.test("Frame with title and single line", () => {
  const framed = frame("Hello", "Title");
  const lines = framed.split("\n");
  assertEquals(lines[0], "┌Title┐");
  assertEquals(lines[1], "│Hello│");
  assertEquals(lines[2], "└─────┘");
});

Deno.test("Frame with title and multiple lines", () => {
  const framed = frame("Hello\nWorld!", "Title");
  const lines = framed.split("\n");
  assertEquals(lines[0], "┌Title─┐");
  assertEquals(lines[1], "│Hello │");
  assertEquals(lines[2], "│World!│");
  assertEquals(lines[3], "└──────┘");
});

Deno.test("Frame with long title and multiple lines", () => {
  const framed = frame("Hello\nWorld!", "Longer Title");
  const lines = framed.split("\n");
  assertEquals(lines[0], "┌Longer Title┐");
  assertEquals(lines[1], "│Hello       │");
  assertEquals(lines[2], "│World!      │");
  assertEquals(lines[3], "└────────────┘");
});
