"use client";

import { useState, useCallback } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { StatsBar } from "@/components/products/StatsBar";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteDialog } from "@/components/products/DeleteDialog";
import { BulkActionBar } from "@/components/products/BulkActionBar";
import { EmptyState } from "@/components/products/EmptyState";
import { SkeletonCard } from "@/components/products/SkeletonCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { exportToCSV, exportToPDF } from "@/lib/storage";
import type { Product } from "@/types/product";
import type { ProductSchemaType } from "@/lib/validations";

export default function HomePage() {
  const {
    filteredProducts,
    filters,
    isLoading,
    selectedIds,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleSelect,
    resetFilters,
    products,
  } = useProducts();

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const hasActiveFilters =
    !!filters.search || !!filters.minPrice || !!filters.maxPrice || filters.category !== "all";

  // Handlers
  const handleAdd = useCallback(
    (values: ProductSchemaType) => addProduct(values),
    [addProduct]
  );

  const handleEdit = useCallback(
    (values: ProductSchemaType) => {
      if (editProduct) updateProduct(editProduct.id, values);
    },
    [editProduct, updateProduct]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteProduct]);

  return (
    <>
      {/* Header */}
      <Header onAddProduct={() => setAddDialogOpen(true)} />

      <main className="flex-1 px-4 sm:px-6 py-6 space-y-6 animate-fade-in">
        {/* Stats bar */}
        <StatsBar />

        {/* Filters */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">
                {isLoading ? (
                  <span className="inline-block w-24 h-4 bg-muted rounded-md animate-pulse" />
                ) : (
                  <>
                    {filteredProducts.length}{" "}
                    <span className="text-muted-foreground font-normal">
                      product{filteredProducts.length !== 1 ? "s" : ""}
                      {hasActiveFilters ? " found" : " total"}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Export Menu */}
            {products.length > 0 && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  id="export-btn"
                  className="gap-2 text-xs h-8"
                  disabled={isExporting}
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                  <ChevronDown className="w-3.5 h-3.5" />
                </Button>

                {/* Dropdown menu */}
                {exportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-card border rounded-lg shadow-lg z-50">
                    <button
                      onClick={async () => {
                        setIsExporting(true);
                        exportToCSV(products);
                        setExportMenuOpen(false);
                        setIsExporting(false);
                      }}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-t-lg transition-colors disabled:opacity-50"
                    >
                      📊 Export as CSV
                    </button>
                    <button
                      onClick={async () => {
                        setIsExporting(true);
                        await exportToPDF(products);
                        setExportMenuOpen(false);
                        setIsExporting(false);
                      }}
                      disabled={isExporting}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-b-lg transition-colors disabled:opacity-50"
                    >
                      📄 Export as PDF
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <ProductFilters />
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onAddProduct={() => setAddDialogOpen(true)}
            onClearFilters={resetFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card-enter"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <ProductCard
                  product={product}
                  isSelected={selectedIds.has(product.id)}
                  onEdit={(p) => setEditProduct(p)}
                  onDelete={(p) => setDeleteTarget(p)}
                  onToggleSelect={toggleSelect}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add product dialog */}
      <ProductDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAdd}
      />

      {/* Edit product dialog */}
      <ProductDialog
        open={!!editProduct}
        product={editProduct}
        onClose={() => setEditProduct(null)}
        onSubmit={handleEdit}
      />

      {/* Delete confirmation */}
      <DeleteDialog
        open={!!deleteTarget}
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Floating bulk action bar */}
      <BulkActionBar />
    </>
  );
}
