import { afterEach, describe, expect, it, vi } from "vitest";

import { login } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/apiClient";
import type { LoginResponse } from "@/types/api";

const loginResponse: LoginResponse = {
  success: true,
  message: "Authenticated",
  data: {
    access_token: "access-token",
    refresh_token: "refresh-token",
    token_type: "Bearer",
    expires_in: 3600,
    email: "admin@example.com",
    password: "",
    description: "",
    message: "Authenticated",
    error: null,
    redirect_to: "/admin/dashboard",
    subscription: {
      status: "active",
      has_access: true,
      access_until: null,
    },
  },
};

describe("login endpoint", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts credentials to /auth/login", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(loginResponse), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await login({
      email: "admin@example.com",
      password: "secret",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(String(url)).toMatch(/\/auth\/login$/);
    expect(init).toEqual(
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          email: "admin@example.com",
          password: "secret",
        }),
      }),
    );
    expect(result.data.access_token).toBe("access-token");
  });

  it("surfaces the API error envelope for failed login", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          message: "Invalid email or password.",
          error: { code: "unauthorized", details: null },
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const error = await login({
      email: "admin@example.com",
      password: "wrong",
    }).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      message: "Invalid email or password.",
      status: 401,
      code: "unauthorized",
    });
  });
});
