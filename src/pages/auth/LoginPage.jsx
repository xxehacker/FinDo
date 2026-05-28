import { AuthLayout, Login } from "@/components";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to manage your money">
      <Login />
    </AuthLayout>
  );
}
