"use client";

import { Resource } from "@/hooks/data/useResource";
import useTranslations from "@/hooks/useTranslations";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { File, FileText, ImageIcon } from "lucide-react";
import { ResourceActions } from "./ResourceActions";

interface ResourceColumnsProps {
  isPendingCreateChunks: boolean;
  isPendingSyncResource: boolean;
  onHandleUploadFile: (
    file: File,
    description: string,
    type: string
  ) => Promise<void>;
  onViewResource: (resource: Resource) => void;
  onToggleResourceStatus: (resource: Resource) => void;
  onReEtl: (documentId: string) => void;
  onDeleteResource: (documentId: string) => void;
}

export const useResourceColumns = ({
  isPendingCreateChunks,
  isPendingSyncResource,
  onHandleUploadFile,
  onViewResource,
  onToggleResourceStatus,
  onReEtl,
  onDeleteResource,
}: ResourceColumnsProps): ColumnDef<Resource>[] => {
  const { t } = useTranslations();

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-500" />;
      case "csv":
      case "xlsx":
      case "xls":
        return <FileText className="h-6 w-6 text-green-500" />;
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="h-6 w-6 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  return [
    {
      id: "index",
      header: () => <div className="text-center">{t("common.index")}</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "name",
      header: t("dashboard.departments.detail.fileName"),
      cell: (row) => {
        const fileName = row.row.original.name;
        return (
          <div className="flex items-center gap-2 max-w-[200px]">
            <span className="flex-shrink-0">
              {getFileIcon(row.row.original.type as string)}
            </span>
            <span className="truncate" title={fileName}>
              {fileName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: t("dashboard.departments.detail.documentType"),
      cell: (row) => (
        <div className="max-w-[100px]">
          <span className="truncate block" title={row.row.original?.type}>
            {row.row.original?.type}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: t("dashboard.departments.detail.fileSize"),
      cell: (row) => (
        <div className="whitespace-nowrap">
          {/* {convertBytesToMB(row.row.original.extra.size as number)} */}
        </div>
      ),
    },

    {
      accessorKey: "description",
      header: t("dashboard.departments.detail.description"),
      cell: (row) => {
        const description = row.row.original.description;
        return (
          <div className="max-w-[250px]">
            <span className="line-clamp-2 text-sm" title={description}>
              {description}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: t("dashboard.departments.detail.isActive"),
      cell: (row) => {
        const isActive = row.row.original.isActive;
        return (
          <div className="flex items-center justify-center">
            {isActive ? (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Khả dụng
              </span>
            ) : (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Không khả dụng
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: t("dashboard.departments.detail.uploadTime"),
      cell: (row) => (
        <div className="whitespace-nowrap text-sm">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="text-center">
          {t("dashboard.departments.detail.status")}
        </div>
      ),
      cell: (row) => {
        const status = row.row.original.status;
        let statusText = status;
        let statusClass = "bg-gray-100 text-gray-800";

        if (isPendingCreateChunks || isPendingSyncResource) {
          return (
            <div className="flex items-center justify-center z-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          );
        }

        switch (status) {
          case "new":
            statusText = t("dashboard.departments.detail.statusValues.new");
            statusClass = "bg-blue-100 text-blue-800";
            break;
          case "processing":
            statusText = t(
              "dashboard.departments.detail.statusValues.processing"
            );
            statusClass = "bg-yellow-100 text-yellow-800";
            return (
              <div className="flex items-center justify-center w-full">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass} flex items-center gap-2`}
                >
                  <div className="animate-spin w-3 h-3 border border-yellow-600 border-t-transparent rounded-full"></div>
                  {statusText}
                </span>
              </div>
            );

          case "completed":
            statusText = t(
              "dashboard.departments.detail.statusValues.completed"
            );
            statusClass = "bg-green-100 text-green-800";
            break;
          case "finished":
            statusText = t(
              "dashboard.departments.detail.statusValues.finished"
            );
            statusClass = "bg-green-100 text-green-800";
            break;
          case "active":
            statusText = t("dashboard.departments.detail.statusValues.active");
            statusClass = "bg-green-100 text-green-800";
            break;
          case "error":
            statusText = t("dashboard.resources.error");
            statusClass = "bg-red-100 text-red-800";
            break;
          default:
            break;
        }

        return (
          <div className="flex items-center justify-center w-full">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}
            >
              {statusText}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("common.actions")}</div>,
      cell: (row) => {
        const resource = row.row.original;
        return (
          <ResourceActions
            resource={resource}
            onHandleUploadFile={onHandleUploadFile}
            onViewResource={onViewResource}
            onToggleResourceStatus={onToggleResourceStatus}
            onReEtl={onReEtl}
            onDeleteResource={onDeleteResource}
          />
        );
      },
    },
  ];
};
