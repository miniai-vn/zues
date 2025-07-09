"use client";
import {
  flattenTreeData,
  transformToTreeData,
  TreeNode,
} from "@/components/dashboard/tables/tree-helpers";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useResource, { Resource } from "@/hooks/data/useResource";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ResourceFilters } from "./components/ResourceFilters";
import { DepartmentHeader } from "./components/DepartmentHeader";
import { ResourceTableView } from "./components/ResourceTableView";

const DepartmentDetailComponent = () => {
  const params = useParams();
  const departmentId = params.id as string;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "tree">("tree");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(
    new Set()
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  const [columnVisibility, setColumnVisibility] = useState({
    index: true,
    name: true,
    type: true,
    size: false,
    description: true,
    createdAt: true,
    status: true,
    actions: true,
  });

  useDebouncedValue(search, 500);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    materialItems,
    createResource,
    updateResource,
    refetchMaterialItems,
    deleteResource,
    createChunks,
    syncResource,
    isPendingCreateChunks,
    isPendingCreateResource,
    isPendingDeleteResource,
    isPendingFetchingItem,
    isPendingSyncResource,
    resourceDetail,
    reEtl,
  } = useResource({
    id: selectedResourceId || undefined,
    departmentId: departmentId,
    page,
    limit: pageSize,
    search,
  });

  useEffect(() => {
    if (materialItems) {
      setPage(materialItems.page || 1);
      setPageSize(materialItems.limit || 10);
    }
  }, [materialItems]);

  const onHandleUploadFile = async (
    file: File,
    description: string,
    type: string,
    parentId?: number
  ) => {
    try {
      await createResource({
        file,
        departmentId,
        description,
        parentId: parentId !== undefined ? String(parentId) : undefined,
        type: type,
      });
    } catch (error) {
      throw error;
    } finally {
      refetchMaterialItems();
    }
  };

  const handlePaginationChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    setPage(1);
  };

  // Filter the data based on search, status, and type
  const filteredData = useMemo(() => {
    if (!materialItems?.items) return [];

    return materialItems.items.filter((item: Resource) => {
      const matchesSearch =
        search === "" ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesType = typeFilter === "all" || item.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [materialItems?.items, search, statusFilter, typeFilter]);

  // Transform filtered data to tree structure
  const processedTreeData = useMemo(() => {
    if (!filteredData.length) return [];

    return transformToTreeData(filteredData, expandedNodes);
  }, [filteredData, expandedNodes]);

  // Update tree data when processed data changes
  useEffect(() => {
    setTreeData(processedTreeData);
  }, [processedTreeData]);

  // Handle tree node expansion
  const handleToggleExpansion = (nodeId: string | number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Get flattened tree data for display
  const flattenedTreeData = useMemo(() => {
    return flattenTreeData(treeData, expandedNodes);
  }, [treeData, expandedNodes]);

  // Handle view resource
  const handleViewResource = (resource: Resource) => {
    console.log("View resource:", resource);
    // Set the selected resource ID to fetch its details
    setSelectedResourceId(String(resource.id));
  };

  // Handle edit resource
  const handleEditResource = (resource: Resource, content?: string) => {
    if (resource.id && updateResource) {
      updateResource({
        id: String(resource.id),
        description: resource.description,
        content: content,
      });
    }
  };

  // Handle enable/disable resource
  const handleToggleResourceStatus = async (resource: Resource) => {
    try {
      const newStatus = resource.status === "active" ? "inactive" : "active";
      console.log("Toggle resource status:", resource.id, newStatus);
      refetchMaterialItems();
    } catch (error) {
      console.error("Error toggling resource status:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <Card className="flex flex-col flex-1 overflow-hidden">
        <DepartmentHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          onHandleUploadFile={onHandleUploadFile}
        />
        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <ResourceFilters
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              handleStatusFilter={handleStatusFilter}
              typeFilter={typeFilter}
              handleTypeFilter={handleTypeFilter}
              onRefetch={refetchMaterialItems}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              onCreateResource={() => {}}
            />
            <Separator className="mt-4" />
          </div>

          {/* Resource Table View */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <ResourceTableView
              viewMode={viewMode}
              flattenedTreeData={flattenedTreeData}
              onToggleExpansion={handleToggleExpansion}
              filteredData={filteredData}
              page={page}
              pageSize={pageSize}
              totalCount={materialItems?.totalCount || 0}
              onPaginationChange={handlePaginationChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={
                isPendingFetchingItem ||
                isPendingCreateResource ||
                isPendingDeleteResource
              }
              columnVisibility={columnVisibility}
              onCreateChunks={createChunks}
              onSyncResource={syncResource}
              onDeleteResource={deleteResource}
              onReEtl={reEtl}
              onViewResource={handleViewResource}
              onEditResource={handleEditResource}
              onToggleResourceStatus={handleToggleResourceStatus}
              onHandleUploadFile={onHandleUploadFile}
              isPendingCreateChunks={isPendingCreateChunks}
              isPendingSyncResource={isPendingSyncResource}
              resourceDetail={resourceDetail}
              selectedResourceId={selectedResourceId}
              // onUploadForResource={onHandleUploadFile}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetailComponent;
