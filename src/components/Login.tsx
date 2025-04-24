"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/data/useAuth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { signIn, isSuccess } = useAuth();
  const router = useRouter();

  const authenticate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    await signIn({ username, password });
    if (isSuccess) {
      router.push("/dashboard");
    }
  };

  return (
    <AuthLayout title="Chào Mừng Bạn Đến Với Chúng Tôi">
      <h2 className="text-xl font-semibold mb-1">Đăng nhập</h2>
      <p className="text-sm text-gray-600 mb-4">Dùng tài khoản bạn được cung cấp</p>
      <form onSubmit={authenticate} className="space-y-4">
        <div>
          <Label htmlFor="username">Email</Label>
          <Input
            id="username"
            type="text"
            placeholder="m@example.com"
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            required
            className="mt-1 w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2">
          Đăng nhập
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <a href="/forgot-password" className="underline text-blue-600">
          Quên mật khẩu?
        </a>
      </div>
    </AuthLayout>
  );
}
