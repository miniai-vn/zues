import dayjs from "dayjs";
const BotMessages = ({ content, time }: { content: string; time: string }) => {
  return (
    <div>
      <div className="px-3.5 py-2 bg-gray-100 rounded justify-start  items-center gap-3 ">
        <h5 className="text-gray-900 w-full text-sm font-normal leading-snug">
          {content}
        </h5>
      </div>
      <div className="justify-end items-center inline-flex mb-2.5">
        <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
          {dayjs(time).format("hh:mm A")}
        </h6>
      </div>
    </div>
  );
};

export default BotMessages;
