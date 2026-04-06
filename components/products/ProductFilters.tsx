"use client";

import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { FilterState } from "@/types/product";

const CATEGORIES = [
  "Electronics", "Clothing", "Food & Beverage",
  "Home & Garden", "Sports", "Books", "Beauty", "Toys", "Other",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name: A → Z" },
  { value: "name-desc", label: "Name: Z → A" },
];

export function ProductFilters() {
  const { filters, setFilter, resetFilters } = useProducts();

  const activeFilterCount = [
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.category !== "all" ? filters.category : "",
    filters.sort !== "newest" ? filters.sort : "",
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="product-search"
            placeholder="Search by name or description..."
            value={filters.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="pl-9 pr-9"
            suppressHydrationWarning
          />
          {filters.search && (
            <button
              onClick={() => setFilter({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category */}
        <Select
          value={filters.category}
          onValueChange={(val) => setFilter({ category: val ?? undefined })}
        >
          <SelectTrigger id="category-filter" className="w-full sm:w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(val) => setFilter({ sort: val as FilterState["sort"] })}
        >
          <SelectTrigger id="sort-filter" className="w-full sm:w-48">
            <ChevronDown className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price range */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Rs.</span>
          <Input
            id="min-price-filter"
            type="number"
            placeholder="Min"
            min={0}
            value={filters.minPrice}
            onChange={(e) => setFilter({ minPrice: e.target.value })}
            className="pl-9 w-24 h-8 text-sm"
            suppressHydrationWarning
          />
        </div>
        <span className="text-muted-foreground text-sm">to</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Rs.</span>
          <Input
            id="max-price-filter"
            type="number"
            placeholder="Max"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => setFilter({ maxPrice: e.target.value })}
            className="pl-9 w-24 h-8 text-sm"
            suppressHydrationWarning
          />
        </div>

        {/* Active filter badges */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 ml-2">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              id="reset-filters-btn"
              className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
