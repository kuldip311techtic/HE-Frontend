import type { PaginationMeta } from '@/types/api';

export type SubscriptionPlanRole = 'org_admin' | 'coach';

export type BillingFrequency = 'monthly' | 'yearly';

export type LimitType = 'limited' | 'unlimited';

export type HistoricalRecordsDuration =
  | '1_month'
  | '3_months'
  | '6_months'
  | '1_year'
  | 'unlimited';

export type PlanStatus = 'active' | 'archived';

export type { PaginationMeta };

export interface SubscriptionPlanItem {
  id: string;
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: string;
  stripe_product_id: string;
  stripe_price_id: string;
  teams_limit_type: LimitType;
  teams_count: number | null;
  coaches_limit_type: LimitType | null;
  coaches_count: number | null;
  players_limit_type: LimitType;
  players_count: number | null;
  historical_records_duration: HistoricalRecordsDuration;
  is_active: boolean;
  include_offline_sync: boolean;
  status: PlanStatus;
  archived_at: string | null;
  replacement_plan_id: string | null;
  stripe_status: PlanStatus | null;
  description: string | null;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanStatusCounts {
  active: number;
  archived: number;
}

export interface SubscriptionPlanListResponse {
  items: SubscriptionPlanItem[];
  pagination: PaginationMeta;
  counts: SubscriptionPlanStatusCounts;
}

export interface SubscriptionPlanListParams {
  role: SubscriptionPlanRole;
  page?: number;
  page_size?: number;
  status?: PlanStatus | null;
  billing_frequency?: BillingFrequency | null;
  search?: string | null;
}

export interface SubscriptionPlanCreateRequest {
  role: SubscriptionPlanRole;
  name: string;
  billing_frequency: BillingFrequency;
  currency: string;
  price_amount: number | string;
  teams_limit_type: LimitType;
  teams_count?: number | null;
  coaches_limit_type?: LimitType | null;
  coaches_count?: number | null;
  players_limit_type: LimitType;
  players_count?: number | null;
  historical_records_duration: HistoricalRecordsDuration;
  is_active?: boolean;
  include_offline_sync?: boolean;
  description?: string | null;
  features?: string[];
}

export type SubscriptionPlanUpdateRequest = Partial<
  Omit<SubscriptionPlanCreateRequest, 'role' | 'billing_frequency' | 'currency'>
>;

export interface SubscriptionPlanDeleteResponse {
  message: string;
}

export interface CurrencyItem {
  code: string;
  name: string;
}

export interface CurrencyListResponse {
  items: CurrencyItem[];
}
