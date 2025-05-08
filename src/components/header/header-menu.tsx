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
import signOut from "./actions";

type HeaderMenuProps = {
  isLoggedIn: boolean;
  username?: string;
  isMobile: boolean;
};

function Greeting({ username }: { username?: string }) {
  return (
    <p className="font-bold font-mono leading-loose text-sm">
      Hey,
      <Button asChild type="button" variant={"link"} size={"sm"}>
        <Link href={username ? "/account-settings" : "/"}>{username}</Link>
      </Button>
      how it&apos;s going today?
    </p>
  );
}

function Items({ isLoggedIn }: Pick<HeaderMenuProps, "isLoggedIn">) {
  return (
    <>
      <ModeToggle />
      {isLoggedIn && (
        <>
          <Button asChild className="hover-btn">
            <Link href="/account-settings">
              <User2Icon />
            </Link>
          </Button>
          <form action={signOut}>
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
  isLoggedIn,
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
                <Items isLoggedIn={isLoggedIn} />
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Greeting username={username} />
          <span className="flex gap-2">
            <Items isLoggedIn={isLoggedIn} />
          </span>
        </>
      )}
    </>
  );
}
