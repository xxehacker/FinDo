import React, { useState, useEffect } from "react";
import ThemeContext from "./contexts/ThemeContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  DashboardPage,
  TransactionsPage,
  TasksPage,
  MasterPage,
} from "./pages";
import PrivateRoute from "./routes/PrivateRoute";

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
    <ThemeContext.Provider value={themeContextValue}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/*user routes  */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/master" element={<MasterPage />} />
            </Route>
            {/* Default route */}
            {/* <Route path="/" element={<Auth />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
