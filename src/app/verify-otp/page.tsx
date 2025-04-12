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
import { CheckIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP } from "./actions";
import { signIn } from "../auth/actions";

type OTPInputProps = {
  otpValue: string;
  setOtpValue: (newOtpValue: string) => void;
  callback: CallableFunction;
};

function OTPInput({ otpValue, setOtpValue, callback: cb }: OTPInputProps) {
  return (
    <InputOTP
      maxLength={6}
      value={otpValue}
      onChange={(value) => {
        if (value.length === 6) cb();
        setOtpValue(value);
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
  const initialResendOtpTime = 60;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(initialResendOtpTime);
  const [resendOtp, setResendOtp] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");
  const email = searchParams.get("email")!;
  useEffect(() => {
    if (!email) {
      router.push("/auth");
    }
  }, [email, router]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(intervalID);
          setResendOtp(false);
          return initialResendOtpTime;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
    return () => {
      clearInterval(intervalID);
    };
  }, [resendOtp, timeLeft]);

  async function handleVerifyOTP(): Promise<void> {
    setIsLoading(true);
    try {
      const response = await verifyOTP({
        email,
        token: otpValue,
      });
      router.push(response.url);
    } catch (e) {
      console.error("Error while verifying the OTP", e);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleResendOTP() {
    setResendOtp(true);
    console.log("resent");
    try {
      await signIn({
        email,
      });
    } catch (e) {
      console.error("Error while sign in", e);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px] h-[350px] flex items-center justify-between flex-col">
        <CardHeader className="w-full flex flex-col items-center text-center justify-center gap-7">
          <CardTitle>Verification Code</CardTitle>
          <CardDescription>
            Verification code has been sent to{" "}
            <span className="font-bold">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Center className="flex-col gap-2.5">
            <OTPInput
              setOtpValue={setOtpValue}
              otpValue={otpValue}
              callback={handleVerifyOTP}
            />
            <span
              style={{
                display: errorMessage ? "inline" : "none",
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
              onClick={handleVerifyOTP}
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <>
                  <CheckIcon /> Confirm
                </>
              )}
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
                      onClick={handleResendOTP}
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
