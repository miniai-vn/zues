import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Update SelectorItem to use ID as value
export interface SelectorItem {
  value: string | number; // Allow both string and number IDs
  label: string;
}

export interface SelectorGroup {
  label: string;
  items: SelectorItem[];
}

interface SelectorProps {
  items: SelectorItem[] | SelectorGroup[];
  onChange?: (value: string | number) => void; // Update onChange to handle IDs
  defaultValue?: string | number; // Allow ID as default value
  value?: string | number | null; // Allow ID as value
  className?: string;
  placeholder?: string;
}

export function Selector({
  items,
  onChange,
  defaultValue,
  value,
  className,
  placeholder = "Select an option",
}: SelectorProps) {
  // Helper function to check if the items array contains groups
  const hasGroups = (
    items: SelectorItem[] | SelectorGroup[]
  ): items is SelectorGroup[] => {
    return items.length > 0 && "items" in items[0];
  };

  return (
    <Select
      onValueChange={onChange}
      defaultValue={defaultValue?.toString()} // Convert ID to string for Select
      value={value?.toString()} // Convert ID to string for Select
    >
      <SelectTrigger className={className || "w-[180px]"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {hasGroups(items)
          ? items.map((group, groupIndex) => (
              <SelectGroup key={groupIndex}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.items.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))
          : // Render flat list of items
            items.map((item) => (
              <SelectItem key={item.value} value={item.value.toString()}>
                {item.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
}
