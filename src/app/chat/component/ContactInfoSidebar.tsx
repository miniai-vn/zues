import { Conversation } from "@/data/mockChatData";
import { useContactInfo } from "@/hooks/data/useContactInfo";
import {
  ContactHeader,
  ContactProfile,
  ContactActions,
  ContactTabs,
} from "./contact-info";
import { ScrollArea } from "@/components/ui/scroll-area";
import useCustomers from "@/hooks/data/useCustomers";

interface ContactInfoSidebarProps {
  conversation: Conversation | null;
  customerId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ContactInfoSidebar = ({
  conversation,
  isOpen,
  customerId,
  onClose,
}: ContactInfoSidebarProps) => {
  const { customer } = useCustomers({
    id: customerId,
  });
  const { saveContact, saveNotes, sendEmail, addStaff, isSaving } =
    useContactInfo({
      userId: customer?.id,
    });

  if (!isOpen || !conversation) return null;
  return (
    <div className="w-80 h-[100vh]  border-l bg-background flex flex-col">
      <ContactHeader onClose={onClose} />

      <ScrollArea className="flex-1  p-4 space-y-6">
        <ContactProfile contactUser={customer} />
        <ContactActions onAddStaff={addStaff} />

        <ContactTabs
          onSaveContact={saveContact}
          onSaveNotes={saveNotes}
          onSendEmail={sendEmail}
        />

        {isSaving && (
          <div className="text-center text-sm text-muted-foreground">
            Đang lưu...
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ContactInfoSidebar;
