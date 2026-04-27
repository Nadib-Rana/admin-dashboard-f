"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Users,
  FileClock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { clearSession } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Shield },
  {
    href: "/admin/all-referrals",
    label: "All User Referrals",
    icon: TrendingUp,
  },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-card text-card-foreground">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Shield className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Super Admin
          </p>
          <h1 className="text-lg font-semibold">Control Center</h1>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = useMemo(() => {
    const name = user?.fullName ?? "Super Admin";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user?.fullName]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("super-admin-token");
      window.localStorage.removeItem("super-admin-user");
      document.cookie = "super_admin_session=; Max-Age=0; path=/";
    }

    dispatch(clearSession());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 lg:flex">
      <aside className="hidden w-80 border-r bg-card lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-50 lg:hidden"
          >
            <Menu className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <main className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/95 px-4 py-4 backdrop-blur lg:px-8">
          <div>
            <p className="text-sm text-muted-foreground">Logged in as</p>
            <h2 className="text-base font-semibold">
              {user?.fullName ?? "Super Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </header>
        <div className="px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
