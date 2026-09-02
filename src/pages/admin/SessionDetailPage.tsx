import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/feedback";
import { useSessionDetail } from "@/hooks/useSessionDetail";
import { getApiErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading, isError, error, refetch } = useSessionDetail(sessionId);

  return (
    <div className="w-full space-y-[16px] font-outfit">
      <PageHeader
        title="Session detail"
        description={
          sessionId
            ? `Practice session ${sessionId}`
            : "Select a session to view details."
        }
      />

      {!sessionId && (
        <ErrorMessage message="No session id was provided in the URL." />
      )}

      {sessionId && isLoading && (
        <Card className="border-border bg-card">
          <CardHeader>
            <Skeleton className="h-[24px] w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-[12px]">
            <Skeleton className="h-[16px] w-full" />
            <Skeleton className="h-[16px] w-3/4" />
          </CardContent>
        </Card>
      )}

      {sessionId && isError && (
        <ErrorMessage
          message={getApiErrorMessage(
            error,
            "Unable to load session details. The session may not exist or you may not have access.",
          )}
          onRetry={() => void refetch()}
        />
      )}

      {sessionId && !isLoading && !isError && data != null && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-body-25 text-foreground">
              Session {sessionId}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-[10px] border border-border bg-background/40 p-[14px] text-body-sm text-foreground">
              {JSON.stringify(data as Record<string, unknown>, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Button variant="outline" asChild>
        <Link to="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
