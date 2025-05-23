"use server";
import { createClient } from "@/lib/supabase/server";

export const signIn = async ({ email }: { email: string }) => {
  "use server";
  const supabase = await createClient();

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
