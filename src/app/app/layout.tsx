import { ReactNode } from "react";
import Center from "@/components/center";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistoryIcon, ListOrderedIcon } from "lucide-react";
import Link from "next/link";

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Center className="relative h-screen flex-col w-screen">
      <Card className="w-[92dvw] md:w-[450px] overflow-y-auto  max-h-1/2">
        {children}
      </Card>
      <CardFooter>
        <div className="absolute bottom-32 right-1/2 left-1/2 flex items-center justify-center gap-2">
          <Button size="lg" variant="secondary" asChild title="Feed">
            <Link href="/app">
              <ListOrderedIcon className="mr-1" />
              Feed
            </Link>
          </Button>

          <Button size="lg" variant="secondary" asChild title="History">
            <Link href="/app/history">
              <HistoryIcon className="mr-1" />
              History
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Center>
  );
}
