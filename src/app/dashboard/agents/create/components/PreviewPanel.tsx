import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bot, Send, User } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

interface Message {
  type: "bot" | "user";
  content: string;
  time: string;
}

interface PreviewPanelProps {
  messages: Message[];
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

export const PreviewPanel = ({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
}: PreviewPanelProps) => {
  const { t } = useTranslations();

  return (
    <>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary">
                {message.type === "bot" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">
                {message.time}
              </div>
              <Card className="p-3">
                <p className="text-sm">{message.content}</p>
              </Card>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Message Input */}
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder={t("dashboard.agents.form.chat.placeholder")}
            className="flex-1"
          />
          <Button onClick={onSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="bg-primary text-xs">
              123
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            2025-06-26 13:53
          </span>
        </div>
      </div>
    </>
  );
};
