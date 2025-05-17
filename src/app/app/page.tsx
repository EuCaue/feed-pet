import Center from "@/components/center";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FrownIcon, HistoryIcon } from "lucide-react";
import AddFeedItem from "./add-feed-item";
import { getFeeds } from "./actions";
import FeedItem from "./feed-item";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const feeds = await getFeeds();

  return (
    <Center className="relative h-screen flex-col w-screen">
      <Card className="w-[92dvw] md:w-[450px] overflow-scroll max-h-1/2 ">
        <CardContent className="flex flex-col items-center justify-between gap-7">
          {(feeds.length > 0 &&
            feeds.map((item) => {
              return (
                <FeedItem
                  time={item.time}
                  datetime={item.datetime}
                  description={item.description}
                  id={item.id}
                  key={item.id}
                />
              );
            })) || (
            <Center className="gap-2 text-lg font-medium leading-relaxed">
              You have no records for today. <FrownIcon />
            </Center>
          )}
        </CardContent>
      </Card>

      <CardFooter>
        <div className="absolute bottom-32 right-1/2 left-1/2 flex items-center justify-center gap-2 ">
          <AddFeedItem />
          <Button size={"lg"} variant={"secondary"} title="See your feed history">
            <HistoryIcon />
          </Button>
        </div>
      </CardFooter>
    </Center>
  );
}
