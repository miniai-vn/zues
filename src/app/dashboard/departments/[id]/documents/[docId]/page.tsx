"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useChunk from "@/hooks/data/useChunk";
import { Filter, SortDesc } from "lucide-react";
import { useParams } from "next/navigation";
import DocumentCartList from "./components/ChunksList";
import { PageHeader } from "@/components/dashboard/common/page-header";

export default function DocumentDetailsPage() {
  const params = useParams();
  const docId = params.docId as string;

  const { chunks } = useChunk({
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
            href: "/dashboard/departments/documents",
          },
          {
            label: "Phân đoạn",
            isCurrentPage: true,
          },
        ]}
      />
      <div className="flex justify-between gap-4 items-center">
        <Input
          placeholder="Search by question"
          className="mr-4 w-full flex-1"
        />

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1" />
          Filter
        </Button>

        <Button variant="outline" size="sm">
          <SortDesc className="h-4 w-4 mr-1" />
          Sort
        </Button>
      </div>

      <DocumentCartList chunks={chunks ?? []} />
    </div>
  );
}
