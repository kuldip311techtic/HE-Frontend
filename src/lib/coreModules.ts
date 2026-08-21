export interface CoreModuleLink {
  id: string;
  label: string;
  description: string;
  to: string;
}

export const CORE_MODULE_LINKS: readonly CoreModuleLink[] = [
  {
    id: "total-organizations",
    label: "Organizations",
    description: "View total organizations",
    to: "/admin/dashboard#total-organizations",
  },
  {
    id: "total-coaches",
    label: "Coaches",
    description: "View total coaches",
    to: "/admin/dashboard#total-coaches",
  },
  {
    id: "total-players",
    label: "Players",
    description: "View total players",
    to: "/admin/dashboard#total-players",
  },
  {
    id: "total-sessions",
    label: "Sessions",
    description: "View total sessions",
    to: "/admin/dashboard#total-sessions",
  },
  {
    id: "active-subscriptions",
    label: "Subscriptions",
    description: "View active subscriptions",
    to: "/admin/dashboard#active-subscriptions",
  },
  {
    id: "revenue-overview",
    label: "Revenue",
    description: "View revenue overview",
    to: "/admin/dashboard#revenue-overview",
  },
];
