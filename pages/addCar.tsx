import { useState } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Chip,
} from "@nextui-org/react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useRouter } from "next/router";

const luxuryBrands = [
  { value: "Rolls-Royce", label: "Rolls-Royce" },
  { value: "Lamborghini", label: "Lamborghini" },
  { value: "Ferrari", label: "Ferrari" },
  { value: "Mercedes-Benz", label: "Mercedes-Benz" },
  { value: "Bentley", label: "Bentley" },
];

const carTypes = [
  { value: "luxury", label: "Luxury" },
  { value: "sports", label: "Sports" },
  { value: "suv", label: "SUV" },
];

const locations = [
  {
    value: "Downtown Dubai Branch",
    label: "Downtown Dubai",
    address: "Sheikh Mohammed bin Rashid Blvd, Downtown Dubai",
    coordinates: { latitude: 25.2048, longitude: 55.2708 },
  },
  {
    value: "Palm Jumeirah Branch",
    label: "Palm Jumeirah",
    address: "Crescent Road, Palm Jumeirah",
    coordinates: { latitude: 25.1124, longitude: 55.139 },
  },
  {
    value: "Dubai Marina Branch",
    label: "Dubai Marina",
    address: "Marina Walk, Dubai Marina",
    coordinates: { latitude: 25.0777, longitude: 55.1304 },
  },
  {
    value: "DIFC Branch",
    label: "DIFC",
    address: "Gate Avenue, DIFC",
    coordinates: { latitude: 25.2147, longitude: 55.2796 },
  },
];

const featureCategories = [
  { value: "safety", label: "Safety" },
  { value: "comfort", label: "Comfort" },
  { value: "performance", label: "Performance" },
  { value: "convenience", label: "Convenience" },
];

