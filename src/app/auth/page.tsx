"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Center from "@/components/center";

export default function Auth() {
  const router = useRouter();
  const authSchema = z.object({
    email: z.string().email({
      message: "Email not valid!",
    }),
  });

  const form = useForm<z.infer<typeof authSchema>>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof authSchema>) {
    console.log(values);
    // await for the otp code to be sent...
    router.push("/verify-otp");
  }

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Feed Pet</CardTitle>
          <CardDescription className="">
            Remeber to always pet your pet too!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-center"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="someemailhere@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="hover-btn">
                Enter <ArrowRightIcon />{" "}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Center>
  );
}
