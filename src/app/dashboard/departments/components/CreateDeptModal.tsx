"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Department } from "@/hooks/data/useDepartments";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string({
    required_error: "Please enter a department name.",
  }),
  description: z.string({
    required_error: "Please enter a department description.",
  }),
});

interface CreateDeptModalProps {
  department?: Department;
  onChange: (data: {
    id?: string;
    name: string;
    description: string;
    isPublic?: boolean;
  }) => void;
}

export function CreateDeptModal({
  department,
  onChange,
}: CreateDeptModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: department || { name: "", description: "" },
  });

  useEffect(() => {
    if (department) {
      form.reset(department);
    }
  }, [department, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    onChange({ ...data, id: department?.id, isPublic: false });
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
      open={isOpen}
    >
      <DialogTrigger asChild>
        {department ? (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (
          <Button>+ Tạo phòng ban mới</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {department ? "Chỉnh sửa" : "Tạo phòng ban"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên phòng ban</FormLabel>
                    <Textarea
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full"
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <Textarea
                      value={field.value ?? ""}
                      placeholder="Mô tả này như prompt và được sử dụng để hướng dẫn AI"
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full h-40"
                    />
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-4">
                <Button
                  type="button"
                  className="w-full bg-white text-black border"
                  onClick={() => setIsOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button type="submit" className="w-full">
                  {department ? "Lưu" : "Tạo"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
