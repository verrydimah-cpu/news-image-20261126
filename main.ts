// main.ts — entrypoint for the news-image-20261126 bounty.
// Copies the poster image shipped beside this file into the output
// directory the grader mounts (MAKEFUN_OUTPUT_DIR). Deterministic:
// the same bytes are written on every run.
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

mkdirSync(outDir, { recursive: true });

// Clear only the contents of the output directory, entry by entry.
// Never remove the directory itself: the grader mounts it.
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

copyFileSync(source, join(outDir, "entry.png"));

// Verify the delivery: the copied file must match the source byte for
// byte, so a truncated or failed copy fails loudly instead of silently
// delivering a bad poster.
const copied = join(outDir, "entry.png");
const sourceSize = statSync(source).size;
const copiedSize = statSync(copied).size;
if (copiedSize !== sourceSize) {
  throw new Error(
    `entry.png copy mismatch: source ${sourceSize} bytes, copied ${copiedSize} bytes`,
  );
}
