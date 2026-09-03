import { Link } from "react-router-dom";
import {
  Building2,
  CreditCard,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const modules = [
  {
    title: "Organizations",
    description: "Manage organization profiles, contact details, and join codes.",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    title: "Coaches",
    description: "View and manage coach accounts across the platform.",
    href: "/admin/users?role=coach",
    icon: GraduationCap,
  },
  {
    title: "Players",
    description: "View and manage player accounts across the platform.",
    href: "/admin/users?role=player",
    icon: UserRound,
  },
  {
    title: "Subscriptions",
    description: "Configure subscription plans for org admins and coaches.",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
] as const;

export function ModuleNavCards() {
  return (
    <nav
      className="grid w-full gap-[12px] sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Core management modules"
    >
      {modules.map((module) => (
        <Link
          key={module.href}
          to={module.href}
          className={cn(
            "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
        >
          <Card className="h-full border-border bg-card transition-colors hover:border-primary/50 hover:bg-accent/30">
            <CardHeader className="flex flex-row items-start gap-[12px] space-y-0 pb-[8px]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/15 transition-colors group-hover:bg-primary/20">
                <module.icon
                  className="h-5 w-5 text-primary"
                  aria-hidden="true"
                />
              </div>
              <CardTitle className="text-body-25 text-foreground">
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-muted-foreground">
                {module.description}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </nav>
  );
}
