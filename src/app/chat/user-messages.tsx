import dayjs from "dayjs";
const UserMessages = ({ content, time }: { content: string; time: string }) => {
  return (
    <div className="justify-center">
      <div className="grid w-fit ml-auto">
        <div className="px-3 py-2 bg-indigo-600 rounded ">
          <h2 className="text-white text-sm font-normal leading-snug">
            {content}
          </h2>
        </div>
        <div className="justify-start items-center inline-flex">
          <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">
            {dayjs(time).format("hh:mm A")}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;
