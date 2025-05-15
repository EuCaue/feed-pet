import Center from "@/components/center";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import OtpForm from "./otp-form"; // agora isolado
import { redirect } from "next/navigation";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";

export default async function VerifyOtpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/app");
  const email = (await searchParams).email as string | undefined;
  const errorMessage = (await searchParams).message as string | undefined;

  if (!email) {
    redirect("/");
  }

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px] h-[350px] flex flex-col justify-between">
        <CardHeader className="text-center">
          <CardTitle>Verification Code</CardTitle>
          <CardDescription>
            Verification code has been sent to{" "}
            <span className="font-bold">{email}</span>
          </CardDescription>
        </CardHeader>
        <OtpForm errorMessage={errorMessage} email={email} />
      </Card>
    </Center>
  );
}
