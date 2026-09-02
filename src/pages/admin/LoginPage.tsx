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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

/** Page-only select trigger to match dark inputs */
const loginSelectTriggerClassName = cn(
  "h-[44px] rounded-[10px] border-figma-border bg-figma-surface-deep px-[14px]",
  "text-body-21 text-white",
  "focus:ring-2 focus:ring-figma-brand-glow focus:ring-offset-0",
  "[&>span]:text-body-21 [&>svg]:text-figma-muted",
);

const loginSelectContentClassName = cn(
  "border-figma-border bg-figma-surface-deep text-white",
);

const loginSelectItemClassName = cn(
  "text-body-21 focus:bg-figma-brand-glow focus:text-white",
);

const ROLE_OPTIONS = [
  { value: "organization_admin", label: "Organization Admin" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "coach", label: "Coach (denied)" },
  { value: "player", label: "Player (denied)" },
] as const;

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
      <div
        className="login-bg-glow pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full flex-col lg:min-h-screen lg:flex-row">
        {/* Form column — fixed width on desktop, centered full-screen on mobile */}
        <div className="flex min-h-screen w-full shrink-0 flex-col items-center justify-center px-[24px] py-[32px] lg:min-h-0 lg:w-[420px] lg:max-w-[420px] lg:items-stretch lg:justify-center lg:px-[24px] lg:py-[32px]">
          <Card className="w-full max-w-md border-figma-border bg-figma-surface shadow-none">
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={loginSelectTriggerClassName}
                            >
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={loginSelectContentClassName}>
                            {ROLE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className={loginSelectItemClassName}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
