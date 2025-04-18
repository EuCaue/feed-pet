"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
import { ArrowRightIcon, Loader2Icon } from "lucide-react";
import { signIn } from "./actions";

const authSchema = z.object({
  email: z.string().email({ message: "Email not valid!" }),
});

export default function AuthForm() {
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "" },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? undefined;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (message) {
      form.setError("email", { type: "manual", message });
    }
  }, [message, form]);

  async function onSubmit({ email }: z.infer<typeof authSchema>) {
    setIsLoading(true);
    try {
      const response = await signIn({ email });
      router.push(response.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
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
                <Input placeholder="someemailhere@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="hover-btn" disabled={isLoading}>
          {isLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              Enter <ArrowRightIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
