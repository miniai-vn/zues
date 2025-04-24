"use client";

import { AuthLayout } from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetSuccess() {
  const router = useRouter();

  return (
    <AuthLayout title="Hoàn tất khôi phục" description="Tài khoản của bạn đã được khôi phục mật khẩu thành công">
      <div className="flex justify-center">
        <Button onClick={() => router.push("/login")} className="w-full bg-blue-600 text-white py-2">
          Đăng nhập
        </Button>
      </div>
    </AuthLayout>
  );
}
