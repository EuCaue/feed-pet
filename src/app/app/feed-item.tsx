import Center from "@/components/center";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import AddFeedItem from "./add-feed-item";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFeed } from "./actions";

type FeedItemProps = {
  time: string;
  description: string;
  datetime: string;
  id?: string;
};

function DeleteFeedItem({ id }: { id: string }) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"} size={"icon"}>
            <TrashIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <form
            action={deleteFeed}
            noValidate
            aria-hidden
            id="delete-feed-item"
          >
            <input
              value={id}
              style={{ display: "none" }}
              name="id"
              aria-hidden
            />
          </form>
          <DialogFooter>
            <Center className="gap-4 m-auto">
              <DialogClose asChild>
                <Button
                  type="button"
                  form="delete-feed-item"
                  variant={"secondary"}
                >
                  Cancel
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  type="submit"
                  form="delete-feed-item"
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </DialogClose>
            </Center>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function FeedItem({
  datetime,
  time,
  description,
  id,
}: FeedItemProps) {
  const d = new Date(datetime);
  return (
    <Center className="justify-between border-3 border-accent-foreground rounded-[12px] w-full bg-secondary">
      <div className="ml-4 uppercase mr-4">{time}</div>

      <div className="flex gap-2 flex-col items-start justify-center flex-1">
        <h1 className="font-bold text-lg">Feeded</h1>
        <p className="max-w-[19ch] truncate text-sm" title={description}>
          {description}
        </p>
      </div>
      <Center className="bg-muted-foreground rounded-br-[11px] rounded-tr-[11px] min-h-[120px] min-w-[5ch] md:min-w-[120px] flex-col md:flex-row gap-2">
        <AddFeedItem
          date={d}
          time={d}
          description={description}
          id={id}
          isEditing
        />
        <DeleteFeedItem id={id ?? ""} />
      </Center>
    </Center>
  );
}
