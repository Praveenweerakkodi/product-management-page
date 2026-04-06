"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Product, FilterState, SortOption } from "@/types/product";
import { getProducts, saveProducts } from "@/lib/storage";

// ─── State ────────────────────────────────────────────────────────────────────

interface ProductState {
  products: Product[];
  filters: FilterState;
  selectedIds: Set<string>;
  isLoading: boolean;
}

const defaultFilters: FilterState = {
  search: "",
  minPrice: "",
  maxPrice: "",
  category: "all",
  sort: "newest",
};

const initialState: ProductState = {
  products: [],
  filters: defaultFilters,
  selectedIds: new Set(),
  isLoading: true,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "LOAD_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: string }
  | { type: "BULK_DELETE"; payload: string[] }
  | { type: "SET_FILTER"; payload: Partial<FilterState> }
  | { type: "RESET_FILTERS" }
  | { type: "TOGGLE_SELECT"; payload: string }
  | { type: "SELECT_ALL"; payload: string[] }
  | { type: "CLEAR_SELECTION" };

function reducer(state: ProductState, action: Action): ProductState {
  switch (action.type) {
    case "LOAD_PRODUCTS":
      return { ...state, products: action.payload, isLoading: false };

    case "ADD_PRODUCT":
      return { ...state, products: [action.payload, ...state.products] };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
        selectedIds: new Set([...state.selectedIds].filter((id) => id !== action.payload)),
      };

    case "BULK_DELETE":
      return {
        ...state,
        products: state.products.filter((p) => !action.payload.includes(p.id)),
        selectedIds: new Set(),
      };

    case "SET_FILTER":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "RESET_FILTERS":
      return { ...state, filters: defaultFilters };

    case "TOGGLE_SELECT": {
      const next = new Set(state.selectedIds);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, selectedIds: next };
    }

    case "SELECT_ALL":
      return { ...state, selectedIds: new Set(action.payload) };

    case "CLEAR_SELECTION":
      return { ...state, selectedIds: new Set() };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ProductContextValue {
  state: ProductState;
  dispatch: React.Dispatch<Action>;
  filteredProducts: Product[];
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getProducts();
    dispatch({ type: "LOAD_PRODUCTS", payload: stored });
  }, []);

  // Persist to localStorage whenever products change
  useEffect(() => {
    if (!state.isLoading) {
      saveProducts(state.products);
    }
  }, [state.products, state.isLoading]);

  // Derived: apply search, category, price, sort filters
  const filteredProducts = useCallback((): Product[] => {
    const { search, minPrice, maxPrice, category, sort } = state.filters;
    let result = [...state.products];

    // Multi-field search: name + description
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Price range filter
    if (minPrice !== "") {
      result = result.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Sort
    switch (sort as SortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [state.products, state.filters])();

  return (
    <ProductContext.Provider value={{ state, dispatch, filteredProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductContext must be used within ProductProvider");
  return ctx;
}
