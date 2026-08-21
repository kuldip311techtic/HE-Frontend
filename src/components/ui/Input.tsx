import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  trailingElement?: ReactNode;
}

export default function Input({
  label,
  error,
  trailingElement,
  className = '',
  id,
  required,
  ...inputProps
}: InputProps) {
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold leading-5 text-ink"
      >
        {label}
      </label>
      <div
        className={`flex min-h-touch items-center rounded-xl border bg-surface transition focus-within:border-accent focus-within:shadow-focus ${
          error ? 'border-danger' : 'border-line'
        }`}
      >
        <input
          {...inputProps}
          id={id}
          required={required}
          aria-required={required || undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm leading-5 text-ink outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-70"
        />
        {trailingElement}
      </div>
      {error ? (
        <p id={errorId} className="mt-1.5 text-xs leading-4 text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
