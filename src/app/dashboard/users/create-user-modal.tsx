"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = (isEditMode: boolean) =>
  z.object({
    username: isEditMode
      ? z.string().optional()
      : z.string().nonempty("* Tài khoản là bắt buộc."),
    password: isEditMode
      ? z.string().optional()
      : z.string().min(8, "* Mật khẩu phải có ít nhất 8 ký tự."),
    phone: isEditMode
      ? z.string().optional()
      : z.string().regex(/^\d+$/, "* Số điện thoại phải là số."),
    roles: z.array(z.string()).optional(),
    departments: z.array(z.number()).optional(),
    position: z.string().nonempty("* Vui lòng chọn chức vụ."),
  });

interface AddUserProps {
  user?: User;
  onChange?: (data: UserData) => void;
  children?: React.ReactNode;
}

export function UserModal({ user, children, onChange }: AddUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEditMode = !!user;

  const form = useForm<z.infer<ReturnType<typeof FormSchema>>>({
    resolver: zodResolver(FormSchema(isEditMode)),
    defaultValues: {
      username: user?.username || "",
      password: "",
      phone: user?.phone || "",
      roles: user?.roles?.map((role) => role.name) || [],
      departments: user?.departments?.map((dept) => dept.id) || [],
    },
  });
  const { departments } = useDepartments();
  const { roles } = useRoles();

  const onSubmit = async (data: z.infer<ReturnType<typeof FormSchema>>) => {
    onChange?.({
      ...data,
      id: user?.id,
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
        <DialogDescription></DialogDescription>
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
                    <FormLabel>
                      Mật khẩu <span className="text-red-500">*</span>
                    </FormLabel>
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
              <FormField
                control={form.control}
                name="position"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Chức vụ</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chức vụ" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
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
                      <div className="space-y-2">
                      <Select
                        value=""
                        onValueChange={(value) => {
                          const current = field.value || [];
                          const exists = current.includes(value);
                          if (exists) {
                            field.onChange(current.filter((v) => v !== value));
                          } else {
                            field.onChange([...current, value]);
                          }
                        }}
                      >
                          <SelectTrigger>
                            <div className="flex flex-wrap gap-2">
                              {field.value?.map((role, index) => (
                                <Badge
                                  key={index}
                                  className="border bg-blue-600 text-white border-blue-600 flex items-center gap-1 pointer-events-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(field.value?.filter((id) => id !== role));
                                  }}
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {roles?.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departments"
                  render={({ field, fieldState }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Bộ phận</FormLabel>
                      <div className="space-y-2">
                        <Select
                          value=""
                          onValueChange={(value) => {
                            const current = field.value || [];
                            const exists = current.includes(Number(value));
                            if (exists) {
                              field.onChange(current.filter((v) => v !== Number(value)));
                            } else {
                              field.onChange([...current, Number(value)]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <div className="flex flex-wrap gap-2">
                              {field.value?.map((deptId, index) => (
                                <Badge
                                  key={index}
                                  className="border bg-blue-600 text-white border-blue-600 flex items-center gap-1 pointer-events-auto"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(field.value?.filter((id) => id !== deptId));
                                  }}
                                >
                                  {departments?.find((dept) => dept.id === deptId)?.name}
                                </Badge>
                              ))}
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {departments?.map((department) => (
                              <SelectItem key={department.id} value={String(department.id)}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
                      </div>
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
