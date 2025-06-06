import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Phone } from "lucide-react";
import { useState } from "react";

interface ContactInfoProps {
  initialPhone?: string;
  initialEmail?: string;
  initialAddress?: string;
  onSave?: (data: { phone: string; email: string; address: string }) => void;
  onSendEmail?: () => void;
}

export const ContactInfo = ({
  initialPhone = "",
  initialEmail = "",
  initialAddress = "",
  onSave,
  onSendEmail,
}: ContactInfoProps) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);

  const handleSaveContact = () => {
    const contactData = { phone: phoneNumber, email, address };
    if (onSave) {
      onSave(contactData);
    } else {
      console.log("Saving contact information:", contactData);
    }
  };

  const handleSendEmail = () => {
    if (onSendEmail) {
      onSendEmail();
    } else {
      console.log("Opening email client...");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Input
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleSendEmail}
          >
            Gửi email
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Địa chỉ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nhập địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </CardContent>
      </Card>

      <Button onClick={handleSaveContact} className="w-full">
        Lưu thông tin
      </Button>
    </div>
  );
};
