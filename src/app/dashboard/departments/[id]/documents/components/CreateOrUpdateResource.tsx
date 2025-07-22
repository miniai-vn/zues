"use client";

import MultipleFileUpload from "@/components/dashboard/mutiple-file-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  onHandleUploadFile: (
    file: File,
    description: string,
    type: string,
    parentId?: number
  ) => void;
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

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      file: undefined,
      description: resource?.description || "",
    },
  });

  const handleFileChange = (file: File | null) => {
    onHandleUploadFile(file as File, "", type || "document", resource?.id);
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
        <MultipleFileUpload handleFileChange={handleFileChange} />
      </DialogContent>
    </Dialog>
  );
}
