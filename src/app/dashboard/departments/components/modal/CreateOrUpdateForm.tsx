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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters.")
    .trim()
    .refine((val) => val.length > 0, "Department name is required."),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters.")
    .trim()
    .refine((val) => val.length > 0, "Description is required."),

  prompt: z
    .string()
    .trim()
    .refine((val) => val.length > 0, "Prompt is required."),
});

interface CreateOrUpdateFormProps {
  department?: Department;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
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
        name: department.name || "",
        description: department.description || "",
        prompt: department.prompt || "",
      });
    }
  }, [department, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await handleSubmit(data);
    if (!department) {
      form.reset();
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
                Tên phòng ban <span className="text-red-500">*</span>
              </FormLabel>
              <Textarea
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              />
              <FormMessage />{" "}
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
                placeholder="Nội dung của phòng ban này cung cấp thông tin chuyên môn, giúp hệ thống AI hiểu rõ bối cảnh và yêu cầu công việc. Nhờ đó, AI có thể đưa ra câu trả lời chính xác, phù hợp với chức năng và nghiệp vụ của phòng Nhân sự, hỗ trợ hiệu quả hơn trong các tác vụ như tuyển dụng, đào tạo hay quản lý nhân sự.."
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full h-24"
              />
              <FormMessage />{" "}
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
  );
}
