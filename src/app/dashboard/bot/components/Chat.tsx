"use client";
import CodeDisplayBlock from "@/components/code-display-block";
import { Selector } from "@/components/dashboard/selector";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { useChat } from "@/hooks/data/useChat";
import useDepartments from "@/hooks/data/useDepartments";
import { useSocket } from "@/hooks/useSocket";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export enum SocketEvent {
  JoinRoom = "join_room",
  RoomJoined = "room_joined",
  StreamingChunk = "streaming_chunk",
  StreamingEnd = "streaming_end",
  StreamingStart = "streaming_start",
  Leave = "leave",
}

export function ChatComponent({ id }: { id?: string }) {
  const { socket } = useSocket();
  const {
    selectedDepartmentId,
    departments = [],
    changeDepartment,
  } = useDepartments({});

  const {
    fetchedMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
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
        console.log(`Joined room: `, data);
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
        name: selectedDepartmentId?.toString() || "",
        content: input || "",
        type: "direct",
        // departmentId: departmentId,
      });
    }
    fetchedMessages?.push({
      content: input || "",
      senderType: "user",
      createdAt: new Date().toISOString(),
      id: 0,
      isBot: false,
      // departmentId: departmentId,
    });
    handleSubmit(e, parseInt(id), [selectedDepartmentId] as string[]);
    handleScrollY();
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading || !input) return;
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  return (
    <div
      className={`flex w-full h-full  ${
        id ? "" : "justify-center"
      } max-w-5xl flex-col items-center my-auto mx-auto`}
    >
      <div
        className={`${
          id ? "flex-1" : ""
        } w-full scroll-y-auto overflow-y-auto bg-background shadow-sm rounded-lg`}
      >
        <ChatMessageList>
          {(!fetchedMessages || fetchedMessages?.length === 0) && (
            <div className="w-full text-center bg-background shadow-sm rounded-lg p-8 flex flex-col gap-2">
              <h1 className="font-bold text-4xl">Tôi giúp gì được cho bạn?.</h1>
            </div>
          )}

          {fetchedMessages &&
            (isStreaming ? fetchedMessages.slice(-1) : fetchedMessages).map(
              (message, index) => (
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
                  </ChatBubbleMessage>
                </ChatBubble>
              )
            )}

          {streamingContent && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {streamingContent}
                </Markdown>
              </ChatBubbleMessage>
            </ChatBubble>
          )}

          {isStreaming && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
          <div ref={messagesRef}></div>
        </ChatMessageList>
      </div>

      <div className="w-full px-4 pb-4">
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
            <Selector
              items={(departments ?? []).map((dept) => {
                return {
                  label: dept.name as string,
                  value: dept.id as string,
                };
              })}
              value={selectedDepartmentId}
              placeholder="Chọn phòng ban"
              onChange={(value: string | number | (string | number)[]) => {
                if (typeof value === "string" || typeof value === "number") {
                  return changeDepartment(value.toString());
                }
              }}
            />

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
