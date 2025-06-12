import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/hooks/data/useCustomers";

interface ContactProfileProps {
  contactUser?: Customer;
}

export const ContactProfile = ({ contactUser }: ContactProfileProps) => {
  if (!contactUser) return null;

  return (
    <div className="text-center">
      <Avatar className="h-20 w-20 mx-auto mb-3">
        <AvatarImage src={contactUser.avatar} />
        <AvatarFallback className="text-lg">
          {contactUser.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <h2 className="font-semibold text-lg">{contactUser.name}</h2>

      <Badge variant="outline" className="mt-2">
        VIP Customer
      </Badge>
    </div>
  );
};
