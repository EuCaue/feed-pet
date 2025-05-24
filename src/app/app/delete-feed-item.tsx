import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
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
import Center from "@/components/center";

type DeleteFeedItemProps = {
  id: string;
};

export default function DeleteFeedItem({ id }: DeleteFeedItemProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"destructive"} size={"icon"}>
            <TrashIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-sm">
          <Center>
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
              readOnly
              aria-hidden
            />
          </form>
          </Center>
          <DialogFooter>
            <Center className="gap-4 m-auto">
              <DialogClose asChild>
                <Button
                  type="button"
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
