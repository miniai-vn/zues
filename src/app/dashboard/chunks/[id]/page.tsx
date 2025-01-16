"use client";
import { LoadingSpinner } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useMaterialItems from "@/hooks/data/useMaterialItems";

interface ChunkProps {
  params: {
    id: string;
  };
}
type Chunk = {
  id: string;
  text: string;
};
const MaterialChunk = ({ params: { id } }: ChunkProps) => {
  const { chunks, isFetchingChunk } = useMaterialItems({
    id,
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
