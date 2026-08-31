import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { isAuthenticated } from "@/services/api-client";

export const Route = createRootRoute({
  component: RootLayout,
  beforeLoad: ({ location }) => {
    const publicPaths = ["/super-admin/login"];
    const isPublic = publicPaths.some((path) =>
      location.pathname.startsWith(path)
    );

    if (!isPublic && !isAuthenticated()) {
      throw redirect({ to: "/super-admin/login" });
    }

    if (isPublic && isAuthenticated() && location.pathname === "/super-admin/login") {
      throw redirect({ to: "/super-admin/dashboard" });
    }
  },
});

function RootLayout() {
  return (
    <>
      <Outlet />
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
