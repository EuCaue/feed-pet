"use server";
import { createClient } from "@/lib/supabase/server";

type UserProfileData = {
  name?: string;
  email?: string;
  is_12h?: boolean;
};

export async function updateUserProfile(data: UserProfileData) {
  const supabase = await createClient();

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
  const fieldsToUpdate = Object.keys(data).join(", ");
  const { data: profile } = await supabase
    .from("profiles")
    .select(fieldsToUpdate)
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      success: false,
      message: "Profile not found.",
    };
  }

  if (JSON.stringify(profile) !== JSON.stringify(data)) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id);

    if (profileError) {
      console.error("PROFILE ERR", profileError);
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
