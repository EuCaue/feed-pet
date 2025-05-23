"use server";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FeedItem = {
  datetime: string;
  description: string;
  id: string;
  localTime: string;
};

type AddFeedItem = {
  datetime: Date;
  description: string;
};

type EditFeedItem = AddFeedItem & { id: string };

export async function deleteFeed(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = await createClient();
  const id = formData.get("id");
  const { error } = await supabase
    .from("feed_history")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  revalidatePath("/app");
}

export async function editFeed({
  description,
  datetime,
  id,
}: EditFeedItem): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = await createClient();
  const payload = {
    description,
    datetime,
    user_id: user.id,
  };
  const { error } = await supabase
    .from("feed_history")
    .update([payload])
    .eq("user_id", user.id)
    .eq("id", id)
    .select();
  if (error) throw new Error(error.message);
  revalidatePath("/app");
}

export async function addFeed({
  description,
  datetime,
}: AddFeedItem): Promise<void> {
  console.log(description, datetime);
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");
  const supabase = await createClient();
  const payload = {
    description,
    datetime,
    user_id: user.id,
  };
  const { error } = await supabase.from("feed_history").insert([payload]);
  if (error) throw new Error(error.message);
  revalidatePath("/app");
}

export async function getFeeds(): Promise<Array<FeedItem>> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const supabase = await createClient();
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
      localTime,
    };
  });
  return feeds;
}
