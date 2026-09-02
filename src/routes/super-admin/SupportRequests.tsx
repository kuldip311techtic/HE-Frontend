import { useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { Notification } from "@/components/Notification";
import { PageHeader } from "@/components/PageHeader";
import { SupportRequestForm } from "@/components/support-requests/SupportRequestForm";
import { SupportRequestTable } from "@/components/support-requests/SupportRequestTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCloseSupportRequest } from "@/hooks/useCloseSupportRequest";
import { useRespondSupportRequest } from "@/hooks/useRespondSupportRequest";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { getSupportRequestUserLabel } from "@/lib/support-request-helpers";
import type {
  SupportRequest,
  SupportRequestFormValues,
} from "@/types/support-request";

export default function SupportRequests() {
  const [respondingRequest, setRespondingRequest] =
    useState<SupportRequest | null>(null);
  const [closingRequest, setClosingRequest] = useState<SupportRequest | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSupportRequests();

  const respondMutation = useRespondSupportRequest();
  const closeMutation = useCloseSupportRequest();

  const supportRequests = data?.items ?? [];
  const total = data?.total ?? supportRequests.length;

  const handleRespondSubmit = (values: SupportRequestFormValues) => {
    if (!respondingRequest) {
      return;
    }

    respondMutation.mutate(
      {
        id: respondingRequest.id,
        response: values.response,
      },
      {
        onSuccess: () => {
          setRespondingRequest(null);
        },
      },
    );
  };

  const handleCloseConfirm = () => {
    if (!closingRequest) {
      return;
    }

    closeMutation.mutate(closingRequest.id, {
      onSuccess: () => {
        setClosingRequest(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Support Requests"
        description="View, respond to, and close user support inquiries."
      />

      {isError ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Notification
              variant="error"
              message={error?.message ?? "Failed to load support requests."}
            />
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {!isLoading && supportRequests.length === 0 ? (
            <EmptyState
              title="No support requests yet"
              description="When users submit support inquiries, they will appear here for you to review and respond."
            />
          ) : (
            <>
              <SupportRequestTable
                supportRequests={supportRequests}
                onRespond={setRespondingRequest}
                onClose={setClosingRequest}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && total > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {total} request{total === 1 ? "" : "s"} total
                </p>
              )}
            </>
          )}
        </>
      )}

      <Dialog
        open={respondingRequest !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRespondingRequest(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              Review the inquiry and submit a response to{" "}
              {respondingRequest
                ? getSupportRequestUserLabel(respondingRequest)
                : "the user"}
              .
            </DialogDescription>
          </DialogHeader>
          {respondingRequest && (
            <SupportRequestForm
              supportRequest={respondingRequest}
              onSubmit={handleRespondSubmit}
              onCancel={() => setRespondingRequest(null)}
              isLoading={respondMutation.isPending}
              error={respondMutation.error}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={closingRequest !== null}
        onOpenChange={(open) => {
          if (!open) {
            setClosingRequest(null);
          }
        }}
        title="Close support request"
        description={
          closingRequest
            ? `Are you sure you want to close the support request from ${getSupportRequestUserLabel(closingRequest)}? The user will no longer be able to receive further responses on this inquiry.`
            : ""
        }
        confirmLabel="Close request"
        variant="destructive"
        onConfirm={handleCloseConfirm}
        isLoading={closeMutation.isPending}
      />
    </div>
  );
}
