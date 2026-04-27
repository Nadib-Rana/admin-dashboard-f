"use client";

import { configureStore } from "@reduxjs/toolkit";
import {
  createContext,
  createElement,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import authReducer from "./authSlice";
import referralReducer from "./referralSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    referral: referralReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const StoreContext = createContext(store);

export function StoreProvider({ children }: { children: ReactNode }) {
  return createElement(StoreContext.Provider, { value: store }, children);
}

export function useStoreValue() {
  return useContext(StoreContext);
}

export function useAppDispatch() {
  return useStoreValue().dispatch;
}

export function useAppSelector<T>(selector: (state: RootState) => T) {
  const currentStore = useStoreValue();

  return useSyncExternalStore(
    currentStore.subscribe,
    () => selector(currentStore.getState()),
    () => selector(currentStore.getState()),
  );
}
