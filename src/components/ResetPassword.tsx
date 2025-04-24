"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    // Gọi API để khôi phục mật khẩu tại đây
    console.log("Resetting password:", password);
  };

  return (
    <AuthLayout title="Khôi phục mật khẩu">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">Nhập mật khẩu mới</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full"
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Nhập lại mật khẩu mới</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2">
          Hoàn tất khôi phục
        </Button>
      </form>
    </AuthLayout>
  );
}
