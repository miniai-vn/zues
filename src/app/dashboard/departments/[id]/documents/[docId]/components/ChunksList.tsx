import { Chunk } from "@/hooks/data/useChunk";
import DocumentCard from "./ChunkCart";

// Define item structure

// Define props for the component
interface DocumentCartListProps {
  chunks: Chunk[];
}

export default function DocumentCartList({ chunks }: DocumentCartListProps) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chunks.map((chunk) => (
          <div key={chunk.id} className="relative">
            <DocumentCard chunk={chunk} />
          </div>
        ))}
      </div>
    </div>
  );
}
