"use client";
import { useParams } from "next/navigation";
import { ChatComponent } from "../components/Chat";

export default function BotPageComponent() {
  
  const params = useParams();
  const id = params.id as string;
  if (!id) return null;
  return <ChatComponent id={id as string} />;
}
