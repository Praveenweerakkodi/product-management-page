import { Product } from "@/types/product";

const STORAGE_KEY = "product_manager_data";
const CURRENT_VERSION = 1;

interface StorageSchema {
  version: number;
  products: Product[];
  lastUpdated: string;
}

// Returns a fresh default schema
function defaultSchema(): StorageSchema {
  return {
    version: CURRENT_VERSION,
    products: [],
    lastUpdated: new Date().toISOString(),
  };
}

// Migrate old schema versions to current — extendable as the app grows
function migrate(raw: unknown): StorageSchema {
  if (!raw || typeof raw !== "object") return defaultSchema();

  const data = raw as Partial<StorageSchema>;

  // Version 0 or missing version: treat as flat array (pre-schema)
  if (!data.version) {
    const products = Array.isArray(data) ? data : [];
    return { version: CURRENT_VERSION, products, lastUpdated: new Date().toISOString() };
  }

  // Current version — no migration needed
  if (data.version === CURRENT_VERSION) {
    return data as StorageSchema;
  }

  // Future versions would add migration steps here
  return defaultSchema();
}

export function getProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const schema = migrate(parsed);
    return schema.products || [];
  } catch {
    // Corrupt data — return empty and let it be overwritten on next save
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  const schema: StorageSchema = {
    version: CURRENT_VERSION,
    products,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
}

export function generateId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function exportToCSV(products: Product[]): void {
  const headers = ["ID", "Name", "Price", "Category", "Description", "Image URL", "Created At"];
  const rows = products.map((p) => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    p.price.toString(),
    p.category,
    `"${p.description.replace(/"/g, '""')}"`,
    p.imageUrl || "",
    new Date(p.createdAt).toLocaleString(),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `products_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
