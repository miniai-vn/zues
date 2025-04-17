// DocumentCard.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Trash2 } from "lucide-react";
import { CreateOrUpdateChunkModal } from "./CreateOrderUpdateChunk";

interface DocumentCardProps {
  title?: string;
  date?: string;
  time?: string;
  content?: string;
  description?: string;
  isCompleted?: boolean;
  isSelected?: boolean;
  onCompletedChange?: (completed: boolean) => void;
}

const DocumentCard = ({
  title = "Đoạn văn 1",
  date = "12/08/2025",
  time = "14:30:06",
  content = "Công Nghệ Theo Áp Dụng Trong Quản Lí Nhân...",
  description = "Theo dõi lượng hàng hóa bán ra tăng hay giảm. Lượng hàng hoá bán ra không chỉ phản ánh tình hình kinh doanh của doanh nghiệp mà còn phản á...",
  isSelected = false,
}: DocumentCardProps) => {
  return (
    <Card
      className={`w-full max-w-md border shadow-sm transition-all p-4 text-base
      ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row w-full items-center justify-between p-0">
        <div className="flex flex-col">
          <CardTitle className="text-blue-700 text-base font-medium ">
            {title}
          </CardTitle>
          <div className="flex items-center text-gray-500 text-base mt-1">
            <span>{time}</span>
            <div className="flex items-center ml-6">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="popover-trigger">
          <CreateOrUpdateChunkModal onChange={() => {}} chunk={{}} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <h3 className="text-blue-700 font-medium mt-4 text-base line-clamp-1">
          {content}
        </h3>
        <p className="text-gray-800 text-base line-clamp-3">{description}</p>
        <div className="flex justify-end mt-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
