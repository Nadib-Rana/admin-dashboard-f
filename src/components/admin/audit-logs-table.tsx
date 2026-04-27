"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { api } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AuditLogRow = {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  createdAt: string;
};

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadLogs = async () => {
      try {
        const response = await api.get("/admin/audit-logs");
        if (!active) return;

        setLogs(response.data.logs);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadLogs();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
        Loading audit logs...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Admin ID</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Target ID</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.adminId}</TableCell>
              <TableCell>{log.action}</TableCell>
              <TableCell>{log.targetId}</TableCell>
              <TableCell>
                {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
