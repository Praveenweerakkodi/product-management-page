"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, Trash2, ExternalLink, Tag } from "lucide-react";
import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleSelect: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Electronics: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Clothing: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  "Food & Beverage": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  "Home & Garden": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Sports: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Books: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  Beauty: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  Toys: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  Other: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
};

export function ProductCard({ product, isSelected, onEdit, onDelete, onToggleSelect }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const categoryColor = CATEGORY_COLORS[product.category] || CATEGORY_COLORS["Other"];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5",
        isSelected && "ring-2 ring-violet-500 border-violet-500/50"
      )}
    >
      {/* Selection checkbox */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Checkbox
          id={`select-${product.id}`}
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(product.id)}
          className="bg-background/80 backdrop-blur-sm border-white/50 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
        />
      </div>

      {/* Image area */}
      <div className="relative h-44 bg-muted overflow-hidden">
        {product.imageUrl && !imgError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
            <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <Tag className="w-6 h-6 text-muted-foreground/50" />
            </div>
            <span className="text-xs text-muted-foreground/60">No image</span>
          </div>
        )}

        {/* Price badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 rounded-lg text-sm font-bold bg-background/90 backdrop-blur-sm border border-border shadow-sm">
            Rs. {product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category badge */}
        <Badge
          variant="outline"
          className={cn("w-fit text-xs font-medium px-2 py-0.5 rounded-md border", categoryColor)}
        >
          {product.category}
        </Badge>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
          {product.description}
        </p>

        {/* Date */}
        <p className="text-xs text-muted-foreground/60 mt-1">
          Added {new Date(product.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/30">
        {product.imageUrl && !imgError && (
          <a
            href={product.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="View image"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          id={`edit-${product.id}`}
          className="h-8 px-3 text-xs gap-1.5 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <Edit2 className="w-3 h-3" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          id={`delete-${product.id}`}
          className="h-8 px-3 text-xs gap-1.5 hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </Button>
      </div>
    </div>
  );
}
