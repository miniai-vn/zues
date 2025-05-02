"use client";
import { useParams } from "next/navigation";
import { BotComponent } from "../components/BotPage";

export default function BotPageComponent() {
  
  const params = useParams();
  const id = params.id as string;
  if (!id) return null;
  return <BotComponent id={id as string} />;
}
