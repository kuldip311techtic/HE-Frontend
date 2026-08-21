interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div
      className="rounded-lg border border-border bg-surface px-6 py-12 text-center shadow-sm"
      role="status"
    >
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
