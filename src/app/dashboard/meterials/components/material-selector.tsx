"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMaterials } from "@/hooks/data/useMaterials";
import { useState } from "react";

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
  const [selectedMaterialName, setSelectedMaterialName] = useState<
    string | null
  >();
  return (
    <>
      <Select
        onValueChange={(value) => {
          const selectedMaterial = materials?.find(
            (material) => material.id === Number(value)
          );
          if (selectedMaterial)
            setSelectedMaterialName(
              selectedMaterial?.name ?? "Select material"
            );
          onChange?.(value);
        }}
        value={value}
      >
        <SelectTrigger className={className}>
          <SelectValue placeholder="Select material">
            {selectedMaterialName || ""}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {materials?.map((material) => (
              <SelectItem key={material.id} value={String(material.id) ?? ""}>
                {material.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
