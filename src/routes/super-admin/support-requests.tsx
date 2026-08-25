import { useState } from 'react';
import SupportRequestDetails from '@/components/features/support-requests/SupportRequestDetails';
import SupportRequestsTable from '@/components/features/support-requests/SupportRequestsTable';
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
import { getSupportRequestErrorMessage } from '@/services/supportRequests';
import type { ResponseFormValues, SupportRequest } from '@/types/supportRequest';

export default function SupportRequestsPage() {
  const { data, isLoading, isError, error, refetch } = useSupportRequests();
  const respondMutation = useRespondToSupportRequest();
  const closeMutation = useCloseSupportRequest();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null,
  );
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [requestToClose, setRequestToClose] = useState<SupportRequest | null>(
    null,
  );

  const requests = data?.items ?? [];
  const isResponding = respondMutation.isPending;
  const isClosing = closeMutation.isPending;

  const openDetails = (request: SupportRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const openRespond = (request: SupportRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    if (isResponding) {
      return;
    }

    setDetailsOpen(false);
    setSelectedRequest(null);
  };

  const handleResponseSubmit = async (values: ResponseFormValues) => {
    if (!selectedRequest) {
      return;
    }

    await respondMutation.mutateAsync({
      request_id: selectedRequest.request_id,
      response: values.response.trim(),
    });

    setDetailsOpen(false);
    setSelectedRequest(null);
  };

  const openCloseDialog = (request: SupportRequest) => {
    setRequestToClose(request);
    setCloseDialogOpen(true);
  };

  const closeCloseDialog = () => {
    if (isClosing) {
      return;
    }

    setCloseDialogOpen(false);
    setRequestToClose(null);
  };

  const handleCloseConfirm = async () => {
    if (!requestToClose) {
      return;
    }

    await closeMutation.mutateAsync(requestToClose.id);
    setCloseDialogOpen(false);
    setRequestToClose(null);
  };

  const listError = isError ? getSupportRequestErrorMessage(error) : null;

  return (
    <AdminLayout title="Support Requests">
      <PageHeader
        title="Support Requests"
        description="Review user inquiries, send responses, and close resolved support requests."
      />

      <SupportRequestsTable
        requests={requests}
        loading={isLoading}
        error={listError}
        onRetry={() => {
          void refetch();
        }}
        onView={openDetails}
        onRespond={openRespond}
        onClose={openCloseDialog}
      />

      <Dialog open={detailsOpen} onOpenChange={(open) => !open && closeDetails()}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
          aria-describedby="support-request-details-description"
        >
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription id="support-request-details-description">
              Review the request details and submit a response to the user.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest ? (
            <SupportRequestDetails
              request={selectedRequest}
              loading={isResponding}
              onSubmitResponse={handleResponseSubmit}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={closeDialogOpen}
        onOpenChange={(open) => !open && closeCloseDialog()}
        title="Close support request"
        description={
          requestToClose
            ? `Are you sure you want to close "${requestToClose.subject}"? The user will no longer be able to receive further responses on this request.`
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
