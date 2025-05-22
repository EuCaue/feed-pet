"use server";
import { CardContent } from "@/components/ui/card";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { redirect } from "next/navigation";
import FeedCalendar from "./feed-calendar";
import { getAllFeeds } from "./actions";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const feeds = await getAllFeeds();

  return (
    <CardContent className="flex flex-col items-center justify-center gap-4">
      <FeedCalendar feeds={feeds} />
    </CardContent>
  );
}
