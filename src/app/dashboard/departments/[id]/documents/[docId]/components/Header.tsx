import { useState } from "react";
import {
  ChevronLeft,
  FileSpreadsheet,
  MoreHorizontal,
  Layers,
  Settings,
  User,
  Bell,
  HelpCircle,
  PanelRight,
} from "lucide-react";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Resource } from "@/hooks/data/useResource";
import { getFileIcon } from "../../../page";
import { get } from "http";
interface ResourceHeaderProps {
  resource: Resource;
}
const ResourceHeader = ({ resource }: ResourceHeaderProps) => {
  return (
    <div className="flex items-center h-12 px-2 border-b bg-white w-full">
      {/* Left section: Back button and file icon/name */}
      <div className="flex items-center">
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <div className="flex items-center">
          {getFileIcon(resource?.extra?.extension)}
          <span className="font-medium ml-2 text-sm">{resource.name}</span>
        </div>
      </div>

      <div className="flex-grow"></div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="text-sm font-medium bg-white border-gray-300 text-gray-700 rounded-md flex items-center gap-1 h-8 px-3"
        >
          <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
          Có sẵn
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Cài đặt phân đoạn</DropdownMenuItem>
            <DropdownMenuItem>Train AI</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ResourceHeader;
