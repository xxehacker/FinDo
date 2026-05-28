import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "flex gap-3 rounded-[var(--neo-radius-sm)] border-4 border-[var(--neo-black)] p-4 font-medium shadow-[4px_4px_0_0_var(--neo-black)]",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground",
        destructive: "bg-destructive/15 text-destructive",
        success: "bg-accent/40 text-foreground",
        warning: "bg-secondary/60 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const icons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
};

function Alert({ className, variant = "default", children, ...props }) {
  const Icon = icons[variant] || Info;
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <Icon className="size-5 shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export { Alert, alertVariants };
