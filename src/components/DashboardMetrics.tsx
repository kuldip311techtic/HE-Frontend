import {
  Building2,
  CreditCard,
  DollarSign,
  Dumbbell,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { DashboardResponse } from "@/types/super-admin";

interface MetricConfig {
  key: keyof Pick<
    DashboardResponse,
    | "total_organizations"
    | "total_coaches"
    | "total_players"
    | "total_sessions"
    | "active_subscriptions"
    | "revenue_overview"
  >;
  label: string;
  icon: LucideIcon;
  format?: (value: number) => string;
}

const METRICS: MetricConfig[] = [
  {
    key: "total_organizations",
    label: "Total Organizations",
    icon: Building2,
  },
  { key: "total_coaches", label: "Total Coaches", icon: UserCog },
  { key: "total_players", label: "Total Players", icon: Users },
  { key: "total_sessions", label: "Total Sessions", icon: Dumbbell },
  {
    key: "active_subscriptions",
    label: "Active Subscriptions",
    icon: CreditCard,
  },
  {
    key: "revenue_overview",
    label: "Revenue Overview",
    icon: DollarSign,
    format: formatCurrency,
  },
];

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  format?: (value: number) => string;
}

function MetricCard({ label, value, icon: Icon, format }: MetricCardProps) {
  const displayValue =
    value === 0 ? "—" : format ? format(value) : formatNumber(value);

  return (
    <Card className="bg-card/80 transition-colors hover:bg-card/90">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardDescription>{label}</CardDescription>
          <Icon
            className="h-4 w-4 shrink-0 text-primary"
            aria-hidden="true"
          />
        </div>
        <CardTitle
          className="text-2xl tabular-nums"
          aria-label={`${label}: ${value === 0 ? "No data" : displayValue}`}
        >
          {displayValue}
        </CardTitle>
        {value === 0 && (
          <p className="text-xs text-muted-foreground">No data yet</p>
        )}
      </CardHeader>
    </Card>
  );
}

interface DashboardMetricsProps {
  data: DashboardResponse;
}

export function DashboardMetrics({ data }: DashboardMetricsProps) {
  return (
    <section aria-label="Platform metrics">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map(({ key, label, icon, format }) => (
          <MetricCard
            key={key}
            label={label}
            value={data[key]}
            icon={icon}
            format={format}
          />
        ))}
      </div>
    </section>
  );
}
