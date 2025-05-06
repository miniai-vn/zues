"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { Input } from "@/components/ui/input";
import useChunk from "@/hooks/data/useChunk";
import { useParams } from "next/navigation";
import DocumentCartList from "./components/ChunksList";
import { CreateOrUpdateChunkModal } from "./components/CreateOrderUpdateChunk";

export default function DocumentDetailsPage() {
  const params = useParams();
  const docId = params.docId as string;
  const departmentId = params.id as string;


  const { chunks, createChunk, deleteChunk, updateChunk } = useChunk({
    id: docId,
  });
  return (
    <div className="flex flex-col space-y-6 p-6">
      <PageHeader
        backButtonHref="/dashboard/departments"
        breadcrumbs={[
          {
            label: "Quản lý phòng ban",
            href: "/dashboard/departments",
          },
          {
            label: "Quản lý tài liệu",
            href: "/dashboard/departments/" + departmentId,
          },
          {
            label: "Phân đoạn",
            isCurrentPage: true,
          },
        ]}
      />
      <div className="flex justify-between gap-4 items-center">
        <Input placeholder="Tìm kiếm...." className="mr-4 w-full flex-1" />
        <CreateOrUpdateChunkModal onChange={createChunk} />
      </div>

      <DocumentCartList
        deleteChunk={deleteChunk}
        updateChunk={updateChunk}
        chunks={chunks ?? []}
      />
    </div>
  );
}
