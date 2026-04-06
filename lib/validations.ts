import { z } from "zod";

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
] as const;

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(100, "Product name must be under 100 characters")
    .trim(),

  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)), "Price must be a valid number")
    .refine((val) => parseFloat(val) >= 0, "Price cannot be negative")
    .refine((val) => parseFloat(val) <= 1_000_000, "Price seems unrealistically high"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be under 500 characters")
    .trim(),

  imageUrl: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === "" ||
        /^https?:\/\/.+/.test(val) ||
        /^data:image\/.+;base64,/.test(val),
      "Please provide a valid image URL or upload an image file"
    ),

  category: z.enum(CATEGORIES, {
    message: "Please select a valid category",
  }),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
