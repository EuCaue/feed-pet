"use client";
import { Calendar } from "@/components/ui/calendar";
import { FeedItem } from "../actions";
import DayContent from "./date-content";
import { useMemo } from "react";

type FeedCalendarProps = {
  feeds: Array<FeedItem>;
};

export default function FeedCalendar({ feeds }: FeedCalendarProps) {
  const dates = useMemo(() => {
    return feeds.map((item) => new Date(item.datetime));
  }, [feeds]);

  return (
    <Calendar
      modifiers={{
        withDot: (date) => {
          return dates.some((d) => d.toDateString() === date.toDateString());
        },
      }}
      components={{
        DayContent: (props) => {
          const dayFeeds = feeds.filter(
            (item) =>
              new Date(item.datetime).toDateString() ===
              props.date.toDateString(),
          );
          return (
            <DayContent
              date={props.date}
              activeModifiers={props.activeModifiers}
              dayFeeds={dayFeeds}
            />
          );
        },
      }}
    />
  );
}
