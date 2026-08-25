import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught application error', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-canvas px-6 text-center text-secondary">
          <section className="max-w-md rounded-2xl border border-white/10 bg-primary p-8 shadow-card">
            <p className="text-3xl font-semibold">Something went wrong.</p>
            <p className="mt-3 text-sm leading-6 text-navy-muted">
              Refresh the page to try again.
            </p>
            <button
              type="button"
              className="mt-6 min-h-touch rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-secondary"
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
