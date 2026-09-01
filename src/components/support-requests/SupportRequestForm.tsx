import type {
  SupportRequest,
  SupportRequestFormValues,
} from "@/types/support-request";

import { ResponseForm } from "./ResponseForm";
import { SupportRequestDetail } from "./SupportRequestDetail";

interface SupportRequestFormProps {
  supportRequest: SupportRequest;
  onSubmit: (values: SupportRequestFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function SupportRequestForm({
  supportRequest,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}: SupportRequestFormProps) {
  return (
    <div className="space-y-6">
      <SupportRequestDetail supportRequest={supportRequest} />
      <ResponseForm
        supportRequest={supportRequest}
        onSubmit={onSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
