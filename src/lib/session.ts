import { UserRole } from "@/types/admin";

export type AdminSession = {
  token: string;
  role: UserRole;
  userId: string;
};

export function createSessionCookieValue(session: AdminSession) {
  return `${session.token}::${session.role}::${session.userId}`;
}

export function getSessionFromCookieValue(value: string): AdminSession | null {
  const [token, role, userId] = value.split("::");

  if (!token || !role || !userId) {
    return null;
  }

  if (role !== UserRole.super_admin) {
    return null;
  }

  return {
    token,
    role,
    userId,
  };
}

export function getUserIdFromToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const match = token.match(/^sa-token-(.+)$/);
  return match?.[1] ?? null;
}
