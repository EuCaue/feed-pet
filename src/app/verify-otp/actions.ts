"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export const verifyOTP = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  "use server";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error, data } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  
  console.log(data.session)

  if (error) {
    console.error(error);
    return {
      success: false,
      message: "Could not authenticate user",
      url: "/verify-otp?message=Could not authenticate user",
    };
  }

  return {
    success: true,
    url: "/app",
  };
};
