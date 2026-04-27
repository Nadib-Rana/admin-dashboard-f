"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  delay?: number;
  accent?: "primary" | "emerald" | "amber";
};

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  emerald: "bg-emerald-500/10 text-emerald-600",
  amber: "bg-amber-500/10 text-amber-600",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  delay = 0,
  accent = "primary",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      <Card className="border-border/70 bg-card shadow-sm">
        <CardContent className="flex items-start justify-between p-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tracking-tight">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",
              accentClasses[accent],
            )}
          >
            <Icon className="size-5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
