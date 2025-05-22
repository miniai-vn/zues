// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Department } from "@/hooks/data/useDepartments";
import { useRouter } from "next/navigation";
interface DepartmentHeaderProps {
  dept: Department; // Use your Dept type here
}

const DepartmentHeader = ({ dept }: DepartmentHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex items-center px-2 border-b w-full">
      <div className="flex flex-col">
        <span className="font-semibold text-base">{dept.name}</span>
        <span className="text-xs text-gray-500">{dept.description}</span>
      </div>
      <div className="flex-grow"></div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.push(`/dashboard/channels`);
          }}
        >
          Liên kết đến nền tảng
        </Button>
      </div>
    </div>
  );
};

export default DepartmentHeader;
