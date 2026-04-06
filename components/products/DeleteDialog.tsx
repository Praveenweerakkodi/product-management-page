"use client";

import { AlertTriangle } from "lucide-react";
import { Product } from "@/types/product";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  product?: Product | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ open, product, onClose, onConfirm }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <DialogTitle className="text-base font-semibold">Delete Product</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">"{product?.name}"</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            id="delete-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1"
            id="delete-confirm-btn"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
