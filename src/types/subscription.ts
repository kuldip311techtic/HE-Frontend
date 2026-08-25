export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  billing_cycle: string;
  duration: string;
  status: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanListData {
  items: SubscriptionPlan[];
  total: number;
}

export interface SubscriptionPlanListResponse {
  success: boolean;
  message: string;
  email: string | null;
  token: string | null;
  data: SubscriptionPlanListData;
  description: string;
  error: null;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  description?: string | null;
  price: number | string;
  billing_cycle: string;
  is_published: boolean;
}

export interface UpdateSubscriptionPlanRequest {
  name?: string | null;
  description?: string | null;
  price?: number | string | null;
  billing_cycle?: string | null;
  is_published?: boolean | null;
}

export interface SubscriptionPlanMutationData {
  subscription_plan: SubscriptionPlan;
}

export interface SubscriptionPlanMutationResponse {
  success: boolean;
  message: string;
  email: string | null;
  token: string | null;
  data: SubscriptionPlanMutationData;
  description: string;
  error: null;
}

export type BillingCycle = 'monthly' | 'yearly';

export interface SubscriptionFormValues {
  name: string;
  price: string;
  billing_cycle: BillingCycle;
  description: string;
  is_published: boolean;
}
