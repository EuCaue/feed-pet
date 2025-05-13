"use server";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { createClient } from "@/lib/supabase/server";
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
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = time.toTimeString().slice(0, 8);
  const timezoneOffset = new Date().getTimezoneOffset();
  const sign = timezoneOffset > 0 ? "-" : "+";
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60),
  ).padStart(2, "0");
  const offsetMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, "0");
  const offsetStr = `${sign}${offsetHours}:${offsetMinutes}`;

  const dateTimeWithOffset = `${dateStr}T${timeStr}${offsetStr}`;
  const datetime: Date = new Date(dateTimeWithOffset);

  const payload = {
    description,
    datetime,
    user_id: user.id,
  };
  const { data, error } = await supabase.from("feed_history").insert([payload]);
  if (error) throw new Error(error.message);
}

export async function getFeeds(): Promise<Array<FeedItem>> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const supabase = createClient(await cookies());
  const tz = user.timezone || "America/Sao_Paulo";
  const now = new Date();
  const startOfDayLocal = new Date(
    now.toLocaleString("en-US", { timeZone: tz }).split(",")[0] + " 00:00:00",
  );
  const endOfDayLocal = new Date(
    now.toLocaleString("en-US", { timeZone: tz }).split(",")[0] + " 23:59:59",
  );
  const startUtc = startOfDayLocal.toISOString();
  const endUtc = endOfDayLocal.toISOString();

  const { data, error } = await supabase
    .from("feed_history")
    .select("*")
    .eq("user_id", user.id)
    .gte("datetime", startUtc)
    .lte("datetime", endUtc)
    .order("datetime", { ascending: true })
    .overrideTypes<Array<FeedItem>>();

  if (error) throw new Error(error.message);

  const feeds = data.map((item) => {
    const localTime = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: user.is_12h,
    }).format(new Date(item.datetime));

    return {
      ...item,
      time: localTime,
    };
  });

  return feeds;
}
