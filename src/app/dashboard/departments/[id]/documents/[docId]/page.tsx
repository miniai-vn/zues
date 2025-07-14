"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useChunk from "@/hooks/data/useChunk";
import useResource from "@/hooks/data/useResource";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { FileText, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import DocumentCartList from "./components/ChunksList";
import { CreateOrUpdateChunkModal } from "./components/CreateOrderUpdateChunk";
import ResourceHeader from "./components/Header";

export default function DocumentDetailsPage() {
  const params = useParams();
  const docId = params.docId as string;
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);

  const { chunks, createChunk, deleteChunk, updateChunk, refetchChunks } =
    useChunk({
      code: docId,
      search: debouncedSearch,
    });
  const { resourceDetail } = useResource({
    id: docId,
  });

  const handleRefresh = () => {
    refetchChunks();
  };

  return (
    <div className="flex flex-1 flex-col p-4 pt-0 h-screen">
      <div className="flex-shrink-0 mb-4">
        {resourceDetail && <ResourceHeader resource={resourceDetail} />}
      </div>

      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quản lý phân đoạn tài liệu
              </CardTitle>
              <CardDescription>
                Quản lý và tổ chức các phân đoạn của tài liệu một cách hiệu quả
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CreateOrUpdateChunkModal onChange={createChunk} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-shrink-0">
            <div className="flex justify-between gap-4 items-center">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm phân đoạn..."
                className="mr-4 w-full flex-1"
              />
              <Button
                onClick={handleRefresh}
                className="font-medium px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Tìm kiếm
              </Button>
            </div>
            <Separator className="mt-4" />
          </div>

          {/* Chunks Content */}
          <div className="flex-1 min-h-0 overflow-auto">
            {chunks?.length === 0 ? (
              <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center min-h-[400px]">
                <FileText className="h-16 w-16 text-gray-400" />
                <span className="text-lg text-muted-foreground">
                  Bạn chưa phân đoạn tài liệu nào
                </span>
                <span className="text-sm text-muted-foreground">
                  Tạo phân đoạn đầu tiên để bắt đầu
                </span>
                <CreateOrUpdateChunkModal onChange={createChunk} />
              </div>
            ) : (
              <DocumentCartList
                deleteChunk={deleteChunk}
                updateChunk={updateChunk}
                chunks={chunks ?? []}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
