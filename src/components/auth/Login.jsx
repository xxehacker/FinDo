import React, { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(
      "handleLogin triggered, form data:",
      loginForm,
      "isLoading:",
      isLoading
    );
    if (
      loginForm.email === "admin@example.com" &&
      loginForm.password === "password"
    ) {
      localStorage.setItem("token", "token");
      window.location.href = "/dashboard";
      return;
    } else {
      setError("Invalid email or password");
    }
    setIsLoading(true);
    setError("");
    try {
      console.log("loginForm:", loginForm);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
      console.log("isLoading reset to:", isLoading);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center text-destructive">
            <svg
              className="h-5 w-5 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          onClick={() => console.log("Sign In button clicked")}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-card-foreground mb-3">
          Demo Credentials:
        </h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Admin:</span>
            <span>admin@example.com / password</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
