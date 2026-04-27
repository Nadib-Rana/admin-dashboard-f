import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminSessionUser } from "@/types/admin";

export type AuthState = {
  token: string | null;
  user: AdminSessionUser | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(
      state,
      action: PayloadAction<{ token: string; user: AdminSessionUser }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearSession(state) {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export default authSlice.reducer;

export function hydrateAuthFromStorage(
  dispatch: (
    action: ReturnType<typeof setSession> | ReturnType<typeof clearSession>,
  ) => void,
) {
  if (typeof window === "undefined") {
    return;
  }

  const token = window.localStorage.getItem("super-admin-token");
  const userJson = window.localStorage.getItem("super-admin-user");

  if (!token || !userJson) {
    return;
  }

  try {
    const user = JSON.parse(userJson) as AdminSessionUser;
    dispatch(setSession({ token, user }));
  } catch {
    window.localStorage.removeItem("super-admin-token");
    window.localStorage.removeItem("super-admin-user");
  }
}
