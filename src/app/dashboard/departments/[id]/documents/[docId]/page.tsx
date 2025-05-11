"use client";

import { PageHeader } from "@/components/dashboard/common/page-header";
import { Input } from "@/components/ui/input";
import useChunk from "@/hooks/data/useChunk";
import useResource from "@/hooks/data/useResource";
import { useParams } from "next/navigation";
import DocumentCartList from "./components/ChunksList";
import { CreateOrUpdateChunkModal } from "./components/CreateOrderUpdateChunk";
import ResourceHeader from "./components/Header";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useState } from "react";

export default function DocumentDetailsPage() {
  const params = useParams();
  const docId = params.docId as string;
  const departmentId = params.id as string;
  const [search, setSearch] = useState("");
  useDebouncedValue(search, 500);
  const { chunks, createChunk, deleteChunk, updateChunk, refetchChunk } =
    useChunk({
      id: docId,
    });

  const { resourceDetail } = useResource({
    id: docId,
  });
  return (
    <div className="flex flex-col space-y-6 p-6">
      <PageHeader
        showBackButton={true}
        breadcrumbs={[
          {
            label: "Quản lý nhóm tài liệu",
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
      {resourceDetail && <ResourceHeader resource={resourceDetail} />}
      <div className="flex justify-between gap-4 items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm...."
          className="mr-4 w-full flex-1"
        />
        <Button
          onClick={() => refetchChunk()}
          className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Search />
          Tìm kiếm
        </Button>
        <CreateOrUpdateChunkModal onChange={createChunk} />
      </div>
      {chunks?.length === 0 && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
          <img
            src="/logo.png"
            alt="Không có nhóm tài liệu"
            className="w-32 h-32 mb-4 opacity-70"
          />
          <span className="text-lg text-muted-foreground">
            Bạn chưa phân đoạn tài liệu nào
          </span>
        </div>
      )}
      <DocumentCartList
        deleteChunk={deleteChunk}
        updateChunk={updateChunk}
        chunks={chunks ?? []}
      />
    </div>
  );
}
