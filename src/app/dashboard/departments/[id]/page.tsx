"use client";
import ActionPopover from "@/components/dashboard/popever";
import Tables from "@/components/dashboard/tables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import useResource, { MaterialItem } from "@/hooks/data/useResource";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const DepartmentDetailComponent = () => {
  const params = useParams();
  const router = useRouter();
  const departmentId = params.id as string;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    materialItems,
    createResource,
    refetchMaterialItems,
    deleteResource,
    createChunks,
  } = useResource({
    id: departmentId,
  });

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

  const columns: ColumnDef<MaterialItem>[] = [
    {
      id: "index",
      header: "STT",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">{row.index + 1}</div>
      ),
      size: 60, // Small fixed width for index numbers
    },
    {
      accessorKey: "name",
      header: "Tên tệp",
      cell: (row) => (
        <div className="break-all line-clamp-2">{row.row.original.name}</div>
      ),
      size: 250, // Larger width for file names
    },
    {
      accessorKey: "type",
      header: "Định dạng",
      cell: (row) => (
        <div className="break-all line-clamp-1">{row.row.original?.type}</div>
      ),
      size: 100, // Medium width for file types
    },
    {
      accessorKey: "createdAt",
      header: "Thời gian tải lên",
      cell: (row) => (
        <div className="whitespace-nowrap">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
      size: 150, // Fixed width for dates
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
            {row.row.original.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      size: 100, // Fixed width for status
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: (row) => {
        const documentId = row.row.original.id as unknown as string;
        const isActive = row.row.original.status === "active";

        return (
          <div className="flex items-center justify-center w-full gap-3">
            <div className="flex items-center">
              <Switch
                id={`status-switch-${documentId}`}
                checked={isActive}
                onCheckedChange={(checked) => {
                  createChunks(documentId);
                  // Handle the status change here
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
      size: 140, // Fixed width for actions column
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
      <Tables
        columns={columns}
        data={materialItems ?? []}
        page={page}
        onChange={(page) => {
          setPage(page);
        }}
      />
    </div>
  );
};

export default DepartmentDetailComponent;
