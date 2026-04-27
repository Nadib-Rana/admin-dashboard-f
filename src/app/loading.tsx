"use client";

import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="flex items-center gap-3 rounded-2xl border bg-card px-6 py-4 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading admin console...</p>
      </div>
    </div>
  );
}
