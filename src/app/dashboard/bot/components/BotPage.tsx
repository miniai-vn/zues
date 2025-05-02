"use client";
import CodeDisplayBlock from "@/components/code-display-block";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useChat } from "@/hooks/data/useChat";
import { useSocket } from "@/hooks/useSocket";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { parse } from "path";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

export function BotComponent({ id }: { id?: string }) {
  const { socket } = useSocket();

  const {
    fetchedMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    createConversation,
  } = useChat(id ? { id } : {});
  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    console.log("Socket:", socket);
    if (socket && id) {
      socket.emit("join_room", {
        room: `conversation:${id}`,
      });
      socket.on('room_joined', (data) => {
        console.log(`Joined room: `, data);
      });
      
      const handleStartStreaming = (data: any) => {
        console.log("start_Streming event received:", data);
      };
      socket.on("streaming_chunk", handleStartStreaming);

      return () => {
        socket.emit("leave", `conversation:${id}`);
        socket.off("message");
        socket.off("streaming_chunk", handleStartStreaming);
      };
    }
  }, [socket, id]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [fetchedMessages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      return createConversation({
        createdAt: new Date().toISOString(),
        name: "New Conversation", // Default name
        content: input || "", // Use the current input as content
        type: "direct",
      });
    }
    handleSubmit(e, parseInt(id));
    formRef.current?.reset();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || !input) return;
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    if (action === "Refresh") {
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
      }
    }

    if (action === "Copy") {
      const message = fetchedMessages ? fetchedMessages[messageIndex] : null;
      if (message && message.senderType === "assistant") {
        navigator.clipboard.writeText(message?.content);
      }
    }
  };

  return (
    <div
      className={`flex w-full h-full  ${
        id ? "" : "justify-center"
      } max-w-4xl flex-col items-center my-auto mx-auto`}
    >
      <div className={`${id ? "flex-1" : ""} w-full overflow-y-auto`}>
        <ChatMessageList>
          <div className="w-full text-center bg-background shadow-sm rounded-lg p-8 flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Tôi giúp gì được cho bạn?.</h1>
          </div>

          {fetchedMessages &&
            fetchedMessages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message?.senderType == "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  src=""
                  fallback={message?.senderType == "user" ? "👨🏽" : "🤖"}
                />
                <ChatBubbleMessage>
                  {message?.content
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
                    fetchedMessages.length - 1 === index && (
                      <div className="flex items-center mt-1.5 gap-1">
                        {!isLoading && (
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
          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

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
