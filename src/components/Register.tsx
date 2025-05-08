"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/data/useAuth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useRegisterForm = () => {
  const { register } = useAuth({});
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

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { authenticate } = useRegisterForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={authenticate}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
