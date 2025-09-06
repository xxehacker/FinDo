import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

const navigation = [
  {
    id: "dashboard",
    label: "Dashboard Management",
    icon: "📊",
    link: "/dashboard",
  },
  {
    id: "transactions",
    label: "Transactions Management",
    icon: "💸",
    link: "/transactions",
    subItems: [
      { id: "pending", label: "Pending", link: "/transactions/pending" },
    ],
  },
  {
    id: "tasks",
    label: "Tasks Management",
    icon: "📋",
    link: "/tasks",
    subItems: [
      { id: "tasks", label: "Tasks List", link: "/tasks" },
      { id: "completed", label: "Completed", link: "/tasks/completed" },
    ],
  },
  {
    id: "Master Management",
    label: "Master Data",
    icon: "📁",
    link: "/master",
    subItems: [
      { id: "category", label: "Category", link: "/master/category" },
      { id: "bank", label: "Bank", link: "/master/bank" },
      { id: "product", label: "Product", link: "/master/product" },
    ],
  },
];

const Sidebar = () => {
  const { isDark } = useTheme();
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname.split("/")[2] || "dashboard";
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const sidebarVariants = {
    open: {
      width: 220,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3,
      },
    },
    closed: {
      width: 56,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3,
      },
    },
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { delay: 0.15, duration: 0.25, ease: "easeOut" },
    },
    closed: {
      opacity: 0,
      x: -10,
      scale: 0.8,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  const itemVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.02,
      x: 4,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
  };

  const dropdownVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className={`relative min-h-screen w-full flex flex-col overflow-hidden backdrop-blur-xl ${
        isDark
          ? "bg-gray-900/95 border-gray-700/50 shadow-2xl shadow-black/20"
          : "bg-white/95 border-gray-200/50 shadow-2xl shadow-gray-900/10"
      } border-r`}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      onHoverStart={() => setIsOpen(true)}
      onHoverEnd={() => {}}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-blue-600/5 via-purple-600/5 to-transparent"
            : "bg-gradient-to-b from-blue-500/3 via-indigo-500/3 to-transparent"
        }`}
      />

      {/* Header Section */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/60">
        <div className="flex items-center">
          <motion.div
            className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ${
              isDark
                ? "bg-gradient-to-br from-blue-600 to-purple-600 shadow-blue-600/25"
                : "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold text-lg">F</span>
          </motion.div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="ml-3"
                variants={textVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FinDo
                </span>
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  } mt-0.5`}
                >
                  Financial Manager
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={toggleSidebar}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isDark
              ? "hover:bg-gray-800/80 text-gray-300 hover:text-white"
              : "hover:bg-gray-100/80 text-gray-600 hover:text-gray-900"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <path d="m15 18-6-6 6-6" />
          </motion.svg>
        </motion.button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-3 space-y-1 relative z-10">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2 }}
            >
              Navigation
            </motion.div>
          )}
        </AnimatePresence>

        {navigation.map((item) => (
          <div key={item.id}>
            <motion.div variants={itemVariants} initial="rest" animate="rest">
              <div
                className={`relative flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  currentPath === item.id
                    ? isDark
                      ? "bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-lg shadow-blue-600/25"
                      : "bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white shadow-lg shadow-blue-500/25"
                    : isDark
                    ? "text-gray-300 hover:text-white hover:bg-gray-800/60"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/60"
                }`}
                onClick={() => isOpen && toggleDropdown(item.id)} // Toggle dropdown on click
              >
                {/* Active indicator */}
                {currentPath === item.id && (
                  <motion.div
                    className={`absolute left-0 top-1/2 w-1 h-8 rounded-r-full ${
                      isDark ? "bg-white/80" : "bg-white/90"
                    }`}
                    layoutId="activeIndicator"
                    initial={{ x: -4, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <span className="text-lg mr-2 flex-shrink-0">{item.icon}</span>

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      variants={textVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isOpen && (
                  <motion.svg
                    className={`ml-auto h-4 w-4 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                    animate={{ rotate: openDropdown === item.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                )}
              </div>
            </motion.div>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && openDropdown === item.id && (
                <motion.div
                  variants={dropdownVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="ml-6 mt-1 space-y-1"
                >
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.link}
                      className={`flex items-center p-2 rounded-lg text-sm transition-all duration-200 ${
                        location.pathname === subItem.link
                          ? isDark
                            ? "text-blue-300 bg-blue-600/20"
                            : "text-blue-600 bg-blue-100/50"
                          : isDark
                          ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/40"
                      }`}
                    >
                      <span className="w-4 h-4 mr-2 flex items-center justify-center">
                        •
                      </span>
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="relative z-10 p-3 border-t border-border/60">
        <motion.button
          onClick={() => logout()}
          className={`w-full flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
            isDark
              ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              : "text-gray-500 hover:text-red-500 hover:bg-red-50"
          }`}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="text-lg mr-2 flex-shrink-0"
            whileHover={{ rotate: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            🚪
          </motion.span>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={textVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                Logout
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
