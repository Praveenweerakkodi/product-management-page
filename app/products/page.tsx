"use client";

import { useState, useCallback } from "react";
import { Plus, Download, Edit2, Trash2, Search, Package, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useProducts } from "@/hooks/useProducts";
import { exportToCSV } from "@/lib/storage";
import { ProductDialog } from "@/components/products/ProductDialog";
import { DeleteDialog } from "@/components/products/DeleteDialog";
import { BulkActionBar } from "@/components/products/BulkActionBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { ProductSchemaType } from "@/lib/validations";

const CATEGORY_COLORS: Record<string, string> = {
  Electronics:      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Clothing:         "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  "Food & Beverage":"bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Home & Garden":  "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Sports:           "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Books:            "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Beauty:           "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  Toys:             "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  Other:            "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

export default function ProductsPage() {
  const {
    products, filteredProducts, filters, setFilter,
    isLoading, selectedIds,
    addProduct, updateProduct, deleteProduct,
    toggleSelect, selectAll, clearSelection,
  } = useProducts();
  const { theme, setTheme } = useTheme();

  const [addDialogOpen, setAddDialogOpen]   = useState(false);
  const [editProduct,   setEditProduct]     = useState<Product | null>(null);
  const [deleteTarget,  setDeleteTarget]    = useState<Product | null>(null);

  const handleAdd    = useCallback((v: ProductSchemaType) => addProduct(v), [addProduct]);
  const handleEdit   = useCallback((v: ProductSchemaType) => {
    if (editProduct) updateProduct(editProduct.id, v);
  }, [editProduct, updateProduct]);
  const handleDelete = useCallback(() => {
    if (deleteTarget) deleteProduct(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteProduct]);

  const allSelected =
    filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

  return (
    <>
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">ProductHub</span>
        </div>

        {/* Desktop title */}
        <div className="hidden lg:block">
          <h1 className="text-xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your full product catalog</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost" size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg" aria-label="Toggle theme"
          >
            <Sun  className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {products.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => exportToCSV(products)} className="gap-2 text-xs h-9">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          )}

          <Button
            id="products-add-btn"
            onClick={() => setAddDialogOpen(true)}
            className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </Button>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────── */}
      <main className="flex-1 px-4 sm:px-6 py-6 space-y-4 animate-fade-in">

        {/* Search bar + count */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="products-search"
              placeholder="Search products…"
              value={filters.search}
              onChange={(e) => setFilter({ search: e.target.value })}
              className="pl-9"
            />
          </div>
          <p className="text-sm text-muted-foreground ml-auto">
            {isLoading ? "Loading…" : `${filteredProducts.length} of ${products.length} products`}
          </p>
        </div>

        {/* ── Table ──────────────────────────────────────────── */}
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-[auto_3fr_1.2fr_0.9fr_2fr_1fr_auto] items-center gap-4 px-4 py-3 border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Checkbox
              id="select-all-products"
              checked={allSelected}
              onCheckedChange={(c) => (c ? selectAll() : clearSelection())}
              className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
            />
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Description</span>
            <span>Added</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Package className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <div>
                <p className="font-semibold">No products yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first product to get started</p>
              </div>
              <Button
                onClick={() => setAddDialogOpen(true)}
                className="mt-1 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredProducts.map((product) => {
                const selected      = selectedIds.has(product.id);
                const categoryColor = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS["Other"];
                return (
                  <div
                    key={product.id}
                    className={cn(
                      "grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_3fr_1.2fr_0.9fr_2fr_1fr_auto] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/30",
                      selected && "bg-violet-500/5"
                    )}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleSelect(product.id)}
                      className="data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
                    />

                    {/* Thumb + Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
                        {product.imageUrl ? (
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40} height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-sm truncate">{product.name}</span>
                    </div>

                    {/* Category (hidden on mobile) */}
                    <Badge
                      variant="outline"
                      className={cn("hidden md:flex w-fit text-xs font-medium px-2 py-0.5 rounded-md border whitespace-nowrap", categoryColor)}
                    >
                      {product.category}
                    </Badge>

                    {/* Price */}
                    <span className="hidden md:block text-sm font-semibold tabular-nums">
                      Rs.&nbsp;{product.price.toFixed(2)}
                    </span>

                    {/* Description */}
                    <p className="hidden md:block text-xs text-muted-foreground truncate">
                      {product.description}
                    </p>

                    {/* Date */}
                    <span className="hidden md:block text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(product.createdAt).toLocaleDateString("en-LK", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setEditProduct(product)}
                        id={`products-edit-${product.id}`}
                        className="h-8 w-8 p-0 hover:bg-violet-500/10 hover:text-violet-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setDeleteTarget(product)}
                        id={`products-delete-${product.id}`}
                        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <ProductDialog open={addDialogOpen}  onClose={() => setAddDialogOpen(false)} onSubmit={handleAdd} />
      <ProductDialog open={!!editProduct}  product={editProduct} onClose={() => setEditProduct(null)} onSubmit={handleEdit} />
      <DeleteDialog  open={!!deleteTarget} product={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <BulkActionBar />
    </>
  );
}
