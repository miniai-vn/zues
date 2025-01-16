type UserMessages = {
  messages: string;
  type: "assitance" | "user";
};
const ConvertToHTML: React.FC<{ input: string }> = ({ input }) => {
  const lines = input.trim().split("\n");
  const listItems = lines.slice(1, -1).map((line) => {
    // eslint-disable-next-line react/jsx-key
    return <li>{line}</li>;
  });

  // Combine into HTML
  return (
    <div>
      <ol>{listItems}</ol>
      <p>{lines[lines.length - 1]}</p>
    </div>
  );
};
const UserMessages = ({ messages, type }: UserMessages) => {
  return (
    <div
      className={`flex items-center ${
        type !== "user" ? "flex-row" : "flex-row-reverser"
      }`}
    >
      {type === "assitance" && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          A
        </div>
      )}
      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
        <ConvertToHTML input={messages} />
      </div>
      {type === "user" && (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
          A
        </div>
      )}
    </div>
  );
};

export default UserMessages;
