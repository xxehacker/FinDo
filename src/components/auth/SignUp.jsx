import React, { useState } from "react";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(
      "handleSignup triggered, form data:",
      signupForm,
      "isLoading:",
      isLoading
    );
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
      console.log("signupForm:", signupForm);
    } catch (err) {
      console.error("Signup error:", err);
      setError("An error occurred during signup");
    } finally {
      setIsLoading(false);
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
      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Full Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            placeholder="Enter your full name"
            value={signupForm.name}
            onChange={(e) =>
              setSignupForm({ ...signupForm, name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            placeholder="Enter your email"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm({ ...signupForm, email: e.target.value })
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
            placeholder="Create a password"
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm({ ...signupForm, password: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
            placeholder="Confirm your password"
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
        <button
          type="submit"
          disabled={isLoading}
          onClick={() => console.log("Create Account button clicked")}
          className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </>
  );
};

export default Signup;
