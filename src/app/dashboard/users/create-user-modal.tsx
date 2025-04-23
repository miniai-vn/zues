"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, UserData } from "@/hooks/data/useAuth";
import { Eye, EyeOff } from "lucide-react";
import useDepartments from "@/hooks/data/useDepartments";
import useRoles from "@/hooks/data/useRoles";

const FormSchema = z.object({
  username: z.string().optional(),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự.").optional(),
  phone: z.string().regex(/^\d+$/, "Số điện thoại phải là số.").optional(),
  roles: z.array(z.string()).optional(),
  departments: z.array(z.number()).optional(),
});

interface AddUserProps {
  user?: User;
  onChange?: (data: UserData) => void;
  children?: React.ReactNode;
}

export function UserModal({ user, children, onChange }: AddUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user?.username || "",
      password: "",
      phone: user?.phone || "",
      roles: user?.roles?.map(role => role.name) || [],
      departments: user?.departments?.map(dept => dept.id) || [],
    },
  });
  const { departments } = useDepartments();
  const { roles } = useRoles();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange?.({
      ...data,
      username: data.username || "",
      password: data.password || "",
      roles: data.roles || [],
      departments: data.departments || [],
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        form.reset();
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Badge className="border bg-white text-blue-700 border-blue-700">
            {user ? "Update" : "Create"}
          </Badge>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? "Cập nhật tài khoản nhân viên" : "Tạo tài khoản nhân viên"}</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Tài khoản</FormLabel>
                    <div className="relative">
                      <Input
                        type="text"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-20"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                        @gmail.com
                      </span>
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
                    <FormLabel>Mật khẩu</FormLabel>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
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
                    />
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Vai trò</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {roles?.map((role) => (
                          <label key={role.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={role.name}
                              checked={field.value?.includes(role.name)}
                              onChange={(e) => {
                                const value = role.name;
                                if (e.target.checked) {
                                  field.onChange([...field.value ?? [], value]);
                                } else {
                                  field.onChange(field.value?.filter((v) => v !== value) ?? []);
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span>{role.name}</span>
                          </label>
                        ))}
                      </div>
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
                    <FormItem className="w-1/2">
                      <FormLabel>Bộ phận</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {departments?.map((department) => (
                          <label key={department.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={String(department.id)}
                              checked={Array.isArray(field.value) && field.value.includes(department.id || -1)}
                              onChange={(e) => {
                                const value = department.id || -1;
                                const currentValue = Array.isArray(field.value) ? field.value : [];
                                if (e.target.checked) {
                                  field.onChange([...currentValue, value]);
                                } else {
                                  field.onChange(currentValue.filter((v) => v !== value));
                                }
                              }}
                              className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <span>{department.name}</span>
                          </label>
                        ))}
                      </div>
                      {fieldState.error && (
                        <FormMessage></FormMessage>
                      )}
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex justify-end">
                <Button type="submit" className="bg-blue-600 text-white">
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
