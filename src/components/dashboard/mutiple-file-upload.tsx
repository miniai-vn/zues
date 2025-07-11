"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, File, ImageIcon, Music, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileWithProgress {
  file: File;
  id: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
  if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
  if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
  if (type.includes("text") || type.includes("document"))
    return <File className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export default function MultipleFileUpload() {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const filesWithProgress: FileWithProgress[] = fileArray.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...filesWithProgress]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const simulateUpload = async (fileWithProgress: FileWithProgress) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileWithProgress.id
          ? { ...f, status: "uploading" as const }
          : f
      )
    );

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setFiles((prev) =>
        prev.map((f) => (f.id === fileWithProgress.id ? { ...f, progress } : f))
      );
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileWithProgress.id
          ? { ...f, status: "completed" as const }
          : f
      )
    );
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    // Upload files concurrently
    await Promise.all(pendingFiles.map((file) => simulateUpload(file)));
  };

  const clearAll = () => {
    setFiles([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop files here, or click to select files
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
              accept="*/*"
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Selected Files ({files.length})
              </h3>
              <div className="space-x-2">
                <Button
                  onClick={uploadAll}
                  disabled={files.every((f) => f.status !== "pending")}
                  size="sm"
                >
                  Upload All
                </Button>
                <Button onClick={clearAll} variant="outline" size="sm">
                  Clear All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {files.map((fileWithProgress) => (
                <div
                  key={fileWithProgress.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(fileWithProgress.file.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">
                        {fileWithProgress.file.name}
                      </p>
                      <Badge
                        variant={
                          fileWithProgress.status === "completed"
                            ? "default"
                            : fileWithProgress.status === "uploading"
                            ? "secondary"
                            : fileWithProgress.status === "error"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {fileWithProgress.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(fileWithProgress.file.size)}
                      </p>

                      {fileWithProgress.status === "uploading" && (
                        <div className="flex-1">
                          <Progress
                            value={fileWithProgress.progress}
                            className="h-2"
                          />
                        </div>
                      )}

                      {fileWithProgress.status === "uploading" && (
                        <span className="text-xs text-muted-foreground">
                          {fileWithProgress.progress}%
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => removeFile(fileWithProgress.id)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    disabled={fileWithProgress.status === "uploading"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
