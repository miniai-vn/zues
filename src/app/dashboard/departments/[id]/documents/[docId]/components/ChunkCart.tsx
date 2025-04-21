// DocumentCard.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dayjs from "dayjs";
import { Calendar1, Trash2 } from "lucide-react";
import { CreateOrUpdateChunkModal } from "./CreateOrderUpdateChunk";
import { Chunk } from "@/hooks/data/useChunk";
interface DocumentCardProps {
  chunk: Chunk;
}
const DocumentCard = ({ chunk }: DocumentCardProps) => {
  return (
    <Card
      className={`w-full max-w-md border shadow-sm transition-all p-4 text-base
      `}
    >
      <CardHeader className="space-y-0 flex flex-row w-full items-center justify-between p-0">
        <div className="flex flex-col">
          <CardTitle className="text-blue-700 text-base font-medium ">
            Đoạn văn bản: {chunk.id}
          </CardTitle>
        </div>
        <div className="popover-trigger">
          <CreateOrUpdateChunkModal onChange={() => {}} chunk={chunk} />
        </div>
      </CardHeader>
      <CardContent className="p-0 h-24 mt-4">
        <p className="text-gray-800 text-xs line-clamp-4">{chunk.text}</p>
        <div className="flex justify-between mt-2">
          <button className="text-gray-400 text-xs hover:text-gray-600 flex items-center justify-center gap-1">
            <Calendar1 className="h-4 w-4" />

            <span>{dayjs(chunk.createdAt).format("DD/MM/YYYY")}</span>
          </button>
          <Button variant="ghost" size="sm" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
