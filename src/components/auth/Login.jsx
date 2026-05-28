import { AuthContext } from "@/contexts/AuthContext";
import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(loginForm.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (loginForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await AXIOS_INSTANCE.post(
        API_ENDPOINTS.AUTH.LOGIN,
        loginForm
      );

      if (response.status === 200) {
        if (!response.data.data?.user || !response.data.data?.token) {
          setError("Invalid response from server");
          setIsLoading(false);
          return;
        }
        setUser(response.data.data.user);
        localStorage.setItem("token", response.data?.data?.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data?.data?.user)
        );
        setIsLoading(false);
        setError("");
      } else {
        setError(response.data?.message || "Failed to login");
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to login. Please try again."
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role) {
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "user":
          navigate("/dashboard");
          break;
        default:
          navigate("/login");
      }
    }
  }, [user, navigate]);

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          No account?{" "}
          <Link
            to="/signup"
            className="text-foreground font-bold underline underline-offset-4 hover:text-primary"
          >
            Create one
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
