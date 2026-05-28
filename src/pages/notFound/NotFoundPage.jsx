import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp } from "@/lib/motion";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        {...fadeInUp}
        className="neo-card max-w-lg w-full p-10 text-center"
      >
        <p className="text-8xl font-bold text-primary leading-none mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground font-medium mb-8">
          This route doesn&apos;t exist in your FinDo workspace.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
