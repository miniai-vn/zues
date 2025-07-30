"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Customer } from "@/hooks/data/cs/useCustomer";

interface ContactListProps {
  contacts?: Customer[];
  selectedContacts: string[];
  onContactSelect: (contactId: string) => void;
}

export function ContactList({
  contacts,
  selectedContacts,
  onContactSelect,
}: ContactListProps) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {contacts?.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
        >
          <Checkbox
            id={`contact-${contact.id}`}
            checked={selectedContacts.includes(contact.id)}
            onCheckedChange={() => onContactSelect(contact.id)}
          />
          <Avatar className="w-10 h-10">
            {contact.avatar && contact.avatar.startsWith("http") ? (
              <AvatarImage src={contact.avatar} alt={contact.name} />
            ) : null}
            <AvatarFallback className="text-sm">
              {contact.avatar && !contact.avatar.startsWith("http")
                ? contact.avatar
                : contact.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium flex-1">{contact?.name}</span>
        </div>
      ))}
    </div>
  );
}
