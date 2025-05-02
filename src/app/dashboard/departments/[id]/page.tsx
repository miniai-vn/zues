"use client";
import { PageHeader } from "@/components/dashboard/common/page-header";
import ActionPopover from "@/components/dashboard/popever";
import { DataTable } from "@/components/dashboard/tables/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useResource, { Resource } from "@/hooks/data/useResource";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateOrUpdateResource } from "./documents/components/CreateOrUpdateResource";
import { Search } from "lucide-react";

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
    createChunks,
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
      header: () => <div className="text-center">STT</div>, // Add this to center the header
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
      header: () => <div className="text-center">Hành động</div>,
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
                  createChunks(documentId);
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
              onArchive={() => syncResource(documentId)}
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
      <PageHeader
        backButtonHref="/dashboard/departments"
        breadcrumbs={[
          {
            label: "Quản lý phòng ban",
            href: "/dashboard/departments",
          },
          {
            label: "Quản lý tài liệu",
            isCurrentPage: true,
          },
        ]}
      />
      {/* <Input
        placeholder="Vui lòng tải lên tệp định dạng PDF, DOC, XLS, TXT, CSV (tối đa 10MB/tệp)"
        type="file"
        onChange={(e) =>
          e.target.files && onHandleUploadFile(e.target.files[0])
        }
        className="w-full h-14 center"
      /> */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm tài tên tài liệu"
          className="mr-4 w-full flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <CreateOrUpdateResource
            onHandleUploadFile={onHandleUploadFile}
            resource={undefined}
          />
          <Button
            onClick={() => refetchMaterialItems()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Search />
            Tìm kiếm
          </Button>
        </div>
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
