import { sendType } from "./page";
import UserMessages from "./user-messages";

interface ChatMessagesProps {
  allMessages: { senderType: string; content: string }[];
}

const ChatMessages = ({ allMessages }: ChatMessagesProps) => {
  return (
    <div className="grid grid-cols-12 gap-y-2">
      {allMessages?.map((message, index) => {
        if (message.senderType === sendType.assistant) {
          return (
            <div key={index} className="col-start-1 col-end-8 p-3 rounded-lg">
              <UserMessages type="assistance" messages={message.content} />
            </div>
          );
        }
        return (
          <div
            key={index}
            className="col-start-6 col-end-13 p-3 rounded-lg float-right w-full"
          >
            <UserMessages type="user" messages={message.content} />
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
