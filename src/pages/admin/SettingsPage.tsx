import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/feedback";
import { usePlayerRoleSelection } from "@/hooks/usePlayerRoleSelection";
import { getApiErrorMessage } from "@/lib/api/client";

export function SettingsPage() {
  const {
    data: roleSelection,
    isLoading,
    isError,
    error,
    refetch,
  } = usePlayerRoleSelection();

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Settings"
        description="Configure admin panel preferences and account settings."
      />

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-body-25 text-foreground">
            Player role selection status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-[12px]">
          {isLoading && (
            <div className="space-y-[8px]">
              <Skeleton className="h-[16px] w-[240px]" />
              <Skeleton className="h-[16px] w-[180px]" />
            </div>
          )}

          {isError && (
            <ErrorMessage
              message={getApiErrorMessage(
                error,
                "Unable to load player role selection status.",
              )}
              onRetry={() => void refetch()}
            />
          )}

          {!isLoading && !isError && roleSelection && (
            <dl className="grid gap-[12px] sm:grid-cols-2">
              <div>
                <dt className="font-lato text-body-5 text-muted-foreground">
                  Selected role
                </dt>
                <dd className="text-body-13 text-foreground">
                  {roleSelection.selected_role || "—"}
                </dd>
              </div>
              <div>
                <dt className="font-lato text-body-5 text-muted-foreground">
                  Current role
                </dt>
                <dd className="text-body-13 text-foreground">
                  {roleSelection.role || "—"}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
