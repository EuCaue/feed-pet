"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP } from "./actions";
import { signIn } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { CheckIcon, RefreshCwIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Center from "@/components/center";
import { CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loading } from "@/components/loading";

const INITIAL_RESEND_OTP_TIME = 60;

export default function OtpForm({
  email,
  errorMessage,
}: {
  email: string;
  errorMessage?: string;
}) {
  console.log("EMAIL:", email);
  const [otpValue, setOtpValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(INITIAL_RESEND_OTP_TIME);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          setResendOtp(false);
          return INITIAL_RESEND_OTP_TIME;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendOtp]);

  async function handleVerifyOTP(token: string) {
    setIsLoading(true);
    try {
      const res = await verifyOTP({
        email,
        token,
        currentUrl: window.location.href,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      router.push(res.url);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    setResendOtp(true);
    console.log("reseding otp", email);
    try {
      await signIn({ email });
    } catch (error) {
      console.error("Error while resend OTP code.", JSON.stringify(error));
    }
  }

  return (
    <>
      <CardContent>
        <Center className="flex-col gap-2.5">
          <InputOTP
            maxLength={6}
            value={otpValue}
            onChange={(val) => {
              setOtpValue(val);
              if (val.length === 6) handleVerifyOTP(val);
            }}
          >
            <InputOTPGroup>
              {[0, 1, 2].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-11 text-2xl"
                />
              ))}
            </InputOTPGroup>
            <InputOTPGroup>
              {[3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-11 text-2xl"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
          {errorMessage && (
            <span className="text-destructive text-sm font-medium">
              The OTP code is not valid, try again.
            </span>
          )}
        </Center>
      </CardContent>
      <CardFooter className="self-center">
        <Center className="relative">
          <Button
            disabled={otpValue.length < 6 || isLoading}
            onClick={() => handleVerifyOTP(otpValue)}
            className="hover-btn flex-0"
          >
            {isLoading ? (
              <Loading position="right">Confirming...</Loading>
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
                    disabled={resendOtp || isLoading}
                    onClick={handleResendOTP}
                  >
                    <RefreshCwIcon />
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {resendOtp
                    ? `${Math.floor(timeLeft / 60)}:${timeLeft % 60}`
                    : "Resend code"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Center>
      </CardFooter>
    </>
  );
}
