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
    <p className="text-sm text-center text-muted-foreground leading-relaxed">
      <span className="font-semibold text-foreground">Hey</span>
      {", "}
      <Button
        asChild
        variant="link"
        size="sm"
        className="p-0 h-auto font-semibold truncate text-primary"
      >
        <Link href={username ? "/account-settings" : "/"}>
          {username ?? "guest"}
        </Link>
      </Button>
      {", how's it going today?"}
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
          <DropdownMenuContent className="w-72 flex flex-col items-center p-4 gap-6">
            <div className="flex gap-2 justify-center">
              <Items isLoggedIn={isLoggedIn} />
            </div>
            <Greeting username={username} />
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
