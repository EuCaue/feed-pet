import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function signOut() {
  "use server";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const user = await getCurrentUser();
  if (user) {
    supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/");
}
