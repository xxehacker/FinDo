import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { id: "dashboard", name: "Dashboard", icon: "📊" },
  { id: "transactions", name: "Transactions", icon: "💸" },
  { id: "tasks", name: "Tasks", icon: "📋" },
  { id: "master", name: "Master Data", icon: "📁" },
];

const MainLayout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2] || "dashboard";

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  F
                </span>
              </div>
              <span className="ml-3 font-bold text-card-foreground text-lg">
                FinDo
              </span>
            </div>
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  to={`/${item.id}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-card-foreground hover:bg-accent"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  console.log("Theme toggle clicked");
                  toggleTheme();
                }}
                className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
                  console.log("Logout clicked");
                  // logout();
                }}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="md:hidden bg-card border-b border-border">
        <div className="max-w-[90rem] mx-auto flex space-x-1 px-4 py-3">
          {navigation.map((item) => (
            <Link
              key={item.id}
              to={`/${item.id}`}
              className={`flex-1 px-2 py-3 rounded-lg text-xs font-medium transition-colors ${
                currentPath === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-accent"
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">{item.icon}</div>
                <div>{item.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <main className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;