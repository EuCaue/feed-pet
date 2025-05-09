import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Center from "@/components/center";
import ClientAccountForm from "./client-account-form";
import { redirect } from "next/navigation";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";

export default async function AccountSettings() {
  const user = await getCurrentUser();

  if (!user) redirect("/");

  const userData = {
    email: user.email,
    name: user.name as string | undefined,
    is_12h: user.is_12h
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
