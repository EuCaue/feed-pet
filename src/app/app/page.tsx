import Center from "@/components/center";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HistoryIcon } from "lucide-react";
import DialogAdd from "./add-feed-item";
import { getFeeds } from "./actions";
import FeedItem from "./feed-item";

export default async function Page() {
  const feeds = await getFeeds();
  return (
    <Center className="relative h-screen flex-col w-screen">
      <Card className="w-[92dvw] md:w-[450px] overflow-scroll max-h-1/2 ">
        <CardContent className="flex flex-col items-center justify-between gap-7">
          {feeds.map((item) => {
            return (
              <FeedItem
                time={item.time}
                description={item.description}
                key={item.id}
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
