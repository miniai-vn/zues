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
import useWhiteLabel from "@/hooks/data/useWhiteLabel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  branding: z.object({
    logo: z
      .object({
        url: z.string().url("URL không hợp lệ"),
        altText: z.string().optional(),
      })
      .optional(),
    favicon: z.string().url("URL không hợp lệ").optional(),
  }),
});
type createDepartment = z.infer<typeof FormSchema>;
type updateDepartment = z.infer<typeof FormSchema> & {
  id?: string;
};

export default function CreateOrUpdateForm() {
  const { whiteLabel, createWhiteLabel, updateWhiteLabel } = useWhiteLabel();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: whiteLabel || {
      branding: {
        logo: {
          url: "",
          altText: "",
        },
        favicon: "",
      },
    },
  });

  useEffect(() => {
    if (whiteLabel) {
      form.reset({});
    }
  }, [whiteLabel, form]);

  const onSubmit = async (data: createDepartment | updateDepartment) => {
    try {
      debugger;
    } catch (error) {
      throw new Error("Error submitting form");
    } finally {
    //   setIsOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="branding.logo.url"
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
          name="branding.logo.altText"
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


        <div className="w-full">
          <div className="w-full mt-auto flex gap-4">
            <Button type="submit" className="w-full">
                {whiteLabel ? "Cập nhật" : "Tạo"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
