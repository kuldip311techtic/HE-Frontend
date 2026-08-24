interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md';
  tone?: 'accent' | 'onDark';
}

export default function LoadingSpinner({
  label = 'Loading',
  size = 'md',
  tone = 'accent',
}: LoadingSpinnerProps) {
  const dimension = size === 'sm' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-[3px]';
  const toneClass =
    tone === 'onDark'
      ? 'border-white/30 border-t-secondary'
      : 'border-navy-muted/30 border-t-accent';

  return (
    <span className="inline-flex items-center justify-center" role="status">
      <span
        className={`${dimension} ${toneClass} animate-spin rounded-full`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
