import {
  SUBSCRIPTION_DURATIONS,
  type CreateSubscriptionRequest,
  type Subscription,
  type SubscriptionFormValues,
  type UpdateSubscriptionRequest,
} from "@/types/subscription";

export function getSubscriptionName(subscription: Subscription): string {
  return subscription.name || "Unnamed plan";
}

export function getSubscriptionStatus(subscription: Subscription): string {
  if (subscription.is_active) {
    return "Active";
  }

  const normalized = subscription.status?.toLowerCase() ?? "";
  if (normalized === "active") {
    return "Active";
  }

  return "Inactive";
}

export function isSubscriptionActive(subscription: Subscription): boolean {
  return getSubscriptionStatus(subscription) === "Active";
}

export function formatSubscriptionPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function formatSubscriptionDuration(duration: string): string {
  const match = SUBSCRIPTION_DURATIONS.find(
    (option) => option.value === duration.toLowerCase(),
  );

  if (match) {
    return match.label;
  }

  return duration.charAt(0).toUpperCase() + duration.slice(1);
}

export function subscriptionToFormValues(
  subscription: Subscription,
): SubscriptionFormValues {
  return {
    name: subscription.name ?? "",
    price: subscription.price != null ? String(subscription.price) : "",
    duration: subscription.duration ?? "",
    description: subscription.description ?? "",
  };
}

export function formValuesToCreateRequest(
  values: SubscriptionFormValues,
): CreateSubscriptionRequest {
  return {
    name: values.name,
    price: Number(values.price),
    duration: values.duration,
    description: values.description,
  };
}

export function formValuesToUpdateRequest(
  values: SubscriptionFormValues,
): UpdateSubscriptionRequest {
  return formValuesToCreateRequest(values);
}
