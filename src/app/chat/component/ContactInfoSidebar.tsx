import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/data/mockChatData";
import useCustomers from "@/hooks/data/useCustomers";
import {
  ContactProfile,
  ContactTabs
} from "./contact-info";

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
  const { customer, updateCustomer } = useCustomers({
    id: customerId,
  });

  if (!isOpen || !conversation) return null;
  return (
    <div className="w-80 h-[100vh]  border-l bg-background flex flex-col">
      <ScrollArea className="flex-1  p-4 space-y-6">
        <ContactProfile contactUser={customer} />
        <ContactTabs
          customer={customer}
          onSaveContact={updateCustomer}
        />
      </ScrollArea>
    </div>
  );
};

export default ContactInfoSidebar;
