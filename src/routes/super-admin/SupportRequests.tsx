import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PageHeader } from "@/components/PageHeader";
import {
  ResponseForm,
  type ResponseFormValues,
} from "@/components/ResponseForm";
import { SuperAdminLayout } from "@/components/SuperAdminLayout";
import { SupportRequestList } from "@/components/SupportRequestList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { ApiClientError, getAuthToken } from "@/services/api-client";
import {
  formatDate,
  getSupportRequestDate,
  getSupportRequestUserLabel,
  isOpenSupportRequest,
} from "@/lib/utils";
import type { SupportRequest } from "@/types/super-admin";

const PAGE_SIZE = 10;

type StatusFilter = "all" | "open" | "closed";

export default function SupportRequestsPage() {
  const navigate = useNavigate();
  const {
    supportRequests,
    isLoading,
    error,
    refetch,
    respond,
    close,
    isMutating,
  } = useSupportRequests();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [respondTarget, setRespondTarget] = useState<SupportRequest | null>(
    null
  );
  const [detailsTarget, setDetailsTarget] = useState<SupportRequest | null>(
    null
  );
  const [closeTarget, setCloseTarget] = useState<SupportRequest | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/super-admin/login", { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return supportRequests.filter((request) => {
      const userLabel = getSupportRequestUserLabel(request).toLowerCase();
      const subject = (request.subject ?? request.message ?? "").toLowerCase();
      const matchesSearch =
        !query || userLabel.includes(query) || subject.includes(query);

      const statusLower = request.status.toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "open" &&
          (statusLower === "open" || statusLower === "pending")) ||
        (statusFilter === "closed" && statusLower === "closed");

      return matchesSearch && matchesStatus;
    });
  }, [supportRequests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleRespond = async (values: ResponseFormValues) => {
    if (!respondTarget) return;
    try {
      await respond(respondTarget.id, values.response);
      toast.success("Response sent successfully.");
      setRespondTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to send response.";
      toast.error(message);
    }
  };

  const handleClose = async () => {
    if (!closeTarget) return;
    setIsClosing(true);
    try {
      await close(closeTarget.id);
      toast.success("Support request closed successfully.");
      setCloseTarget(null);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to close support request.";
      toast.error(message);
    } finally {
      setIsClosing(false);
    }
  };

  const openCount = supportRequests.filter((r) =>
    isOpenSupportRequest(r.status)
  ).length;

  return (
    <SuperAdminLayout>
      <PageHeader
        title="Support Requests"
        description={`Manage user support inquiries${!isLoading && supportRequests.length > 0 ? ` · ${openCount} open` : ""}`}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search by user or subject…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
              aria-label="Search support requests"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <Select
              value={statusFilter}
              onValueChange={(value: StatusFilter) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-[140px]"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
          <Button
            variant="link"
            className="mt-2 h-auto p-0 text-primary"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      )}

      {!error && !isLoading && filtered.length === 0 ? (
        <EmptyState
          title="No support requests"
          description={
            search || statusFilter !== "all"
              ? "No requests match your filters. Try adjusting your search or status filter."
              : "There are no support requests at this time."
          }
        />
      ) : (
        <>
          <SupportRequestList
            supportRequests={paginated}
            isLoading={isLoading}
            onRespond={setRespondTarget}
            onClose={setCloseTarget}
            onViewDetails={setDetailsTarget}
          />
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      <Dialog
        open={respondTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRespondTarget(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Support Request</DialogTitle>
            <DialogDescription>
              {respondTarget && (
                <>
                  Reply to{" "}
                  <span className="font-medium text-foreground">
                    {getSupportRequestUserLabel(respondTarget)}
                  </span>
                  {respondTarget.subject && (
                    <>
                      {" "}
                      regarding &ldquo;{respondTarget.subject}&rdquo;
                    </>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {respondTarget && (
            <div className="space-y-4">
              {respondTarget.message && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    User message
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {respondTarget.message}
                  </p>
                </div>
              )}
              <ResponseForm
                onSubmit={handleRespond}
                onCancel={() => setRespondTarget(null)}
                isSubmitting={isMutating}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailsTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsTarget(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Support Request Details</DialogTitle>
            <DialogDescription>
              {detailsTarget &&
                `Submitted ${formatDate(getSupportRequestDate(detailsTarget))}`}
            </DialogDescription>
          </DialogHeader>
          {detailsTarget && (
            <div className="space-y-4">
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">User</dt>
                  <dd className="font-medium text-foreground">
                    {getSupportRequestUserLabel(detailsTarget)}
                  </dd>
                </div>
                {detailsTarget.user_email && (
                  <div>
                    <dt className="text-muted-foreground">Email</dt>
                    <dd className="text-foreground">
                      {detailsTarget.user_email}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="capitalize text-foreground">
                    {detailsTarget.status}
                  </dd>
                </div>
                {detailsTarget.subject && (
                  <div>
                    <dt className="text-muted-foreground">Subject</dt>
                    <dd className="text-foreground">{detailsTarget.subject}</dd>
                  </div>
                )}
                {detailsTarget.message && (
                  <div>
                    <dt className="text-muted-foreground">Message</dt>
                    <dd className="whitespace-pre-wrap text-foreground">
                      {detailsTarget.message}
                    </dd>
                  </div>
                )}
                {detailsTarget.response && (
                  <div>
                    <dt className="text-muted-foreground">Admin Response</dt>
                    <dd className="whitespace-pre-wrap text-foreground">
                      {detailsTarget.response}
                    </dd>
                  </div>
                )}
              </dl>
              {isOpenSupportRequest(detailsTarget.status) && (
                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDetailsTarget(null);
                      setRespondTarget(detailsTarget);
                    }}
                  >
                    Respond
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setDetailsTarget(null);
                      setCloseTarget(detailsTarget);
                    }}
                  >
                    Close Request
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={closeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCloseTarget(null);
        }}
        title="Close support request"
        description={
          closeTarget ? (
            <>
              Are you sure you want to close the support request from{" "}
              <span className="font-medium">
                {getSupportRequestUserLabel(closeTarget)}
              </span>
              ? The user will no longer be able to receive further responses on
              this request.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Close Request"
        variant="destructive"
        onConfirm={handleClose}
        isLoading={isClosing}
      />
    </SuperAdminLayout>
  );
}
