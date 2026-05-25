import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  initials: string;
}

export function Avatar({ initials, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-soft",
        className
      )}
      aria-label={`Avatar ${initials}`}
      {...props}
    >
      {initials}
    </div>
  );
}
