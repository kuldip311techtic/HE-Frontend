import type { ButtonHTMLAttributes, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'accent';
}

const variantClassName: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-secondary hover:bg-navy active:bg-canvas',
  accent: 'bg-accent text-secondary hover:bg-warning',
};

export default function Button({
  children,
  loading = false,
  loadingText = 'Please wait…',
  variant = 'primary',
  disabled,
  className = '',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex min-h-touch w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70 ${variantClassName[variant]} ${className}`}
    >
      {loading ? (
        <LoadingSpinner size="sm" label={loadingText} tone="onDark" />
      ) : null}
      {loading ? loadingText : children}
    </button>
  );
}
