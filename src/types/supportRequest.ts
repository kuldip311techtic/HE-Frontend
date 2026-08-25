export interface SupportRequest {
  id: string;
  request_id: string;
  subject: string;
  description: string;
  message: string;
  status: string;
  submitter_email: string | null;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
  closed_at: string | null;
}

export interface SupportRequestListData {
  items: SupportRequest[];
  total: number;
}

export interface SupportRequestListResponse {
  success: boolean;
  message: string;
  email: string | null;
  token: string | null;
  data: SupportRequestListData;
  description: string;
  error: null;
}

export interface RespondToSupportRequestRequest {
  request_id: string;
  response: string;
}

export interface SupportRequestMutationResponse {
  success: boolean;
  message: string;
  email: string | null;
  token: string | null;
  data: SupportRequest;
  description: string;
  error: null;
}

export interface ResponseFormValues {
  response: string;
}
