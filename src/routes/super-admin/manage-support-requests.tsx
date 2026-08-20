import { useEffect, useState } from 'react';
import ResponseForm from '../../components/features/support-requests/ResponseForm';
import SupportRequestList from '../../components/features/support-requests/SupportRequestList';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import Toast from '../../components/ui/Toast';
import { useCloseSupportRequest } from '../../hooks/useCloseSupportRequest';
import { useSupportRequests } from '../../hooks/useSupportRequests';
import type { SupportRequest } from '../../types/supportRequest';

interface ToastState {
  message: string;
  variant: 'success' | 'error';
}

export default function ManageSupportRequestsPage() {
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequest | null>(null);
  const [requestToClose, setRequestToClose] =
    useState<SupportRequest | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const {
    supportRequests,
    total,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
  } = useSupportRequests(page);

  const closeMutation = useCloseSupportRequest();

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleCloseConfirm = async () => {
    if (!requestToClose) {
      return;
    }

    try {
      const response = await closeMutation.closeSupportRequest(
        requestToClose.id,
      );
      setToast({
        message: response.message || 'Support request closed successfully.',
        variant: 'success',
      });
      setRequestToClose(null);

      if (supportRequests.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        void refetch();
      }
    } catch {
      setToast({
        message:
          closeMutation.errorMessage ??
          'Unable to close support request. Please try again.',
        variant: 'error',
      });
    }
  };

  const closeDisplayName = requestToClose
    ? requestToClose.user_name || requestToClose.name
    : '';

  return (
    <AdminLayout title="Manage Support Requests">
      <div className="space-y-6">
        <Card
          title="Support Requests"
          description="View, respond to, and close user-submitted support inquiries."
        >
          <SupportRequestList
            supportRequests={supportRequests}
            total={total}
            page={page}
            pageSize={pageSize}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onPageChange={setPage}
            onRespond={setSelectedRequest}
            onClose={setRequestToClose}
          />
        </Card>
      </div>

      <ResponseForm
        supportRequest={selectedRequest}
        open={selectedRequest !== null}
        onClose={() => {
          setSelectedRequest(null);
        }}
        onSuccess={(message) => {
          setToast({ message, variant: 'success' });
          void refetch();
        }}
      />

      <ConfirmationDialog
        open={Boolean(requestToClose)}
        title="Close support request"
        message={
          requestToClose
            ? `Are you sure you want to close the support request from ${closeDisplayName}? This action cannot be undone.`
            : ''
        }
        confirmLabel="Close request"
        loading={closeMutation.isLoading}
        onConfirm={() => void handleCloseConfirm()}
        onCancel={() => {
          if (!closeMutation.isLoading) {
            setRequestToClose(null);
            closeMutation.reset();
          }
        }}
      />

      {toast ? (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
