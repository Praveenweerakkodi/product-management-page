"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImageIcon, Banknote, Tag, AlignLeft, Type, Upload, X } from "lucide-react";
import { productSchema, ProductSchemaType } from "@/lib/validations";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverage",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Toys",
  "Other",
];

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (values: ProductSchemaType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string>(product?.imageUrl || "");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<ProductSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price ? String(product.price) : "",
      description: product?.description || "",
      imageUrl: product?.imageUrl || "",
      category: product?.category || undefined,
    },
  });

  const categoryValue = watch("category") || "";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setValue("imageUrl", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setValue("imageUrl", "", { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImagePreview(dataUrl);
      setValue("imageUrl", dataUrl, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Product Name */}
      <div className="space-y-1.5">
        <Label htmlFor="product-name" className="text-sm font-medium flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-muted-foreground" />
          Product Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="product-name"
          placeholder="e.g. Wireless Noise-Cancelling Headphones"
          {...register("name")}
          className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
        />
        {errors.name && (
          <p className="text-xs text-red-500 flex items-center gap-1">{errors.name.message}</p>
        )}
      </div>

      {/* Price + Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="product-price" className="text-sm font-medium flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-muted-foreground" />
            Price <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs.</span>
            <Input
              id="product-price"
              placeholder="0.00"
              className={`pl-10 ${errors.price ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("price")}
            />
          </div>
          {errors.price && (
            <p className="text-xs text-red-500">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="product-category" className="text-sm font-medium flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={categoryValue}
            onValueChange={(val) => setValue("category", val as ProductSchemaType["category"])}
          >
            <SelectTrigger
              id="product-category"
              className={errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-red-500">{errors.category.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="product-description" className="text-sm font-medium flex items-center gap-1.5">
          <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="product-description"
          placeholder="Describe the product in detail..."
          rows={3}
          {...register("description")}
          className={errors.description ? "border-red-500 focus-visible:ring-red-500 resize-none" : "resize-none"}
        />
        <div className="flex justify-between items-center">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {watch("description")?.length || 0}/500
          </span>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
          Product Image <span className="text-xs text-muted-foreground font-normal">(optional)</span>
        </Label>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          id="product-image-upload"
          onChange={handleFileChange}
        />

        {imagePreview ? (
          /* ── Preview with remove button ── */
          <div className="relative rounded-xl overflow-hidden border border-border bg-muted group">
            <div className="relative h-40 w-full">
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-6 h-6 text-white" />
              <span className="text-xs text-white font-medium">Click to change image</span>
            </div>
            {/* Remove button */}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors z-10"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-2 left-2 text-xs text-white/90 bg-black/40 px-2 py-0.5 rounded">
              Preview
            </span>
          </div>
        ) : (
          /* ── Upload zone ── */
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              flex flex-col items-center justify-center gap-2.5 h-36 rounded-xl border-2 border-dashed
              cursor-pointer transition-all duration-200 select-none
              ${
                isDragging
                  ? "border-violet-500 bg-violet-500/10 scale-[1.01]"
                  : errors.imageUrl
                  ? "border-red-400 bg-red-50/5 hover:border-red-500"
                  : "border-border bg-muted/40 hover:border-violet-400 hover:bg-violet-500/5"
              }
            `}
          >
            <div className={`p-2.5 rounded-full transition-colors ${
              isDragging ? "bg-violet-500/20" : "bg-muted"
            }`}>
              <Upload className={`w-5 h-5 transition-colors ${
                isDragging ? "text-violet-500" : "text-muted-foreground"
              }`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop image here" : "Click to upload image"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                PNG, JPG, GIF, WebP up to 10 MB
              </p>
            </div>
          </div>
        )}

        {errors.imageUrl && (
          <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          id="form-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          id="form-submit-btn"
          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
        >
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
