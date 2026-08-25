export type SupportRequestStatus = "open" | "responded" | "closed";

export interface SupportRequest {
  id: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  status: SupportRequestStatus | string;
  response: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportRequestListData {
  items: SupportRequest[];
  total: number;
}

export interface SupportRequestListResponse {
  success: boolean;
  message: string;
  description: string;
  data: SupportRequestListData | SupportRequest[];
}

export interface RespondSupportRequestPayload {
  id: string;
  response: string;
}

export interface SupportRequestMutationResponse {
  success: boolean;
  message: string;
  description: string;
  data: SupportRequest;
}

export interface SupportRequestFormValues {
  response: string;
}
