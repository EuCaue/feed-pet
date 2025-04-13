"use server"
import { LogInIcon, MenuIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default async function HeaderMenu({ username,isMobile }: HeaderMenuProps) {
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
                <ModeToggle />
                {username && (
                  <Button variant="default" size="icon" className="hover-btn">
                    <LogInIcon />
                  </Button>
                )}
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Greeting username={username} />
          <span className="flex gap-2">
            <ModeToggle />
            {username && (
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
            )}
          </span>
        </>
      )}
    </>
  );
}
