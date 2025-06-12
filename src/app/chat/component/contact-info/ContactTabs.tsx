import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Customer } from "@/hooks/data/useCustomers";
import { ContactInfo } from "./ContactInfo";
import { ContactNotes } from "./ContactNotes";

interface ContactTabsProps {
  customer?: Customer;
  onSaveContact?: (data: {
    id: string;
    data: {
      phone?: string;
      email?: string;
      address?: string;
      note?: string;
    };
  }) => void;
}

export const ContactTabs = ({ customer, onSaveContact }: ContactTabsProps) => {
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

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Thông tin</TabsTrigger>
        <TabsTrigger value="notes">Ghi chú</TabsTrigger>
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
          initialNotes={customer?.note || ""}
          id={customer?.id}
          onSave={({ id, data }) => {
            if (onSaveContact && customer?.id) {
              onSaveContact({
                id: customer.id,
                data: {
                  note: data.note,
                },
              });
            }
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
