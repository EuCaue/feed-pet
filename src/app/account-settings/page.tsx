"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import Center from "@/components/center";
import { useRouter } from "next/navigation";

export default function AccountSettings() {
  const router = useRouter();
  const isFirstRun: boolean = false;
  const accountSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters long." })
      .max(255, { message: "Name can be a maximum of 255 characters long." }),
  });

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: "someemailhere@gmail.com",
      name: "Claudio",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof accountSchema>) {
    //  TODO: update data on database
    console.log(values);
    if (isFirstRun) {
      router.push("/app");
    }
  }

  return (
    <Center as="main" className="h-screen">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Account Settings</CardTitle>
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
                    <FormLabel>Email:</FormLabel>
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
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name:</FormLabel>
                    <FormControl>
                      <Input placeholder="Anna" {...field} />
                    </FormControl>
                    <FormDescription>
                      {isFirstRun &&
                        "I dont know your name yet, how should I call you?"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="hover-btn"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                Submit <CheckIcon />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Center>
  );
}
