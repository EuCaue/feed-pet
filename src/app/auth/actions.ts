"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const signIn = async ({ email }: { email: string }) => {
  "use server";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) {

    return {
      success: false,
      message: "Could not authenticate user",
      url: "/auth?message=Could not authenticate user",
    };
  }

  return { success: true, url: `/verify-otp?email=${email}` };
};
