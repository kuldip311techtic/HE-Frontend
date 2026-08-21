import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import { ToastProvider } from "@/context/ToastContext";
import type { AuthSession } from "@/lib/auth/session";
import { LoginPage } from "@/pages/LoginPage";

function createSession(): AuthSession {
  return {
    accessToken: "token",
    refreshToken: "refresh",
    tokenType: "Bearer",
    expiresIn: 3600,
    email: "admin@example.com",
    role: "super_admin",
    redirectTo: "/admin/dashboard",
  };
}

function createAuthValue(
  overrides: Partial<AuthContextValue> = {},
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

function renderPage(auth: AuthContextValue) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthContext.Provider value={auth}>
        <ToastProvider>
          <MemoryRouter initialEntries={["/admin/login"]}>
            <Routes>
              <Route path="/admin/login" element={children} />
              <Route path="/admin/dashboard" element={<p>Dashboard</p>} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </AuthContext.Provider>
    );
  }

  return render(<LoginPage />, { wrapper: Wrapper });
}

describe("LoginPage", () => {
  it("renders the Super Admin login heading and form", () => {
    renderPage(createAuthValue());

    expect(
      screen.getByRole("heading", { name: "Super Admin login" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("redirects authenticated Super Admins to the dashboard", () => {
    const session = createSession();
    renderPage(
      createAuthValue({
        session,
        isAuthenticated: true,
        isAdmin: true,
        isSuperAdmin: true,
      }),
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Super Admin login" }),
    ).not.toBeInTheDocument();
  });
});
