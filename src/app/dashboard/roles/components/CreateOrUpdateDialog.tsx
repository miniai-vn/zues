"use client";

import { useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const roleSchema = z.object({
  name: z.string().nonempty("Vui lòng nhập tên vai trò."),
  description: z.string().nonempty("Vui lòng nhập mô tả."),
});

export interface RoleData {
  id?: number;
  name: string;
  description: string;
}

interface CreateOrUpdateRoleDialogProps {
  role?: RoleData;
  onChange?: (data: RoleData) => void;
  children?: React.ReactNode;
}

export function CreateOrUpdateRoleDialog({
  role,
  onChange,
  children,
}: CreateOrUpdateRoleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof roleSchema>>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof roleSchema>) => {
    onChange?.({
      ...data,
      id: role?.id,
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        {children || <Button>+ Tạo vai trò</Button>}
      </DialogTrigger>
      <DialogContent className="w-[400px] max-w-full">
        <DialogHeader>
          <DialogTitle>{role ? "Cập nhật vai trò" : "Tạo vai trò"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Tên vai trò <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập tên vai trò"
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Mô tả <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập mô tả vai trò"
                  />
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
            <div className="w-full flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white">
                {role ? "Cập nhật" : "Tạo vai trò"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrUpdateRoleDialog;
