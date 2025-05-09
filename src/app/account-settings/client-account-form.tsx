"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { saveAccountSettings } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/loading";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Center from "@/components/center";

const accountSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z
    .string()
    .min(4, { message: "Name must be at least 4 characters long." })
    .max(255, { message: "Name can be a maximum of 255 characters long." })
    .optional(),
  is_12h: z.boolean(),
});

type User = {
  email: string;
  name?: string;
  is_12h: boolean;
};

type ClientAccountFormProps = {
  user: User;
};

type BackendResponse = {
  message: string;
  hasError: boolean;
};

const DEFAULT_BACKEND_RESPONSE: BackendResponse = {
  hasError: false,
  message: "",
};
export default function ClientAccountForm({ user }: ClientAccountFormProps) {
  const hasName = user?.name?.length ? user.name.length > 0 : 0;
  const router = useRouter();
  const [backendResponse, setBackendResponse] = useState<BackendResponse>(
    DEFAULT_BACKEND_RESPONSE,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: user,
    mode: "onChange",
  });

  async function onSubmit({
    email,
    name,
    is_12h,
  }: z.infer<typeof accountSchema>) {
    if (!name) return;
    setIsLoading(true);
    setBackendResponse(DEFAULT_BACKEND_RESPONSE);
    const result = await saveAccountSettings({ email, name, is_12h });
    setBackendResponse({
      hasError: !result.success,
      message: result.message,
    });
    setIsLoading(false);
    if (!hasName && result.success) {
      router.push("/app");
      return;
    }
    toast("Update Status", {
      description: result.message,
      closeButton: true,
    });
    setTimeout(() => {
      form.reset(result.success ? form.getValues() : undefined);
      setBackendResponse(DEFAULT_BACKEND_RESPONSE);
    }, 5000);
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
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input placeholder="someemailhere@example.com" {...field} />
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
                {!hasName &&
                  "I dont know your name yet, how should I call you?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_12h"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between p-4">
              <FormLabel>Time Format:</FormLabel>
              <FormControl>
                <Center className="gap-4">
                  <span className="">12h</span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      form.setValue("is_12h", checked, {
                        shouldDirty: true,
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                    }}
                  />
                  <span>24h</span>
                </Center>
              </FormControl>
              <FormDescription>
                {!hasName &&
                  "I dont know your name yet, how should I call you?"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="hover-btn"
          disabled={
            !form.formState.isDirty || !form.formState.isValid || isLoading
          }
        >
          {isLoading ? (
            <Loading>Updating...</Loading>
          ) : (
            <>
              {hasName ? "Update" : "Update and Go to the App"} <CheckIcon />
            </>
          )}
        </Button>
        {backendResponse.message.length > 0 &&
          (backendResponse.hasError ? (
            <FormMessage>{backendResponse.message}</FormMessage>
          ) : (
            <FormDescription>{backendResponse.message}</FormDescription>
          ))}
      </form>
    </Form>
  );
}
