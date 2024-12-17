// hooks/useCars.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";

const fetchCars = async (pageParam = 1, filters: any) => {
  console.log("[useCars] fetchCars called with filters:", filters);

  // Start with basic pagination
  const params = new URLSearchParams({
    page: pageParam.toString(),
    limit: "10",
  });

  // Only add non-empty filters
  if (filters.brands && filters.brands.length > 0) {
    params.append("make", filters.brands[0].toLowerCase());
    console.log("[useCars] Adding make filter:", filters.brands[0]);
  }

  // Only add price range if it has been explicitly set (not initial values)
  if (
    filters.priceRange &&
    Array.isArray(filters.priceRange) &&
    filters.priceRange.length === 2 &&
    filters.priceRange[0] !== null &&
    filters.priceRange[1] !== null &&
    filters.priceRange[0] !== 1000 && // Don't add if it's the default min
    filters.priceRange[1] !== 10000 // Don't add if it's the default max
  ) {
    params.append(
      "priceRange",
      `${filters.priceRange[0]}-${filters.priceRange[1]}`
    );
    console.log("[useCars] Adding price range:", filters.priceRange.join("-"));
  }

  if (filters.type && filters.type.trim() !== "") {
    params.append("type", filters.type.toLowerCase());
    console.log("[useCars] Adding type filter:", filters.type);
  }

  if (filters.transmission && filters.transmission.trim() !== "") {
    params.append("transmission", filters.transmission.toLowerCase());
    console.log("[useCars] Adding transmission filter:", filters.transmission);
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cars?${params}`;
  console.log("[useCars] Final request URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[useCars] Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("[useCars] Received data:", {
      totalCars: data.totalCars,
      currentPage: data.currentPage,
      carsCount: data.cars?.length,
    });
    return data;
  } catch (error) {
    console.error("[useCars] Error in fetchCars:", error);
    throw error;
  }
};

export function useCars() {
  const filters = useFilterStore((state) => state.filters);
  console.log("[useCars] Current filter state:", filters);

  return useInfiniteQuery({
    queryKey: ["cars", filters],
    queryFn: ({ pageParam = 1 }) => fetchCars(pageParam, filters),
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.totalPages || !lastPage.currentPage) {
        return undefined;
      }
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}
