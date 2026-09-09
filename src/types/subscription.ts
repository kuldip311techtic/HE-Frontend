export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  description?: string | null;
  status?: string | null;
}

export interface SubscriptionListResponse {
  items: SubscriptionPlan[];
}

export interface SubscriptionWriteRequest {
  name: string;
  price: number;
  billing_cycle: string;
}

export interface SubscriptionMutationResponse extends SubscriptionPlan {
  message: string;
}
