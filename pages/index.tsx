import {
  Card,
  CardBody,
  Chip,
  Button,
  Tabs,
  Tab,
  Input,
} from "@nextui-org/react";
import {
  Star,
  Navigation,
  User,
  MessageCircle,
  Car,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFilterStore } from "@/store/useFilterStore";
import { useCars } from "@/hooks/useCars";

interface Location {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  name: string;
}

interface CarAvailability {
  availableFrom: string;
  location: Location;
  pickupOptions: string[];
  status: string;
}

interface Color {
  exterior: string;
  interior: string;
}

interface Pricing {
  basePrice: number;
  currency: string;
  deposit: number;
  discounts: {
    weeklyRate: number;
    monthlyRate: number;
  };
  insurance: {
    basic: number;
    premium: number;
  };
}

interface Rating {
  average: number;
  count: number;
  isRare: boolean;
}

interface CarType {
  _id: string;
  make: string;
  model: string;
  variant: string;
  type: string;
  year: number;
  color: Color;
  availability: CarAvailability;
  pricing: Pricing;
  rating: Rating;
  licensePlate: string;
  createdAt: string;
  updatedAt: string;
  vin: string;
  __v: number;
}

export default function Home() {
  console.log("[HomePage] Component rendered");
  const router = useRouter();
  const { ref: loadMoreRef, inView } = useInView();
  const filters = useFilterStore((state) => state.filters);

  console.log("[HomePage] Current filters:", filters);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useCars();

  // Infinite scroll effect
  useEffect(() => {
    console.log("[HomePage] InView effect triggered:", {
      inView,
      hasNextPage,
      isFetchingNextPage,
    });
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("[HomePage] Fetching next page");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten all pages of cars data
  const cars = data?.pages.flatMap((page) => page.cars) ?? [];
  console.log("[HomePage] Processed cars count:", cars.length);

  return (
    <main className="min-h-screen relative pb-16 bg-gray-50">
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-white">
        <h1 className="text-xl font-bold text-black">AutoLuxe</h1>
        <div className="flex items-center gap-2">
          <Navigation className="text-black" size={20} />
          <span className="text-black">Burj Al Arab Ho..</span>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-4 py-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-black">Schedule a car</h2>
        <Link href="/filters" className="block">
          <div className="relative cursor-pointer">
            <Input
              isReadOnly
              startContent={<Search />}
              endContent={
                (filters.brands.length > 0 ||
                  (filters.priceRange[0] !== null &&
                    filters.priceRange[1] !== null) ||
                  filters.type !== "" ||
                  filters.transmission !== "") && (
                  <Chip size="sm" color="primary">
                    {[
                      filters.brands.length > 0 ? 1 : 0,
                      filters.priceRange[0] !== null ? 1 : 0,
                      filters.type ? 1 : 0,
                      filters.transmission ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}{" "}
                    filters
                  </Chip>
                )
              }
              placeholder="Schedule here"
              description="Cars are just 3 mins away"
              size="lg"
              classNames={{
                base: "mb-6",
                mainWrapper: "h-16",
                input: "text-large",
              }}
            />
          </div>
        </Link>
      </div>

      {/* Available Cars Section */}
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">Available Cars</h2>
          {status === "pending" && <p>Loading...</p>}
          {status === "error" && error && (
            <p className="text-red-500">Error: {error.message}</p>
          )}
        </div>

        {/* Cars Grid */}
        {status === "success" && (
          <>
            {cars.length === 0 ? (
              <div className="text-center py-8">
                <p>No cars found matching your criteria</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {cars.map((car) => (
                  <Link
                    href={`/car/${car._id}`}
                    key={car._id}
                    className="block no-underline"
                  >
                    <Card>
                      <CardBody>
                        <img
                          src="/api/placeholder/400/200"
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold">{`${car.make} ${car.model}`}</h3>
                            <p className="text-gray-500">{car.type}</p>
                            <p className="text-sm text-gray-500">
                              {car.color?.exterior} •{" "}
                              {car.availability?.location?.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {car.pricing?.currency} {car.pricing?.basePrice}
                              /day
                            </p>
                            {car.rating && (
                              <div className="flex items-center justify-end">
                                <Star
                                  size={16}
                                  className="fill-yellow-400 text-yellow-400"
                                />
                                <span className="ml-1">
                                  {car.rating.average?.toFixed(1)}
                                </span>
                                <span className="ml-1 text-gray-500">
                                  ({car.rating.count})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="h-20 flex items-center justify-center"
              >
                {isFetchingNextPage && <p>Loading more...</p>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t">
        <Tabs
          aria-label="Navigation"
          classNames={{
            base: "w-full",
            tabList: "flex justify-around py-2",
            tab: "flex-1 h-12",
            tabContent: "flex flex-col items-center text-xs",
          }}
        >
          <Tab
            key="home"
            title={
              <div className="flex flex-col items-center">
                <Navigation size={24} />
                <span>Home</span>
              </div>
            }
          />
          <Tab
            key="cars"
            title={
              <div className="flex flex-col items-center">
                <Car size={24} />
                <span>Cars</span>
              </div>
            }
          />
          <Tab
            key="profile"
            title={
              <div className="flex flex-col items-center">
                <User size={24} />
                <span>Profile</span>
              </div>
            }
          />
          <Tab
            key="messages"
            title={
              <div className="flex flex-col items-center">
                <MessageCircle size={24} />
                <span>Messages</span>
              </div>
            }
          />
        </Tabs>
      </div>
    </main>
  );
}
