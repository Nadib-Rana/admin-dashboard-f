import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionFromCookieValue } from "@/lib/session";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("super_admin_session")?.value;
  const session = sessionCookie
    ? getSessionFromCookieValue(sessionCookie)
    : null;

  if (session?.role === "super_admin") {
    redirect("/admin");
  }

  redirect("/login");
}
