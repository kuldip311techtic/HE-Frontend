import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { LoginForm } from "@/components/ui/LoginForm";
import { AuthContext, type AuthContextValue } from "@/context/auth-context";
import { ToastProvider } from "@/context/ToastContext";
import type { AuthSession } from "@/lib/auth/session";

const session: AuthSession = {
  accessToken: "token",
  refreshToken: "refresh",
  tokenType: "Bearer",
  expiresIn: 3600,
  email: "admin@example.com",
  role: "super_admin",
  redirectTo: "/admin/dashboard",
};

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

function renderLogin(auth: AuthContextValue) {
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

  return render(<LoginForm />, { wrapper: Wrapper });
}

describe("LoginForm", () => {
  it("associates labels with email and password fields", () => {
    renderLogin(createAuthValue());

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("shows field errors when email and password are empty", async () => {
    const user = userEvent.setup();
    renderLogin(createAuthValue());

    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("displays an inline error for failed login attempts", () => {
    renderLogin(
      createAuthValue({
        loginError: "Invalid email or password.",
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    );
  });

  it("shows a loading spinner while login is processing", () => {
    renderLogin(createAuthValue({ isLoggingIn: true }));

    expect(screen.getByRole("status")).toHaveTextContent("Logging in");
    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });

  it("redirects to the dashboard and shows a success toast after login", async () => {
    const user = userEvent.setup();
    const login = vi.fn().mockResolvedValue(session);

    renderLogin(createAuthValue({ login }));

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "secret");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(login).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "secret",
    });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Signed in successfully.",
    );
  });
});
