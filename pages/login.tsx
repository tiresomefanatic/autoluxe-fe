// pages/login.tsx
import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { Phone } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth.context";

export default function Login() {
  const router = useRouter();
  const { signInWithGoogle, signInWithPhone, verifyOtp } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const verId = await signInWithPhone(phoneNumber);
      setVerificationId(verId);
      onOpen();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      await verifyOtp(verificationId, otp);
      onClose();
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
      router.push("/");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="text-center mb-8 mt-12">
        <h1 className="text-3xl font-bold mb-2">AutoLuxe</h1>
        <p className="text-gray-600">Welcome to luxury car rentals</p>
      </div>

      <Card className="w-full max-w-md">
        <CardBody className="px-6 py-8">
          <div className="space-y-4">
            <Input
              type="tel"
              label="Phone Number"
              placeholder="+971 XX XXX XXXX"
              startContent={<Phone className="text-default-400" />}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              color="primary"
              className="w-full"
              size="lg"
              isLoading={loading}
              onClick={handlePhoneSubmit}
            >
              Continue with Phone
            </Button>
          </div>

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <Divider className="my-6" />

          <Button
            className="w-full"
            variant="bordered"
            startContent={
              <img src="/google-icon.svg" alt="Google" width={20} height={20} />
            }
            isLoading={loading}
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Enter OTP
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  We've sent a verification code to {phoneNumber}
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  size="lg"
                  classNames={{
                    input: "text-2xl tracking-widest text-center",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  onPress={handleOtpSubmit}
                >
                  Verify OTP
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div id="recaptcha-container"></div>
    </div>
  );
}
