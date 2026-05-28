import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const AuthLayout = ({ children, title = "Welcome back", subtitle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div
        className="absolute top-8 right-8 w-24 h-24 rounded-full border-4 border-[var(--neo-black)] bg-secondary neo-shadow-sm pointer-events-none hidden sm:block"
        aria-hidden
      />
      <div
        className="absolute bottom-12 left-8 w-16 h-16 rotate-12 rounded-[16px] border-4 border-[var(--neo-black)] bg-accent neo-shadow-sm pointer-events-none hidden sm:block"
        aria-hidden
      />

      <motion.div
        {...fadeInUp}
        className="w-full max-w-md relative z-10"
      >
        <div className="neo-card p-8 sm:p-10">
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ rotate: [-2, 2, 0], scale: 1.05 }}
              className="h-16 w-16 mx-auto mb-5 rounded-[18px] border-4 border-[var(--neo-black)] bg-primary flex items-center justify-center neo-shadow"
            >
              <span className="text-2xl font-bold text-primary-foreground">F</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground font-medium">
              {subtitle || "Your bold finance command center"}
            </p>
          </div>

          {children}

          <div className="mt-8 flex items-center justify-between pt-6 border-t-4 border-[var(--neo-black)]">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? "Light mode" : "Dark mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <p className="text-xs font-semibold text-muted-foreground">
              <Link to="/login" className="hover:text-primary font-bold">
                FinDo
              </Link>{" "}
              · Neobrutal finance
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
