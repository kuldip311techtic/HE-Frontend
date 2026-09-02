import {
  Building2,
  ChevronRight,
  CreditCard,
  HeadphonesIcon,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NavModule {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

const MODULES: NavModule[] = [
  {
    to: "/super-admin/organizations",
    label: "Organizations",
    description: "Manage platform organizations",
    icon: Building2,
  },
  {
    to: "/super-admin/users",
    label: "Users",
    description: "Manage coach and player accounts",
    icon: UsersRound,
  },
  {
    to: "/super-admin/coaches",
    label: "Coaches",
    description: "View and manage coach accounts",
    icon: UserCog,
  },
  {
    to: "/super-admin/players",
    label: "Players",
    description: "View and manage player accounts",
    icon: Users,
  },
  {
    to: "/super-admin/subscriptions",
    label: "Subscriptions",
    description: "Manage subscription plans",
    icon: CreditCard,
  },
  {
    to: "/super-admin/support-requests",
    label: "Support Requests",
    description: "Respond to user support inquiries",
    icon: HeadphonesIcon,
  },
];

interface NavigationLinksProps {
  className?: string;
}

export function NavigationLinks({ className }: NavigationLinksProps) {
  return (
    <section aria-label="Core modules" className={cn("mt-8", className)}>
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Core Modules
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map(({ to, label, description, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card className="h-full bg-card/80 transition-colors hover:border-primary/40 hover:bg-card/90 active:bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <Icon
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <CardTitle className="text-base">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
