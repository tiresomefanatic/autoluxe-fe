// store/useFilterStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Filters {
  brands: string[];
  priceRange: [number | null, number | null];
  type: string;
  transmission: string;
  priceRangeModified: boolean; // New flag to track if price range was modified
}

interface FilterState {
  filters: Filters;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  setPriceRange: (range: [number | null, number | null]) => void;
}

const initialFilters: Filters = {
  brands: [],
  priceRange: [null, null],
  type: "",
  transmission: "",
  priceRangeModified: false,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      filters: initialFilters,

      setFilters: (newFilters) => {
        console.log("[FilterStore] Setting filters:", newFilters);
        set((state) => ({
          filters: {
            ...state.filters,
            ...newFilters,
            // Preserve the modified flag if price range is being set
            priceRangeModified: newFilters.priceRange
              ? true
              : state.filters.priceRangeModified,
          },
        }));
      },

      clearFilters: () => {
        console.log("[FilterStore] Clearing filters");
        set({ filters: initialFilters });
      },

      setFilter: (key, value) => {
        console.log("[FilterStore] Setting filter:", key, value);
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        }));
      },

      setPriceRange: (range) => {
        console.log("[FilterStore] Setting price range:", range);
        set((state) => ({
          filters: {
            ...state.filters,
            priceRange: range,
            priceRangeModified: true,
          },
        }));
      },
    }),
    {
      name: "car-filters",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        filters: {
          brands: state.filters.brands,
          priceRange: state.filters.priceRange,
          type: state.filters.type,
          transmission: state.filters.transmission,
          priceRangeModified: state.filters.priceRangeModified,
        },
      }),
    }
  )
);

export type { Filters };
