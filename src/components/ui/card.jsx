import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { cardMotion } from "@/lib/motion";

function Card({ className, hover = true, ...props }) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover ? cardMotion : {};

  return (
    <Comp
      data-slot="card"
      className={cn(
        "neo-card flex flex-col gap-5 p-6 sm:p-7",
        className
      )}
      {...motionProps}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 pb-1",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-xl sm:text-2xl font-bold leading-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm font-medium", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return (
    <div data-slot="card-content" className={cn("", className)} {...props} />
  );
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-4 mt-2 border-t-4 border-[var(--neo-black)]",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
