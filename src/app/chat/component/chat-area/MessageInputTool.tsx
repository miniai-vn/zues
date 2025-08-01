"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Grid3X3,
  ImageIcon,
  Info,
  MessageSquareQuote,
  MoreHorizontal,
  Paperclip,
  Type,
} from "lucide-react";
import { useRef } from "react";

type MessageInputToolProps = {
  onSendMessage?: (message: string, files?: FileList) => void;
  onFileSelect?: (files: FileList) => void;
  onCameraClick?: () => void;
  onUploadImages?: (files: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MessageInputTool({
  onFileSelect,
  onUploadImages,
  disabled = false,
}: MessageInputToolProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB cho file thường
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB cho ảnh

  const validateFiles = (
    fileList: FileList
  ): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith("image/")) {
        if (file.size > MAX_IMAGE_SIZE) {
          errors.push(`${file.name} vượt quá giới hạn 1MB cho ảnh`);
        } else {
          validFiles.push(file);
        }
      } else {
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name} vượt quá giới hạn 5MB`);
        } else {
          validFiles.push(file);
        }
      }
    });

    return { validFiles, errors };
  };

  // Hàm xử lý upload nhiều ảnh khi click ImageIcon
  const handleImageIconClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Array.from(target.files);
        if (onUploadImages) {
          onUploadImages(files);
        }
      }
    };
    input.click();
  };

  // Hàm xử lý file cho nút Paperclip
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const { validFiles, errors } = validateFiles(e.target.files);

      if (errors.length > 0) {
        alert(`Lỗi: ${errors.join(", ")}`);
      }

      if (validFiles.length > 0 && onFileSelect) {
        const dt = new DataTransfer();
        validFiles.forEach((file) => dt.items.add(file));
        onFileSelect(dt.files);
      }
    }
  };

  return (
    <div className="w-full mx-auto ">
      {/* Toolbar */}
      <div className="flex items-center pb-2 border-gray-100">
        {/* Image Gallery Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          onClick={handleImageIconClick}
        >
          <ImageIcon className="h-4 w-4 text-gray-600" />
        </Button>

        {/* File Attachment Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          onClick={handleFileClick}
          disabled={disabled}
        >
          <Paperclip className="h-4 w-4 text-gray-600" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed,application/octet-stream"
            multiple
            className="hidden"
            onChange={handleFileChange}
            tabIndex={-1}
          />
        </Button>

        {/* Grid/Layout Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          disabled={disabled}
        >
          <Grid3X3 className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Info Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              disabled={disabled}
            >
              <div className="flex items-center">
                <Info className="h-4 w-4 text-gray-600" />
                <ChevronDown className="h-3 w-3 text-gray-600 ml-0.5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Thông tin chat</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuItem>Trợ giúp</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text Formatting Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          disabled={disabled}
        >
          <Type className="h-4 w-4 text-gray-600" />
        </Button>

        {/* Quote/Message Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          disabled={disabled}
        >
          <MessageSquareQuote className="h-4 w-4 text-gray-600" />
        </Button>

        {/* More Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              disabled={disabled}
            >
              <MoreHorizontal className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Ghi âm</DropdownMenuItem>
            <DropdownMenuItem>Vị trí</DropdownMenuItem>
            <DropdownMenuItem>Sticker</DropdownMenuItem>
            <DropdownMenuItem>GIF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
