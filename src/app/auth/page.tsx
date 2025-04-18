import Center from "@/components/center";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AuthForm from "./auth-form";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { redirect } from "next/navigation";

export default async function Auth() {
  const user = await getCurrentUser();
  if (user) redirect("/app");

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Feed Pet</CardTitle>
          <CardDescription>
            Remember to always pet your pet too!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm />
        </CardContent>
      </Card>
    </Center>
  );
}
