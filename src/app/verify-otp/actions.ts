"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type VerifyOTP = {
  email: string;
  token: string;
  currentUrl: string;
};

export const verifyOTP = async ({ email, token, currentUrl }: VerifyOTP) => {
  "use server";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    console.error(error);
    const url = new URL(currentUrl, "http://localhost"); // host dummy só pra usar o URL
    url.searchParams.set("message", "Could not authenticate user");

    return {
      success: false,
      message: "Could not authenticate user",
      url: url.pathname + "?" + url.searchParams.toString(),
    };
  }
  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return {
      success: false,
      message: "User not found.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  const name = profile?.name;

  return {
    success: true,
    url: name ? "/app" : "/account-settings",
  };
};
