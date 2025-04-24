"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export function AuthLayout({ title, description, children, className, ...props }: AuthLayoutProps) {
  return (
    <div className={cn("flex items-center justify-center min-h-[90vh] bg-white pb-12", className)} {...props}>
      <div className="flex w-full max-w-6xl bg-white overflow-hidden">
        {/* Left: Content/Form */}
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
          <div className="w-full max-w-md">
            <Image src="/logo.png" alt="Logo" width={160} height={160} className="mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
            {description && <p className="text-sm text-gray-600 text-center mb-4">{description}</p>}
            {/* Form or content goes here */}
            <div className="bg-white shadow rounded-lg p-6">
              {children}
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-4">
              <a href="#" className="underline">Điều khoản sử dụng</a>
              <div className="w-px h-4 bg-gray-400" />
              <a href="#" className="underline">Chính sách riêng tư</a>
            </div>
          </div>
        </div>

        {/* Right: Mascot */}
        <div className="hidden lg:flex items-center justify-center w-1/2 p-8 bg-white">
          <Image
            src="/login_mascot.png"
            alt="Mascot"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
