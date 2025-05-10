"use server";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { format, parse } from "date-fns";
import { cookies } from "next/headers";

type FeedItem = {
  date: string;
  description: string;
  id: string;
  time: string;
};

type AddFeedItem = {
  date: Date;
  time: Date;
  description: string;
};

export async function addFeed({ description, date, time }: AddFeedItem) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = createClient(await cookies());
  const payload = {
    description,
    date: date.toISOString().slice(0, 10),
    time: time.toTimeString().slice(0, 8),
    user_id: user.id,
  };
  const { data, error } = await supabase.from("feed_history").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function getFeeds(): Promise<Array<FeedItem>> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = createClient(await cookies());
  //  TODO: get only the day feed
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("feed_history")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .overrideTypes<Array<FeedItem>>();

  if (error) throw new Error(error.message);

  const feeds = data.map((item) => ({
    ...item,
    time: user.is_12h
      ? format(
          parse(item.time as unknown as string, "HH:mm:ss", new Date()),
          "h:mm a",
        )
      : format(
          parse(item.time as unknown as string, "HH:mm:ss", new Date()),
          "HH:mm",
        ),
  }));

  return feeds;
}
