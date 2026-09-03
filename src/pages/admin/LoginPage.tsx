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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { ErrorMessage } from "@/components/ui/feedback";
import { useAuth } from "@/hooks/useAuth";
import {
  createDemoAuthUser,
  getDemoAuthToken,
  isDemoAdminRole,
} from "@/lib/auth/demo-auth";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const demoRoles = [
  { value: "super_admin", label: "Super Admin" },
  { value: "organization_admin", label: "Organization Admin" },
  { value: "admin", label: "Admin" },
  { value: "coach", label: "Coach" },
  { value: "player", label: "Player" },
] as const satisfies ReadonlyArray<{ value: UserRole; label: string }>;

const loginSchema = z.object({
  role: z.enum(
    ["super_admin", "organization_admin", "admin", "coach", "player"],
    { required_error: "Please select a role." },
  ),
  email: z
    .string()
    .optional()
    .refine(
      (value) => !value || z.string().email().safeParse(value).success,
      "Please enter a valid email address.",
    ),
  password: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Page-only Input override — dark Figma field via theme tokens */
const loginInputClassName = cn(
  "!h-[44px] !w-full !rounded-[10px] !border !px-[14px] !py-0 !shadow-none !ring-offset-0",
  "!border-figma-border !bg-figma-surface-deep !text-white",
  "font-outfit text-body-21",
  "placeholder:font-outfit placeholder:text-body-21 placeholder:text-figma-accent",
  "hover:!border-figma-accent",
  "focus-visible:!border-figma-bright focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-figma-brand-glow focus-visible:!ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const loginSelectTriggerClassName = cn(
  loginInputClassName,
  "data-[login-field=true]",
  "data-[placeholder]:text-figma-accent",
  "[&>span]:font-outfit [&>span]:text-body-21",
);

/** Page-only Button override — brand fill with dark label text */
const loginButtonClassName = cn(
  "login-submit-btn !h-[44px] !w-full !rounded-[10px] !px-[14px] !py-0 !shadow-none !ring-offset-0",
  "!border !border-figma-border !bg-figma-brand",
  "font-outfit text-body-10 !text-figma-border",
  "hover:!bg-figma-brand/90 hover:!text-figma-border",
  "active:!bg-figma-brand/80 active:!text-figma-border",
  "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-figma-bright focus-visible:!ring-offset-2 focus-visible:!ring-offset-figma-background",
  "[&_svg]:!text-figma-border",
  "disabled:pointer-events-none disabled:opacity-50",
);

const loginErrorClassName = cn(
  "rounded-[10px] border border-figma-danger-subtle bg-figma-danger-muted px-[14px] py-[12px]",
  "font-outfit text-body-sm text-figma-danger",
);

export function AdminLoginPage() {
  const { login, isAuthenticated, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    "/admin/dashboard";

  useEffect(() => {
    if (isAuthenticated && hasAdminAccess) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, hasAdminAccess, from, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: undefined,
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const role = values.role;

      if (!isDemoAdminRole(role)) {
        toast.error("Access denied. Admin credentials are required.");
        navigate("/admin/unauthorized", { replace: true });
        return;
      }

      const authUser = createDemoAuthUser(role, values.email);
      login(getDemoAuthToken(), authUser);
      toast.success("Signed in successfully.");
      navigate(from, { replace: true });
    } catch {
      setFormError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page relative flex min-h-screen bg-figma-background font-outfit">
      <div
        className="login-bg-glow pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full flex-col lg:min-h-screen lg:flex-row">
        {/* Form column — fixed 420px on desktop; do not widen */}
        <div className="flex min-h-screen w-full shrink-0 flex-col items-center justify-center px-[24px] py-[32px] lg:min-h-0 lg:w-[420px] lg:max-w-[420px] lg:flex-none lg:items-stretch lg:justify-center lg:px-[24px] lg:py-[32px]">
          <Card className="w-full rounded-[10px] border-figma-border bg-figma-surface text-white shadow-none">
            <CardHeader className="space-y-[12px] px-[20px] pt-[24px] text-center">
              <div className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-[100px] bg-figma-brand-glow">
                <Shield
                  className="h-[24px] w-[24px] text-figma-bright"
                  aria-hidden="true"
                />
              </div>
              <h1 className="font-outfit text-body-42 text-white">
                Admin Sign In
              </h1>
              <CardDescription className="font-outfit text-body-21 text-figma-muted">
                Demo sign-in for local development. Select an admin role to
                access the panel.
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
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="login-field-label font-lato text-body-5 text-figma-accent">
                          Role
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={loginSelectTriggerClassName}
                              data-login-field="true"
                            >
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-figma-border bg-figma-surface font-outfit text-body-21 text-white">
                            {demoRoles.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="font-outfit text-body-21 focus:bg-figma-surface-deep focus:text-white"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-outfit text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="login-field-label font-lato text-body-5 text-figma-accent">
                          Email{" "}
                          <span className="text-figma-accent/70">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="admin@hoopsengine.com"
                            autoComplete="email"
                            className={loginInputClassName}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-outfit text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel className="login-field-label font-lato text-body-5 text-figma-accent">
                          Password{" "}
                          <span className="text-figma-accent/70">(optional)</span>
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
                        <FormMessage className="font-outfit text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  {formError && (
                    <ErrorMessage
                      message={formError}
                      className={loginErrorClassName}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="ghost"
                    className={loginButtonClassName}
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Brand column — absorbs remaining width */}
        <div className="hidden min-w-0 flex-1 flex-col items-start justify-center gap-[20px] px-[28px] py-[32px] lg:flex">
          <p className="font-outfit text-body-9 max-w-[420px] text-figma-muted">
            Hoops Engine Admin
          </p>
          <h2 className="font-outfit text-body-56 max-w-[480px] text-white">
            Manage organizations, users, and platform analytics from one
            workspace.
          </h2>
          <p className="font-inter text-body-71 max-w-[440px] text-figma-accent">
            Secure access for administrators.
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
