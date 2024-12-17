import { Button, Select, SelectItem, Slider } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

interface Brand {
  id: string;
  name: string;
  image: string;
}

interface Filters {
  brands: string[];
  priceRange: [number, number];
  type: string;
  transmission: string;
}

export default function Filters() {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    brands: [],
    priceRange: [1000, 5000],
    type: "",
    transmission: "",
  });

  const brands: Brand[] = [
    { id: "mercedes", name: "Mercedes", image: "/mercedes.svg" },
    { id: "lexus", name: "Lexus", image: "/lexus.svg" },
    { id: "toyota", name: "Toyota", image: "/toyota.svg" },
    { id: "ferrari", name: "Ferrari", image: "/ferrari.svg" },
    { id: "rolls-royce", name: "Rolls Royce", image: "/rolls-royce.svg" },
    { id: "mclaren", name: "McLaren", image: "/mclaren.svg" },
  ];

  const carTypes = [
    { value: "sedan", label: "Sedan" },
    { value: "suv", label: "SUV" },
    { value: "sports", label: "Sports" },
    { value: "luxury", label: "Luxury" },
  ];

  const transmissionTypes = [
    { value: "automatic", label: "Automatic" },
    { value: "manual", label: "Manual" },
  ];

  const toggleBrand = (brandId: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brandId)
        ? prev.brands.filter((id) => id !== brandId)
        : [...prev.brands, brandId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      priceRange: [1000, 5000],
      type: "",
      transmission: "",
    });
  };

  const applyFilters = () => {
    // Create query parameters
    const queryParams = new URLSearchParams();

    if (filters.brands.length > 0) {
      queryParams.set("brands", filters.brands.join(","));
    }

    if (filters.priceRange) {
      queryParams.set("priceRange", filters.priceRange.join("-"));
    }

    if (filters.type) {
      queryParams.set("type", filters.type);
    }

    if (filters.transmission) {
      queryParams.set("transmission", filters.transmission);
    }

    router.push(`/?${queryParams.toString()}`);
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
            {`AED ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}`}
          </span>
        </div>
        <Slider
          label="Price Range"
          step={100}
          minValue={1000}
          maxValue={10000}
          value={filters.priceRange}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: value as [number, number],
            }))
          }
          className="max-w-md"
        />
      </div>

      {/* Type Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Type</h2>
          <span className="text-gray-500">{filters.type || "Any"}</span>
        </div>
        <Select
          placeholder="Select car type"
          selectedKeys={filters.type ? [filters.type] : []}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, type: e.target.value }))
          }
        >
          {carTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Transmission Section */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Transmission</h2>
          <span className="text-gray-500">{filters.transmission || "Any"}</span>
        </div>
        <Select
          placeholder="Select transmission type"
          selectedKeys={filters.transmission ? [filters.transmission] : []}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, transmission: e.target.value }))
          }
        >
          {transmissionTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex gap-4">
          <Button variant="light" className="flex-1" onClick={clearFilters}>
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
