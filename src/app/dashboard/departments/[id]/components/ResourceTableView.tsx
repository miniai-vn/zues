"use client";

import { DataTable } from "@/components/dashboard/tables/data-table";
import { TreeNode } from "@/components/dashboard/tables/tree-helpers";
import TreeTable from "@/components/dashboard/tables/tree-table";
import { Resource } from "@/hooks/data/useResource";
import { useResourceColumns } from "./ResourceColumns";

interface ResourceTableViewProps {
  viewMode: "table" | "tree";
  // Tree table props
  flattenedTreeData: TreeNode[];
  onToggleExpansion: (nodeId: string | number) => void;
  // Data table props
  filteredData: Resource[];
  page: number;
  pageSize: number;
  totalCount: number;
  onPaginationChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
  isLoading: boolean;
  // Shared props
  columnVisibility: Record<string, boolean>;
  onCreateChunks: (id: string) => void;
  onSyncResource: (id: string) => void;
  onDeleteResource: (id: string) => void;
  onReEtl: (id: string) => void;
  onUploadForResource?: (resource: Resource) => void;
  onViewResource: (resource: Resource) => void;
  onEditResource?: (resource: Resource, content?: string) => void;
  onToggleResourceStatus: (resource: Resource) => void;
  handleViewChunk: (resource: Resource) => void;
  onHandleUploadFile: (
    file: File,
    description: string,
    type: string,
    parentId?: number
  ) => Promise<void>;
  isPendingCreateChunks: boolean;
  isPendingSyncResource: boolean;
  resourceDetail?: Resource;
  selectedResourceId?: string | null;
  departmentId?: string;
}

export const ResourceTableView = ({
  viewMode,
  flattenedTreeData,
  onToggleExpansion,
  filteredData,
  page,
  pageSize,
  totalCount,
  onPaginationChange,
  onPageSizeChange,
  isLoading,
  columnVisibility,
  onCreateChunks,
  onSyncResource,
  onDeleteResource,
  onReEtl,
  onViewResource,
  onToggleResourceStatus,
  onHandleUploadFile,
  isPendingCreateChunks,
  isPendingSyncResource,
  departmentId,
  handleViewChunk,
}: ResourceTableViewProps) => {
  const columns = useResourceColumns({
    isPendingCreateChunks,
    isPendingSyncResource,
    onHandleUploadFile,
    onViewResource,
    onToggleResourceStatus,
    onReEtl,
    onDeleteResource,
  });

  // Filter visible columns based on columnVisibility state
  const visibleColumns = columns.filter((column) => {
    const columnId =
      column.id || (column as unknown as { accessorKey: string }).accessorKey;
    return columnVisibility[columnId as keyof typeof columnVisibility];
  });

  if (viewMode === "tree") {
    return (
      <TreeTable
        handleViewChunk={handleViewChunk}
        data={flattenedTreeData}
        departmentId={departmentId}
        onToggleExpansion={onToggleExpansion}
        onCreateChunks={onCreateChunks}
        onSyncResource={onSyncResource}
        onDeleteResource={onDeleteResource}
        onReEtl={onReEtl}
        onUploadForResource={() => {}}
        onViewResource={(treeNode) => {
          onViewResource(treeNode as unknown as Resource);
        }}
        onToggleResourceStatus={(treeNode) => {
          onToggleResourceStatus(treeNode as unknown as Resource);
        }}
        onHandleUploadFile={onHandleUploadFile}
        isPendingCreateChunks={isPendingCreateChunks}
        isPendingSyncResource={isPendingSyncResource}
        columnVisibility={columnVisibility}
      />
    );
  }
  return (
    <DataTable
      columns={visibleColumns}
      data={filteredData || []}
      pagination={{
        page: page,
        limit: pageSize,
        total: totalCount,
      }}
      onPaginationChange={onPaginationChange}
      onPageSizeChange={onPageSizeChange}
      isLoading={isLoading}
    />
  );
};
