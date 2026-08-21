import type { ErrorInfo } from "react";

import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export class AdminErrorBoundary extends ErrorBoundary {
  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("AdminErrorBoundary caught an error", error, info);
  }
}
