import { motion } from "framer-motion";
import { Button } from "./button";

function EmptyState({
  icon = "📭",
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-14 px-6 text-center"
    >
      <span className="text-5xl mb-4" role="img" aria-hidden>
        {icon}
      </span>
      <h4 className="text-lg font-bold text-foreground mb-2">{title}</h4>
      {description && (
        <p className="text-muted-foreground text-sm font-medium max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

export { EmptyState };
