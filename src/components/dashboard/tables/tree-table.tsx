import { CreateOrUpdateResource } from "@/app/dashboard/departments/[id]/documents/components/CreateOrUpdateResource";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Resource } from "@/hooks/data/useResource";
import useTranslations from "@/hooks/useTranslations";
import dayjs from "dayjs";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  File,
  FileText,
  Folder,
  ImageIcon,
  MoreHorizontal,
  Power,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useState } from "react";
import { TreeNode } from "./tree-helpers";

interface TreeTableProps {
  data: TreeNode[];
  onToggleExpansion: (nodeId: string | number) => void;
  onCreateChunks: (id: string) => void;
  onSyncResource: (id: string) => void;
  onDeleteResource: (id: string) => void;
  onReEtl: (id: string) => void;
  onUploadForResource?: (resource: TreeNode) => void;
  onViewResource?: (resource: TreeNode) => void;
  onToggleResourceStatus?: (resource: TreeNode) => void;
  onHandleUploadFile?: (
    file: File,
    description: string,
    type: string
  ) => Promise<void>;

  isPendingCreateChunks?: boolean;
  isPendingSyncResource?: boolean;
  columnVisibility: Record<string, boolean>;
}

const TreeTable: React.FC<TreeTableProps> = ({
  data,
  onToggleExpansion,
  onCreateChunks,
  onSyncResource,
  onDeleteResource,
  onReEtl,
  onViewResource,
  onToggleResourceStatus,
  onHandleUploadFile,
  isPendingCreateChunks = false,
  isPendingSyncResource = false,
  columnVisibility,
}) => {
  const { t } = useTranslations();
  const [selectedResourceForUpload, setSelectedResourceForUpload] =
    useState<TreeNode | null>(null);

  const getFileIcon = (type: string) => {
    // if (hasChildren) {
    //   return <Folder className="h-4 w-4 text-blue-500" />;
    // }

    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "csv":
      case "xlsx":
      case "xls":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    let statusText = status;
    let statusClass = "bg-gray-100 text-gray-800";

    switch (status) {
      case "new":
        statusText = t("dashboard.departments.detail.statusValues.new");
        statusClass = "bg-blue-100 text-blue-800";
        break;
      case "processing":
        statusText = t("dashboard.departments.detail.statusValues.processing");
        statusClass = "bg-yellow-100 text-yellow-800";
        break;
      case "finished":
        statusText = t("dashboard.departments.detail.statusValues.finished");
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
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}
      >
        {statusText}
      </span>
    );
  };

  const renderTreeNode = (node: TreeNode, index: number) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.isExpanded || false;
    const indentLevel = node.level * 20;

    return (
      <React.Fragment key={node.id || index}>
        <tr className="border-b transition-colors hover:bg-muted/50">
          {columnVisibility.index && (
            <td className="p-2 align-middle text-center">{index + 1}</td>
          )}

          {columnVisibility.name && (
            <td className="p-2 align-middle">
              <div
                className="flex items-center gap-2"
                style={{ marginLeft: `${indentLevel}px` }}
              >
                {hasChildren && (
                  <button
                    onClick={() => onToggleExpansion(node.id!)}
                    className="flex-shrink-0 p-1 hover:bg-muted rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                {!hasChildren && <div className="w-6" />}
                <span className="flex-shrink-0">
                  {getFileIcon(node.type as string)}
                </span>

                <span className="truncate max-w-[200px]" title={node.name}>
                  {node.name}
                </span>
              </div>
            </td>
          )}

          {columnVisibility.type && (
            <td className="p-2 align-middle">
              <div className="max-w-[100px]">
                <span className="truncate block" title={node.type}>
                  {node.type}
                </span>
              </div>
            </td>
          )}

          {columnVisibility.size && <td className="p-2 align-middle"></td>}

          {columnVisibility.description && (
            <td className="p-2 align-middle">
              <div className="max-w-[250px]">
                <span className="line-clamp-2 text-sm" title={node.description}>
                  {node.description}
                </span>
              </div>
            </td>
          )}

          {columnVisibility.createdAt && (
            <td className="p-2 align-middle">
              <div className="whitespace-nowrap text-sm">
                {node.createdAt
                  ? dayjs(node.createdAt).format("DD/MM/YYYY HH:mm")
                  : "-"}
              </div>
            </td>
          )}

          {columnVisibility.status && (
            <td className="p-2 align-middle">
              <div className="flex items-center justify-center">
                {isPendingCreateChunks || isPendingSyncResource ? (
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                ) : (
                  getStatusBadge(node.status || "")
                )}
              </div>
            </td>
          )}

          {columnVisibility.actions && (
            <td className="p-2 align-middle">
              <div className="flex items-center justify-center w-full gap-2">
                <div className="flex items-center">
                  <Switch
                    id={`status-switch-${node.id}`}
                    checked={node.isActive === true}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onCreateChunks(String(node.id));
                      } else {
                        onSyncResource(String(node.id));
                      }
                    }}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      aria-label={t("common.actions")}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {onHandleUploadFile && (
                      <CreateOrUpdateResource
                        type="document"
                        onHandleUploadFile={onHandleUploadFile}
                        resource={
                          (selectedResourceForUpload as Resource) || undefined
                        }
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => {
                              setSelectedResourceForUpload(node);
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            {t(
                              "dashboard.departments.detail.uploadNewDocument"
                            )}
                          </DropdownMenuItem>
                        }
                      />
                    )}
                    {onViewResource && (
                      <DropdownMenuItem
                        onClick={() => onViewResource(node)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {t("dashboard.departments.detail.viewResource")}
                      </DropdownMenuItem>
                    )}
                    {onToggleResourceStatus && (
                      <DropdownMenuItem
                        onClick={() => onToggleResourceStatus(node)}
                        className="flex items-center gap-2"
                      >
                        <Power className="h-4 w-4" />
                        {node.status === "active"
                          ? t("dashboard.departments.detail.disableResource")
                          : t("dashboard.departments.detail.enableResource")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onReEtl(String(node.id))}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {t("dashboard.departments.detail.reprocessDocument")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteResource(String(node.id))}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t("dashboard.departments.detail.deleteDocument")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </td>
          )}
        </tr>

        {/* Render children if expanded */}
        {hasChildren &&
          isExpanded &&
          node.children?.map((child, childIndex) =>
            renderTreeNode(child, childIndex)
          )}
      </React.Fragment>
    );
  };
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              {columnVisibility.index && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  <div className="text-center">{t("common.index")}</div>
                </th>
              )}
              {columnVisibility.name && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {t("dashboard.departments.detail.fileName")}
                </th>
              )}
              {columnVisibility.type && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {t("dashboard.departments.detail.documentType")}
                </th>
              )}
              {columnVisibility.size && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {t("dashboard.departments.detail.fileSize")}
                </th>
              )}
              {columnVisibility.description && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {t("dashboard.departments.detail.description")}
                </th>
              )}
              {columnVisibility.createdAt && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  {t("dashboard.departments.detail.uploadTime")}
                </th>
              )}
              {columnVisibility.status && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  <div className="text-center">
                    {t("dashboard.departments.detail.status")}
                  </div>
                </th>
              )}
              {columnVisibility.actions && (
                <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">
                  <div className="text-center">{t("common.actions")}</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {data.map((node, index) => renderTreeNode(node, index))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TreeTable;
