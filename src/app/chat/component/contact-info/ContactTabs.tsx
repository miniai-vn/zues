import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfo } from "./ContactInfo";
import { ContactNotes } from "./ContactNotes";
import { ContactOrders } from "./ContactOrders";
import { ContactFiles } from "./ContactFiles";

interface ContactTabsProps {
  onSaveContact?: (data: {
    phone: string;
    email: string;
    address: string;
  }) => void;
  onSaveNotes?: (notes: string) => void;
  onSendEmail?: () => void;
}

export const ContactTabs = ({
  onSaveContact,
  onSaveNotes,
  onSendEmail,
}: ContactTabsProps) => {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Thông tin</TabsTrigger>
        <TabsTrigger value="notes">Ghi chú</TabsTrigger>
      </TabsList>

      <TabsContent value="info" className="space-y-4">
        <ContactInfo onSave={onSaveContact} onSendEmail={onSendEmail} />
      </TabsContent>

      <TabsContent value="orders" className="space-y-4">
        <ContactOrders />
      </TabsContent>

      <TabsContent value="files" className="space-y-4">
        <ContactFiles />
      </TabsContent>

      <TabsContent value="notes" className="space-y-4">
        <ContactNotes onSave={onSaveNotes} />
      </TabsContent>
    </Tabs>
  );
};
