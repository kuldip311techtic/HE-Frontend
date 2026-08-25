export const SUBSCRIPTION_API_PATH = "/api/super-admin/subscriptions" as const;

export function subscriptionDetailPath(
  id: string,
): `${typeof SUBSCRIPTION_API_PATH}/${string}` {
  return `${SUBSCRIPTION_API_PATH}/${id}`;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionListData {
  items: Subscription[];
  total: number;
}

export interface SubscriptionListResponse {
  success: boolean;
  message: string;
  description: string;
  data: SubscriptionListData | Subscription[];
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  duration: string;
  description: string;
}

export interface UpdateSubscriptionRequest {
  name?: string;
  price?: number;
  duration?: string;
  description?: string;
}

export interface EditSubscriptionVariables {
  id: string;
  values: SubscriptionFormValues;
}

export interface SubscriptionMutationResponse {
  success: boolean;
  message: string;
  description: string;
  data: Subscription;
}

export interface SubscriptionFormValues {
  name: string;
  price: string;
  duration: string;
  description: string;
}

export const SUBSCRIPTION_DURATIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annual", label: "Semi-Annual" },
  { value: "annual", label: "Annual" },
] as const;
