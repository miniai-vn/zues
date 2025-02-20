"use client";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useChunk from "@/hooks/data/useChunk";
import { useSearchParams } from "next/navigation";

interface ChunkProps {
  params: {
    id: string;
  };
}
type Chunk = {
  id: string;
  text: string;
};

const MaterialChunk = ({ params: initialParams }: ChunkProps) => {
  const [params, setParams] = useState<ChunkProps["params"] | null>(null);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    (async () => {
      const resolvedParams = await initialParams;
      setParams(resolvedParams);
    })();
  }, [initialParams]);

  const { chunks, isFetchingChunk } = useChunk({
    id: params?.id || "",
    type,
  });

  if (isFetchingChunk) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <div className="px-4 flex flex-end gap-4 py-4">
        <Button className="px-4 ">Xác nhận</Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {chunks?.map((chunk: Chunk, index: number) => {
          return <Textarea key={index} className="h-52" value={chunk.text} />;
        })}
      </div>
    </div>
  );
};

export default MaterialChunk;
