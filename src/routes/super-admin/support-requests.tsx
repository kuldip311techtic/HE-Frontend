import { useState } from 'react';
import SupportRequestDetail from '@/components/features/support-requests/SupportRequestDetail';
import SupportRequestTable from '@/components/features/support-requests/SupportRequestTable';
import AdminLayout from '@/components/layout/AdminLayout';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PageHeader from '@/components/shared/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCloseSupportRequest,
  useRespondToSupportRequest,
  useSupportRequests,
} from '@/hooks/useSupportRequests';
import { getSupportRequestErrorMessage } from '@/services/support-requests';
import type { ResponseFormValues } from '@/types/support-request';
import type { SupportRequest } from '@/types/support-request';

export default function SupportRequestsPage() {
  const { data, isLoading, isError, error, refetch } = useSupportRequests();
  const respondMutation = useRespondToSupportRequest();
  const closeMutation = useCloseSupportRequest();

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null,
  );
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const requests = data?.items ?? [];
  const isResponding = respondMutation.isPending;
  const isClosing = closeMutation.isPending;

  const openDetail = (request: SupportRequest) => {
    setSelectedRequest(request);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    if (isResponding) {
      return;
    }

    setDetailOpen(false);
    setSelectedRequest(null);
  };

  const handleRespond = async (values: ResponseFormValues) => {
    if (!selectedRequest) {
      return;
    }

    await respondMutation.mutateAsync({
      request_id: selectedRequest.request_id,
      response: values.response.trim(),
    });

    setDetailOpen(false);
    setSelectedRequest(null);
  };

  const openCloseDialog = () => {
    setCloseDialogOpen(true);
  };

  const closeCloseDialog = () => {
    if (isClosing) {
      return;
    }

    setCloseDialogOpen(false);
  };

  const handleCloseConfirm = async () => {
    if (!selectedRequest) {
      return;
    }

    await closeMutation.mutateAsync(selectedRequest.id);
    setCloseDialogOpen(false);
    setDetailOpen(false);
    setSelectedRequest(null);
  };

  const listError = isError ? getSupportRequestErrorMessage(error) : null;

  return (
    <AdminLayout title="Support Requests">
      <PageHeader
        title="Support Requests"
        description="Review user support inquiries, submit responses, and close resolved requests."
      />

      <SupportRequestTable
        requests={requests}
        loading={isLoading}
        error={listError}
        onRetry={() => {
          void refetch();
        }}
        onView={openDetail}
      />

      <Dialog open={detailOpen} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
          aria-describedby="support-request-detail-description"
        >
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription id="support-request-detail-description">
              Review the request details and submit a response to the user.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest ? (
            <SupportRequestDetail
              request={selectedRequest}
              responding={isResponding}
              closing={isClosing}
              onRespond={handleRespond}
              onClose={openCloseDialog}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={closeDialogOpen}
        onOpenChange={(open) => !open && closeCloseDialog()}
        title="Close support request"
        description={
          selectedRequest
            ? `Are you sure you want to close "${selectedRequest.subject}"? The user will no longer be able to receive further responses on this request.`
            : 'Are you sure you want to close this support request?'
        }
        confirmLabel="Close Request"
        cancelLabel="Cancel"
        variant="destructive"
        loading={isClosing}
        onConfirm={() => {
          void handleCloseConfirm();
        }}
      />
    </AdminLayout>
  );
}
