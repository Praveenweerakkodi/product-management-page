"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Package, Tag, Banknote, BarChart3, Moon, Sun, ArrowRight, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Electronics", "Clothing", "Food & Beverage", "Home & Garden",
  "Sports", "Books", "Beauty", "Toys", "Other",
];

type CatCfg = { color: string; bg: string; border: string; barColor: string };

const CFG: Record<string, CatCfg> = {
  Electronics:      { color: "text-blue-600 dark:text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   barColor: "bg-blue-500"   },
  Clothing:         { color: "text-pink-600 dark:text-pink-400",   bg: "bg-pink-500/10",   border: "border-pink-500/20",   barColor: "bg-pink-500"   },
  "Food & Beverage":{ color: "text-orange-600 dark:text-orange-400",bg:"bg-orange-500/10",  border: "border-orange-500/20", barColor: "bg-orange-500" },
  "Home & Garden":  { color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10",  border: "border-green-500/20",  barColor: "bg-green-500"  },
  Sports:           { color: "text-yellow-600 dark:text-yellow-400",bg:"bg-yellow-500/10", border: "border-yellow-500/20", barColor: "bg-yellow-400" },
  Books:            { color: "text-purple-600 dark:text-purple-400",bg:"bg-purple-500/10", border: "border-purple-500/20", barColor: "bg-purple-500" },
  Beauty:           { color: "text-rose-600 dark:text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20",   barColor: "bg-rose-500"   },
  Toys:             { color: "text-teal-600 dark:text-teal-400",   bg: "bg-teal-500/10",   border: "border-teal-500/20",   barColor: "bg-teal-500"   },
  Other:            { color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10",  border: "border-slate-500/20",  barColor: "bg-slate-400"  },
};

export default function CategoriesPage() {
  const { products, isLoading } = useProducts();
  const { theme, setTheme } = useTheme();

  const categoryStats = useMemo(() =>
    CATEGORIES.map((cat) => {
      const items      = products.filter((p) => p.category === cat);
      const totalValue = items.reduce((s, p) => s + p.price, 0);
      return {
        name:       cat,
        count:      items.length,
        totalValue,
        avgPrice:   items.length ? totalValue / items.length : 0,
        topProduct: items.sort((a, b) => b.price - a.price)[0] ?? null,
      };
    }),
  [products]);

  const totalProducts = products.length;
  const totalValue    = products.reduce((s, p) => s + p.price, 0);
  const activeCount   = categoryStats.filter((c) => c.count > 0).length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">ProductHub</span>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {CATEGORIES.length} categories · {totalProducts} products
          </p>
        </div>
        <Button
          variant="ghost" size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-lg" aria-label="Toggle theme"
        >
          <Sun  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 animate-fade-in">

        {/* Overview stat tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Tag,          label: "Total Categories", value: CATEGORIES.length.toString(),  color: "text-violet-500",  bg: "bg-violet-500/10"  },
            { icon: Package,      label: "Total Products",   value: totalProducts.toString(),      color: "text-indigo-500",  bg: "bg-indigo-500/10"  },
            { icon: BarChart3,    label: "Active Categories",value: activeCount.toString(),        color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Banknote,  label: "Inventory Value",  value: `Rs. ${totalValue.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`, color: "text-orange-500", bg: "bg-orange-500/10" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
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

        {/* Category cards grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl border bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats.map(({ name, count, totalValue: tv, avgPrice, topProduct }) => {
              const cfg = CFG[name] ?? CFG["Other"];
              const pct = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;

              return (
                <div
                  key={name}
                  className={cn(
                    "group relative rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-card",
                    cfg.border
                  )}
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", cfg.bg)}>
                      <Tag className={cn("w-5 h-5", cfg.color)} />
                    </div>
                    <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", cfg.bg, cfg.color)}>
                      {pct}%
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm mb-0.5">{name}</h3>
                  <p className={cn("text-xs font-medium mb-3", cfg.color)}>
                    {count} product{count !== 1 ? "s" : ""}
                  </p>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-muted mb-4 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", cfg.barColor)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-muted-foreground mb-0.5">Total Value</p>
                      <p className="font-semibold">
                        Rs.&nbsp;{tv.toLocaleString("en-LK", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-muted-foreground mb-0.5">Avg. Price</p>
                      <p className="font-semibold">
                        Rs.&nbsp;{avgPrice.toLocaleString("en-LK", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>

                  {/* Top product */}
                  {topProduct && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        Top: <span className="font-medium text-foreground">{topProduct.name}</span>
                      </span>
                    </div>
                  )}

                  {/* View link on hover */}
                  {count > 0 && (
                    <Link
                      href="/products"
                      className={cn(
                        "absolute bottom-4 right-4 flex items-center gap-1 text-xs font-semibold",
                        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        cfg.color
                      )}
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  {/* Empty state label */}
                  {count === 0 && (
                    <p className="mt-3 text-xs text-muted-foreground/60 italic">No products yet</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
