"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, Tag, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/"            },
  { icon: Package,         label: "Products",   href: "/products"    },
  { icon: Tag,             label: "Categories", href: "/categories"  },
  { icon: Settings,        label: "Settings",   href: "/settings"    },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm tracking-tight">ProductHub</p>
          <p className="text-xs text-muted-foreground">Management Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  active
                    ? "text-violet-500"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span>{label}</span>
              {active && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@producthub.lk</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

