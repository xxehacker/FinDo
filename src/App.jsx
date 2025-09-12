import React, { useState, useEffect } from "react";
import ThemeContext from "./contexts/ThemeContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  DashboardPage,
  TransactionsPage,
  TasksPage,
  NotFoundPage,
} from "./pages";
import PrivateRoute from "./routes/PrivateRoute";
import AuthContextProvider from "./contexts/AuthContext";
import CategoryCreatePage from "./pages/masters/category/CategoryCreatePage";
import BankManagement from "./pages/masters/bank/BankManagement";
import CategoryManagement from "./pages/masters/category/CategoryManagement";
import BankCreatePage from "./pages/masters/bank/BankCreatePage";
import BankEditPage from "./pages/masters/bank/BankEditPage";
import BankViewPage from "./pages/masters/bank/BankViewPage";
import CategoryEditPage from "./pages/masters/category/CategoryEditPage";
import CategoryViewPage from "./pages/masters/category/CategoryViewPage";

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const themeContextValue = { isDark, toggleTheme };

  return (
    <AuthContextProvider>
      <ThemeContext.Provider value={themeContextValue}>
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

              {/* User routes */}
              <Route element={<PrivateRoute allowedRoles={["user"]} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                {/* //! Category management */}
                <Route
                  path="/master/category"
                  element={<CategoryManagement />}
                />
                <Route
                  path="/master/category/create"
                  element={<CategoryCreatePage />}
                />
                <Route
                  path="/master/category/edit/:id"
                  element={<CategoryEditPage />}
                />
                <Route
                  path="/master/category/view/:id"
                  element={<CategoryViewPage />}
                />
              </Route>
              {/* //! Bank Management */}
              <Route path="/master/bank" element={<BankManagement />} />
              <Route path="/master/bank/create" element={<BankCreatePage />} />
              <Route path="/master/bank/edit/:id" element={<BankEditPage />} />
              <Route path="/master/bank/view/:id" element={<BankViewPage />} />

              {/* Admin routes */}
              {/* <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              </Route> */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeContext.Provider>
    </AuthContextProvider>
  );
}

export default App;
