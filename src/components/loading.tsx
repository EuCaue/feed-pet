import { cn } from "@/lib/utils"; // se estiver usando algo tipo shadcn/ui
import { Loader2Icon } from "lucide-react";

type LoadingProps = {
  position?: "left" | "right";
  children?: React.ReactNode;
  spinner?: React.ReactNode;
  className?: string;
};

export function Loading({
  position = "right",
  children,
  spinner,
  className,
}: LoadingProps) {
  const loader = spinner || <Loader2Icon className="animate-spin"/>;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {position === "left" && loader}
      {children && <span>{children}</span>}
      {position === "right" && loader}
    </div>
  );
}
