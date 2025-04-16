"use client";
import Tables from "@/components/dashboard/tables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import useResource, { MaterialItem } from "@/hooks/data/useResource";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis, FileSliders, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

const DepartmentDetailComponent = () => {
  const params = useParams();
  const departmentId = params.id as string;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { materialItems, handleUploadFile, refetchMaterialItems } = useResource(
    {
      id: departmentId,
    }
  );

  const onHandleUploadFile = async (file: File) => {
    try {
      await handleUploadFile(file);
    } catch (error) {
      throw error;
    } finally {
      refetchMaterialItems();
    }
  };

  const columns: ColumnDef<MaterialItem>[] = [
    {
      accessorKey: "type",
      header: "Định dạng",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original?.name}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên tệp",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {row.row.original.type}
        </div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: "Thời gian tải lên",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          {dayjs(row.row.original.createdAt).format("DD/MM/YYYY HH:mm")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: (row) => (
        <div className="break-all line-clamp-2 w-1/2">
          <Switch id="airplane-mode" />
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <Popover>
          <PopoverTrigger>
            <Ellipsis></Ellipsis>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-y-4 w-48">
            <div className="flex items-center  cursor-pointer">
              <FileSliders /> Cài đặt phân khúc
            </div>
            <div className="flex items-center hover:bg-red-100 cursor-pointer ">
              <Trash2 /> Xóa
            </div>
          </PopoverContent>
        </Popover>
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
