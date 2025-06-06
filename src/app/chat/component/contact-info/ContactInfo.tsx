import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Phone className="h-3 w-3" />
              <span>Số điện thoại</span>
            </div>
            <Input
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Mail className="h-3 w-3" />
              <span>Email</span>
            </div>
            <Input
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              <span>Địa chỉ</span>
            </div>
            <Input
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button onClick={handleSaveContact} className="w-full" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Lưu thông tin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
