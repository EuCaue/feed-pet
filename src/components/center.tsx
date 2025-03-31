import { cn } from "@/lib/utils";
import React from "react";

type CenterProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "children">;

export default function Center<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: CenterProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={cn("flex h-screen items-center justify-center", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
