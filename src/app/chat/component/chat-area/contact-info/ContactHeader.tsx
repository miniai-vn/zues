import { Button } from "@/components/ui/button";
import { FileText, MessageCircle, Star, X } from "lucide-react";

interface ContactHeaderProps {
  onClose: () => void;
}

export const ContactHeader = ({ onClose }: ContactHeaderProps) => {
  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost">
          <FileText className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Star className="h-4 w-4" />
        </Button>
      </div>
      <Button size="sm" variant="ghost" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
