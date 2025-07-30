import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "@/hooks/useTranslations";
import { ContactInfo } from "./ContactInfo";
import { ContactNotes } from "./ContactNotes";
import { Customer } from "@/hooks/data/cs/useCustomer";

interface ContactTabsProps {
  customer?: Customer;
  onSaveContact?: (cus: Customer) => void;
}

export const ContactTabs = ({ customer, onSaveContact }: ContactTabsProps) => {
  const { t } = useTranslations();

  // Handler that connects ContactInfo's onSave to updateCustomer
  const handleSaveContact = ({
    data,
  }: {
    data: {
      phone: string;
      email: string;
      address: string;
    };
  }) => {
    if (onSaveContact && customer?.id) {
      onSaveContact({
        ...customer,
        ...data,
      });
    }
  };

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">
          {t("dashboard.chat.information")}
        </TabsTrigger>
        <TabsTrigger value="notes">{t("dashboard.chat.notes")}</TabsTrigger>
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
                ...customer,
                note: data,
              });
            }
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
