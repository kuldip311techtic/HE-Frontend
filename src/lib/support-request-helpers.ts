import type { SupportRequest, SupportRequestStatus } from "@/types/support-request";

export function getSupportRequestUserLabel(request: SupportRequest): string {
  if (request.user_name && request.user_email) {
    return `${request.user_name} (${request.user_email})`;
  }

  return request.user_name || request.user_email || "Unknown user";
}

export function getSupportRequestSubject(request: SupportRequest): string {
  return request.subject || "No subject";
}

export function normalizeSupportRequestStatus(
  status: string,
): SupportRequestStatus {
  const normalized = status.toLowerCase();

  if (normalized === "closed") {
    return "closed";
  }

  if (normalized === "responded" || normalized === "resolved") {
    return "responded";
  }

  return "open";
}

export function getSupportRequestStatusLabel(
  request: SupportRequest,
): string {
  const status = normalizeSupportRequestStatus(request.status);

  switch (status) {
    case "closed":
      return "Closed";
    case "responded":
      return "Responded";
    default:
      return "Open";
  }
}

export function isSupportRequestClosed(request: SupportRequest): boolean {
  return normalizeSupportRequestStatus(request.status) === "closed";
}

export function canRespondToSupportRequest(request: SupportRequest): boolean {
  return !isSupportRequestClosed(request);
}

export function canCloseSupportRequest(request: SupportRequest): boolean {
  return !isSupportRequestClosed(request);
}

export function formatSupportRequestDate(dateString: string): string {
  if (!dateString) {
    return "—";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
