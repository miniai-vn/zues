// DocumentCard.jsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import { Calendar, Calendar1, Trash2 } from "lucide-react";
import { CreateOrUpdateChunkModal } from "./CreateOrderUpdateChunk";
import useChunk, { Chunk } from "@/hooks/data/useChunk";
import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
interface DocumentCardProps {
  chunk: Chunk;
  updateChunk: (chunk: Chunk) => void;
  deleteChunk: (id: string) => void;
}
const ChunkCard = ({ chunk, updateChunk, deleteChunk }: DocumentCardProps) => {
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
          <CreateOrUpdateChunkModal onChange={updateChunk} chunk={chunk} />
        </div>
      </CardHeader>
      <CardContent className="p-0 h-24 mt-4">
        <p className="text-gray-800 text-xs line-clamp-4">{chunk.text}</p>
      </CardContent>
      <CardFooter className="p-0  border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-xs">
              {dayjs(chunk.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <AlertDialogComponent
            description="Bạn có chắc chắn muốn xóa đoạn văn này không?"
            title="Xóa đoạn văn"
            onConfirm={() => deleteChunk(chunk.id as string)}
            onCancel={() => {}}
            // eslint-disable-next-line react/no-children-prop
            children={
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Trash2 className="h-4 w-4 text-gray-400" />
              </Button>
            }
          ></AlertDialogComponent>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChunkCard;
