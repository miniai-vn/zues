import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDepartments from "@/hooks/data/useDepartments";
import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import CreateDeptModal from "./CreateDeptModal";

export function CardCreateDepartment() {
  const { createDepartment } = useDepartments();

  return (
    <Card>
      <CardHeader className="h-[72px] overflow-hidden">
        <CardTitle className={cn("flex items-center")}>
          <CreateDeptModal onChange={createDepartment} />
          <p className="ml-2">Tạo tài liệu mới</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[80px] overflow-hidden"></CardContent>
      <CardFooter className="flex justify-between">
        <User2 />
      </CardFooter>
    </Card>
  );
}
