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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Update SelectorItem to use ID as value
export interface SelectorItem {
  value: string | number;
  label: string;
}

export interface SelectorGroup {
  label: string;
  items: SelectorItem[];
}

interface SelectorProps {
  items: SelectorItem[] | SelectorGroup[];
  onChange?: (value: string | number | (string | number)[]) => void;
  defaultValue?: string | number | (string | number)[];
  value?: string | number | (string | number)[] | null;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
}

export function Selector({
  items,
  onChange,
  defaultValue,
  value,
  className,
  placeholder = "Select an option",
  multiple = false,
}: SelectorProps) {
  // Helper function to check if the items array contains groups
  const hasGroups = (
    items: SelectorItem[] | SelectorGroup[]
  ): items is SelectorGroup[] => {
    return items.length > 0 && "items" in items[0];
  };

  // Handle single select
  if (!multiple) {
    return (
      <Select
        onValueChange={onChange}
        defaultValue={defaultValue?.toString()}
        value={value?.toString()}
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
            : items.map((item) => (
                <SelectItem key={item.value} value={item.value.toString()}>
                  {item.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    );
  }

  // Handle multi-select
  const [selectedValues, setSelectedValues] = React.useState<(string | number)[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  // Effect to sync state with value prop
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(Array.isArray(value) ? value : value ? [value] : []);
    }
  }, [value]);

  // Get all available items flattened (for finding labels by value)
  const getAllItems = React.useMemo(() => {
    if (hasGroups(items)) {
      return items.flatMap(group => group.items);
    }
    return items as SelectorItem[];
  }, [items]);

  const handleSelect = (newValue: string) => {
    // Convert string value to original type if needed
    const originalValue = getAllItems.find(item => item.value.toString() === newValue)?.value;
    
    if (originalValue && !selectedValues.includes(originalValue)) {
      const newValues = [...selectedValues, originalValue];
      setSelectedValues(newValues);
      onChange?.(newValues);
    }
  };

  const removeValue = (valueToRemove: string | number) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const clearAll = () => {
    setSelectedValues([]);
    onChange?.([]);
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className={className || "w-full"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {hasGroups(items)
            ? items.map((group, groupIndex) => (
                <SelectGroup key={groupIndex}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.items.map((item) => (
                    <SelectItem 
                      key={item.value} 
                      value={item.value.toString()}
                      disabled={selectedValues.includes(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            : items.map((item) => (
                <SelectItem 
                  key={item.value} 
                  value={item.value.toString()}
                  disabled={selectedValues.includes(item.value)}
                >
                  {item.label}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedValues.map(value => {
            const item = getAllItems.find(item => item.value === value);
            return (
              <Badge key={value} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                {item?.label || value.toString()}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeValue(value)}
                />
              </Badge>
            );
          })}
          
        </div>
      )}
    </div>
  );
}