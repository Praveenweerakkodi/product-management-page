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

// Helper to shorten image URLs
function shortenImageUrl(imageUrl?: string): string {
  if (!imageUrl) return "No Image";
  if (imageUrl.length > 50) return "[Image Uploaded]";
  return imageUrl;
}

// Format price with currency
function formatPrice(price: number): string {
  return `Rs. ${price.toFixed(2)}`;
}

export function exportToCSV(products: Product[]): void {
  const headers = ["ID", "Name", "Price (Rs.)", "Category", "Description", "Image", "Created Date"];
  
  const rows = products.map((p) => {
    const name = p.name.includes(",") || p.name.includes('"') ? `"${p.name.replace(/"/g, '""')}"` : p.name;
    const description = p.description.includes(",") || p.description.includes('"') 
      ? `"${p.description.replace(/"/g, '""')}"` 
      : p.description;
    
    return [
      p.id,
      name,
      p.price.toFixed(2),
      p.category,
      description,
      shortenImageUrl(p.imageUrl),
      new Date(p.createdAt).toLocaleDateString(),
    ];
  });

  // Build CSV with proper formatting
  const csvContent = [
    headers.join(","),
    ...rows.map((r) => r.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `products_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportToPDF(products: Product[]): Promise<void> {
  // Dynamically import jsPDF to reduce bundle size
  const { jsPDF } = await import("jspdf");
  const { autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(16);
  doc.text("Product Inventory Report", 14, 15);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
  doc.text(`Total Products: ${products.length}`, 14, 28);
  
  // Prepare table data
  const tableData = products.map((p) => [
    p.id,
    p.name.substring(0, 25), // Truncate long names
    formatPrice(p.price),
    p.category.substring(0, 15),
    p.description.substring(0, 35), // Truncate descriptions
    shortenImageUrl(p.imageUrl),
    new Date(p.createdAt).toLocaleDateString(),
  ]);

  // Generate table
  autoTable(doc, {
    head: [["ID", "Name", "Price", "Category", "Description", "Image", "Date"]],
    body: tableData,
    startY: 35,
    margin: 10,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246], // Blue header
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8,
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 25 },
      2: { cellWidth: 18 },
      3: { cellWidth: 20 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 },
      6: { cellWidth: 22 },
    },
    didDrawPage: (data: any) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.getHeight();
      const pageWidth = pageSize.getWidth();

      doc.setFontSize(8);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    },
  });

  // Download PDF
  doc.save(`products_${new Date().toISOString().split("T")[0]}.pdf`);
}
