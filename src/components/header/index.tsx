import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import HeaderMenu from "./header-menu";
import Link from "next/link";
import { CatIcon } from "lucide-react";

function Logo({ username }: { username: string | null }) {
  return (
    <Link href={username ? "/app" : "/"}>
      <CatIcon size={28} />
    </Link>
  );
}

export default async function Header() {
  const cookieStore = await cookies();
  const isMobile = cookieStore.get("isMobile")?.value === "true";
  const supabase = createClient(cookieStore);
  const user = await supabase.auth.getUser();
  //@ts-expect-error email exists
  const username = user.data.user?.identities[0].email;
  return (
    <header className="flex justify-between items-center min-w-[85vw] px-5 py-5 bg-accent sticky top-0">
      <Logo username={username} />
      <HeaderMenu username={username} isMobile={isMobile} />
    </header>
  );
}