const conditions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export default function AddCar() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    variant: "",
    year: new Date().getFullYear(),
    type: "luxury",
    color: {
      exterior: "",
      interior: "",
    },
    vin: "",
    licensePlate: "",
    specifications: {
      engine: {
        type: "",
        capacity: 0,
        power: 0,
        transmission: "Automatic",
        cylinders: 8,
      },
      performance: {
        acceleration: 0,
        topSpeed: 0,
        fuelEfficiency: 0,
      },
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        wheelbase: 0,
        seatingCapacity: 0,
      },
    },
    features: [] as Array<{
      id: string;
      name: string;
      category: "safety" | "comfort" | "performance" | "convenience";
      icon?: string;
    }>,
    maintenance: {
      lastService: {
        date: new Date().toISOString(),
        mileage: 0,
        type: "regular" as "regular" | "major" | "repair",
      },
      nextServiceDue: {
        date: new Date().toISOString(),
        mileage: 0,
      },
      condition: "excellent" as "excellent" | "good" | "fair",
    },
    pricing: {
      basePrice: 0,
      currency: "AED",
      deposit: 0,
      insurance: {
        basic: 0,
        premium: 0,
      },
      discounts: {
        weeklyRate: 0,
        monthlyRate: 0,
        specialOffer: 0,
      },
    },
    availability: {
      status: "available" as
        | "available"
        | "booked"
        | "maintenance"
        | "unavailable",
      location: {
        name: "",
        address: "",
        coordinates: {
          latitude: 0,
          longitude: 0,
        },
      },
      pickupOptions: ["location", "delivery"] as ("location" | "delivery")[],
      availableFrom: new Date().toISOString(),
    },
    rating: {
      average: 5,
      count: 0,
      isRare: false,
    },
    restrictions: {
      minAge: 25,
      minLicenseYears: 3,
      requiredDocuments: [
        "Valid UAE/International Driver's License",
        "Original Passport",
        "Tourist Visa or UAE ID",
        "Credit Card with Sufficient Limit",
      ],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [newFeature, setNewFeature] = useState({
    name: "",
    category: "comfort" as "safety" | "comfort" | "performance" | "convenience",
    icon: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // First, upload images and get their URLs
      const imageUrls = await uploadImages(images);

      // Prepare the final car data
      const carData = {
        ...formData,
        images: imageUrls.map((url, index) => ({
          id: crypto.randomUUID(),
          url,
          alt: `${formData.make} ${formData.model} ${formData.variant} Image ${index + 1}`,
          isMain: index === 0,
        })),
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
        },
      };

      // Send the data to your backend
      const response = await fetch("http://localhost:8080/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error("Failed to add car");
      }

      const result = await response.json();
      router.push("/admin/cars"); // Redirect to cars list
    } catch (error) {
      console.error("Error adding car:", error);
      // Show error message to user
    }
  };

  // Function to handle image uploads
  const uploadImages = async (files: File[]): Promise<string[]> => {
    // In a real application, you would upload these to your server or a cloud storage
    // For now, we'll return placeholder URLs
    return files.map(() => "/placeholder-car-image.jpg");
  };

  const handleLocationChange = (locationValue: string) => {
    const selectedLocation = locations.find(
      (loc) => loc.value === locationValue
    );
    if (selectedLocation) {
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          location: {
            name: selectedLocation.value,
            address: selectedLocation.address,
            coordinates: selectedLocation.coordinates,
          },
        },
      }));
    }
  };

  const addFeature = () => {
    if (newFeature.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          {
            id: crypto.randomUUID(),
            ...newFeature,
          },
        ],
      }));
      setNewFeature({
        name: "",
        category: "comfort",
        icon: "",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button isIconOnly variant="light" onPress={() => router.back()}>
          <ChevronLeft />
        </Button>
        <h1 className="text-xl font-bold text-black">Add New Car</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Basic Information */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Brand"
              value={formData.make}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, make: e.target.value }))
              }
              isRequired
            >
              {luxuryBrands.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </Select>

            <Input
              label="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, model: e.target.value }))
              }
              isRequired
            />

            <Input
              label="Variant"
              value={formData.variant}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, variant: e.target.value }))
              }
              isRequired
            />

            <Input
              label="VIN"
              value={formData.vin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, vin: e.target.value }))
              }
              isRequired
            />

            <Input
              label="License Plate"
              value={formData.licensePlate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  licensePlate: e.target.value,
                }))
              }
              isRequired
            />

            <Input
              label="Year"
              type="number"
              min={1900}
              max={new Date().getFullYear() + 1}
              value={formData.year.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  year: parseInt(e.target.value),
                }))
              }
              isRequired
            />

            <Input
              label="Exterior Color"
              value={formData.color.exterior}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  color: { ...prev.color, exterior: e.target.value },
                }))
              }
              isRequired
            />

            <Input
              label="Interior Color"
              value={formData.color.interior}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  color: { ...prev.color, interior: e.target.value },
                }))
              }
              isRequired
            />
          </div>
        </Card>

        {/* Engine & Performance */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Engine & Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Engine Type"
              placeholder="e.g. V8 Twin-Turbo"
              value={formData.specifications.engine.type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    engine: {
                      ...prev.specifications.engine,
                      type: e.target.value,
                    },
                  },
                }))
              }
              isRequired
            />

            <Input
              type="number"
              label="Engine Capacity (L)"
              step="0.1"
              value={formData.specifications.engine.capacity.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    engine: {
                      ...prev.specifications.engine,
                      capacity: parseFloat(e.target.value),
                    },
                  },
                }))
              }
              isRequired
            />

            <Input
              type="number"
              label="Power (HP)"
              value={formData.specifications.engine.power.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    engine: {
                      ...prev.specifications.engine,
                      power: parseInt(e.target.value),
                    },
                  },
                }))
              }
              isRequired
            />

            <Select
              label="Transmission"
              value={formData.specifications.engine.transmission}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    engine: {
                      ...prev.specifications.engine,
                      transmission: e.target.value as "Manual" | "Automatic",
                    },
                  },
                }))
              }
              isRequired
            >
              <SelectItem value="Automatic" key={""}>
                Automatic
              </SelectItem>
              <SelectItem value="Manual" key={""}>
                Manual
              </SelectItem>
            </Select>

            <Input
              type="number"
              label="0-100 km/h (seconds)"
              step="0.1"
              value={formData.specifications.performance.acceleration.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    performance: {
                      ...prev.specifications.performance,
                      acceleration: parseFloat(e.target.value),
                    },
                  },
                }))
              }
              isRequired
            />

            <Input
              type="number"
              label="Top Speed (km/h)"
              value={formData.specifications.performance.topSpeed.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    performance: {
                      ...prev.specifications.performance,
                      topSpeed: parseInt(e.target.value),
                    },
                  },
                }))
              }
              isRequired
            />
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Base Price (AED/day)"
              value={formData.pricing.basePrice.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    basePrice: parseInt(e.target.value),
                  },
                }))
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">AED</span>
                </div>
              }
              isRequired
            />

            <Input
              type="number"
              label="Deposit"
              value={formData.pricing.deposit.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    deposit: parseInt(e.target.value),
                  },
                }))
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">AED</span>
                </div>
              }
              isRequired
            />

            <Input
              type="number"
              label="Basic Insurance (AED/day)"
              value={formData.pricing.insurance.basic.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    insurance: {
                      ...prev.pricing.insurance,
                      basic: parseInt(e.target.value),
                    },
                  },
                }))
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">AED</span>
                </div>
              }
              isRequired
            />

            <Input
              type="number"
              label="Premium Insurance (AED/day)"
              value={formData.pricing.insurance.premium.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricing: {
                    ...prev.pricing,
                    insurance: {
                      ...prev.pricing.insurance,
                      premium: parseInt(e.target.value),
                    },
                  },
                }))
              }
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">AED</span>
                </div>
              }
              isRequired
            />
          </div>
        </Card>

        {/* Location & Availability */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">
            Location & Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Location"
              value={formData.availability.location.name}
              onChange={(e) => handleLocationChange(e.target.value)}
              isRequired
            >
              {locations.map((location) => (
                <SelectItem key={location.value} value={location.value}>
                  {location.label}
                </SelectItem>
              ))}
            </Select>

            <Select
              label="Status"
              value={formData.availability.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  availability: {
                    ...prev.availability,
                    status: e.target.value as
                      | "available"
                      | "booked"
                      | "maintenance"
                      | "unavailable",
                  },
                }))
              }
              isRequired
            >
              <SelectItem value="available" key={""}>
                Available
              </SelectItem>
              <SelectItem value="booked" key={""}>
                Booked
              </SelectItem>
              <SelectItem value="maintenance" key={""}>
                Maintenance
              </SelectItem>
              <SelectItem value="unavailable" key={""}>
                Unavailable
              </SelectItem>
            </Select>
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Images</h2>
          <div className="flex flex-col gap-4">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setImages(Array.from(e.target.files));
                }
              }}
            />
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== index))
                    }
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Feature name"
                value={newFeature.name}
                onChange={(e) =>
                  setNewFeature((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Select
                placeholder="Category"
                value={newFeature.category}
                onChange={(e) =>
                  setNewFeature((prev) => ({
                    ...prev,
                    category: e.target.value as
                      | "safety"
                      | "comfort"
                      | "performance"
                      | "convenience",
                  }))
                }
              >
                {featureCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              <Button onClick={addFeature}>
                <Plus size={20} />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Chip
                  key={feature.id}
                  onClose={() =>
                    setFormData((prev) => ({
                      ...prev,
                      features: prev.features.filter((_, i) => i !== index),
                    }))
                  }
                  variant="flat"
                  color={
                    feature.category === "safety"
                      ? "danger"
                      : feature.category === "comfort"
                        ? "success"
                        : feature.category === "performance"
                          ? "primary"
                          : "default"
                  }
                >
                  {feature.name} ({feature.category})
                </Chip>
              ))}
            </div>
          </div>
        </Card>

        <div className="flex gap-4 mt-6 mb-20">
          <Button
            variant="bordered"
            onPress={() => router.back()}
            className="flex-1 text-black"
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" className="flex-1">
            Add Car
          </Button>
        </div>
      </form>
    </div>
  );
}
