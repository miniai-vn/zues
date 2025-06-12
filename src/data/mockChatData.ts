import { Message } from "postcss";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
}


export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  isGroup: boolean;
  name?: string;
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Bạn",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    status: "online",
  },
  {
    id: "2",
    name: "Giselle Hiên",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b5aa?w=40&h=40&fit=crop&crop=face",
    status: "online",
  },
  {
    id: "3",
    name: "Sun",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    status: "away",
  },
  {
    id: "4",
    name: "Dương",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    status: "offline",
  },
  {
    id: "5",
    name: "Tranainu",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    status: "online",
  },
];

export const mockMessages: { [conversationId: string]: Message[] } = {
  "1": [
    {
      id: "1",
      senderId: "2",
      content: "Chào mừng bạn đến với Official Account Mini AI trên Zalo",
      timestamp: new Date(Date.now() - 3600000),
      type: "text",
    },
    {
      id: "2",
      senderId: "1",
      content: "Cảm ơn bạn! Tôi rất vui được tham gia.",
      timestamp: new Date(Date.now() - 3500000),
      type: "text",
    },
    {
      id: "3",
      senderId: "2",
      content: "Bạn có thể hỏi tôi bất cứ điều gì về dịch vụ của chúng tôi.",
      timestamp: new Date(Date.now() - 3400000),
      type: "text",
    },
    {
      id: "4",
      senderId: "1",
      content: "Tuyệt vời! Tôi sẽ khám phá thêm.",
      timestamp: new Date(Date.now() - 300000),
      type: "text",
    },
  ],
  "2": [
    {
      id: "5",
      senderId: "3",
      content: "Chào mừng bạn đến với Mini AI",
      timestamp: new Date(Date.now() - 7200000),
      type: "text",
    },
    {
      id: "6",
      senderId: "1",
      content: "Xin chào! Làm thế nào để tôi có thể sử dụng dịch vụ này?",
      timestamp: new Date(Date.now() - 7100000),
      type: "text",
    },
  ],
  "3": [
    {
      id: "7",
      senderId: "4",
      content: "Chào mừng bạn đến với Mini AI",
      timestamp: new Date(Date.now() - 86400000),
      type: "text",
    },
  ],
  "4": [
    {
      id: "8",
      senderId: "5",
      content: "Chào mừng bạn đến với Mini AI",
      timestamp: new Date(Date.now() - 86400000),
      type: "text",
    },
  ],
};

export const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: [mockUsers[0], mockUsers[1]],
    lastMessage: mockMessages["1"][3],
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "2",
    participants: [mockUsers[0], mockUsers[2]],
    lastMessage: mockMessages["2"][1],
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "3",
    participants: [mockUsers[0], mockUsers[3]],
    lastMessage: mockMessages["3"][0],
    unreadCount: 1,
    isGroup: false,
  },
  {
    id: "4",
    participants: [mockUsers[0], mockUsers[4]],
    lastMessage: mockMessages["4"][0],
    unreadCount: 0,
    isGroup: false,
  },
];
