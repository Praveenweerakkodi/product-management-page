"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Package, Moon, Sun, Monitor,
  Download, Trash2, Info, AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { exportToCSV } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light",  label: "Light",  icon: Sun,     desc: "Clean, bright interface"   },
  { value: "dark",   label: "Dark",   icon: Moon,    desc: "Easy on the eyes"           },
  { value: "system", label: "System", icon: Monitor, desc: "Follow OS preference"       },
] as const;

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { products, bulkDelete } = useProducts();
  const [clearStep, setClearStep] = useState<"idle" | "confirm">("idle");

  const handleClearAll = () => {
    if (clearStep === "idle") {
      setClearStep("confirm");
      return;
    }
    bulkDelete(products.map((p) => p.id));
    setClearStep("idle");
  };

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
          <h1 className="text-xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">App preferences & data management</p>
        </div>
        {/* Dark-mode quick toggle */}
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
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl space-y-6 animate-fade-in">

        {/* ── Appearance ─────────────────────────────────────── */}
        <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Appearance</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred colour theme</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
                const active = theme === value;
                return (
                  <button
                    key={value}
                    id={`theme-${value}`}
                    onClick={() => setTheme(value)}
                    className={cn(
                      "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                      active
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-border hover:border-violet-400/50 hover:bg-muted/40"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      active ? "bg-violet-500/20" : "bg-muted"
                    )}>
                      <Icon className={cn("w-5 h-5", active ? "text-violet-500" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <p className={cn("text-sm font-semibold", active && "text-violet-600 dark:text-violet-400")}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5">{desc}</p>
                    </div>
                    {active && (
                      <span className="flex items-center gap-1 text-xs font-medium text-violet-600 dark:text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Data Management ─────────────────────────────────── */}
        <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Data Management</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Export or reset your product data</p>
          </div>
          <div className="p-5 space-y-3">

            {/* Export */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div>
                <p className="text-sm font-medium">Export Products</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Download all {products.length} product{products.length !== 1 ? "s" : ""} as a CSV file
                </p>
              </div>
              <Button
                variant="outline" size="sm"
                id="settings-export-btn"
                onClick={() => exportToCSV(products)}
                disabled={products.length === 0}
                className="gap-2 flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Export CSV
              </Button>
            </div>

            {/* Clear All */}
            <div className={cn(
              "flex items-center justify-between p-4 rounded-xl border transition-colors",
              clearStep === "confirm"
                ? "border-red-500/50 bg-red-500/10"
                : "border-red-500/20 bg-red-500/5"
            )}>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Clear All Products
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {clearStep === "confirm"
                    ? "⚠️ Click again to permanently delete all products. This cannot be undone."
                    : `Permanently removes all ${products.length} product${products.length !== 1 ? "s" : ""} from local storage.`}
                </p>
              </div>
              <Button
                variant={clearStep === "confirm" ? "destructive" : "outline"}
                size="sm"
                id="settings-clear-btn"
                onClick={handleClearAll}
                onBlur={() => setClearStep("idle")}
                disabled={products.length === 0}
                className={cn(
                  "gap-2 flex-shrink-0",
                  clearStep === "idle" && "border-red-500/30 text-red-600 hover:bg-red-500/10 hover:border-red-500"
                )}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {clearStep === "confirm" ? "Confirm Delete" : "Clear All"}
              </Button>
            </div>
          </div>
        </section>

        {/* ── About ───────────────────────────────────────────── */}
        <section className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              About ProductHub
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-base">ProductHub</p>
                <p className="text-xs text-muted-foreground mt-0.5">Management Console · v1.0.0</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Framework",  "Next.js 16 + React 19"],
                ["Storage",    "Browser Local Storage"],
                ["Currency",   "Sri Lankan Rupee (LKR)"],
                ["Categories", "9 product categories"],
                ["Validation", "Zod + React Hook Form"],
                ["Styling",    "Tailwind CSS v4"],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5 p-3 rounded-lg bg-muted/40">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
