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
import { TextEditor } from "@/components/ui/text-editor";
import { Chunk } from "@/hooks/data/useChunk";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for form validation
const chunkFormSchema = z.object({
  original_content: z.string().min(1, "Please enter chunk text"),
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
      original_content: chunk?.original_content || "",
    },
  });

  // Reset form when chunk props change
  useEffect(() => {
    if (chunk && isOpen) {
      form.reset({
        original_content: chunk.original_content || "",
      });
    }
  }, [chunk, form, isOpen]);

  const onSubmit = (data: ChunkFormValues) => {
    onChange({
      id: chunk?.id as string,
      original_content: data.original_content,
      isPublic: false,
      createdAt: "",
      updatedAt: "",
      isActive: false,
      resourceId: "",
      code: chunk?.code || "",
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
            original_content: chunk.original_content || "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        {chunk ? (
          <Button variant="ghost" size="sm" aria-label="Edit chunk">
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
        ) : (
          <Button>+ Tạo phân đoạn mới</Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw] h-[100vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {chunk ? "Chỉnh sửa phân đoạn" : "Tạo phân đoạn mới"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1"
          >
            <div className="flex-1 flex flex-col">
              <FormField
                control={form.control}
                name="original_content"
                render={({ field }) => (
                  <FormItem className="flex-1 flex flex-col">
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập nội dung phân đoạn..."
                      className="w-full max-h-[95%] flex-1"
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
