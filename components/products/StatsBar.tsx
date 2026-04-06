"use client";

import { Package, Banknote, Tag, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

export function StatsBar() {
  const { stats } = useProducts();

  const items = [
    {
      icon: Package,
      label: "Total Products",
      value: stats.total.toString(),
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
    {
      icon: Banknote,
      label: "Total Value",
      value: `Rs. ${stats.totalValue.toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: TrendingUp,
      label: "Avg. Price",
      value: `Rs. ${stats.avgPrice.toFixed(2)}`,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Tag,
      label: "Categories",
      value: stats.categories.toString(),
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ icon: Icon, label, value, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow duration-200"
        >
          <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <p className="text-lg font-bold tracking-tight truncate">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
