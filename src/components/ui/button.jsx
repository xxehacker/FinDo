import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { buttonMotion } from "@/lib/motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-[box-shadow,transform] duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none neo-border rounded-[var(--neo-radius-sm)] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground neo-shadow hover:neo-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground neo-shadow hover:neo-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        outline:
          "bg-card text-foreground neo-shadow hover:bg-muted hover:neo-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground neo-shadow hover:neo-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        accent:
          "bg-accent text-accent-foreground neo-shadow hover:neo-shadow-hover active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        ghost:
          "border-transparent shadow-none bg-transparent hover:bg-muted",
        link: "border-transparent shadow-none underline-offset-4 hover:underline text-primary bg-transparent",
      },
      size: {
        default: "h-11 px-5 py-2 text-sm has-[>svg]:px-4",
        sm: "h-9 px-3.5 text-xs has-[>svg]:px-2.5 rounded-[12px]",
        lg: "h-12 px-7 text-base has-[>svg]:px-5 rounded-[var(--neo-radius)]",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  animated = true,
  ...props
}) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (asChild) {
    return <Slot data-slot="button" className={classes} {...props} />;
  }

  if (!animated) {
    return <button data-slot="button" className={classes} {...props} />;
  }

  return (
    <motion.button
      data-slot="button"
      className={classes}
      {...buttonMotion}
      {...props}
    />
  );
}

export { Button, buttonVariants };
