import { useEffect, useMemo, useState } from "react";

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

const DEFAULT_PAGE_SIZE = 10;

export default function SupportRequests() {
  const [page, setPage] = useState(1);
  const [respondingRequest, setRespondingRequest] =
    useState<SupportRequest | null>(null);
  const [closingRequest, setClosingRequest] = useState<SupportRequest | null>(
    null,
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useSupportRequests();

  const respondMutation = useRespondSupportRequest();
  const closeMutation = useCloseSupportRequest();

  const allSupportRequests = useMemo(
    () => data?.items ?? [],
    [data?.items],
  );
  const total = data?.total ?? allSupportRequests.length;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));

  const paginatedSupportRequests = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return allSupportRequests.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [allSupportRequests, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

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
        if (paginatedSupportRequests.length === 1 && page > 1) {
          setPage((current) => current - 1);
        }
      },
    });
  };

  return (
    <div className="w-full">
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
          {!isLoading && allSupportRequests.length === 0 ? (
            <EmptyState
              title="No support requests yet"
              description="When users submit support inquiries, they will appear here for you to review and respond."
            />
          ) : (
            <>
              <SupportRequestTable
                supportRequests={paginatedSupportRequests}
                onRespond={setRespondingRequest}
                onClose={setClosingRequest}
                isLoading={isLoading || isFetching}
              />

              {!isLoading && total > 0 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} ({total} request
                    {total === 1 ? "" : "s"} total)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((current) => Math.max(1, current - 1))
                      }
                      disabled={!hasPrev || isFetching}
                      aria-label="Previous page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((current) => Math.min(totalPages, current + 1))
                      }
                      disabled={!hasNext || isFetching}
                      aria-label="Next page"
                      className="min-h-11 sm:min-h-9"
                    >
                      Next
                    </Button>
                  </div>
                </div>
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
