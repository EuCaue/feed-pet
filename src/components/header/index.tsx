import { cookies } from "next/headers";
import HeaderMenu from "./header-menu";
import getCurrentUser from "@/lib/supabase/queries/get-current-user";
import Link from "next/link";
import { CatIcon } from "lucide-react";

function Logo({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <Link href={isLoggedIn ? "/app" : "/"}>
      <CatIcon size={28} />
    </Link>
  );
}

export default async function Header() {
  const cookieStore = await cookies();
  const isMobile = cookieStore.get("isMobile")?.value === "true";
  const user = await getCurrentUser();

  return (
    <header className="flex justify-between items-center min-w-[85vw] px-5 py-5 bg-accent sticky top-0">
      <Logo isLoggedIn={!!user} />
      <HeaderMenu
        isLoggedIn={!!user}
        username={user?.name}
        isMobile={isMobile}
      />
    </header>
  );
}
