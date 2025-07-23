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
import { useSocket } from "@/hooks/useSocket";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DepartmentHeader } from "./components/DepartmentHeader";
import { ResourceFilters } from "./components/ResourceFilters";
import { ResourceTableView } from "./components/ResourceTableView";
import { useRouter } from "next/navigation";
const DepartmentDetailComponent = () => {
  const params = useParams();
  const departmentId = params.id as string;
  const router = useRouter();
  const { socket } = useSocket();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "tree">("table");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string | number>>(
    new Set()
  );
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(
    null
  );

  const [columnVisibility, setColumnVisibility] = useState({
    index: true,
    name: true,
    type: true,
    size: false,
    isActive: true,
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
    if (socket) {
      console.log("Setting up socket listener for resource updates");
      socket.on("resourceStatusUpdated", (data: Resource) => {
        console.log("Resource updated:", data);
        refetchMaterialItems();
      });
    }
    return () => {
      if (socket) {
        socket.off("resourceStatusUpdated");
      }
    };
  }, [socket, refetchMaterialItems]);

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

  const handleViewChunk = (resource: Resource) => {
    if (departmentId && resource.code) {
      // Navigate to the document detail page with department context
      router.push(
        `/dashboard/departments/${departmentId}/documents/${resource.code}`
      );
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
              handleViewChunk={handleViewChunk}
              viewMode={viewMode}
              flattenedTreeData={flattenedTreeData}
              onToggleExpansion={handleToggleExpansion}
              filteredData={filteredData}
              page={page}
              pageSize={pageSize}
              totalCount={materialItems?.total || 0}
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
              onViewResource={handleViewChunk}
              onEditResource={handleEditResource}
              onToggleResourceStatus={handleToggleResourceStatus}
              onHandleUploadFile={onHandleUploadFile}
              isPendingCreateChunks={isPendingCreateChunks}
              isPendingSyncResource={isPendingSyncResource}
              resourceDetail={resourceDetail}
              selectedResourceId={selectedResourceId}
              departmentId={departmentId}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepartmentDetailComponent;
