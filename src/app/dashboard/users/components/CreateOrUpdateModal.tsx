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
import useRoles from "@/hooks/data/useRoles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().nonempty("Please enter a username."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .nonempty("Please enter a password."),
  phone: z.string().regex(/^\d+$/, "Phone number must be a number").optional(),
  roles: z.array(z.number()).nonempty("Please select at least one role."),
  departments: z
    .array(z.number())
    .nonempty("Please select at least one department."),
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
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: user?.username || "",
      password: user?.password,
      phone: user?.phone || "",
      roles: user?.roles?.map((role) => role.id),
      departments: user?.departments?.map((dept) => Number(dept.id)),
    },
  });
  const { departments } = useDepartments({});
  const { roles } = useRoles();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange?.({ ...data, id: user?.id });
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
        {children || <Button>+ Tạo nhân viên</Button>}
      </DialogTrigger>
      <DialogContent className="w-[60%] overflow-y-auto">
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roles"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Vai trò</FormLabel>
                    <Selector
                      className="w-full"
                      items={(roles || []).map((role) => ({
                        value: role.id,
                        label: role.name,
                      }))}
                      multiple={true}
                      placeholder="Chọn vai trò"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departments"
                render={({ field, fieldState }) => (
                  <FormItem>
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
                  </FormItem>
                )}
              />
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
