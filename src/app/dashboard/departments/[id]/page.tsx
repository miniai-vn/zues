"use client";
import ActionPopover from "@/components/dashboard/popever";
import { DataTable } from "@/components/dashboard/tables/data-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import useResource, { Resource } from "@/hooks/data/useResource";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const DepartmentDetailComponent = () => {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.id as string;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    materialItems,
    createResource,
    refetchMaterialItems,
    deleteResource,
    syncResource,
  } = useResource({
    id: departmentId,
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

  const onHandleUploadFile = async (file: File) => {
    try {
      await createResource({
        file,
        departmentId,
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

  const columns: ColumnDef<Resource>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">{row.index + 1}</div>
      ),
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Tên tệp",
      cell: (row) => (
        <div className="break-all line-clamp-2">{row.row.original.name}</div>
      ),
      size: 250,
    },
    {
      accessorKey: "type",
      header: "Định dạng",
      cell: (row) => (
        <div className="break-all line-clamp-1">{row.row.original?.type}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian tải lên",
      cell: (row) => (
        <div className="whitespace-nowrap">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Trạng thái</div>,
      cell: (row) => (
        <div className="flex items-center justify-center w-full">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              row.row.original.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.row.original.status}
          </span>
        </div>
      ),
      size: 100,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: (row) => {
        const documentId = row.row.original.id as unknown as string;
        const isActive = row.row.original.isActive === true;

        return (
          <div className="flex items-center justify-center w-full gap-3">
            <div className="flex items-center">
              <Switch
                id={`status-switch-${documentId}`}
                checked={isActive}
                onCheckedChange={(checked) => {
                  syncResource(documentId);
                  console.log(
                    `Document ${documentId} status changed to ${
                      checked ? "active" : "inactive"
                    }`
                  );
                }}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <ActionPopover
              onDelete={() => deleteResource(documentId)}
              onConfigure={() => {
                router.push(
                  `/dashboard/departments/${departmentId}/documents/${documentId}`
                );
              }}
            />
          </div>
        );
      },
      size: 140,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-2 py-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Quản lý phòng ban</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Quản lý tài liệu</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Input
        placeholder="Vui lòng tải lên tệp định dạng PDF, DOC, XLS, TXT, CSV (tối đa 10MB/tệp)"
        type="file"
        onChange={(e) =>
          e.target.files && onHandleUploadFile(e.target.files[0])
        }
        className="w-full h-14 center"
      />
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm tài tên tài liệu"
          className="mr-4 w-full flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => refetchMaterialItems()}>Tìm kiếm</Button>
      </div>
      <DataTable
        columns={columns}
        data={materialItems?.items || []}
        pagination={{
          page: page,
          limit: pageSize,
          total: materialItems?.totalCount || 0,
        }}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={!materialItems}
      />
    </div>
  );
};

export default DepartmentDetailComponent;
