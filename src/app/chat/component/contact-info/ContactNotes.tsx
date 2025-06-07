import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StickyNote, Save } from "lucide-react";
import { useState } from "react";

interface ContactNotesProps {
  id?: string;
  initialNotes?: string;
  onSave?: (data: {
    id?: string;
    data: {
      note: string;
    };
  }) => void;
}

export const ContactNotes = ({
  id,
  initialNotes = "",
  onSave,
}: ContactNotesProps) => {
  const [note, setNote] = useState(initialNotes);

  const handleSaveNotes = () => {
    if (onSave) {
      onSave({
        id,
        data: {
          note: note,
        },
      });
    } else {
      console.log("Saving notes:", note);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Ghi chú về khách hàng
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="notes"
          className="min-h-[150px] resize-none"
          placeholder="Khách hàng thường mua vào cuối tuần, thích màu xanh..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button size="sm" onClick={handleSaveNotes} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Lưu ghi chú
        </Button>
      </CardFooter>
    </Card>
  );
};
