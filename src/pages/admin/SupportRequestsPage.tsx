import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SupportRequestDetailPanel } from "@/components/admin/SupportRequestDetailPanel";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { adminSearchInputClass } from "@/lib/adminFormStyles";
import { getApiErrorMessage } from "@/lib/api/client";
import type { SupportRequestItem } from "@/types/api";

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function SupportRequestsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<SupportRequestItem | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch } = useSupportRequests({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  const columns: DataTableColumn<SupportRequestItem>[] = [
    {
      id: "name",
      header: "User name",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-medium leading-[17.64px] text-white">
          {row.name}
        </span>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-white">
          {row.email}
        </span>
      ),
    },
    {
      id: "subject",
      header: "Subject",
      cell: (row) => (
        <span className="block max-w-[240px] truncate font-outfit text-[14px] font-normal leading-[17.64px] text-white sm:max-w-none">
          {row.subject}
        </span>
      ),
    },
    {
      id: "created_at",
      header: "Created",
      cell: (row) => (
        <span className="font-outfit text-[14px] font-normal leading-[17.64px] text-figma-muted">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      className: "w-[100px] text-right",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 min-h-[44px] font-outfit text-[14px] font-medium text-figma-bright hover:bg-figma-accent/30 hover:text-white"
          onClick={() => setSelectedRequest(row)}
          aria-label={`View support request from ${row.name}`}
        >
          <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Support Requests"
        description="Review support inquiries submitted by users."
        className="gap-[12px]"
        titleClassName="text-[18px] font-bold leading-[22.68px] tracking-[0.18px] text-white"
        descriptionClassName="text-[16px] font-normal leading-[22px] text-figma-muted"
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        error={error ? getApiErrorMessage(error) : null}
        onRetry={() => void refetch()}
        searchPlaceholder="Search support requests…"
        searchValue={search}
        onSearchChange={setSearch}
        searchInputClassName={adminSearchInputClass}
        serverPagination
        emptyTitle="No support requests yet"
        emptyDescription="Support requests will appear here when users submit inquiries."
        pagination={{
          page,
          pageSize,
          total: data?.pagination.total ?? 0,
        }}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      <SupportRequestDetailPanel
        open={Boolean(selectedRequest)}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
}
