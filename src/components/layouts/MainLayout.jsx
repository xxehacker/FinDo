import React, { useContext } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthContext } from "@/contexts/AuthContext";
import Sidebar from "@/components/common/Sidebar";

const MainLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-card border-b border-border shadow-sm">
          <div className="min-w-0 flex-1 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    console.log("Theme toggle clicked");
                    toggleTheme();
                  }}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  title={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDark ? "☀️" : "🌙"}
                </button>
                <div className="flex items-center space-x-3 px-3 py-2 bg-secondary rounded-lg">
                  <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {"U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-card-foreground">
                      {"Mridu"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {"Admin"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;