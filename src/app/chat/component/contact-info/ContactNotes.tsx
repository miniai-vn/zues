import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ContactNotesProps {
  initialNotes?: string;
  onSave?: (notes: string) => void;
}

export const ContactNotes = ({ initialNotes = "", onSave }: ContactNotesProps) => {
  const [notes, setNotes] = useState(initialNotes);

  const handleSaveNotes = () => {
    if (onSave) {
      onSave(notes);
    } else {
      console.log("Saving notes:", notes);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Ghi chú về khách hàng</Label>
      <textarea
        id="notes"
        className="w-full min-h-[100px] p-2 border rounded-md resize-none"
        placeholder="Khách hàng thường mua vào cuối tuần, thích màu xanh..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button size="sm" onClick={handleSaveNotes}>
        Lưu ghi chú
      </Button>
    </div>
  );
};
