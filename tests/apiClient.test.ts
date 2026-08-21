import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/apiClient";
import { writeSession } from "@/lib/auth/session";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("attaches a Bearer token from the stored session", async () => {
    writeSession({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 3600,
      email: "admin@example.com",
      role: "super_admin",
      redirectTo: "/admin",
    });

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await apiClient("/health");

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();
    const init = firstCall?.[1];
    const headers = new Headers(
      init && typeof init === "object" && "headers" in init
        ? init.headers
        : undefined,
    );
    expect(headers.get("Authorization")).toBe("Bearer access-token");
  });
});
