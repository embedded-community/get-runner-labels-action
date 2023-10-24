/**
 * Unit tests for the action's entrypoint, src/index.js
 */
const { describe, it, mock } = require("node:test");
const assert = require("node:assert");

let isRunCalled = false;

// Modify the exports of main.js before requiring index.js
const originalMainModule = require("../src/main");

// Use a Proxy to wrap the run function to track its calls
const mockedMainModule = new Proxy(originalMainModule, {
  get: (target, prop) => {
    if (prop === "run") {
      return () => {
        isRunCalled = true;
      };
    }
    return target[prop];
  },
});

// Replace the exports of main.js in the require cache
require.cache[require.resolve("../src/main")] = {
  exports: mockedMainModule,
};

describe("index", () => {
  it("calls run when imported", async (context) => {
    await require("../src/index");
    assert.ok(isRunCalled);
    // Reset the cache for future tests
    delete require.cache[require.resolve("../src/index")];
    delete require.cache[require.resolve("../src/main")];
  });
});
