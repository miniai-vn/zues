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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, LockOpen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Hàm tạo schema động dựa trên props user
const getFormSchema = (user?: User) =>
  z.object({
    username: z.string().nonempty("Vui lòng nhập tài khoản."),
    password: user
      ? z.string().optional()
      : z
          .string()
          .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
          .nonempty("Vui lòng nhập mật khẩu."),
    name: z.string().nonempty("Vui lòng nhập họ và tên.").default(""),
    phone: z.string().regex(/^\d+$/, "Số điện thoại phải là số").optional(),
    roles: z
      .array(z.number())
      .min(1, { message: "Vui lòng chọn ít nhất một phòng ban." })
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
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);

  // Sử dụng schema động
  const form = useForm<z.infer<ReturnType<typeof getFormSchema>>>({
    resolver: zodResolver(getFormSchema(user)),
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
      <DialogTrigger asChild>
        {children || <Button >+ Tạo nhân viên</Button>}
      </DialogTrigger>
      <DialogContent className="w-[40vw] max-w-[70vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user ? "Cập nhật tài khoản nhân viên" : "Tạo tài khoản nhân viên"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Tài khoản <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-20"
                        placeholder="Nhập tài khoản"
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
                      Mật khẩu <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-10"
                        placeholder="Nhập mật khẩu"
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
                          {/* Tooltip hiển thị khi hover */}
                          <span className="absolute right-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            Đổi mật khẩu
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
                      Họ và tên <span className="text-red-500">*</span>
                    </FormLabel>
                    <Input
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                      placeholder="Nhập họ và tên"
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
                    <FormLabel>Số điện thoại</FormLabel>
                    <Input
                      type="text"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                      placeholder="Nhập số điện thoại"
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
                        Vai trò <span className="text-red-500">*</span>
                      </FormLabel>
                      <Selector
                        className="w-full"
                        items={(roleWithPermissions || []).map((role) => ({
                          value: role.id,
                          label: RoleVietnameseNames[role.name] || role.name,
                        }))}
                        multiple={true}
                        placeholder="Chọn vai trò"
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
                      <FormLabel>Phòng ban</FormLabel>
                      <Selector
                        className="w-full"
                        multiple={true}
                        placeholder="Chọn phòng ban"
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
              </div>
              <div className="w-full flex justify-end">
                <Button type="submit">
                  {user ? "Cập nhật" : "Tạo tài khoản"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
