import { describe, expect, it } from "vitest";

import {
  formatQuickAccessStatus,
  getQuickAccessStatusVariant,
  normalizeQuickAccessLink,
  unwrapQuickAccessLinks,
} from "@/lib/quick-access-helpers";
import { QUICK_ACCESS_API_PATH } from "@/types/quick-access";

describe("QUICK_ACCESS_API_PATH", () => {
  it("targets the Super Admin quick access endpoint", () => {
    expect(QUICK_ACCESS_API_PATH).toBe("/api/super-admin/quick-access");
  });
});

describe("unwrapQuickAccessLinks", () => {
  it("returns array responses as-is", () => {
    const items = [{ id: "1", label: "Organizations", href: "/orgs" }];
    expect(unwrapQuickAccessLinks(items)).toEqual(items);
  });

  it("unwraps known envelope keys", () => {
    const items = [{ id: "1", label: "Users", href: "/users" }];
    expect(unwrapQuickAccessLinks({ data: items })).toEqual(items);
    expect(unwrapQuickAccessLinks({ items })).toEqual(items);
    expect(unwrapQuickAccessLinks({ links: items })).toEqual(items);
    expect(unwrapQuickAccessLinks({ results: items })).toEqual(items);
  });

  it("returns an empty list for unrecognized envelopes", () => {
    expect(unwrapQuickAccessLinks({})).toEqual([]);
  });
});

describe("normalizeQuickAccessLink", () => {
  it("maps API fields to navigation link shape", () => {
    expect(
      normalizeQuickAccessLink(
        {
          id: "orgs",
          label: "Organizations",
          description: "Manage organizations",
          href: "/super-admin/organizations",
          status: "active",
        },
        0,
      ),
    ).toEqual({
      id: "orgs",
      label: "Organizations",
      description: "Manage organizations",
      path: "/super-admin/organizations",
      status: "active",
    });
  });

  it("falls back to title, name, and path fields", () => {
    expect(
      normalizeQuickAccessLink(
        {
          title: "Support",
          name: "Ignored when title exists",
          link: "super-admin/support",
        },
        2,
      ),
    ).toMatchObject({
      id: "quick-access-2",
      label: "Support",
      path: "/super-admin/support",
      status: "active",
    });
  });
});

describe("formatQuickAccessStatus", () => {
  it("title-cases hyphenated and underscored statuses", () => {
    expect(formatQuickAccessStatus("pending_review")).toBe("Pending Review");
    expect(formatQuickAccessStatus("in-progress")).toBe("In Progress");
  });
});

describe("getQuickAccessStatusVariant", () => {
  it("maps known statuses to badge variants", () => {
    expect(getQuickAccessStatusVariant("active")).toBe("success");
    expect(getQuickAccessStatusVariant("pending")).toBe("warning");
    expect(getQuickAccessStatusVariant("error")).toBe("destructive");
    expect(getQuickAccessStatusVariant("disabled")).toBe("secondary");
    expect(getQuickAccessStatusVariant("custom")).toBe("outline");
  });
});
