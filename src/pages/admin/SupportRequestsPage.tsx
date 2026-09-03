import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { SupportRequestDetailPanel } from "@/components/features/super-admin/SupportRequestDetailPanel";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsSuperAdmin } from "@/hooks/useIsSuperAdmin";
import { useSupportRequests } from "@/hooks/useSupportRequests";
import { getApiErrorMessage } from "@/lib/api/client";
import type { SupportRequest } from "@/types/api";

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return value;
  }
}

export function SupportRequestsPage() {
  const isSuperAdmin = useIsSuperAdmin();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useSupportRequests({
    page,
    page_size: pageSize,
    search: debouncedSearch || undefined,
  });

  useEffect(() => {
    if (!data?.items.length) {
      setSelectedId(null);
      return;
    }

    const selectedStillVisible = data.items.some((item) => item.id === selectedId);
    if (!selectedId || !selectedStillVisible) {
      setSelectedId(data.items[0].id);
    }
  }, [data?.items, selectedId]);

  if (!isSuperAdmin) {
    return <Navigate to="/admin/unauthorized" replace />;
  }

  const selectedRequest =
    data?.items.find((item) => item.id === selectedId) ?? null;

  const columns: DataTableColumn<SupportRequest>[] = [
    {
      id: "subject",
      header: "Subject",
      cell: (row) => (
        <span className="font-medium text-foreground">{row.subject}</span>
      ),
    },
    {
      id: "name",
      header: "From",
      cell: (row) => row.name,
    },
    {
      id: "email",
      header: "Email",
      cell: (row) => row.email,
    },
    {
      id: "created_at",
      header: "Submitted",
      cell: (row) => formatDate(row.created_at),
    },
  ];

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Support requests"
        description="Review inbound support inquiries from platform users."
      />

      <div className="grid w-full gap-[16px] lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
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
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          serverSide
          selectedRowId={selectedId}
          onRowClick={(row) => setSelectedId(row.id)}
          emptyTitle="No support requests"
          emptyDescription="New inquiries will appear here when submitted."
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
          getRowId={(row) => row.id}
          getRowAriaLabel={(row) => `View support request: ${row.subject}`}
        />

        <SupportRequestDetailPanel
          request={selectedRequest}
          isLoading={isLoading && !selectedRequest}
        />
      </div>
    </div>
  );
}
