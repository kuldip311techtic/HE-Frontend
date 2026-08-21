import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import type { AuthSession } from "@/lib/auth/session";

const session: AuthSession = {
  accessToken: "token",
  refreshToken: "refresh",
  tokenType: "Bearer",
  expiresIn: 3600,
  email: "super@example.com",
  role: "super_admin",
  redirectTo: "/admin",
};

const authValue: AuthContextValue = {
  session,
  status: "ready",
  isAuthenticated: true,
  isAdmin: true,
  isSuperAdmin: true,
  isLoggingIn: false,
  loginError: null,
  login: async () => session,
  logout: () => undefined,
  clearLoginError: () => undefined,
};

describe("AdminLayout", () => {
  it("renders the sidebar and header for Super Admin", () => {
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter>
          <AdminLayout />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByLabelText("Admin navigation")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Super Admin")).toBeInTheDocument();
    expect(screen.getByText("super@example.com")).toBeInTheDocument();
  });
});
