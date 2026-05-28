import { API_ENDPOINTS } from "@/utils/apiPath";
import AXIOS_INSTANCE from "@/utils/axiosInstance";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    try {
      const { username, email, password, phone } = signupForm;
      const response = await AXIOS_INSTANCE.post(API_ENDPOINTS.AUTH.SIGNUP, {
        username,
        email,
        password,
        phone,
      });
      if (response.status === 201) {
        window.location.href = "/login";
      }
    } catch (err) {
      setError(`${err?.response?.data?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Your name"
            value={signupForm.username}
            onChange={(e) =>
              setSignupForm({ ...signupForm, username: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm({ ...signupForm, email: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 ..."
            value={signupForm.phone}
            onChange={(e) =>
              setSignupForm({ ...signupForm, phone: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 characters"
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm({ ...signupForm, password: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat password"
            value={signupForm.confirmPassword}
            onChange={(e) =>
              setSignupForm({
                ...signupForm,
                confirmPassword: e.target.value,
              })
            }
            required
          />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-foreground font-bold underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
};

export default Signup;
