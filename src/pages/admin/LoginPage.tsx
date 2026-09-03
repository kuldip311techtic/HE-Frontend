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

/** Figma GLOBAL DESIGN TOKENS — exact hex for this page */
const FIGMA = {
  accent: "#445154",
  brand: "#86d31f",
  border: "#0d1612",
  background: "#081410",
  surface: "#13291b",
  surfaceDeep: "#0b1f12",
  muted: "#9ca3af",
  bright: "#4bcd39",
  brandGlow: "#1bc94f1f",
} as const;

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

/** Page-only Input override — dark Figma field, not library-white */
const loginInputClassName = cn(
  "!h-[44px] !w-full !rounded-[10px] !border !px-[14px] !py-0 !text-[16px] !leading-[22px] !shadow-none !ring-offset-0",
  "!border-[#0d1612] !bg-[#0b1f12] !text-white",
  "font-outfit text-body-21",
  "placeholder:font-outfit placeholder:text-[16px] placeholder:leading-[22px] placeholder:text-[#445154]",
  "hover:!border-[#445154]",
  "focus-visible:!border-[#4bcd39] focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#1bc94f1f] focus-visible:!ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const loginSelectTriggerClassName = cn(
  loginInputClassName,
  "data-[login-field=true]",
  "data-[placeholder]:text-[#445154]",
  "[&>span]:font-outfit [&>span]:text-[16px] [&>span]:leading-[22px]",
);

/** Page-only Button override — #86d31f fill with #0d1612 label (not white) */
const loginButtonClassName = cn(
  "login-submit-btn !h-[44px] !w-full !rounded-[10px] !px-[14px] !py-0 !shadow-none !ring-offset-0",
  "!border !border-[#0d1612] !bg-[#86d31f]",
  "font-outfit text-body-10 !text-[#0d1612]",
  "hover:!bg-[#86d31f]/90 hover:!text-[#0d1612]",
  "active:!bg-[#86d31f]/80 active:!text-[#0d1612]",
  "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-[#4bcd39] focus-visible:!ring-offset-2 focus-visible:!ring-offset-[#081410]",
  "[&_svg]:!text-[#0d1612]",
  "disabled:pointer-events-none disabled:opacity-50",
);

const loginErrorClassName = cn(
  "rounded-[10px] border border-[#ff41411f] bg-[#ff414114] px-[14px] py-[12px]",
  "font-outfit text-body-sm text-[#ff6b6b]",
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
    <div
      className="login-page relative flex min-h-screen font-outfit"
      style={{ backgroundColor: FIGMA.background }}
    >
      <div
        className="login-bg-glow pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full flex-col lg:min-h-screen lg:flex-row">
        {/* Form column — fixed 420px on desktop; do not widen */}
        <div className="flex min-h-screen w-full shrink-0 flex-col items-center justify-center px-[24px] py-[32px] lg:min-h-0 lg:w-[420px] lg:max-w-[420px] lg:flex-none lg:items-stretch lg:justify-center lg:px-[24px] lg:py-[32px]">
          <Card
            className="w-full rounded-[10px] shadow-none"
            style={{
              borderColor: FIGMA.border,
              backgroundColor: FIGMA.surface,
              color: "#ffffff",
            }}
          >
            <CardHeader className="space-y-[12px] px-[20px] pt-[24px] text-center">
              <div
                className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-[100px]"
                style={{ backgroundColor: FIGMA.brandGlow }}
              >
                <Shield
                  className="h-[24px] w-[24px]"
                  style={{ color: FIGMA.bright }}
                  aria-hidden="true"
                />
              </div>
              <h1
                className="font-outfit text-body-42"
                style={{ color: "#ffffff" }}
              >
                Admin Sign In
              </h1>
              <CardDescription
                className="font-outfit text-body-21"
                style={{ color: FIGMA.muted }}
              >
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
                        <FormLabel
                          className="login-field-label text-body-5"
                          style={{
                            fontFamily: "'Lato', sans-serif",
                            color: FIGMA.accent,
                          }}
                        >
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
                          <SelectContent
                            className="font-outfit text-body-21"
                            style={{
                              borderColor: FIGMA.border,
                              backgroundColor: FIGMA.surface,
                              color: "#ffffff",
                            }}
                          >
                            {demoRoles.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                                className="font-outfit text-body-21 focus:bg-[#0b1f12] focus:text-white"
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-outfit text-body-sm text-[#ff6b6b]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel
                          className="login-field-label text-body-5"
                          style={{
                            fontFamily: "'Lato', sans-serif",
                            color: FIGMA.accent,
                          }}
                        >
                          Email{" "}
                          <span style={{ color: FIGMA.accent, opacity: 0.7 }}>
                            (optional)
                          </span>
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
                        <FormMessage className="font-outfit text-body-sm text-[#ff6b6b]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-[10px]">
                        <FormLabel
                          className="login-field-label text-body-5"
                          style={{
                            fontFamily: "'Lato', sans-serif",
                            color: FIGMA.accent,
                          }}
                        >
                          Password{" "}
                          <span style={{ color: FIGMA.accent, opacity: 0.7 }}>
                            (optional)
                          </span>
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
                        <FormMessage className="font-outfit text-body-sm text-[#ff6b6b]" />
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
          <p
            className="font-outfit text-body-9 max-w-[420px]"
            style={{ color: FIGMA.muted }}
          >
            Hoops Engine Admin
          </p>
          <h2
            className="font-outfit text-body-56 max-w-[480px]"
            style={{ color: "#ffffff" }}
          >
            Manage organizations, users, and platform analytics from one
            workspace.
          </h2>
          <p
            className="font-inter text-body-71 max-w-[440px]"
            style={{ color: FIGMA.accent, fontFamily: "'Inter', sans-serif" }}
          >
            Secure access for administrators.
          </p>
          <div
            className="mt-[12px] h-[1px] w-[105px]"
            style={{ backgroundColor: FIGMA.brand }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
