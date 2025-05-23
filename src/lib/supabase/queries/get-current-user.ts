"use server"
import { createClient } from "@/lib/supabase/server";

type User = {
  email: string;
  name: string;
  id: string;
  is_12h: boolean;
  timezone: string;
};

export default async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, email, id, is_12h, timezone")
    .eq("id", user!.id)
    .single()
    .overrideTypes<User>();

  if (error) {
    console.error("Failed to fetch profile", error);
    return null;
  }

  return profile;
}
