"use server";
import { LogInIcon, MenuIcon, User2Icon } from "lucide-react";
import { Button } from "@components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
type HeaderMenuProps = {
  username: string | null;
  isMobile: boolean;
};

function Greeting({ username }: { username: string | null }) {
  return (
    <p className="font-bold font-mono leading-loose text-sm">
      Hey, {username} how it&apos;s going today?
    </p>
  );
}

function Items({ username }: { username: string | null }) {
  return (
    <>
      <ModeToggle />
      {username && (
        <>
          <Button asChild className="hover-btn">
            <Link href="/account-settings">
              <User2Icon />
            </Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button
              variant="default"
              size="icon"
              title="Sign out"
              type="submit"
              className="hover-btn"
            >
              <LogInIcon />
            </Button>
          </form>
        </>
      )}
    </>
  );
}

export default async function HeaderMenu({
  username,
  isMobile,
}: HeaderMenuProps) {
  return (
    <>
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex items-center justify-between flex-col min-h-fit p-4">
              <Greeting username={username} />
              <span className="flex gap-2">
                <Items username={username} />
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Greeting username={username} />
          <span className="flex gap-2">
            <Items username={username} />
          </span>
        </>
      )}
    </>
  );
}
