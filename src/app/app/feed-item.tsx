"use client";
import Center from "@/components/center";
import AddFeedItem from "./add-feed-item";
import DeleteFeedItem from "./delete-feed-item";

type FeedItemProps = {
  localTime: string;
  description: string;
  datetime: string;
  id?: string;
  use12Format: boolean;
};

export default function FeedItem({
  datetime,
  localTime,
  description,
  id,
  use12Format,
}: FeedItemProps) {
  const d = new Date(datetime);
  return (
    <Center className="justify-between border-3 border-accent-foreground rounded-[12px] w-full bg-secondary">
      <div className="ml-4 uppercase mr-4">{localTime}</div>
      <div className="flex gap-2 flex-col items-start justify-center flex-1">
        <h1 className="font-bold text-lg">Feeded</h1>
        <p
          className="max-w-[19ch] max-h-12 overflow-y-scroll pr-1.5 flex-1"
          title={description}
        >
          {description}
        </p>
      </div>

      <Center className="bg-muted-foreground rounded-br-[11px] rounded-tr-[11px] min-h-[120px] min-w-[5ch] md:min-w-[120px] flex-col md:flex-row gap-2">
        <AddFeedItem
          use12Format={use12Format}
          datetime={d}
          description={description}
          id={id}
          isEditing
        />
        <DeleteFeedItem id={id ?? ""} />
      </Center>
    </Center>
  );
}
