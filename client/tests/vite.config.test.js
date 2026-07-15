import test from "node:test";
import assert from "node:assert/strict";
import config from "../vite.config.js";

test("dev server proxies auth requests to the local backend", () => {
  const proxy = config.server?.proxy?.["/auth"];

  assert.ok(proxy, "expected a /auth proxy entry");
  assert.equal(proxy.target, "http://localhost:5000");
  assert.equal(proxy.changeOrigin, true);
});
