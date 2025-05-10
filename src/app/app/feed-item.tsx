import Center from "@/components/center";
type FeedItemProps = {
  time: string;
  description: string;
};

export default function FeedItem({ time, description }: FeedItemProps) {
  return (
    <Center className="justify-between border-3 border-accent-foreground rounded-[12px] w-full bg-secondary">
      <div className="ml-4 uppercase mr-4">{time}</div>

      <div className="flex gap-2 flex-col items-start justify-center flex-1">
        <h1 className="font-bold text-lg">Feeded</h1>
        <p className="max-w-[19ch] truncate text-sm" title={description}>
          {description}
        </p>
      </div>
      <div className="bg-chart-4 rounded-br-[11px] rounded-tr-[11px] min-h-[120px] min-w-[5ch] md:min-w-[120px]"></div>
    </Center>
  );
}

