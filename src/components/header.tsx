"use client";
import { CatIcon, LogInIcon, MenuIcon } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";
import ModeToggle from "./mode-toggle";
import { useMobile } from "@/hooks/useMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const isLoggedIn: boolean = true;
  const isMobile = useMobile();
  return (
    <div className="flex justify-between items-center min-w-[85vw] px-5 py-5 bg-accent">
      <Link href="/">
        <CatIcon size={28} />
      </Link>

      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MenuIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="flex items-center justify-between flex-col min-h-fit p-4">
              <p className="font-bold font-mono leading-loose text-sm">
                Hey $USER, how it&apos;s going today?
              </p>
              <span className="flex gap-2">
                <ModeToggle />
                {isLoggedIn && (
                  <Button variant="default" size={"icon"}>
                    <LogInIcon />
                  </Button>
                )}
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <p className="font-bold font-mono leading-loose text-sm">
            Hey $USER, how it&apos;s going today?
          </p>
          <span className="flex gap-2">
            <ModeToggle />
            {isLoggedIn && (
              <Button variant="default" size={"icon"}>
                <LogInIcon />
              </Button>
            )}
          </span>
        </>
      )}
    </div>
  );
}
