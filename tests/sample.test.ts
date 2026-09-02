import { describe, expect, it } from "vitest";
import { userHasAdminAccess, isAdminRole } from "@/types/auth";
import type { AuthUser } from "@/types/auth";
import { getApiErrorMessage } from "@/lib/api/client";

describe("auth role helpers", () => {
  it("identifies admin roles correctly", () => {
    expect(isAdminRole("organization_admin")).toBe(true);
    expect(isAdminRole("super_admin")).toBe(true);
    expect(isAdminRole("coach")).toBe(false);
    expect(isAdminRole("player")).toBe(false);
  });

  it("grants admin access to organization admins", () => {
    const user: AuthUser = {
      id: "1",
      email: "admin@test.com",
      firstName: "Test",
      lastName: "Admin",
      role: "organization_admin",
      roles: ["organization_admin"],
    };
    expect(userHasAdminAccess(user)).toBe(true);
  });

  it("denies admin access to coaches", () => {
    const user: AuthUser = {
      id: "2",
      email: "coach@test.com",
      firstName: "Test",
      lastName: "Coach",
      role: "coach",
      roles: ["coach"],
    };
    expect(userHasAdminAccess(user)).toBe(false);
  });
});

describe("getApiErrorMessage", () => {
  it("maps 401 errors to session message", () => {
    const error = {
      isAxiosError: true,
      response: { status: 401, data: {} },
      message: "Request failed with status code 401",
    };
    expect(getApiErrorMessage(error)).toBe(
      "Your session may have expired. Please sign in again.",
    );
  });

  it("returns fallback for unknown errors", () => {
    expect(getApiErrorMessage(new Error("unknown"))).toBe(
      "Something went wrong. Please try again.",
    );
  });
});
