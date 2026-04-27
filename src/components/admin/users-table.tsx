"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import { useAppSelector } from "@/store";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

type UserRow = {
  id: string;
  fullName: string | null;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

export function UsersTable() {
  const currentUser = useAppSelector((state) => state.auth.user);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        if (!active) return;

        setUsers(
          (response as { data: { users: any[]; currentUserId: string } }).data
            .users,
        );
        setCurrentUserId(
          (response as { data: { users: any[]; currentUserId: string } }).data
            .currentUserId,
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const currentAdminId = useMemo(
    () => currentUserId ?? currentUser?.id ?? null,
    [currentUserId, currentUser?.id],
  );

  const handleToggle = async (user: UserRow) => {
    const nextActive = !user.isActive;

    if (user.id === currentAdminId && !nextActive) {
      await Swal.fire({
        icon: "warning",
        title: "Blocked",
        text: "You cannot deactivate your own Super Admin account.",
      });
      return;
    }

    const confirmation = await Swal.fire({
      icon: "question",
      title: nextActive ? "Activate user?" : "Deactivate user?",
      text: `${user.fullName ?? user.email} will be marked as ${nextActive ? "active" : "inactive"}.`,
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
    });

    if (!confirmation.isConfirmed) {
      return;
    }

    try {
      const response = await api.patch(`/admin/users/${user.id}/status`, {
        isActive: nextActive,
      });

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                isActive: (
                  response as { data: { user: { isActive: boolean } } }
                ).data.user.isActive,
              }
            : item,
        ),
      );
      toast.success("User status updated.");
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error instanceof Error
            ? error.message
            : "Unable to update the user status.",
      });
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading users...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentAdminId;

            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.fullName ?? "Unnamed user"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={() => void handleToggle(user)}
                      disabled={loading || (isSelf && !user.isActive)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {isSelf ? "Self protected" : "Toggle"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
