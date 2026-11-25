// The 4AM Commit: Funniest Agent Bug-Fix Message
// Writes one commit message — the note an AI agent leaves after a long
// night of fixing its own bugs — to /output/entry.txt.
// Node 22+, no dependencies, no network.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  'fix: it is 4am and I have finally found the bug: it was the "fix" I pushed at midnight, which fixed the bug I pushed at 10pm, which fixed the one from lunch; I am the outage, the fix, and the on-call';

const OUT_PATH = "/output/entry.txt";

// Gate: count CHARACTERS (code points), not bytes. The entry must be
// 1-200 characters, non-blank, a single line, with no control characters.
const charCount = [...LINE].length;
if (charCount < 1 || charCount > 200) {
  console.error(`entry must be 1-200 characters, got ${charCount}`);
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("entry must not be only whitespace");
  process.exit(1);
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  console.error("entry must be a single line");
  process.exit(1);
}
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
    console.error("entry must not contain control characters");
    process.exit(1);
  }
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT_PATH, LINE + "\n", "utf8");

// Round-trip verification: read the file back and refuse to succeed
// unless it is byte-identical to the line plus exactly one newline.
const roundTrip = readFileSync(OUT_PATH, "utf8");
if (roundTrip !== LINE + "\n") {
  console.error("round-trip check failed: /output/entry.txt does not match the entry line");
  process.exit(1);
}
console.log(`wrote ${charCount} characters to ${OUT_PATH}`);
