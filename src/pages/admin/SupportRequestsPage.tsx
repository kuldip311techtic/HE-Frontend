import { useEffect, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader";
import { SupportRequestResponseForm } from "@/components/features/super-admin/SupportRequestResponseForm";
import type { SupportRequestResponseFormValues } from "@/components/features/super-admin/SupportRequestResponseForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  useCloseSupportRequest,
  useRespondSupportRequest,
  useSupportRequests,
} from "@/hooks/useSupportRequests";
import { getApiErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { SupportRequest } from "@/types/api";

const RESPONSE_FORM_ID = "support-response-form";

function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function isClosed(request: SupportRequest): boolean {
  return request.status?.toLowerCase() === "closed";
}

function statusBadgeVariant(
  status: string | undefined,
): "default" | "secondary" | "outline" {
  const normalized = status?.toLowerCase();
  if (normalized === "closed") return "outline";
  if (normalized === "pending") return "secondary";
  return "default";
}

export function SupportRequestsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null,
  );
  const [closeTarget, setCloseTarget] = useState<SupportRequest | null>(null);
  const [responseFormKey, setResponseFormKey] = useState(0);

  const { data, isLoading, isError, error, refetch } = useSupportRequests({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  const respondMutation = useRespondSupportRequest();
  const closeMutation = useCloseSupportRequest();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const selectedId = selectedRequest?.id;

  useEffect(() => {
    if (!selectedId || !data?.items) return;
    const updated = data.items.find((item) => item.id === selectedId);
    if (updated) {
      setSelectedRequest(updated);
    }
  }, [data?.items, selectedId]);

  const handleSelectRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setResponseFormKey((key) => key + 1);
  };

  const handleRespond = async (values: SupportRequestResponseFormValues) => {
    if (!selectedRequest) return;
    try {
      const result = await respondMutation.mutateAsync({
        request_id: selectedRequest.id,
        response: values.response.trim(),
      });
      toast.success(result.message || "Response sent successfully.");
      setResponseFormKey((key) => key + 1);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Unable to send response. Please try again."),
      );
    }
  };

  const handleClose = async () => {
    if (!closeTarget) return;
    try {
      const result = await closeMutation.mutateAsync(closeTarget.id);
      toast.success(result.message || "Support request closed successfully.");
      setCloseTarget(null);
      if (selectedRequest?.id === closeTarget.id) {
        setSelectedRequest((current) =>
          current ? { ...current, status: "closed" } : null,
        );
      }
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          "Unable to close support request. Please try again.",
        ),
      );
    }
  };

  const columns: DataTableColumn<SupportRequest>[] = [
    {
      id: "subject",
      header: "Subject",
      cell: (row) => (
        <button
          type="button"
          className={cn(
            "min-h-9 text-left text-sm font-medium text-primary hover:underline",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            selectedRequest?.id === row.id && "underline",
          )}
          onClick={() => handleSelectRequest(row)}
        >
          {row.subject}
        </button>
      ),
    },
    {
      id: "name",
      header: "Name",
      cell: (row) => row.name,
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge variant={statusBadgeVariant(row.status)} className="capitalize">
          {row.status ?? "open"}
        </Badge>
      ),
    },
    {
      id: "created_at",
      header: "Submitted",
      cell: (row) => formatDate(row.created_at),
    },
  ];

  const selectedIsClosed = selectedRequest ? isClosed(selectedRequest) : false;
  const isMutating = respondMutation.isPending || closeMutation.isPending;

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Support Requests"
        description="Review, respond to, and close user support inquiries."
      />

      <div className="grid gap-[16px] lg:grid-cols-[1fr_380px]">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          isLoading={isLoading}
          error={
            isError
              ? getApiErrorMessage(
                  error,
                  "Unable to load support requests. Please try again.",
                )
              : null
          }
          onRetry={() => void refetch()}
          searchPlaceholder="Search support requests…"
          searchValue={search}
          onSearchChange={setSearch}
          serverSide
          emptyTitle="No support requests"
          emptyDescription="Support inquiries will appear here when users submit them."
          pagination={{
            page,
            pageSize,
            total: data?.pagination.total ?? 0,
          }}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />

        <Card
          className={cn(
            "border-border bg-card",
            !selectedRequest && "hidden lg:block",
          )}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-[12px]">
            <CardTitle className="text-body-25 text-foreground">
              Request detail
            </CardTitle>
            {selectedRequest && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 lg:hidden"
                onClick={() => setSelectedRequest(null)}
                aria-label="Close detail panel"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-[16px]">
            {!selectedRequest ? (
              <p className="text-body-sm text-muted-foreground">
                Select a support request from the table to view details and
                respond.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-[10px]">
                  <Badge
                    variant={statusBadgeVariant(selectedRequest.status)}
                    className="capitalize"
                  >
                    {selectedRequest.status ?? "open"}
                  </Badge>
                </div>

                <div>
                  <p className="font-lato text-body-5 text-muted-foreground">
                    Subject
                  </p>
                  <p className="text-body-13 text-foreground">
                    {selectedRequest.subject}
                  </p>
                </div>
                <div>
                  <p className="font-lato text-body-5 text-muted-foreground">
                    From
                  </p>
                  <p className="text-body-13 text-foreground">
                    {selectedRequest.name} ({selectedRequest.email})
                  </p>
                </div>
                <div>
                  <p className="font-lato text-body-5 text-muted-foreground">
                    Submitted
                  </p>
                  <p className="text-body-13 text-foreground">
                    {formatDate(selectedRequest.created_at)}
                  </p>
                </div>
                <div>
                  <p className="font-lato text-body-5 text-muted-foreground">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap text-body-21 text-foreground">
                    {selectedRequest.message}
                  </p>
                </div>
                {selectedRequest.attachment_url && (
                  <a
                    href={selectedRequest.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-9 items-center gap-2 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    View attachment
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}

                <div className="space-y-[12px] border-t border-border pt-[16px]">
                  <h3 className="text-body-13 text-foreground">Respond</h3>
                  {selectedIsClosed ? (
                    <p className="text-body-sm text-muted-foreground">
                      This request is closed. Reopen is not available from the
                      admin panel.
                    </p>
                  ) : (
                    <>
                      <SupportRequestResponseForm
                        key={responseFormKey}
                        formId={RESPONSE_FORM_ID}
                        disabled={isMutating}
                        onSubmit={(values) => void handleRespond(values)}
                      />
                      <div className="flex flex-wrap gap-[10px]">
                        <Button
                          type="submit"
                          form={RESPONSE_FORM_ID}
                          size="sm"
                          className="min-h-9"
                          isLoading={respondMutation.isPending}
                          disabled={isMutating}
                        >
                          {respondMutation.isPending
                            ? "Sending…"
                            : "Send response"}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="min-h-9"
                          disabled={isMutating}
                          onClick={() => setCloseTarget(selectedRequest)}
                        >
                          Close request
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(closeTarget)}
        onOpenChange={(open) => !open && setCloseTarget(null)}
        title="Close support request?"
        description={`This will mark the inquiry "${closeTarget?.subject}" as closed. The user will no longer receive follow-up on this thread unless a new request is submitted.`}
        confirmLabel="Close"
        variant="destructive"
        isLoading={closeMutation.isPending}
        onConfirm={handleClose}
      />
    </div>
  );
}
