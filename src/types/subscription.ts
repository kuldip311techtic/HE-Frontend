import type { PaginationMeta } from '@/types/api';

export type BillingFrequency = 'monthly' | 'yearly';
export type PlanStatus = 'active' | 'archived';
export type SubscriptionPlanRole = 'org_admin' | 'coach';
export type LimitType = 'limited' | 'unlimited';
export type HistoricalRecordsDuration = '1_month' | '3_months' | '6_months' | '1_year' | 'unlimited';

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

export interface SubscriptionPlanListResponse {
  items: SubscriptionPlanItem[];
  pagination?: PaginationMeta;
  counts: { active: number; archived: number };
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

export interface SubscriptionPlanUpdateRequest {
  name?: string | null;
  billing_frequency?: BillingFrequency | null;
  currency?: string | null;
  price_amount?: number | string | null;
  teams_limit_type?: LimitType | null;
  teams_count?: number | null;
  coaches_limit_type?: LimitType | null;
  coaches_count?: number | null;
  players_limit_type?: LimitType | null;
  players_count?: number | null;
  historical_records_duration?: HistoricalRecordsDuration | null;
  is_active?: boolean | null;
  include_offline_sync?: boolean | null;
  description?: string | null;
  features?: string[] | null;
}

export interface SubscriptionPlanDeleteResponse {
  message: string;
}

export interface CurrencyItem {
  code: string;
  name?: string | null;
}

export interface CurrencyListResponse {
  items?: Array<string | CurrencyItem>;
  currencies?: string[];
}

export interface SubscriptionPlanListParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: SubscriptionPlanRole;
  status?: PlanStatus;
  is_active?: boolean;
  billing_frequency?: BillingFrequency;
}
