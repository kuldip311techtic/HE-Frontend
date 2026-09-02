import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "@/lib/api/resolve-base-url";

describe("resolveApiBaseUrl", () => {
  it("returns the default when unset", () => {
    expect(resolveApiBaseUrl(undefined)).toBe("/api");
  });

  it("keeps relative paths unchanged", () => {
    expect(resolveApiBaseUrl("/api")).toBe("/api");
  });

  it("rewrites localhost absolute URLs to the proxied path", () => {
    expect(resolveApiBaseUrl("http://localhost:3300/api")).toBe("/api");
    expect(resolveApiBaseUrl("http://127.0.0.1:3300/api/")).toBe("/api");
  });

  it("preserves non-local absolute URLs", () => {
    expect(resolveApiBaseUrl("https://api.example.com/v1")).toBe(
      "https://api.example.com/v1",
    );
  });
});
