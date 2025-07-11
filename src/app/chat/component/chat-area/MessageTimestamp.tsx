interface MessageTimestampProps {
  timestamp: string;
}

export const MessageTimestamp = ({ timestamp }: MessageTimestampProps) => {
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <p className="text-xs text-muted-foreground">
      {formatMessageTime(timestamp)}
    </p>
  );
};