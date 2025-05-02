"use client";
import CodeDisplayBlock from "@/components/code-display-block";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage
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
import { useEffect, useRef, useState } from "react";
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

export function ChatComponent({ id }: { id?: string }) {
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
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStreamingChunk = (data: any) => {
    setStreamingContent((prev) => prev + (data?.chunk || ""));
  };

  const handleStreamingEnd = () => {
    setStreamingContent("");
    setIsStreaming(false);
  };
  const handleStreamingStart = () => {
    setIsStreaming(true);
  };

  useEffect(() => {
    if (socket && id) {
      socket.emit("join_room", {
        room: `conversation:${id}`,
      });
      socket.on("room_joined", (data) => {
        console.log(`Joined room: `, data);
      });

      socket.on("streaming_chunk", handleStreamingChunk);

     
      socket.on("streaming_end", handleStreamingEnd);
      socket.on("streaming_start", handleStreamingStart);
      

      return () => {
        socket.emit("leave", `conversation:${id}`);
        socket.off("message");
        socket.off("streaming_chunk", handleStreamingChunk);
        socket.off("streaming_end", handleStreamingEnd);
      };
    }
  }, [socket, id]);

  const handleScrollY = () => {
    if (messagesRef.current) {
      messagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    handleScrollY();
  }, [fetchedMessages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isStreaming) return;
    e.preventDefault();
    if (!id) {
      return createConversation({
        createdAt: new Date().toISOString(),
        name: "New Conversation",
        content: input || "",
        type: "direct",
      });
    }
    handleSubmit(e, parseInt(id));
    fetchedMessages?.push({
      content: input || "",
      senderType: "user",
      createdAt: new Date().toISOString(),
      id: 0,
      isBot: false,
    });
    handleScrollY();

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
      } max-w-5xl flex-col items-center my-auto mx-auto`}
    >
      <div className={`${id ? "flex-1" : ""} w-full overflow-y-auto`}>
        <ChatMessageList>
          {fetchedMessages?.length === 0 && (
            <div className="w-full text-center bg-background shadow-sm rounded-lg p-8 flex flex-col gap-2">
              <h1 className="font-bold text-4xl">Tôi giúp gì được cho bạn?.</h1>
            </div>
          )}

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
                    .map((part: string, idx: number) => {
                      if (idx % 2 === 0) {
                        return (
                          <Markdown key={idx} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap pt-2" key={idx}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}

                  {/* {message.senderType === "assistant" &&
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
                    )} */}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

          {/* Streaming assistant message */}
          {isLoading && streamingContent && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {streamingContent}
                </Markdown>
              </ChatBubbleMessage>
            </ChatBubble>
          )}

          {/* Loading fallback */}
          {isLoading && !streamingContent && (
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
