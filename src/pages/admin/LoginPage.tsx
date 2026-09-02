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
import { loginSuperAdmin } from "@/lib/api/services/admin";
import { getApiErrorMessage } from "@/lib/api/client";
import { mapUserPublicToAuthUser } from "@/lib/auth/mapUserPublic";
import { userHasAdminAccess } from "@/types/auth";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

/** Page-scoped overrides — do not apply globally */
const loginInputClass = cn(
  "h-10 w-full rounded-[10px] border border-figma-border bg-figma-surface px-[12px] py-[10px]",
  "font-outfit text-[16px] font-normal leading-[22px] text-white shadow-none",
  "placeholder:font-outfit placeholder:text-[16px] placeholder:font-normal placeholder:leading-[22px] placeholder:text-figma-muted",
  "focus-visible:border-figma-brand focus-visible:ring-2 focus-visible:ring-figma-brand/30 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

const loginButtonClass = cn(
  "h-10 w-full rounded-[10px] bg-figma-brand shadow-none",
  "font-outfit text-[16px] font-semibold leading-[20.16px] text-figma-border",
  "hover:bg-figma-brand/90 active:bg-figma-brand/80",
  "focus-visible:ring-2 focus-visible:ring-figma-brand focus-visible:ring-offset-2 focus-visible:ring-offset-figma-background",
  "disabled:pointer-events-none disabled:opacity-50",
  "[&_svg]:text-figma-border",
);

const loginLabelClass = cn(
  "font-lato text-[16px] font-medium leading-[19.2px] text-white",
);

export function AdminLoginPage() {
  const { login, isAuthenticated, hasAdminAccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentialError, setCredentialError] = useState<string | null>(null);

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
    mode: "onChange",
  });

  const email = form.watch("email");
  const password = form.watch("password");
  const canSubmit = Boolean(email.trim() && password.trim());

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setCredentialError(null);
    try {
      const response = await loginSuperAdmin({
        email: values.email,
        password: values.password,
      });

      if (!response.user.is_super_admin) {
        const message = "Super Admin access required.";
        setCredentialError(message);
        toast.error(message);
        return;
      }

      const authUser = mapUserPublicToAuthUser(response.user);

      if (!userHasAdminAccess(authUser)) {
        toast.error("Access denied. Admin credentials are required.");
        navigate("/admin/unauthorized");
        return;
      }

      login(response.access_token, authUser);
      toast.success("Signed in successfully.");
      navigate(from, { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Unable to sign in. Please check your credentials and try again.",
      );
      setCredentialError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-[24px] py-[32px] font-outfit"
      style={{
        backgroundColor: "var(--figma-background)",
        backgroundImage: [
          "radial-gradient(ellipse 80% 60% at 50% -10%, var(--figma-brand-glow) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 40% at 100% 100%, rgba(75, 205, 57, 0.12) 0%, transparent 60%)",
          "radial-gradient(ellipse 40% 30% at 0% 80%, rgba(68, 81, 84, 0.25) 0%, transparent 55%)",
        ].join(", "),
      }}
    >
      <Card className="relative z-10 w-full max-w-md rounded-[10px] border-figma-border bg-figma-background shadow-none">
        <CardHeader className="gap-[12px] px-[24px] pb-0 pt-[24px] text-center">
          <div
            className="mx-auto mb-[16px] flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--figma-brand-subtle)" }}
          >
            <Shield
              className="h-6 w-6 text-figma-bright"
              aria-hidden="true"
            />
          </div>
          <h1 className="font-outfit text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white">
            Super Admin Sign In
          </h1>
          <CardDescription className="font-outfit text-[16px] font-normal leading-[22px] text-figma-muted">
            Sign in with your Super Admin credentials to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-[24px] pb-[24px] pt-[20px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-[16px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="gap-[10px]">
                    <FormLabel className={loginLabelClass}>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@hoopsengine.com"
                        autoComplete="email"
                        disabled={isSubmitting}
                        className={loginInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-outfit text-[14px] font-medium leading-[17.64px] text-[#ff6b6b]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="gap-[10px]">
                    <FormLabel className={loginLabelClass}>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        disabled={isSubmitting}
                        className={loginInputClass}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-outfit text-[14px] font-medium leading-[17.64px] text-[#ff6b6b]" />
                  </FormItem>
                )}
              />

              {credentialError && (
                <ErrorMessage message={credentialError} />
              )}

              <Button
                type="submit"
                variant="default"
                className={loginButtonClass}
                isLoading={isSubmitting}
                disabled={!canSubmit || isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
