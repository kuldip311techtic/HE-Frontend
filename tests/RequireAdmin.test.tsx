import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { RequireAdmin } from "@/components/features/RequireAdmin";
import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import type { AuthSession } from "@/lib/auth/session";

function createSession(role: string): AuthSession {
  return {
    accessToken: "token",
    refreshToken: "refresh",
    tokenType: "Bearer",
    expiresIn: 3600,
    email: "admin@example.com",
    role,
    redirectTo: "/admin",
  };
}

function createAuthValue(
  overrides: Partial<AuthContextValue>,
): AuthContextValue {
  return {
    session: null,
    status: "ready",
    isAuthenticated: false,
    isAdmin: false,
    isSuperAdmin: false,
    isLoggingIn: false,
    loginError: null,
    login: async () => {
      throw new Error("login is not available in this test");
    },
    logout: () => undefined,
    clearLoginError: () => undefined,
    ...overrides,
  };
}

function renderGate(auth: AuthContextValue) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin/login" element={<p>Login screen</p>} />
          <Route path="/admin/unauthorized" element={<p>Access denied</p>} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <p>Admin dashboard</p>
              </RequireAdmin>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("RequireAdmin", () => {
  it("redirects unauthenticated users to login", () => {
    renderGate(createAuthValue({}));
    expect(screen.getByText("Login screen")).toBeInTheDocument();
  });

  it("rejects authenticated non-admin users", () => {
    const session = createSession("member");
    renderGate(
      createAuthValue({
        session,
        isAuthenticated: true,
        isAdmin: false,
        isSuperAdmin: false,
      }),
    );
    expect(screen.getByText("Access denied")).toBeInTheDocument();
  });

  it("renders the admin shell for Super Admin", () => {
    const session = createSession("super_admin");
    renderGate(
      createAuthValue({
        session,
        isAuthenticated: true,
        isAdmin: true,
        isSuperAdmin: true,
      }),
    );
    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
  });
});
