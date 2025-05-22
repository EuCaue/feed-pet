"use client";
import { ActiveModifiers } from "react-day-picker";
import type { FeedItem as IFeedItem } from "../actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FeedItem from "../feed-item";
import Center from "@/components/center";

type DayContentProps = {
  date: Date;
  activeModifiers: ActiveModifiers;
  dayFeeds: Array<IFeedItem>;
};

type CalenderItemProps = {
  date: Date;
  dayFeeds: Array<IFeedItem>;
};

function DayItem({ date, dayFeeds }: CalenderItemProps) {
  const day = date.getDate();
  const month = date.getMonth().toString().padStart(2, "0");
  const year = date.getFullYear();
  return (
    <Dialog>
      <DialogTrigger>{date.getDate()}</DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-1/2">
        <DialogHeader>
          <DialogTitle>
            <Center as="p">
              History for {day}/{month}/{year}
            </Center>
          </DialogTitle>
        </DialogHeader>

        {dayFeeds.map((item) => (
          <FeedItem
            key={item.id}
            localTime={item.localTime}
            datetime={item.datetime}
            description={item.description}
            id={item.id}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default function DayContent({
  date,
  activeModifiers,
  dayFeeds,
}: DayContentProps) {
  const isWithDot = activeModifiers.withDot;
  return (
    <div className="flex flex-col items-center justify-center">
      <div>
        {isWithDot ? (
          <DayItem dayFeeds={dayFeeds} date={date} />
        ) : (
          date.getDate()
        )}
      </div>
      {isWithDot && (
        <div className="w-1.5 h-1.5 rounded-full bg-accent-foreground mt-0.5" />
      )}
    </div>
  );
}
