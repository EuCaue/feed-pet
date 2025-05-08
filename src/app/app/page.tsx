"use client";

import Center from "@/components/center";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HistoryIcon, PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import TimePicker from "@/components/time-picker";
import DatePicker from "@/components/date-picker";

type FeedItemProps = {
  time: string;
  description: string;
};

const feedItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  date: z.date({ message: "Date is required." }),
  time: z.date({ message: "Time is required." }),
});

function DialogAdd() {
  const form = useForm({
    resolver: zodResolver(feedItemSchema),
    defaultValues: { description: "", date: new Date(), time: new Date() },
  });

  async function onSubmit({
    description,
    date,
    time,
  }: z.infer<typeof feedItemSchema>) {
    console.info(
      "SUBMIT ============>",
      description,
      new Date(date).getTime(),
      new Date(time).getTime(),
    );
    form.reset();
  }
  const isLoading = form.formState.isSubmitting;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusIcon />
        </Button>
      </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Register the time you feed your pet!</DialogTitle>
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
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
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
          </Form>

        <Center>
          <DialogFooter className="flex-row">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isLoading}>
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

function FeedItem({ time, description }: FeedItemProps) {
  return (
    <Center className="justify-between border-3 border-accent-foreground rounded-[12px] w-full bg-secondary">
      <div className="ml-4 lowercase mr-4">{time}</div>

      <div className="flex gap-2 flex-col items-start justify-center flex-1">
        <h1 className="font-bold text-lg">Feeded</h1>
        <p className="max-w-[19ch] truncate text-sm" title={description}>
          {description}
        </p>
      </div>
      <div className="bg-chart-4 rounded-br-[11px] rounded-tr-[11px] min-h-[120px] min-w-[5ch] md:min-w-[120px]"></div>
    </Center>
  );
}

export default function Page() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  //  TODO: this it will come from the server
  const items: Array<FeedItemProps> = [
    { time: "10AM", description: "I've feeded X, Y, Z" },
    { time: "10PM", description: "I've feeded X, Y AND NOT  Z" },
    { time: "6PM", description: "I've feedded everyone and bla bla bla bla" },
    { time: "1PM", description: "I've feedded everyone and bla bla bla bla" },
    { time: "5PM", description: "I've feedded everyone and bla bla bla bla" },
    { time: "4PM", description: "I've feedded everyone and bla bla bla bla" },
    { time: "3PM", description: "I've feedded everyone and bla bla bla bla" },
    { time: "2PM", description: "I've feedded everyone and bla bla bla bla" },
  ];
  return (
    <Center className="relative h-screen flex-col w-screen">
      <Card className="w-[92dvw] md:w-[450px] overflow-scroll max-h-1/2 ">
        <CardContent className="flex flex-col items-center justify-between gap-7">
          {items.map((item) => {
            return (
              <FeedItem
                time={item.time}
                description={item.description}
                key={item.time}
              />
            );
          })}
        </CardContent>
      </Card>
      <CardFooter>
        <div className="absolute bottom-32 right-1/2 left-1/2 flex items-center justify-center gap-2 ">
          <DialogAdd />
          <Button size={"lg"} variant={"secondary"}>
            <HistoryIcon />
          </Button>
        </div>
      </CardFooter>
    </Center>
  );
}
