import { LoginForm } from "@/components/admin/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
        <div className="mb-8 space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Super Admin Access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sign in to the control panel
          </h1>
          <p className="text-sm text-muted-foreground">
            Use the seeded demo credentials to enter the dashboard.
          </p>
        </div>
        <LoginForm />
        <div className="mt-6 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Demo credentials</p>
          <p>Email: superadmin@demo.com</p>
          <p>Password: Admin@1234</p>
        </div>
      </div>
    </main>
  );
}
