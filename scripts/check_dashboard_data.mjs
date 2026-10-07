import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadData } from "../dashboard/src/data.js";

globalThis.fetch = async (path) => ({
  ok: true,
  text: () => readFile(new URL(`../dashboard/public${path}`, import.meta.url), "utf8"),
});
const { cleaned, standby } = await loadData();
assert.equal(cleaned.length, 4839);
assert.equal(new Set(cleaned.map((row) => row.Brand_Reg)).size, 73);
assert.equal(standby.length, 3985);

globalThis.fetch = async () => ({
  ok: true,
  text: async () => "Screen Size Band,Count*(Submit_ID)\n1. Small,1175\n",
});
await assert.rejects(loadData(), /Invalid TV data/);
console.log("Website data: 4,839 TVs, 73 brands, 3,985 standby records; invalid summaries rejected.");
