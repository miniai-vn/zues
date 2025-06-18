import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "@/hooks/useTranslations";
import { MapPin, Phone, Mail, Save } from "lucide-react";
import { useState } from "react";

interface ContactInfoProps {
  id?: string;
  initialPhone?: string;
  initialEmail?: string;
  initialAddress?: string;
  onSave?: ({
    id,
    data,
  }: {
    id?: string;
    data: {
      phone: string;
      email: string;
      address: string;
    };
  }) => void;
}

export const ContactInfo = ({
  id,
  initialPhone = "",
  initialEmail = "",
  initialAddress = "",
  onSave,
}: ContactInfoProps) => {
  const { t } = useTranslations();
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);

  const handleSaveContact = () => {
    const contactData = { phone: phoneNumber, email, address };
    if (onSave) {
      onSave({ id, data: contactData });
    } else {
      console.log("Saving contact information:", contactData);
    }
  };

  return (
    <div className="space-y-4">
      <Card>        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {t("dashboard.chat.contactInfo.editContact")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Phone className="h-3 w-3" />
              <span>{t("dashboard.chat.contactInfo.phone")}</span>
            </div>
            <Input
              placeholder={t("dashboard.chat.contactInfo.phone")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Mail className="h-3 w-3" />
              <span>{t("dashboard.chat.contactInfo.email")}</span>
            </div>
            <Input
              placeholder={t("dashboard.chat.contactInfo.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              <span>{t("dashboard.chat.contactInfo.address")}</span>
            </div>
            <Input
              placeholder={t("dashboard.chat.contactInfo.address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleSaveContact} className="w-full" size="sm">
            <Save className="h-4 w-4 mr-2" />
            {t("dashboard.chat.contactInfo.saveContact")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
