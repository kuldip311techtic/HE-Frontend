import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import type { AuthUser, UserRole } from "@/types/auth";
import { userHasAdminAccess } from "@/types/auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  role: z.enum(["organization_admin", "super_admin", "admin", "coach", "player"]),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Page-only field styling — dark Figma fill, not library white */
const loginInputClassName = cn(
  "h-[44px] rounded-[10px] border-figma-border bg-figma-surface-deep px-[14px]",
  "text-body-21 text-white placeholder:text-figma-muted",
  "focus-visible:border-figma-bright focus-visible:ring-2 focus-visible:ring-figma-brand-glow focus-visible:ring-offset-0",
  "hover:border-figma-accent",
);

/** Page-only CTA — brand fill with dark label text */
const loginButtonClassName = cn(
  "h-[44px] w-full rounded-[10px] border border-figma-border bg-figma-brand",
  "text-body-10 text-figma-border shadow-none [&_svg]:text-figma-border",
  "hover:bg-figma-brand/90 active:bg-figma-brand/80",
  "focus-visible:ring-2 focus-visible:ring-figma-bright focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "disabled:opacity-50",
);

/** Page-only select to match dark inputs */
const loginSelectClassName = cn(
  "flex h-[44px] w-full rounded-[10px] border border-figma-border bg-figma-surface-deep px-[14px]",
  "text-body-21 text-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand-glow focus-visible:ring-offset-0",
);

export function AdminLoginPage() {
  const { login, isAuthenticated, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin";

  useEffect(() => {
    if (isAuthenticated && hasAdminAccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, hasAdminAccess, from, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "organization_admin",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const demoUser: AuthUser = {
        id: "demo-admin-1",
        email: values.email,
        firstName: "Organization",
        lastName: "Admin",
        role: values.role as UserRole,
        roles: [values.role as UserRole],
      };

      if (!userHasAdminAccess(demoUser)) {
        toast.error("Access denied. Admin credentials are required.");
        navigate("/admin/unauthorized");
        return;
      }

      login("demo-admin-token", demoUser);
      toast.success("Signed in successfully.");
      navigate(from, { replace: true });
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-figma-background font-outfit">
      {/* Radial glow layers — project background treatment */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 55% 45% at 78% 42%, rgba(134, 211, 31, 0.18) 0%, transparent 68%)",
            "radial-gradient(ellipse 42% 38% at 18% 72%, rgba(27, 201, 79, 0.12) 0%, transparent 62%)",
            "radial-gradient(ellipse 30% 28% at 52% 12%, rgba(68, 81, 84, 0.22) 0%, transparent 70%)",
            "linear-gradient(180deg, #081410 0%, #0b1f12 48%, #081410 100%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        {/* Form column — fixed width, do not widen */}
        <div className="flex w-full shrink-0 flex-col justify-center px-[24px] py-[32px] lg:w-[420px] lg:max-w-[420px] lg:px-[24px] lg:py-[32px]">
          <Card className="w-full border-figma-border bg-figma-surface shadow-none">
            <CardHeader className="space-y-[12px] px-[20px] pt-[24px] text-center">
              <div className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-[100px] bg-figma-brand-glow">
                <Shield
                  className="h-[24px] w-[24px] text-figma-bright"
                  aria-hidden="true"
                />
              </div>
              <h1 className="text-body-42 text-white">Admin Sign In</h1>
              <CardDescription className="text-body-21 text-figma-muted">
                Sign in with your organization admin credentials to access the
                admin panel.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-[20px] pb-[24px] pt-[12px]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-[16px]"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="text-body-5 text-figma-muted">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="admin@organization.com"
                            autoComplete="email"
                            className={loginInputClassName}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="text-body-5 text-figma-muted">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className={loginInputClassName}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="text-body-5 text-figma-muted">
                          Role (demo)
                        </FormLabel>
                        <FormControl>
                          <select
                            className={loginSelectClassName}
                            {...field}
                          >
                            <option value="organization_admin">
                              Organization Admin
                            </option>
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="coach">Coach (denied)</option>
                            <option value="player">Player (denied)</option>
                          </select>
                        </FormControl>
                        <FormMessage className="text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className={loginButtonClassName}
                    isLoading={isSubmitting}
                  >
                    {isSubmitting ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Brand column — absorbs remaining width; keeps form narrow */}
        <div className="hidden flex-1 flex-col items-start justify-center gap-[20px] px-[28px] py-[32px] lg:flex">
          <p className="text-body-9 max-w-[420px] text-figma-muted">
            Hoops Engine Admin
          </p>
          <h2 className="text-body-56 max-w-[480px] text-white">
            Manage organizations, teams, and platform analytics from one workspace.
          </h2>
          <p className="font-inter text-body-71 max-w-[440px] text-figma-accent">
            Secure access for organization and super administrators.
          </p>
          <div
            className="mt-[12px] h-[1px] w-[105px] bg-figma-brand"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
