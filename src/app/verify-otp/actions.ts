"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type VerifyOTP = {
  email: string;
  token: string;
  currentUrl: string;
  tz: string;
};

export const verifyOTP = async ({
  email,
  token,
  currentUrl,
  tz,
}: VerifyOTP) => {
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
    const url = new URL(currentUrl, "http://localhost"); // host dummy só pra usar o URL
    url.searchParams.set("message", "Could not authenticate user");
    return {
      success: false,
      message: "User not found.",
      url: url.pathname + "?" + url.searchParams.toString(),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .update({ timezone: tz })
    .eq("id", user.id)
    .select("name, email")
    .single();

  const name = profile?.name;

  return {
    success: true,
    url: name ? "/app" : "/account-settings",
  };
};
