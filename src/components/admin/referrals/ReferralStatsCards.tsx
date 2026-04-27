"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, TrendingUp } from "lucide-react";
import { ReferralStats } from "@/store/referralSlice";
import { Card } from "@/components/ui/card";

interface ReferralStatsCardProps {
  stats: ReferralStats | null;
  isLoading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function ReferralStatsCards({
  stats,
  isLoading,
}: ReferralStatsCardProps) {
  if (isLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3].map((i) => (
          <motion.div key={i} variants={item}>
            <Card className="h-32 bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals,
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
    },
    {
      label: "Referral Vendors",
      value: stats.referralVendors,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
    },
    {
      label: "Converted Subscriptions",
      value: stats.convertedSubscriptions,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div key={index} variants={item}>
            <Card className={`overflow-hidden ${stat.bgColor}`}>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <motion.p
                      className="text-3xl font-bold mt-2 text-gray-900"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div
                    className={`${stat.iconBg} p-3 rounded-lg`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-6 h-6 text-gray-700" />
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
