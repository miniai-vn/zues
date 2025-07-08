"use client";

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
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Resource } from "@/hooks/data/useResource";
import useTranslations from "@/hooks/useTranslations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define schema for file upload validation
const uploadFormSchema = z.object({
  file: z
    .custom<string>()
    .refine((file) => file !== undefined && file !== null, {
      message: "Tệp là bắt buộc",
    })
    .refine(
      (file) => {
        if (!file) return false;
        const extension = file.split(".").pop()?.toLowerCase();
        return ["pdf", "txt", "docx", "doc", "xlsx"].includes(extension || "");
      },
      {
        message: "Chỉ hỗ trợ tệp PDF, TXT, DOC, DOCX, XLS, XLSX và CSV",
      }
    ),
  description: z.string().nonempty("Mô tả tài liệu là bắt buộc"),
});

type UploadFormValues = z.infer<typeof uploadFormSchema>;

interface CreateOrUpdateResourceProps {
  type?: string;
  resource?: Resource;
  onHandleUploadFile: (file: File, description: string, type: string) => void;
  trigger?: React.ReactNode;
}

export function CreateOrUpdateResource({
  resource,
  type,
  onHandleUploadFile,
  trigger,
}: CreateOrUpdateResourceProps) {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      file: undefined,
      description: resource?.description || "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = (values: UploadFormValues) => {
    if (selectedFile) {
      onHandleUploadFile(selectedFile, values.description, type || "document");
      form.reset();
      setSelectedFile(null);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedFile(null);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setSelectedFile(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ||
          (resource ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8"
              aria-label={t("dashboard.departments.detail.editResource")}
            >
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
          ) : type === "faqs" ? (
            <Button>{t("dashboard.departments.detail.faqs.uploadFaq")}</Button>
          ) : (
            <Button>
              {t("dashboard.departments.detail.uploadNewDocument")}
            </Button>
          ))}
      </DialogTrigger>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>
            {resource
              ? t("dashboard.departments.detail.editDocument")
              : t("dashboard.departments.detail.createNewDocument")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <Input
                    placeholder={t(
                      "dashboard.departments.detail.uploadFilePlaceholder"
                    )}
                    type="file"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFileChange(e);
                    }}
                    className="w-full h-14 center"
                    accept=".pdf,.doc,.docx,.txt,.xlsx"
                  />
                  <FormDescription>
                    {t("dashboard.departments.detail.acceptedFormats")}
                  </FormDescription>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-500">
                      {t("dashboard.departments.detail.selectedFile")}:{" "}
                      {selectedFile.name} (
                      {Math.round(selectedFile.size / 1024)} KB)
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Textarea
                    {...field}
                    placeholder={t(
                      "dashboard.departments.detail.descriptionPlaceholder"
                    )}
                    className="w-full h-40"
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
                {t("common.cancel")}
              </Button>
              <Button type="submit" className="w-full" disabled={!selectedFile}>
                {resource ? t("common.save") : t("common.create")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
