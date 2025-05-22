import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { cookies } from "next/headers";
import { FeedItem } from "../actions";
import { createClient } from "@/lib/supabase/server";

export async function getAllFeeds(): Promise<Array<FeedItem>> {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not found");

  const supabase = createClient(await cookies());
  const tz = user.timezone || "America/Sao_Paulo";

  const { data, error } = await supabase
    .from("feed_history")
    .select("*")
    .eq("user_id", user.id)
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
