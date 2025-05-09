import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type User = {
  email: string;
  name: string;
  id: string;
  is_12h: boolean;
}

export default async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, id, is_12h")
    .eq("id", user!.id)
    .single()
    .overrideTypes<User>();
  return profile;
}
