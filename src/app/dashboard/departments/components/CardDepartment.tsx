"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useDepartments, { Department } from "@/hooks/data/useDepartments";

import { Calendar, Eye, Folder, MoreVertical, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardDepartmentProps {
  department: Department;
}

import { AlertDialogComponent } from "@/components/dashboard/alert-modal";
import dayjs from "dayjs";
import CreateOrUpdateDeptDialog from "./modal/CreateDeptModal";

export function CardDepartment({ department }: CardDepartmentProps) {
  const { deleteDepartment, updateDepartment } = useDepartments({});
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest("[role='menuitem']") ||
      (e.target as HTMLElement).closest("[data-radix-collection-item]")
    ) {
      e.stopPropagation();
      return;
    }

    router.push(`/dashboard/departments/${department.id}`);
  };

  const handleViewDepartment = () => {
    router.push(`/dashboard/departments/${department.id}`);
  };

  return (
    <TooltipProvider>
      <Card
        className="w-full max-w-md max-h-80 border-2 border-dashed border-muted hover:border-primary/50 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group flex flex-col"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0 flex-shrink-0">
          <div className="flex items-center p-4 pb-2">
            <div className="mr-3 p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="font-semibold text-lg truncate text-foreground group-hover:text-primary transition-colors">
                    {department.name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{department.name}</p>
                </TooltipContent>
              </Tooltip>
              <Badge variant="secondary" className="mt-1 text-xs">
                Department
              </Badge>
            </div>
            <div
              className="flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleViewDepartment}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Department
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <CreateOrUpdateDeptDialog
                      onChange={updateDepartment}
                      department={department}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <AlertDialogComponent
                      description="This action cannot be undone. This will permanently delete the department and all its associated data."
                      title="Delete Department"
                      onConfirm={() =>
                        deleteDepartment(department.id as string)
                      }
                      onCancel={() => {}}
                    >
                      <div className="flex items-center w-full cursor-pointer text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Department
                      </div>
                    </AlertDialogComponent>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <Separator className="mx-4" />

        <CardContent className="px-4 py-3 flex-1 overflow-hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                {department.description || "No description available"}
              </p>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{department.description || "No description available"}</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>

        <Separator className="mx-4" />

        <CardFooter className="px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Created {dayjs(department.createdAt).format("MMM DD, YYYY")}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDepartment();
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Department</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
