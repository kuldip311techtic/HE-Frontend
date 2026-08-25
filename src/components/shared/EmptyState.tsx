import { CreditCard } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <CreditCard className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="text-lg font-semibold leading-7 text-foreground">{title}</p>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
