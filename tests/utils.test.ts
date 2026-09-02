import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";
import { resolveApiUrl } from "@/services/api-client";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("resolveApiUrl", () => {
  it("joins base URL with API path without duplicating /api", () => {
    expect(resolveApiUrl("/api/super-admin/login")).toBe(
      "http://localhost:3300/api/super-admin/login",
    );
  });
});
