import { Chunk } from "@/hooks/data/useChunk";
import ChunkCard from "./ChunkCard";

// Define props for the component
interface DocumentCartListProps {
  chunks: Chunk[];
  deleteChunk: (id: string) => void;
  updateChunk: (chunk: Chunk) => void;
}

export default function DocumentCartList({
  chunks,
  deleteChunk,
  updateChunk,
}: DocumentCartListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chunks.map((chunk, index) => (
          <div key={chunk.pk || `chunk-${index}`} className="relative">
            <ChunkCard
              deleteChunk={deleteChunk}
              updateChunk={updateChunk}
              chunk={chunk}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
