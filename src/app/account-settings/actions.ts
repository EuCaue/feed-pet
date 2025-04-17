"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

type SaveAccountSettingsReturn = {
  success: boolean;
  message: string;
};

export async function saveAccountSettings(data: {
  name: string;
  email: string;
}): Promise<SaveAccountSettingsReturn> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

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

  if (user.email !== data.email) {
    const { error: authError } = await supabase.auth.updateUser({
      email: data.email,
    });
    console.error("AUTH ERROR", authError);

    if (authError) {
      return {
        success: false,
        message: authError.message,
      };
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      success: false,
      message: "Profile not found.",
    };
  }

  if (profile.name !== data.name || profile.email !== data.email) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        name: data.name,
        email: data.email,
      })
      .eq("id", user.id);
    console.log("PROFILE ERR", profileError);

    if (profileError) {
      return {
        success: false,
        message: "Error while updating profile.",
      };
    }
  }

  return {
    success: true,
    message: "Account settings updated successfully.",
  };
}
