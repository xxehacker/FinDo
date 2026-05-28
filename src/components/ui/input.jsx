import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] bg-input-background px-4 py-2 text-base font-medium text-foreground shadow-[4px_4px_0_0_var(--neo-black)] transition-[box-shadow,transform] duration-150",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:translate-x-[-1px] focus-visible:translate-y-[-1px] focus-visible:shadow-[6px_6px_0_0_var(--neo-black)]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
