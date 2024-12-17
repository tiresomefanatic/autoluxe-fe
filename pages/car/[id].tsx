import { Button, Card, Chip } from "@nextui-org/react";
import { ChevronLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

interface CarFeature {
  icon: string;
  label: string;
}

export default function CarDetail({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white pb-6">
      {/* Header */}
      <div className="p-4 flex justify-between items-center fixed top-0 w-full bg-white z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()}>
            <ChevronLeft size={24} />
          </button>
          <span className="text-black">Burj Al Arab Ho..</span>
        </div>
      </div>

      {/* Car Image */}
      <div className="w-full h-[300px] mt-14">
        <img
          src="/mercedes-s500.jpg"
          alt="Mercedes S class"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-black mb-4">Mercedes S class</h1>

        {/* Features Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <Chip variant="flat" className="bg-gray-100">
            Automatic
          </Chip>
          <Chip variant="flat" className="bg-gray-100">
            4 seater
          </Chip>
          <Chip variant="flat" className="bg-gray-100">
            2019
          </Chip>
        </div>

        {/* Rating and No Advance Fee Card */}
        <Card className="mb-4 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">4.95</span>
              <span>⭐️</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎫</span>
              <div>
                <p className="font-semibold">No advance fee</p>
                <p className="text-gray-500 text-sm">
                  and superfast verification
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Rare Car Note */}
        <div className="flex items-center gap-3 p-4 border-b">
          <span className="text-xl">⭐️</span>
          <div>
            <p className="font-semibold text-black">This is a rare car</p>
            <p className="text-gray-500">Made for business professionals</p>
          </div>
        </div>

        {/* Car Specifications */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-xl">⛽️</span>
            <span className="text-black">Petrol</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="text-black">2999cc</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔄</span>
            <span className="text-black">Automatic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡️</span>
            <span className="text-black">362.07bhp</span>
          </div>
        </div>

        {/* Price and Reserve Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-bold text-black">AED 2200/-</p>
              <p className="text-gray-500 text-sm">Total before taxes</p>
            </div>
            <Button color="primary" size="lg" className="bg-rose-500">
              Reserve car
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="flex items-center gap-3 p-4 border-b">
            <span>✓</span>
            <span className="text-black">Anti lock braking system (ABS)</span>
          </div>
          <div className="flex items-center gap-3 p-4 border-b">
            <span>✓</span>
            <span className="text-black">Automatic climate control</span>
          </div>

          {/* Service Info */}
          <div className="flex items-center gap-3 p-4 border-b">
            <span className="text-xl">🚗</span>
            <span className="text-black">Last serviced 1 week ago</span>
          </div>

          {/* Help Section */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-3">
              <span className="text-xl">❓</span>
              <div>
                <p className="text-black">Need more help ? message us now.</p>
                <Button variant="light" className="p-0 h-auto text-blue-500">
                  Start chat
                </Button>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex justify-between items-center p-4">
            <div>
              <p className="font-semibold text-black">
                Burj Arab Stadium Gate 7
              </p>
              <p className="text-gray-500">Dec 6 - Dec 10 10:30 am</p>
            </div>
            <Button isIconOnly variant="light">
              <Edit size={20} />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
