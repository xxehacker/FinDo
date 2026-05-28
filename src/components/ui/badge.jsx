import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-3 border-[var(--neo-black)] px-3 py-1 text-xs font-bold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        secondary: "bg-secondary text-secondary-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        accent: "bg-accent text-accent-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        outline: "bg-card text-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        success: "bg-success text-success-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        destructive: "bg-destructive text-destructive-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
        muted: "bg-muted text-muted-foreground shadow-[2px_2px_0_0_var(--neo-black)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
