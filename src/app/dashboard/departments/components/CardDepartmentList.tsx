import { Department } from "@/hooks/data/useDepartments";
import { CardDepartment } from "./CardDepartment";

interface CardDepartmentListProps {
  departments: Department[];
  selectedDepartments: string[];
  onSelectionChange: (id: string, selected: boolean) => void;
}

const CardDepartmentList = ({ departments }: CardDepartmentListProps) => {
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
