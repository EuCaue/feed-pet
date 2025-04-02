"use client";
import Center from "@/components/center";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CheckIcon, RefreshCwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OTPInputProps = {
  otpValue: string;
  setOtpValue: (newOtpValue: string) => void;
  OTPCODE: string;
};

function OTPInput({ otpValue, setOtpValue, OTPCODE }: OTPInputProps) {
  const router = useRouter();
  return (
    <InputOTP
      maxLength={6}
      value={otpValue}
      onChange={(value) => {
        setOtpValue(value);
        if (value === OTPCODE) {
          router.push("/account-settings");
        }
      }}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} className="w-11 h-11 text-2xl" />
        <InputOTPSlot index={1} className="w-11 h-11 text-2xl" />
        <InputOTPSlot index={2} className="w-11 h-11 text-2xl" />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={3} className="w-11 h-11 text-2xl" />
        <InputOTPSlot index={4} className="w-11 h-11 text-2xl" />
        <InputOTPSlot index={5} className="w-11 h-11 text-2xl" />
      </InputOTPGroup>
    </InputOTP>
  );
}

export default function VerifyOtp() {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [resendOtp, setResendOtp] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const router = useRouter();
  const otpCode = "932012";

  useEffect(() => {
    setTimeLeft(60000);

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = Math.max(prev - 1000, 0);
        if (newTime === 0) {
          setResendOtp(false);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [resendOtp]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = ((timeLeft % 60000) / 1000).toFixed(0);

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px] h-[350px] flex items-center justify-between flex-col">
        <CardHeader className="w-full flex flex-col items-center text-center justify-center gap-7">
          <CardTitle>Verification Code</CardTitle>
          <CardDescription>
            Verification code has been sent to{" "}
            <span className="font-bold">useremail@example.com</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Center className="flex-col gap-2.5">
            <OTPInput
              setOtpValue={setOtpValue}
              otpValue={otpValue}
              OTPCODE={otpCode}
            />
            <span
              style={{
                display:
                  otpValue !== otpCode && otpValue.length === 6
                    ? "inline"
                    : "none",
              }}
              className="text-destructive text-sm text-center justify-end self-center font-medium"
            >
              The OTP code is not valid, try again.
            </span>
          </Center>
        </CardContent>
        <CardFooter>
          <Center className="relative">
            <Button
              className="hover-btn flex-0"
              variant={"default"}
              disabled={otpValue.length < 6}
              onClick={() => {
                if (otpValue === otpCode) {
                  router.push("/account-settings");
                }
              }}
            >
              <CheckIcon /> Confirm
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant={"link"}
                      size={"sm"}
                      disabled={resendOtp}
                      className="flex-1 text-sm"
                      onClick={() => setResendOtp(true)}
                    >
                      <RefreshCwIcon />
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{resendOtp ? `${minutes}:${seconds}` : "Resend code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Center>
        </CardFooter>
      </Card>
    </Center>
  );
}
