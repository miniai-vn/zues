import { ScrollArea } from "@/components/ui/scroll-area";
import { ContactProfile, ContactTabs } from ".";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCustomer } from "@/hooks/data/cs/useCustomer";

interface ContactInfoSidebarProps {
  customerId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ContactInfoSidebar = ({
  isOpen,
  customerId,
  onClose,
}: ContactInfoSidebarProps) => {
  const { customer, updateCustomer } = useCustomer({
    id: customerId,
  });

  if (!customerId) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Thông tin khách hàng</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 space-y-6">
          <ContactProfile contactUser={customer} />
          <ContactTabs customer={customer} onSaveContact={updateCustomer} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ContactInfoSidebar;
