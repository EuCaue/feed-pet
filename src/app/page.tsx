import { Button } from "@/components/ui/button";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center px-4 text-center gap-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
        FeedPet
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-md leading-relaxed">
        Never forget when to feed your pet again. Stay organized and keep your buddy happy!
      </p>
      <Button asChild size="lg" className="gap-2 px-6 py-4 text-base md:text-lg">
        <Link href={user ? "/app" : "/auth"}>
          Get Started <ArrowRightIcon size={20} />
        </Link>
      </Button>
    </main>
  );
}
