import { Component, type ErrorInfo, type ReactNode } from "react";

import { ApiError } from "@/lib/apiClient";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

function getAdminErrorCopy(error: Error): {
  title: string;
  description: string;
} {
  if (error instanceof ApiError && error.status === 403) {
    return {
      title: "Admin access denied",
      description: error.message,
    };
  }

  if (error instanceof ApiError && error.status === 401) {
    return {
      title: "Admin session expired",
      description: error.message,
    };
  }

  if (error instanceof ApiError) {
    return {
      title: "Admin request failed",
      description: error.message,
    };
  }

  return {
    title: "Admin panel error",
    description: error.message || "An unexpected error occurred.",
  };
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Admin error boundary caught an error", error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    const copy = getAdminErrorCopy(error);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div
          role="alert"
          className="w-full max-w-md rounded-lg border border-error-border bg-error-background p-6 shadow-md"
        >
          <h1 className="text-xl font-semibold text-error">{copy.title}</h1>
          <p className="mt-2 text-sm text-foreground">{copy.description}</p>
          <Button className="mt-6" onClick={this.reset}>
            Try again
          </Button>
        </div>
      </div>
    );
  }
}
