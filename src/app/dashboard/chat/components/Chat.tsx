"use client";
import CodeDisplayBlock from "@/components/code-display-block";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Message, useChat } from "@/hooks/data/useChat";
import useDepartments from "@/hooks/data/useDepartments";
import { useSocket } from "@/hooks/useSocket";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatHeader from "./Header";

export enum SocketEvent {
  JoinRoom = "join_room",
  RoomJoined = "room_joined",
  StreamingChunk = "streaming_chunk",
  StreamingEnd = "streaming_end",
  StreamingStart = "streaming_start",
  Leave = "leave",
}

export default function ChatComponent({ id }: { id?: string }) {
  const { socket } = useSocket();
  const router = useRouter();
  const { selectedDepartmentId } = useDepartments({});

  const {
    fetchedMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    createConversation,
    sendMessage,
  } = useChat(id ? { id } : {});

  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (fetchedMessages) {
      setDisplayMessages(fetchedMessages);
    }
  }, [fetchedMessages]);

  const handleStreamingChunk = (data: any) => {
    if (!isStreaming) {
      setIsStreaming(true);
    }
    setStreamingContent((prev) => prev + (data?.chunk || ""));
  };

  const handleStreamingEnd = (data: any) => {
    setDisplayMessages((prev) => [
      ...prev,
      {
        content: data.content,
        senderType: "assistant",
      },
    ]);
    setStreamingContent("");
    setIsStreaming(false);
  };

  const handleStreamingStart = () => {
    setStreamingContent("");
    setIsStreaming(true);
  };

  useEffect(() => {
    if (socket && id) {
      socket.emit(SocketEvent.JoinRoom, {
        room: `conversation:${id}`,
      });
      socket.on(SocketEvent.RoomJoined, (data) => {
        // Optionally handle room joined
      });

      socket.on(SocketEvent.StreamingStart, handleStreamingStart);
      socket.on(SocketEvent.StreamingChunk, handleStreamingChunk);
      socket.on(SocketEvent.StreamingEnd, handleStreamingEnd);

      return () => {
        socket.emit(SocketEvent.Leave, `conversation:${id}`);
        socket.off(SocketEvent.StreamingChunk, handleStreamingChunk);
        socket.off(SocketEvent.StreamingEnd, handleStreamingEnd);
        socket.off(SocketEvent.StreamingStart, handleStreamingStart);
        socket.off(SocketEvent.RoomJoined);
      };
    }
  }, [socket, id]);

  // Scroll to top of messages after sending
  const scrollToTopMessage = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isStreaming) return;
    if (selectedDepartmentId === undefined) {
      alert("Vui lòng chọn phòng trước khi gửi tin nhắn");
      return;
    }
    e.preventDefault();

    if (!id) {
      const conversation = await createConversation({
        createdAt: new Date().toISOString(),
        name: input,
        content: input || "",
        type: "direct",
      });
      if (conversation) {
        router.push(`/dashboard/chat/${conversation.id}`);
        sendMessage({
          content: conversation.content,
          conversation_id: Number(conversation.id as string),
          department_id: [selectedDepartmentId] as string[],
        });
      }
      return;
    }
    setDisplayMessages((prev) => [
      ...prev,
      {
        content: input || "",
        senderType: "user",
      },
    ]);
    handleSubmit(e, parseInt(id), [selectedDepartmentId] as string[]);
    scrollToTopMessage();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || !input) return;
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <ChatHeader />

      <div
        className={`flex w-full h-full  ${
          id ? "" : "justify-center"
        } flex-col items-center mx-auto`}
      >
        <div
          className={`${
            id ? "flex-1" : ""
          } w-full max-w-3xl overflow-y-auto bg-background shadow-sm rounded-lg`}
        >
          <ChatMessageList>
            {!id && (
              <div className="w-full text-center bg-background">
                <h2 className="text-3xl">Tôi có thể giúp gì cho bạn?</h2>
              </div>
            )}

            {displayMessages.length > 0 &&
              displayMessages.map((message, index) => (
                <ChatBubble
                  key={index}
                  variant={message?.senderType === "user" ? "sent" : "received"}
                >
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
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

            {streamingContent && (
              <ChatBubble variant="received">
                <ChatBubbleMessage>
                  <div className="animate-pulse-fadein">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {streamingContent}
                    </Markdown>
                  </div>
                </ChatBubbleMessage>
              </ChatBubble>
            )}

            {isStreaming && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar src="" fallback="🤖" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </div>

        <div className="max-w-3xl w-full px-4 pb-2">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="rounded-l-2xl rounded-2xl border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <ChatInput
              value={input}
              onKeyDown={onKeyDown}
              onChange={handleInputChange}
              placeholder="Nhập tin nhắn..."
              className="rounded-l-2xl rounded-2xl bg-background border-0 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-2 pt-0">
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
                <span className="sr-only">Đính kèm tệp</span>
              </Button>

              <Button variant="ghost" size="icon">
                <Mic className="size-4" />
                <span className="sr-only">Sử dụng micro</span>
              </Button>

              <Button
                disabled={!input || isLoading}
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
              >
                Gửi
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
