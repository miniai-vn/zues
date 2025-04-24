"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    // TODO: Add actual reset logic
    console.log("Send reset link to:", email);
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      description="Nhập địa chỉ email bạn đã tạo trước đó. AI Agent sẽ gửi link xác nhận qua email để bạn phục hồi mật khẩu."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="mt-1 w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2">
          Gửi yêu cầu
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        <a href="/login" className="text-blue-600">
          Đăng nhập
        </a>
      </div>
    </AuthLayout>
  );
}
