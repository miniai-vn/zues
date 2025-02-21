"use client";
import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import Tables from "@/components/dashboard/tables";
import { LoadingSpinner } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useKnowledge, { MaterialItem } from "@/hooks/data/useKnowledge";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FileComponent = () => {
  const router = useRouter();
  const {
    materialItems,
    handleUploadFile,
    refetchMaterialItems,
    syncKnowLedgeToVector,
    isSyncKnowledge,
    deleteFileKnowledge,
  } = useKnowledge({
    type: "file",
  });

  const [isFetching, setIsFetching] = useState(false);

  const onHandleUploadFile = async (file: File) => {
    try {
      setIsFetching(true);
      await handleUploadFile(file);
    } catch (error) {
      throw error;
    } finally {
      setIsFetching(false);
      refetchMaterialItems();
    }
  };

  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original?.name}
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type File",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original.type}
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original.size}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Update At",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {dayjs(row.row.original.updatedAt).format("DD/MM/YYYY")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Badge
            onClick={() => {
              router.push(`/dashboard/chunks/${row.row.original.id}?type=file`);
            }}
          >
            Update
          </Badge>
          <Badge
            onClick={() => {
              syncKnowLedgeToVector(Number(row.row.original.id));
            }}
          >
            {isSyncKnowledge ? <LoadingSpinner /> : "Sync"}
          </Badge>
          <AlertDialogComponent
            description="
            Do you want to delete this file?"
            title="Confirm delete"
            onConfirm={() =>
              row.row.original.id && deleteFileKnowledge(row.row.original.id)
            }
            onCancel={() => {}}
          />
        </div>
      ),
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
        />
        <Button>Tìm kiếm</Button>
      </div>
      {isFetching ? (
        <LoadingSpinner />
      ) : (
        <Tables columns={columns} data={materialItems ?? []} />
      )}
    </div>
  );
};

export default FileComponent;
