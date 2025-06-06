import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfo } from "./ContactInfo";
import { ContactNotes } from "./ContactNotes";
import { ContactFiles } from "./ContactFiles";
import { Customer } from "@/hooks/data/useCustomers";

interface ContactTabsProps {
  customer?: Customer;
  onSaveContact?: (data: {
    id: string;
    data: {
      phone?: string;
      email?: string;
      address?: string;
    };
  }) => void;
  onSaveNotes?: (notes: string) => void;
  onSendEmail?: () => void;
}

export const ContactTabs = ({
  customer,
  onSaveContact,
  onSaveNotes,
  onSendEmail,
}: ContactTabsProps) => {
  // Handler that connects ContactInfo's onSave to updateCustomer
  const handleSaveContact = ({
    id,
    data,
  }: {
    id?: string;
    data: {
      phone: string;
      email: string;
      address: string;
    };
  }) => {
    if (onSaveContact && customer?.id) {
      onSaveContact({
        id: customer.id,
        data: {
          phone: data.phone,
          email: data.email,
          address: data.address,
        },
      });
    }
  };

  // Handler for saving notes
  const handleSaveNotes = (notes: string) => {
    if (onSaveNotes && customer?.id) {
      onSaveNotes(notes);
    }
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info">Thông tin</TabsTrigger>
        <TabsTrigger value="notes">Ghi chú</TabsTrigger>
        <TabsTrigger value="files">Tệp tin</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <ContactInfo
          initialPhone={customer?.phone || ""}
          initialEmail={customer?.email || ""}
          initialAddress={customer?.address || ""}
          onSave={handleSaveContact}
        />
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        <ContactNotes
          initialNotes={customer?.notes || ""}
          onSave={handleSaveNotes}
        />
      </TabsContent>

      <TabsContent value="files" className="space-y-4">
        <ContactFiles />
      </TabsContent>
    </Tabs>
  );
};
