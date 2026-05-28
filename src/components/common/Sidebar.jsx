import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  CheckSquare,
  Database,
  FolderOpen,
  Building2,
  Package,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    link: "/dashboard",
    subItems: [
      { id: "overview", label: "Overview", link: "/dashboard" },
      { id: "analytics", label: "Analytics", link: "/dashboard/analytics" },
    ],
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: CreditCard,
    link: "/transactions",
    subItems: [
      { id: "all", label: "All Transactions", link: "/transactions" },
      { id: "income", label: "Income", link: "/transactions/income" },
      { id: "expenses", label: "Expenses", link: "/transactions/expenses" },
    ],
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: CheckSquare,
    link: "/tasks",
    subItems: [
      { id: "active", label: "Active Tasks", link: "/tasks" },
      { id: "completed", label: "Completed", link: "/tasks/completed" },
      { id: "archived", label: "Archived", link: "/tasks/archived" },
    ],
  },
  {
    id: "master",
    label: "Master Data",
    icon: Database,
    link: "/master",
    subItems: [
      {
        id: "category",
        label: "Categories",
        link: "/master/category",
        icon: FolderOpen,
      },
      {
        id: "bank",
        label: "Bank Accounts",
        link: "/master/bank",
        icon: Building2,
      },
      {
        id: "product",
        label: "Products",
        link: "/master/product",
        icon: Package,
      },
    ],
  },
];

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const isActiveRoute = (link) => {
    if (link === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (link === "/transactions") {
      return location.pathname === "/transactions";
    }
    if (link === "/tasks") {
      return location.pathname === "/tasks";
    }
    return (
      location.pathname === link || location.pathname.startsWith(link + "/")
    );
  };

  const isParentActive = (item) =>
    item.subItems.some((subItem) => isActiveRoute(subItem.link));

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
        aria-label="Toggle menu"
        animated={false}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileSidebar}
            className="fixed inset-0 bg-[var(--neo-black)]/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-40 flex flex-col bg-sidebar border-r-4 border-[var(--neo-black)] neo-shadow-lg ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform lg:transition-none`}
        style={{ width: isOpen ? "280px" : "88px" }}
      >
        <div
          className={`flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } px-4 py-5 border-b-4 border-[var(--neo-black)]`}
        >
          {isOpen ? (
            <>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-[14px] border-4 border-[var(--neo-black)] bg-primary flex items-center justify-center shadow-[3px_3px_0_0_var(--neo-black)]">
                  <span className="text-primary-foreground font-bold text-lg">
                    F
                  </span>
                </div>
                <div className="leading-tight">
                  <h1 className="font-bold text-lg text-sidebar-foreground">
                    FinDo
                  </h1>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Finance Manager
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-[10px] border-3 border-[var(--neo-black)] bg-secondary shadow-[2px_2px_0_0_var(--neo-black)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform"
                aria-label="Collapse sidebar"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-[10px] border-3 border-[var(--neo-black)] bg-secondary shadow-[2px_2px_0_0_var(--neo-black)]"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={18} className="rotate-180" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isParentActive(item);
            const isDropdownOpen = openDropdown === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (isOpen) {
                      toggleDropdown(item.id);
                    } else {
                      setIsOpen(true);
                      setTimeout(() => toggleDropdown(item.id), 100);
                    }
                  }}
                  className={`w-full flex items-center ${
                    isOpen ? "justify-between" : "justify-center"
                  } px-3 py-3 rounded-[14px] text-sm font-bold border-4 transition-all duration-150 ${
                    isActive
                      ? "border-[var(--neo-black)] bg-primary text-primary-foreground shadow-[4px_4px_0_0_var(--neo-black)]"
                      : "border-transparent hover:border-[var(--neo-black)] hover:bg-muted hover:shadow-[3px_3px_0_0_var(--neo-black)] text-sidebar-foreground"
                  }`}
                  title={!isOpen ? item.label : ""}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="shrink-0" />
                    {isOpen && <span>{item.label}</span>}
                  </div>
                  {isOpen && (
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 ml-3 space-y-1 border-l-4 border-[var(--neo-black)] pl-3"
                    >
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActiveRoute(subItem.link);

                        return (
                          <Link
                            key={subItem.id}
                            to={subItem.link}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-sm font-semibold transition-all ${
                              isSubActive
                                ? "bg-secondary border-3 border-[var(--neo-black)] shadow-[2px_2px_0_0_var(--neo-black)] text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            {SubIcon ? (
                              <SubIcon size={16} className="shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-current shrink-0" />
                            )}
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t-4 border-[var(--neo-black)]">
          <button
            onClick={() => {
              logout();
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center ${
              isOpen ? "gap-3" : "justify-center"
            } px-3 py-3 rounded-[14px] text-sm font-bold border-4 border-transparent text-muted-foreground hover:border-destructive hover:bg-destructive/15 hover:text-destructive hover:shadow-[3px_3px_0_0_var(--neo-black)] transition-all`}
            title={!isOpen ? "Logout" : ""}
          >
            <LogOut size={20} className="shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
