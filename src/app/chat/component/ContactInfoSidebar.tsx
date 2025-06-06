import { Conversation } from "@/data/mockChatData";
import { useContactInfo } from "@/hooks/data/useContactInfo";
import {
  ContactHeader,
  ContactProfile,
  ContactActions,
  ContactTabs,
} from "./contact-info";

interface ContactInfoSidebarProps {
  conversation: Conversation | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContactInfoSidebar = ({
  conversation,
  isOpen,
  onClose,
}: ContactInfoSidebarProps) => {
  const currentUserId = "1";
  const contactUser = conversation?.participants.find(
    (p) => p.id !== currentUserId
  );

  const {
    saveContact,
    saveNotes,
    sendEmail,
    addStaff,
    isSaving,
  } = useContactInfo({
    userId: contactUser?.id,
  });

  if (!isOpen || !conversation) return null;
  return (
    <div className="w-80 h-[100vh] overflow-y-auto border-l bg-background flex flex-col">
      <ContactHeader onClose={onClose} />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ContactProfile contactUser={contactUser} />
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
      </div>
    </div>
  );
};

export default ContactInfoSidebar;
