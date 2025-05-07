import { Department } from "@/hooks/data/useDepartments";
import { CardDepartment } from "./CardDepartment";
import { Skeleton } from "@/components/ui/skeleton";

interface CardDepartmentListProps {
  departments: Department[];
  selectedDepartments: string[];
  onSelectionChange: (id: string, selected: boolean) => void;
  isLoading?: boolean;
}

const CardDepartmentSkeleton = () => (
  <div className="w-[calc(33.333%-16px)] min-w-[300px]">
    <div className="border rounded-lg p-4 h-[220px] flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-6" />
      <div className="mt-auto">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

const CardDepartmentList = ({
  departments,
  isLoading = false,
}: CardDepartmentListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <CardDepartmentSkeleton key={index} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {departments.map((department) => (
        <div
          key={department.id}
          className="w-[calc(33.333%-16px)] min-w-[300px]"
        >
          <CardDepartment department={department} />
        </div>
      ))}
    </div>
  );
};

export default CardDepartmentList;
