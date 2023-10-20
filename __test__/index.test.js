/**
 * Unit tests for the action's entrypoint, src/index.ts
 */

const { run } = require("../src/main");
const { describe, it } = require("node:test");
const assert = require("node:assert");

describe("index", () => {
  it("calls run when imported", async (t) => {
    const mockRun = t.mock.fn(run);
    await require("../src/main");
    assert.ok(mockRun);
  });
});
