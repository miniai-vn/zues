"use client";

import { Selector } from "@/components/dashboard/selector";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {} from "@/app/dashboard/permissions/page";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, UserData, UserUpdateData } from "@/hooks/data/useAuth";
import useDepartments from "@/hooks/data/useDepartments";
import useRoles, { RoleVietnameseNames } from "@/hooks/data/useRoles";
import { useTranslations } from "@/hooks/useTranslations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, LockOpen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

// Hàm tạo schema động dựa trên props user và translation
const getFormSchema = (user?: User, t?: any) =>
  z.object({
    username: z
      .string()
      .nonempty(
        t?.("dashboard.users.modal.validation.usernameRequired") ||
          "Vui lòng nhập tài khoản."
      ),
    password: user
      ? z.string().optional()
      : z
          .string()
          .min(
            8,
            t?.("dashboard.users.modal.validation.passwordMin") ||
              "Mật khẩu phải có ít nhất 8 ký tự."
          )
          .nonempty(
            t?.("dashboard.users.modal.validation.passwordRequired") ||
              "Vui lòng nhập mật khẩu."
          ),
    name: z
      .string()
      .nonempty(
        t?.("dashboard.users.modal.validation.nameRequired") ||
          "Vui lòng nhập họ và tên."
      )
      .default(""),
    phone: z
      .string()
      .regex(
        /^\d+$/,
        t?.("dashboard.users.modal.validation.phoneInvalid") ||
          "Số điện thoại phải là số"
      )
      .optional(),
    roles: z
      .array(z.number())
      .min(1, {
        message:
          t?.("dashboard.users.modal.validation.rolesRequired") ||
          "Vui lòng chọn ít nhất một vai trò.",
      })
      .default([]),
    departments: z.array(z.number()).default([]),
  });

interface AddUserProps {
  user?: User;
  onChange?: (data: UserData | UserUpdateData) => void;
  children?: React.ReactNode;
}

export function AddOrUpdateUserModal({
  user,
  children,
  onChange,
}: AddUserProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  // Sử dụng schema động với translation
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(user, t)),
    defaultValues: {
      username: user?.username || "",
      // password: "",
      name: user?.name || "",
      phone: user?.phone || "",
      roles: user?.roles?.map((role) => role.id) || [],
      departments: user?.departments?.map((dept) => Number(dept.id)) || [],
    },
  });
  const { departments } = useDepartments({});
  const { roleWithPermissions } = useRoles();

  const onSubmit = async (data: z.infer<ReturnType<typeof getFormSchema>>) => {
    onChange?.({
      ...data,
      id: user?.id,
      ...(data?.password &&
      data.password.length > 0 &&
      data.password !== "defualt"
        ? {
            password: data.password,
          }
        : {}),
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      {" "}
      <DialogTrigger asChild>
        {children || <Button>{t("dashboard.users.add")}</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-auto max-h-[90vh] p-4">
        <DialogHeader>
          <DialogTitle>
            {user
              ? t("dashboard.users.modal.editTitle")
              : t("dashboard.users.modal.createTitle")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("dashboard.users.username")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-20"
                        placeholder={t("dashboard.users.username")}
                      />
                    </div>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("dashboard.users.modal.password")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-10"
                        placeholder={t("dashboard.users.modal.password")}
                        disabled={user ? !resetPassword : false}
                      />
                      {user ? (
                        <div className="group">
                          <button
                            type="button"
                            onClick={() => {
                              setResetPassword(!resetPassword);
                              field.onChange("");
                            }}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                          >
                            {resetPassword ? <LockOpen /> : <Key />}
                          </button>
                          {/* Tooltip hiển thị khi hover */}{" "}
                          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            {t("dashboard.users.modal.changePassword")}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                          {showPassword ? <Eye /> : <EyeOff />}
                        </button>
                      )}
                    </div>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {t("dashboard.users.name")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>{" "}
                    <Input
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                      placeholder={t("dashboard.users.name")}
                    />
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t("dashboard.users.phone")}</FormLabel>
                    <Input
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                      placeholder={t("dashboard.users.phone")}
                    />
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t("dashboard.users.roles")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Selector
                        className="w-full"
                        items={(roleWithPermissions || []).map((role) => ({
                          value: role.id,
                          label: RoleVietnameseNames[role.name] || role.name,
                        }))}
                        multiple={true}
                        placeholder={t("dashboard.users.modal.selectRoles")}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departments"
                  render={({ field, fieldState }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t("dashboard.users.departments")}</FormLabel>
                      <Selector
                        className="w-full"
                        multiple={true}
                        placeholder={t(
                          "dashboard.users.modal.selectDepartments"
                        )}
                        items={(departments || [])
                          .filter((department) => department.id !== undefined)
                          .map((department) => ({
                            value: department.id as string,
                            label: department.name,
                          }))}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                      />
                      {fieldState.error && (
                        <FormMessage>{fieldState.error.message}</FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>{" "}
              <div className="w-full flex justify-end">
                <Button type="submit">
                  {user ? t("common.edit") : t("dashboard.users.add")}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
