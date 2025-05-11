"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Department } from "@/hooks/data/useDepartments";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, "Tên nhóm tài liệu phải có ít nhất 2 ký tự.")
    .trim()
    .refine((val) => val.length > 0, "Vui lòng nhập tên nhóm tài liệu."),

  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự.")
    .max(500, "Mô tả không được vượt quá 500 ký tự.")
    .trim()
    .refine((val) => val.length > 0, "Vui lòng nhập mô tả."),

  prompt: z
    .string()
    .trim()
    .refine((val) => val.length > 0, "Vui lòng nhập lời nhắc."),
});
type createDepartment = z.infer<typeof FormSchema>;
type updateDepartment = z.infer<typeof FormSchema> & {
  id?: string;
};
interface CreateOrUpdateFormProps {
  department?: Department;
  onSubmit: ({ data }: { data: createDepartment | updateDepartment }) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function CreateOrUpdateForm({
  department,
  onSubmit: handleSubmit,
  isOpen,
  setIsOpen,
}: CreateOrUpdateFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: department || {
      name: "",
      description: "",
      prompt: "",
    },
  });

  useEffect(() => {
    if (department) {
      form.reset({
        name: department.name,
        description: department.description,
        prompt: department.prompt,
      });
    }
  }, [department, form]);

  const onSubmit = async (data: createDepartment | updateDepartment) => {
    try {
     
      await handleSubmit({
        data: {
          ...(department ? { id: department.id } : {}),
          ...data,
        },
      });
    } catch (error) {
      throw new Error("Error submitting form");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên nhóm tài liệu <span className="text-red-500">*</span>
              </FormLabel>
              <Textarea
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả <span className="text-red-500">*</span>
              </FormLabel>
              <Textarea
                value={field.value ?? ""}
                placeholder="Nội dung của nhóm tài liệu này cung cấp thông tin chuyên môn, giúp hệ thống AI hiểu rõ bối cảnh và yêu cầu công việc. Nhờ đó, AI có thể đưa ra câu trả lời chính xác, phù hợp với chức năng và nghiệp vụ, hỗ trợ hiệu quả hơn trong các tác vụ chuyên môn."
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full h-24"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Lời nhắc <span className="text-red-500">*</span>
              </FormLabel>
              <Textarea
                value={field.value ?? ""}
                placeholder="Chức năng này giúp bạn xây dựng tính cách, phong cách trả lời của trợ lý AI. Càng cung cấp dữ liệu đầy đủ, hệ thống sẽ càng hiểu hơn về loại tính cách, giọng văn, kiểu phong cách bạn muốn xây dựng cho trợ lý."
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full h-24"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full">
          <div className="w-full mt-auto flex gap-4">
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
        </div>
      </form>
    </Form>
  );
}
