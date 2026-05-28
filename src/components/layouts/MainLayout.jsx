import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";
import Sidebar from "@/components/common/Sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogOut } from "lucide-react";
import { fadeInUp } from "@/lib/motion";

const MainLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { logout, user } = useContext(AuthContext);

  const displayName = user?.username || user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <motion.nav
          {...fadeInUp}
          className="sticky top-0 z-30 bg-card border-b-4 border-[var(--neo-black)]"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 lg:h-[4.5rem]">
              <div className="hidden lg:block">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  FinDo Workspace
                </p>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  title={isDark ? "Light mode" : "Dark mode"}
                  aria-label="Toggle theme"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] border-4 border-[var(--neo-black)] bg-secondary shadow-[3px_3px_0_0_var(--neo-black)]">
                  <div className="h-9 w-9 rounded-[10px] border-3 border-[var(--neo-black)] bg-primary flex items-center justify-center font-bold text-sm text-primary-foreground">
                    {initial}
                  </div>
                  <div className="hidden sm:block pr-1">
                    <div className="text-sm font-bold text-foreground leading-tight">
                      {displayName}
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground capitalize">
                      {user?.role || "Member"}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="hidden sm:inline-flex text-destructive hover:bg-destructive/15"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
