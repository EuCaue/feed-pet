import { CardContent } from "@/components/ui/card";
import { FrownIcon } from "lucide-react";
import AddFeedItem from "./add-feed-item";
import { getFeeds } from "./actions";
import FeedItem from "./feed-item";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { redirect } from "next/navigation";
import Center from "@/components/center";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const feeds = await getFeeds();

  return (
    <>
      <CardContent className="flex flex-col items-center justify-between gap-7">
        {feeds.length > 0 ? (
          feeds.map((item) => (
            <FeedItem
              localTime={item.localTime}
              datetime={item.datetime}
              description={item.description}
              id={item.id}
              key={item.id}
            />
          ))
        ) : (
          <Center className="gap-2 text-lg font-medium leading-relaxed">
            You have no records for today. <FrownIcon />
          </Center>
        )}
      </CardContent>
      <div className="absolute bottom-[177px] left-0 right-0 w-full z-10 flex items-center justify-center">
        <AddFeedItem />
      </div>
    </>
  );
}
