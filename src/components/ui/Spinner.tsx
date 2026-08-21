interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({ label = "Loading", className = "" }: SpinnerProps) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-primary ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        className="h-5 w-5 animate-spin text-current"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-sm font-medium text-current">{label}</span>
    </div>
  );
}
