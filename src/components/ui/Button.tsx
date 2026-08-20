import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'accent' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

const variantClassName: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-secondary hover:bg-navy active:bg-canvas',
  accent: 'bg-accent text-secondary hover:bg-warning',
  ghost:
    'border border-line bg-surface text-ink hover:bg-accent-soft hover:text-ink',
  danger: 'border border-danger/30 bg-danger-soft text-danger hover:bg-danger/10',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    loading = false,
    loadingText = 'Please wait…',
    variant = 'primary',
    fullWidth = true,
    disabled,
    className = '',
    ...buttonProps
  },
  ref,
) {
  return (
    <button
      {...buttonProps}
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`flex min-h-touch items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-70 ${fullWidth ? 'w-full' : 'w-auto'} ${variantClassName[variant]} ${className}`}
    >
      {loading ? (
        <LoadingSpinner size="sm" label={loadingText} tone="onDark" />
      ) : null}
      {loading ? loadingText : children}
    </button>
  );
});

export default Button;
