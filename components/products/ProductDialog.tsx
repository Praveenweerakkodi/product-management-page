"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductForm } from "./ProductForm";
import { ProductSchemaType } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductDialogProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (values: ProductSchemaType) => void;
}

export function ProductDialog({ open, product, onClose, onSubmit }: ProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: ProductSchemaType) => {
    setIsSubmitting(true);
    // Small delay to show loading state — feels more intentional to users
    await new Promise((r) => setTimeout(r, 300));
    onSubmit(values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {product
              ? "Update the details for this product."
              : "Fill in the details to add a new product to your catalog."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
