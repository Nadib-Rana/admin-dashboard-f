"use client";

import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { StoreProvider, store } from "@/store";
import { hydrateAuthFromStorage } from "@/store/authSlice";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    hydrateAuthFromStorage(store.dispatch);
  }, []);

  return (
    <StoreProvider>
      {children}
      <Toaster richColors position="top-right" />
    </StoreProvider>
  );
}
