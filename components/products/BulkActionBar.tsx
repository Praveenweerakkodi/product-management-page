"use client";

import { Trash2, X, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";

export function BulkActionBar() {
  const { selectedIds, bulkDelete, selectAll, clearSelection, filteredProducts } = useProducts();
  const count = selectedIds.size;

  if (count === 0) return null;

  const allSelected = filteredProducts.every((p) => selectedIds.has(p.id));

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-foreground text-background shadow-2xl border border-border/10 animate-in slide-in-from-bottom-4 duration-200">
      <span className="text-sm font-medium">
        {count} item{count > 1 ? "s" : ""} selected
      </span>

      <div className="w-px h-4 bg-background/20" />

      {!allSelected && (
        <Button
          variant="ghost"
          size="sm"
          onClick={selectAll}
          id="select-all-btn"
          className="text-background hover:text-background hover:bg-background/10 h-7 text-xs gap-1.5"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          Select all ({filteredProducts.length})
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => bulkDelete([...selectedIds])}
        id="bulk-delete-btn"
        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 text-xs gap-1.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete selected
      </Button>

      <button
        onClick={clearSelection}
        id="clear-selection-btn"
        className="ml-1 text-background/60 hover:text-background transition-colors"
        aria-label="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
