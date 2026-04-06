"use client";

import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasFilters: boolean;
  onAddProduct: () => void;
  onClearFilters: () => void;
}

export function EmptyState({ hasFilters, onAddProduct, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center">
          <PackageOpen className="w-12 h-12 text-violet-400" strokeWidth={1.2} />
        </div>
        {/* Decorative dots */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-500/20 border border-violet-500/30" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-indigo-500/20 border border-indigo-500/30" />
      </div>

      <h2 className="text-lg font-semibold mb-2">
        {hasFilters ? "No products match your filters" : "No products yet"}
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {hasFilters
          ? "Try adjusting your search, category, or price filters to find what you're looking for."
          : "Get started by adding your first product to the catalog. It only takes a few seconds."}
      </p>

      {hasFilters ? (
        <Button
          variant="outline"
          onClick={onClearFilters}
          id="empty-clear-filters-btn"
          className="gap-2"
        >
          Clear all filters
        </Button>
      ) : (
        <Button
          onClick={onAddProduct}
          id="empty-add-product-btn"
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add your first product
        </Button>
      )}
    </div>
  );
}
