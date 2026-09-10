import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingState } from '@/components/ui/LoadingState';
import { useSession } from '@/hooks/useSession';
import { getApiErrorMessage } from '@/lib/api/getApiErrorMessage';

export function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const query = useSession(sessionId);

  return (
    <div className="w-full space-y-6">
      <PageHeader title="Session" description={sessionId ? `Session ${sessionId}` : 'Session detail'} />
      {query.isLoading ? <LoadingState label="Loading session…" /> : null}
      {query.isError ? (
        <div className="space-y-3">
          <ErrorMessage
            message={getApiErrorMessage(query.error, 'Unable to load this session. Please try again.')}
          />
          <Button type="button" variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : null}
      {query.data ? (
        <pre className="overflow-auto rounded-figma-10 border border-sidebar-border bg-card p-4 text-body-sm text-foreground">
          {JSON.stringify(query.data, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
