import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/hooks/useTranslations";
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
  const { t } = useTranslations();
  const [note, setNote] = useState(initialNotes);

  const handleSaveNotes = () => {
    if (onSave) {
      onSave({
        id,
        data: {
          note: note,
        },
      });
    }
  };

  return (
    <Card>      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          {t("dashboard.chat.contactInfo.note")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="notes"
          className="min-h-[150px] resize-none"
          placeholder={t("dashboard.chat.contactInfo.note")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </CardContent>
      <CardFooter>
        <Button size="sm" onClick={handleSaveNotes} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {t("common.save")} {t("dashboard.chat.contactInfo.note")}
        </Button>
      </CardFooter>
    </Card>
  );
};
