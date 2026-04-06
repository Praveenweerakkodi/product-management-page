import { useCallback } from "react";
import { toast } from "sonner";
import { useProductContext } from "@/context/ProductContext";
import { Product, FilterState } from "@/types/product";
import { generateId } from "@/lib/storage";
import { ProductSchemaType } from "@/lib/validations";

/**
 * useProducts — custom hook that exposes all product CRUD actions.
 * Keeps business logic out of components.
 */
export function useProducts() {
  const { state, dispatch, filteredProducts } = useProductContext();

  const addProduct = useCallback(
    (values: ProductSchemaType) => {
      const now = new Date().toISOString();
      const product: Product = {
        id: generateId(),
        name: values.name,
        // Zod validates price as a string from the form input; convert here
        price: parseFloat(values.price),
        description: values.description,
        imageUrl: values.imageUrl || undefined,
        category: values.category,
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: "ADD_PRODUCT", payload: product });
      toast.success(`"${product.name}" added successfully!`);
      return product;
    },
    [dispatch]
  );

  const updateProduct = useCallback(
    (id: string, values: ProductSchemaType) => {
      const existing = state.products.find((p) => p.id === id);
      if (!existing) return;

      const updated: Product = {
        ...existing,
        name: values.name,
        price: parseFloat(values.price),
        description: values.description,
        imageUrl: values.imageUrl || undefined,
        category: values.category,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_PRODUCT", payload: updated });
      toast.success(`"${updated.name}" updated successfully!`);
      return updated;
    },
    [dispatch, state.products]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const product = state.products.find((p) => p.id === id);
      dispatch({ type: "DELETE_PRODUCT", payload: id });
      toast.success(`"${product?.name || "Product"}" deleted.`);
    },
    [dispatch, state.products]
  );

  const bulkDelete = useCallback(
    (ids: string[]) => {
      dispatch({ type: "BULK_DELETE", payload: ids });
      toast.success(`${ids.length} product${ids.length > 1 ? "s" : ""} deleted.`);
    },
    [dispatch]
  );

  const toggleSelect = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_SELECT", payload: id }),
    [dispatch]
  );

  const selectAll = useCallback(
    () =>
      dispatch({
        type: "SELECT_ALL",
        payload: filteredProducts.map((p) => p.id),
      }),
    [dispatch, filteredProducts]
  );

  const clearSelection = useCallback(
    () => dispatch({ type: "CLEAR_SELECTION" }),
    [dispatch]
  );

  // Simplified, explicit type — avoids the `never` inference issue
  const setFilter = useCallback(
    (filter: Partial<FilterState>) =>
      dispatch({ type: "SET_FILTER", payload: filter }),
    [dispatch]
  );

  const resetFilters = useCallback(
    () => dispatch({ type: "RESET_FILTERS" }),
    [dispatch]
  );

  // Aggregate stats
  const stats = {
    total: state.products.length,
    totalValue: state.products.reduce((sum, p) => sum + p.price, 0),
    avgPrice:
      state.products.length > 0
        ? state.products.reduce((sum, p) => sum + p.price, 0) / state.products.length
        : 0,
    categories: new Set(state.products.map((p) => p.category)).size,
  };

  return {
    products: state.products,
    filteredProducts,
    filters: state.filters,
    selectedIds: state.selectedIds,
    isLoading: state.isLoading,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    toggleSelect,
    selectAll,
    clearSelection,
    setFilter,
    resetFilters,
  };
}
