import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

function PageHeader({ title, description, breadcrumbs, actions, className }) {
  return (
    <motion.header
      {...fadeInUp}
      className={cn("neo-card mb-8 p-6 sm:p-8", className)}
    >
      {breadcrumbs && (
        <nav className="text-muted-foreground text-sm font-semibold mb-3 flex flex-wrap items-center gap-2">
          {breadcrumbs}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground font-medium mt-2">{description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
    </motion.header>
  );
}

export { PageHeader };
