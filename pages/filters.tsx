// pages/filters.tsx
import { Button } from "@nextui-org/react";
import { Slider } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFilterStore } from "@/store/useFilterStore";
import type { Filters } from "@/store/useFilterStore";

interface Brand {
  id: string;
  name: string;
  image: string;
}

interface CarType {
  value: string;
  label: string;
}

interface TransmissionType {
  value: string;
  label: string;
}

export default function Filters() {
  console.log("[FiltersPage] Component rendered");
  const router = useRouter();
  const { filters, setFilters, clearFilters, setFilter, setPriceRange } =
    useFilterStore();

  console.log("[FiltersPage] Current filters:", filters);

  // Available brands data
  const brands: Brand[] = [
    { id: "mercedes", name: "Mercedes", image: "/mercedes.svg" },
    { id: "lexus", name: "Lexus", image: "/lexus.svg" },
    { id: "toyota", name: "Toyota", image: "/toyota.svg" },
    { id: "ferrari", name: "Ferrari", image: "/ferrari.svg" },
    { id: "rolls-royce", name: "Rolls Royce", image: "/rolls-royce.svg" },
    { id: "mclaren", name: "McLaren", image: "/mclaren.svg" },
  ];

  // Car types data
  const carTypes: CarType[] = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "sports", label: "Sports" },
    { value: "luxury", label: "Luxury" },
  ];

  // Transmission types data
  const transmissionTypes: TransmissionType[] = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  // Sync URL params with store on mount
  useEffect(() => {
    console.log(
      "[FiltersPage] useEffect triggered, router ready:",
      router.isReady
    );
    if (!router.isReady) return;

    const { brands, priceRange, type, transmission } = router.query;
    console.log("[FiltersPage] URL query params:", {
      brands,
      priceRange,
      type,
      transmission,
    });

    if (brands || priceRange || type || transmission) {
      const newFilters: Partial<Filters> = {};

      if (brands) {
        newFilters.brands = (brands as string).split(",");
        console.log("[FiltersPage] Parsed brands from URL:", newFilters.brands);
      }

      if (priceRange) {
        const [min, max] = (priceRange as string).split("-").map(Number);
        if (!isNaN(min) && !isNaN(max)) {
          newFilters.priceRange = [min, max];
          console.log(
            "[FiltersPage] Parsed price range from URL:",
            newFilters.priceRange
          );
        }
      }

      if (type) {
        newFilters.type = type as string;
        console.log("[FiltersPage] Parsed type from URL:", newFilters.type);
      }

      if (transmission) {
        newFilters.transmission = transmission as string;
        console.log(
          "[FiltersPage] Parsed transmission from URL:",
          newFilters.transmission
        );
      }

      console.log("[FiltersPage] Setting filters from URL:", newFilters);
      setFilters(newFilters);
    }
  }, [router.isReady, router.query, setFilters]);

  // Toggle brand selection
  const toggleBrand = (brandId: string) => {
    console.log("[FiltersPage] Toggling brand:", brandId);
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter((id) => id !== brandId)
      : [brandId]; // Only allow one brand at a time
    console.log("[FiltersPage] New brands array:", newBrands);
    setFilter("brands", newBrands);
  };

  // Apply filters and navigate back
  const applyFilters = () => {
    console.log("[FiltersPage] Applying filters:", filters);
    const queryParams = new URLSearchParams();

    if (filters.brands.length > 0) {
      queryParams.set("brands", filters.brands.join(","));
    }

    if (filters.priceRange[0] !== null && filters.priceRange[1] !== null) {
      queryParams.set("priceRange", filters.priceRange.join("-"));
    }

    if (filters.type) {
      queryParams.set("type", filters.type);
    }

    if (filters.transmission) {
      queryParams.set("transmission", filters.transmission);
    }

    const queryString = queryParams.toString();
    console.log("[FiltersPage] Generated query string:", queryString);
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // Handle clear filters
  const handleClearFilters = () => {
    console.log("[FiltersPage] Clearing all filters");
    clearFilters();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b">
        <Link href="/">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-semibold">Filters</h1>
      </div>

      {/* Brands Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Brands</h2>
          <span className="text-gray-500">
            {filters.brands.length === 0
              ? "Any"
              : `${filters.brands.length} selected`}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => toggleBrand(brand.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all
                ${
                  filters.brands.includes(brand.id)
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-white"
                }`}
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-10 h-10 mb-2"
              />
              <span className="text-sm">{brand.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Price range</h2>
          <span className="text-gray-500">
            {filters.priceRange[0] === null || filters.priceRange[1] === null
              ? "Any"
              : `AED ${(filters.priceRange[0] / 1000).toFixed(0)}K - ${(filters.priceRange[1] / 1000).toFixed(0)}K`}
          </span>
        </div>
        <div className="px-3">
          <Slider
            label="Price Range"
            formatOptions={{ style: "currency", currency: "AED" }}
            step={50000}
            minValue={1000000}
            maxValue={2000000}
            value={[
              filters.priceRange[0] ?? 1000000,
              filters.priceRange[1] ?? 2000000,
            ]}
            onChange={(value) => {
              console.log("[FiltersPage] Price range changed:", value);
              if (Array.isArray(value) && value.length === 2) {
                setPriceRange([value[0], value[1]]);
              }
            }}
            className="max-w-full"
          />
        </div>
      </div>

      {/* Type Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Type</h2>
          <span className="text-gray-500">{filters.type || "Any"}</span>
        </div>
        <select
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select car type</option>
          {carTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Transmission Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Transmission</h2>
          <span className="text-gray-500">{filters.transmission || "Any"}</span>
        </div>
        <select
          value={filters.transmission}
          onChange={(e) => setFilter("transmission", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Select transmission type</option>
          {transmissionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex gap-4">
          <Button
            variant="light"
            className="flex-1"
            onClick={handleClearFilters}
          >
            Clear all
          </Button>
          <Button color="primary" className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </main>
  );
}
