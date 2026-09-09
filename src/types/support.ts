export interface SupportRequest {
  id: string;
  request_id: string;
  user?: string;
  email?: string;
  request_date?: string;
  status?: string;
  inquiry_subject?: string;
  message_description?: string;
  attachment_url?: string | null;
}

export interface SupportRequestListResponse {
  items: SupportRequest[];
}

export interface SupportRequestRespondRequest {
  request_id: string;
  message: string;
}

export interface SupportRequestUpdateRequest {
  status?: string;
}

export interface SupportRequestMutationResponse {
  message: string;
  id?: string;
  request_id?: string;
}
