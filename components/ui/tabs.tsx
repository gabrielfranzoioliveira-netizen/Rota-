"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  items: Array<{ value: T; label: string }>;
  className?: string;
}

export function Tabs<T extends string>({ value, onValueChange, items, className }: TabsProps<T>) {
  return (
    <div className={cn("inline-flex rounded-md border bg-white/70 p-1 dark:bg-white/5", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={cn(
            "focus-ring rounded-sm px-3 py-2 text-sm font-semibold transition-colors",
            value === item.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onValueChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
