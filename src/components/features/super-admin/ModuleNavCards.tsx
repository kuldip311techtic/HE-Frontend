import { Link } from "react-router-dom";
import {
  Building2,
  CreditCard,
  LifeBuoy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModuleNavItem {
  label: string;
  route: string;
  icon: LucideIcon;
  description: string;
}

/** Ticket nav: Organizations, Users, Subscriptions, Support requests */
const modules: ModuleNavItem[] = [
  {
    label: "Organizations",
    route: "/admin/organizations",
    icon: Building2,
    description: "Manage platform organizations and contact details.",
  },
  {
    label: "Users",
    route: "/admin/users",
    icon: Users,
    description: "View and manage platform user accounts.",
  },
  {
    label: "Subscriptions",
    route: "/admin/subscriptions",
    icon: CreditCard,
    description: "Configure subscription plans by role.",
  },
  {
    label: "Support requests",
    route: "/admin/support-requests",
    icon: LifeBuoy,
    description: "Review inbound support inquiries.",
  },
];

export function ModuleNavCards() {
  return (
    <section aria-labelledby="module-nav-heading" className="space-y-3">
      <h2
        id="module-nav-heading"
        className="font-outfit text-body-25 text-foreground"
      >
        Core modules
      </h2>
      <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <Link
            key={module.route}
            to={module.route}
            className={cn(
              "group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            )}
            aria-label={`Navigate to ${module.label}`}
          >
            <Card className="h-full border-border bg-card transition-colors hover:border-primary/40 hover:bg-card/80 active:bg-card/70">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 transition-colors group-hover:bg-primary/20">
                  <module.icon
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle className="font-outfit text-body-13 text-foreground">
                  {module.label}
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
      </div>
    </section>
  );
}
