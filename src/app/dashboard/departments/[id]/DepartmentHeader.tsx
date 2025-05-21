import { File, FileText, Image, MoreHorizontal } from "lucide-react";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Resource } from "@/hooks/data/useResource";
import { Department } from "@/hooks/data/useDepartments";
const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <FileText className="h-6 w-6 text-red-500" />;
    case "csv":
    case "xlsx":
    case "xls":
      return <FileText className="h-6 w-6 text-green-500" />;
    case "doc":
    case "docx":
    case "txt":
      return <FileText className="h-6 w-6 text-blue-500" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return <Image className="h-6 w-6 text-purple-500" />;
    default:
      return <File className="h-6 w-6 text-gray-500" />;
  }
};
interface DepartmentHeaderProps {
  dept: Department; // Use your Dept type here
}

const DepartmentHeader = ({ dept }: DepartmentHeaderProps) => {
  return (
    <div className="flex items-center h-12 px-2 border-b bg-white w-full">
      {/* Left section: Department name and description */}
      <div className="flex flex-col">
        <span className="font-semibold text-base">{dept.name}</span>
        <span className="text-xs text-gray-500">{dept.description}</span>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="text-sm font-medium bg-white border-gray-300 text-gray-700 rounded-md flex items-center gap-1 h-8 px-3"
        >
          Liên kết đến nền tảng chat
        </Button>

     
      </div>
    </div>
  );
};

export default DepartmentHeader;
