import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/lib/motion";

const accentMap = {
  default: "bg-card",
  income: "bg-accent/50",
  expense: "bg-destructive/15",
  balance: "bg-secondary/70",
  tasks: "bg-primary/20",
};

function StatCard({
  label,
  value,
  subtext,
  icon,
  accent = "default",
  className,
}) {
  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      animate="animate"
      whileHover={{ y: -4, rotate: -0.3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "neo-card p-6 sm:p-7",
        accentMap[accent],
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mt-2 truncate">
            {value}
          </p>
          {subtext && (
            <p className="text-sm font-semibold text-muted-foreground mt-2">
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border-4 border-[var(--neo-black)] bg-card text-2xl shadow-[3px_3px_0_0_var(--neo-black)]"
            aria-hidden
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { StatCard };
