import { Button } from "@/components/ui/button";
import { AirVent } from "lucide-react";

interface ContactActionsProps {
  onAddStaff?: () => void;
}

export const ContactActions = ({ onAddStaff }: ContactActionsProps) => {
  const handleAddStaff = () => {
    if (onAddStaff) {
      onAddStaff();
    } else {
      console.log("Adding staff member...");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleAddStaff}
      >
        <AirVent className="h-4 w-4" />
        Thêm nhân viên
      </Button>
    </div>
  );
};
