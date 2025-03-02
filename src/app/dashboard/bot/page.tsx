"use client";

import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "@/components/code-display-block";
import { useChat } from "@/hooks/data/useChat";

const ChatAiIcons = [
  {
    icon: CopyIcon,
    label: "Copy",
  },
  {
    icon: RefreshCcw,
    label: "Refresh",
  },
  {
    icon: Volume2,
    label: "Volume",
  },
];

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat();

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    handleSubmit(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    console.log("Action clicked:", action, "Message index:", messageIndex);
    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      const message = messages[messageIndex];
      if (message && message.senderType === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  return (
    <div className="flex w-full  max-w-3xl flex-col items-center mx-auto">
      <div className="flex-1 w-full overflow-y-auto py-6 mb-8">
        <ChatMessageList>
          {/* Initial Message */}
          {messages?.length === 0 && (
            <div className="w-full bg-background shadow-sm border rounded-lg p-8 flex flex-col gap-2">
              <h1 className="font-bold">Welcome to this example app.</h1>
            </div>
          )}

          {/* Messages */}
          {messages &&
            messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.senderType == "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  src=""
                  fallback={message.senderType == "user" ? "👨🏽" : "🤖"}
                />
                <ChatBubbleMessage>
                  {message.content
                    .split("```")
                    .map((part: string, index: number) => {
                      if (index % 2 === 0) {
                        return (
                          <Markdown key={index} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap pt-2" key={index}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}

                  {message.senderType === "assistant" &&
                    messages.length - 1 === index && (
                      <div className="flex items-center mt-1.5 gap-1">
                        {!isGenerating && (
                          <>
                            {ChatAiIcons.map((icon, iconIndex) => {
                              const Icon = icon.icon;
                              return (
                                <ChatBubbleAction
                                  variant="outline"
                                  className="size-5"
                                  key={iconIndex}
                                  icon={<Icon className="size-3" />}
                                  onClick={() =>
                                    handleActionClick(icon.label, index)
                                  }
                                />
                              );
                            })}
                          </>
                        )}
                      </div>
                    )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

          {/* Loading */}
          {isGenerating && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      {/* Form and Footer fixed at the bottom */}
      <div ref={messagesRef} className="w-full px-4 pb-4">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            onKeyDown={onKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              disabled={!input || isLoading}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
