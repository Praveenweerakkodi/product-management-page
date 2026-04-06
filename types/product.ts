export type ProductCategory =
  | "Electronics"
  | "Clothing"
  | "Food & Beverage"
  | "Home & Garden"
  | "Sports"
  | "Books"
  | "Beauty"
  | "Toys"
  | "Other";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: ProductCategory;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ProductFormValues {
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  category: ProductCategory;
}

export type SortOption =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

export interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  category: string;
  sort: SortOption;
}
