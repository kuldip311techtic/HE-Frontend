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
import { ErrorMessage } from "@/components/ui/feedback";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdminLogin } from "@/hooks/useSuperAdminLogin";
import { getApiErrorMessage } from "@/lib/api/client";
import { mapUserPublicToAuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Page-only field styling — dark Figma fill via figma-* tokens */
const loginInputClassName = cn(
  "h-[44px] rounded-[10px] border border-figma-border bg-figma-surface-deep px-[14px]",
  "font-outfit text-body-21 text-white shadow-none ring-offset-0",
  "placeholder:font-outfit placeholder:text-body-21 placeholder:text-figma-muted",
  "hover:border-figma-accent",
  "focus-visible:border-figma-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-brand-glow focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

/** Page-only CTA — brand fill with dark label text */
const loginButtonClassName = cn(
  "login-submit-btn h-[44px] w-full rounded-[10px]",
  "border border-figma-border bg-figma-brand",
  "font-outfit text-body-10 text-figma-border shadow-none ring-offset-0",
  "[&_svg]:text-figma-border",
  "hover:bg-figma-brand/90",
  "active:bg-figma-brand/80",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-figma-bright focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
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
  const loginMutation = useSuperAdminLogin();
  const [apiError, setApiError] = useState<string | null>(null);

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
    },
  });

  const email = form.watch("email");
  const password = form.watch("password");
  const canSubmit = Boolean(email.trim() && password.trim());

  const onSubmit = async (values: LoginFormValues) => {
    setApiError(null);
    try {
      const response = await loginMutation.mutateAsync(values);

      if (!response.user.is_super_admin) {
        toast.error("Access denied. Super admin credentials are required.");
        setApiError("Access denied. Super admin credentials are required.");
        return;
      }

      const authUser = mapUserPublicToAuthUser(response.user);
      login(response.access_token, authUser);
      toast.success("Signed in successfully.");
      navigate("/admin", { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Invalid email or password. Please try again.",
      );
      setApiError(message);
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
                Super Admin Sign In
              </h1>
              <CardDescription className="font-outfit text-body-21 text-figma-muted">
                Sign in with your super admin credentials to access the admin
                panel.
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
                        <FormLabel className="font-lato text-body-5 text-figma-muted">
                          Email
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
                        <FormLabel className="font-lato text-body-5 text-figma-muted">
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
                        <FormMessage className="font-outfit text-body-sm text-figma-danger" />
                      </FormItem>
                    )}
                  />

                  {apiError && (
                    <ErrorMessage
                      message={apiError}
                      className={loginErrorClassName}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="ghost"
                    className={loginButtonClassName}
                    isLoading={loginMutation.isPending}
                    disabled={!canSubmit || loginMutation.isPending}
                    aria-busy={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in…" : "Sign in"}
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
            Secure access for super administrators.
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
