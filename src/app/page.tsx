import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-w-[100vw] min-h-[100vh] flex flex-col items-center justify-center gap-5">
      <h1 className="font-bold text-5xl">Feed pet</h1>
      <h2 className="text-2xl max-w-48 text-center self-center leading-relaxed">
        Never forget when to feed your pet again
      </h2>
      <Button asChild variant={"default"} className="hover-btn">
        <Link href="/app">
          Get started <ArrowRightIcon size={24} />
        </Link>
      </Button>
    </div>
  );
}
