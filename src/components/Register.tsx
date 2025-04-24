"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/data/useAuth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useRegisterForm = () => {
  const { register } = useAuth();
  const router = useRouter();

  const authenticate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const username = form.username.value;
      const password = form.password.value;
      await register({ username, password });
      router.push("/login");
    },
    [register, router]
  );

  return { authenticate };
};

export function RegisterForm() {
  const { authenticate } = useRegisterForm();

  return (
    <AuthLayout title="Tạo Tài Khoản Mới">
      <h2 className="text-xl font-semibold mb-1">Đăng ký</h2>
      <p className="text-sm text-gray-600 mb-4">
        Vui lòng nhập email và mật khẩu để tạo tài khoản
      </p>
      <form onSubmit={authenticate} className="space-y-4">
        <div>
          <Label htmlFor="username">Email</Label>
          <Input
            id="username"
            type="email"
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
          Đăng ký
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        <a href="/login" className="underline text-blue-600">
          Đã có tài khoản? Đăng nhập
        </a>
      </div>
    </AuthLayout>
  );
}
