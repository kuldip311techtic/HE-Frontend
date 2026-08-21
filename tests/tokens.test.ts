import { describe, expect, it } from "vitest";

import { queryKeys } from "@/lib/api/queryKeys";
import { tokens } from "@/theme/tokens";

describe("admin theme tokens", () => {
  it("defines hover and focus color tokens", () => {
    expect(tokens.colors.primaryHover).toBeTruthy();
    expect(tokens.colors.primaryFocus).toBeTruthy();
    expect(tokens.spacing.touch).toBe("2.75rem");
  });
});

describe("query keys", () => {
  it("keeps health query keys stable for cache invalidation", () => {
    expect(queryKeys.health).toEqual(["health"]);
    expect(queryKeys.healthReady).toEqual(["health", "ready"]);
  });

  it("keeps dashboard query keys stable for cache invalidation", () => {
    expect(queryKeys.dashboard()).toEqual(["dashboard"]);
    expect(
      queryKeys.dashboard({ from: "2026-01-01", to: "2026-01-31" }),
    ).toEqual(["dashboard", { from: "2026-01-01", to: "2026-01-31" }]);
  });
});
