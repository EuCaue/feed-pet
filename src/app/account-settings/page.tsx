import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Center from "@/components/center";
import ClientAccountForm from "./client-account-form";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export default async function AccountSettings() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/");
  }

  const userData = {
    email: profile.email,
    name: profile.name,
  };

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientAccountForm user={userData} />
        </CardContent>
      </Card>
    </Center>
  );
}
