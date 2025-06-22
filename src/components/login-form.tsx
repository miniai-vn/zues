"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/data/useAuth";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const { t } = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth({});
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn({
        username: email,
        password,
      });
      if (res) {
        router.push("/dashboard/channels");
      }
    } catch (error) {
      console.error(t("auth.login.error"), error);
      alert(t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit}
    >
      {" "}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{t("auth.login.title")}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {t("auth.login.description")}
        </p>
      </div>
      <div className="grid gap-6">
        {" "}
        <div className="grid gap-2">
          <Label htmlFor="email">{t("auth.login.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@vidu.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>{" "}
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">{t("auth.login.password")}</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>{" "}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t("auth.login.loading") : t("auth.login.submit")}
        </Button>
      </div>{" "}
      <div className="text-center text-sm">
        {t("auth.login.noAccount")}{" "}
        <a href="#" className="underline underline-offset-4">
          {t("auth.login.signUp")}
        </a>
      </div>
    </form>
  );
}
