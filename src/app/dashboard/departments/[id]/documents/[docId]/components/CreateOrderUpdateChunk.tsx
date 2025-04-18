"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Chunk } from "@/hooks/data/useChunk";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for form validation
const chunkFormSchema = z.object({
  text: z.string().min(1, "Please enter chunk text"),
});

type ChunkFormValues = z.infer<typeof chunkFormSchema>;

interface CreateOrUpdateChunkModalProps {
  chunk?: Chunk;
  onChange: (data: Chunk) => void;
}

export function CreateOrUpdateChunkModal({
  chunk,
  onChange,
}: CreateOrUpdateChunkModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ChunkFormValues>({
    resolver: zodResolver(chunkFormSchema),
    defaultValues: {
      text: chunk?.text || "",
    },
  });

  // Reset form when chunk props change
  useEffect(() => {
    if (chunk && isOpen) {
      form.reset({
        text: chunk.text || "",
      });
    }
  }, [chunk, form, isOpen]);

  const onSubmit = (data: ChunkFormValues) => {
    onChange({
      id: chunk?.id || crypto.randomUUID(),
      text: data.text,
      isPublic: false,
    });
    form.reset();
    setIsOpen(false);
  };

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
        if (open && chunk) {
          form.reset({
            text: chunk.text || "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        {chunk ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8"
            aria-label="Edit chunk"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (
          <Button>+ Tạo phân đoạn mới</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {chunk ? "Chỉnh sửa phân đoạn" : "Tạo phân đoạn mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    placeholder="Nhập nội dung phân đoạn..."
                    className="w-full h-80"
                    aria-invalid={fieldState.invalid}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" className="w-full">
                {chunk ? "Lưu" : "Tạo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
