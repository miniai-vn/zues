import dynamic from "next/dynamic";
const ChatComponent = dynamic(() => import("./components/Chat"));
export default function ChatPageComponent() {
  return <ChatComponent />;
}
