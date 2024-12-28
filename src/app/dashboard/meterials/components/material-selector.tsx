import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaterials } from "@/hooks/data/useMaterials";

interface MaterialSelectorProps {
  onChange?: (value: string) => void;
  className?: string;
  value: string;
}
export function MaterialSelector({
  value,
  onChange,
  className,
}: MaterialSelectorProps) {
  const { materials } = useMaterials();

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select material" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {materials?.map((material: any) => (
            <SelectItem key={material.id} value={material.id}>
              {material.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
