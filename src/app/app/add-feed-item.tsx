"use client";
import { PlusIcon } from "lucide-react";
import { addFeed } from "./actions";
import TimePicker from "@/components/time-picker";
import DatePicker from "@/components/date-picker";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import Center from "@/components/center";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const feedItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  date: z.date({ message: "Date is required." }),
  time: z.date({ message: "Time is required." }),
});

export default function DialogAdd() {
  const form = useForm({
    resolver: zodResolver(feedItemSchema),
    defaultValues: { description: "", date: undefined, time: undefined },
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [open, setOpen] = useState(false);

  async function onSubmit({
    description,
    date,
    time,
  }: z.infer<typeof feedItemSchema>) {
    try {
      await addFeed({ description, date, time});
      form.reset();
      setOpen(false);
    } catch (err: unknown) {
      setErrorMessage(err.message);
    }
  }
  const isLoading = form.formState.isSubmitting || !form.formState.isDirty || form.formState.isLoading; 
  function handleDialogOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (isOpen) {
      const now = new Date();
      form.setValue("date", now);
      form.setValue("time", now);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            Register the time you feed your pet!
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="addForm"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 text-center"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Today, everyone has been fed without making a mess."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date:</FormLabel>
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time:</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      use24Format={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        </Form>

        <Center>
          <DialogFooter className="flex-row">
            <DialogClose asChild>
              <Button
                variant="secondary"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Close
              </Button>
            </DialogClose>
            <Button type="submit" form="addForm" disabled={isLoading}>
              Save
            </Button>
          </DialogFooter>
        </Center>
      </DialogContent>
    </Dialog>
  );
}
