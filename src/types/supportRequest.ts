export interface SupportRequest {
  id: string;
  user_id: string;
  name: string;
  user_name: string;
  request: string;
  description: string;
  response: string | null;
  status: string;
  submitted_at: string;
  created_at: string;
}

export interface SupportRequestResponsePayload {
  id: string;
  response: string;
}

export interface PaginatedSupportRequests {
  items: SupportRequest[];
  total: number;
  page: number;
  page_size: number;
}

export interface CloseSupportRequestResponse {
  success: boolean;
  message: string;
}
